import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation, useBeforeUnload } from 'react-router-dom';
import styles from './publicar.module.css'
import {Tooltip} from 'react-tooltip';
import validator from 'validator'
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import axios from 'axios'
import { storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes, deleteObject} from "firebase/storage";
import { Loader } from '@googlemaps/js-api-loader'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; //
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import VerificationBannerPhone from '../general/verificationBannerPhone';
import { useTimer } from 'react-timer-hook';
import PublicarService from '../publicar/publicar_service';
import PublicarPhoto from '../publicar/publicar_photo';
import PublicarDetails from '../publicar/publicar_details';
import {profissoesMap, regioesMap, profissoesGrouped} from '../general/util'
import Loader2 from '../general/loader';
import VerificationBannerConfirm from '../general/verificationBannerConfirm';
import VerificationBannerEditConfirm from '../general/verificationBannerEditConfirm';
import VerificationBannerTooMany from '../general/verificationBannerTooMany';
import { auth } from '../firebase/firebase'
import { user_update_phone_verified, user_update_email_verified } from '../store';
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, sendEmailVerification, unlink } from 'firebase/auth';
import VerificationBannerEmail from '../general/verificationBannerEmail';
import SelectHome from '../selects/selectHome';
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
}

const Publicar = props => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const scrolltopref = useRef(null)

    const dispatch = useDispatch()

    useBeforeUnload(
        useCallback(
          (event) => {
            event.preventDefault();
            event.returnValue = "";
          },
          [],
        ),
        { capture: true },
      )

    const [selectedWorker, setSelectedWorker] = useState(null)
    const [selectedWorkerObject, setSelectedWorkerObject] = useState(null)
    const [titulo, setTitulo] = useState('')
    const [tituloWrong, setTituloWrong] = useState(true)
    const [description, setDescription] = useState('')
    const [nome, setNome] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneVisual, setPhoneVisual] = useState('')
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [porta, setPorta] = useState('')
    const [portaWrong, setPortaWrong] = useState(false)
    const [andar, setAndar] = useState('')
    const [confirmationPopup, setConfirmationPopup] = useState(false)
    const [tooManyReservations, setTooManyReservations] = useState(false)
    const [images, setImages] = useState([])
    const [imageFiles, setImageFiles] = useState([])
    const [inPropFoto, setInPropFoto] = useState(false)
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [district, setDistrict] = useState(null)
    const [edit, setEdit] = useState(false)
    const [editReservation, setEditReservation] = useState(null)
    const [confirmationEditPopup, setConfirmationEditPopup] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [verifyPhone, setVerifyPhone] = useState(0)
    const [verifyEmail, setVerifyEmail] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const [taskType, setTaskType] = useState(0)
    const [availableToGo, setAvailableToGo] = useState(false)
    const [editAddress, setEditAddress] = useState(null)
    const [backdrop, setBackdrop] = useState(false)

    const [photoPrincipal, setPhotoPrincipal] = useState(null)
    const [expired, setExpired] = useState(true)

    const [publicationSent, setPublicationSent] = useState(false)

    const recaptchaWrapperRef = useRef(null)
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaObject = useRef(null)

    const [codeStatus, setCodeStatus] = useState(null)
    const [emailCodeStatus, setEmailCodeStatus] = useState(null)

    const [sendingError, setSendingError] = useState(null)

    
    const [editedTitle, setEditedTitle] = useState(false)
    const [editedDesc, setEditedDesc] = useState(false)
    const [editedPhotos, setEditedPhotos] = useState(false)
    const [editedLocation, setEditedLocation] = useState(false)


    const checkAllFieldsCorrect = () => {
        let first_phase_correct = titulo.length>6&&selectedWorker!=null
        let second_third_correct = (user.phone===phone&&user_phone_verified)&&user_email_verified&&!loadingConfirm
        let both_phases = first_phase_correct&&second_third_correct

        return both_phases&&checkAddressCorrect()
    }

    const checkAddressCorrect = () => {
        if(taskType===2)
            return true
        return address?.length>1&&district!=null&&porta?.length>0
        
    }

    const maxFiles = 6
    const inputRef = useRef(null);
    const ObjectID = require("bson-objectid");
    const divRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [searchParams] = useSearchParams()

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        function handleResize() {
          setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, [])

    useEffect(() => {
        if(window.google){
        }
        else{
            new Loader({
                apiKey: "AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk",
                libraries: ["places"]
              });
        }
    }, [])

    useEffect(() => {
        return () => {
            for(let el of imageFiles) URL.revokeObjectURL(el)
        } 
    }, [])

    useEffect(() => {
        if(user){
            setNome(user.name)
            setEmail(user.email)
            if(user.phone){
                setPhone(user.phone)
                setPhoneVisual(user.phone)
            }            
        }
    }, [user])

    useEffect(() => {
        setLoading(true)
        const paramsAux = Object.fromEntries([...searchParams])
        // if(paramsAux && !paramsAux.editar){
        //     setSelectedWorker(paramsAux.t)
        // }
        if(paramsAux.editar && paramsAux.res_id)
        {   
            setEdit(true)
            axios.get(`${api_url}/reservations/get_single_by_id`, { params: {_id: paramsAux.res_id, inc: false} }).then(res => {
                console.log(res.data)
                if(res.data?.value){
                    !editReservation&&setSelectedWorker(res.data.value.workerType)
                    setEditReservation(res.data.value)
                    setTitulo(res.data.value.title)
                    setDescription(res.data.value.desc)
                    setEditAddress(res.data.value.localizacao)
                    setAddress(res.data.value.localizacao)
                    setPorta(res.data.value.porta)
                    setAndar(res.data.value.andar)
                    setLat(res.data.value.lat)
                    setLng(res.data.value.lng)
                    setDistrict(regioesMap[res.data.value.district])
                    setPhotoPrincipal(res.data.value.photo_principal)
                    setImages(res.data.value.photos)
                    setLoading(false)
                    setTaskType(res.data.value.task_type)
                    setTituloWrong(false)
                }
                else{
                    setEditReservation(null)
                    setLoading(false)
                }
            })
        }
        else{
            // setEdit(false)
            // setEditReservation(null)
            // setTitulo('')
            // setDescription('')
            // setPorta('')
            // setLat('')
            // setLng('')
            // setDistrict('')
            setLoading(false)
        }
    }, [searchParams])

    useEffect(() => {
        if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
        else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
        else{
            setPhoneVisual(`${phone.slice(0,3)}`)
        }
    }, [phone])
    

    const setPhoneHandler = (val) => {
        setPhoneWrong(false)
        let phone = val.replace(/\D/g, "")
        phone.replace(/\s/g, '')
        setPhone(phone)
    }

    const {
        seconds,
        restart,
    } = useTimer({ onExpire: () => setExpired(true) })

    const handlerVerifyPressed = () => {
        setExpired(false)
        const time = new Date()
        time.setSeconds(time.getSeconds() + 59)
        restart(time)
    }

    const uploadImageFileHandler = async (file, postId, arr) => {
        const storageRef = ref(storage, `posts/${postId}/${file.id}`);
        return uploadBytes(storageRef, file.img).then(() => {
            return getDownloadURL(storageRef).then(url => {
                arr.push({
                    url: url,
                    id: file.id
                })
            })
        })
    }

    const confirmarPopupHandler = async () => {
        setLoadingConfirm(true)
        let arr = []
        let postId = edit?editReservation._id:ObjectID()
        if(edit){
            for(let img_obj of images)
            {
                if(img_obj.from_edit!==false)
                    arr.push({
                        url: img_obj.url,
                        id: img_obj.id
                    })
            }
            for(let photo_original of editReservation.photos)
            {
                let original_still_exists_in_current = false
                for(let photo_current of arr)
                {
                    if(photo_current.id === photo_original.id)
                    {
                        original_still_exists_in_current = true
                    }
                }
                if(original_still_exists_in_current===false){
                    const deleteRef = ref(storage, `/posts/${postId}/${photo_original.id}`)
                    await deleteObject(deleteRef)
                }
            }
        }
        await Promise.all(imageFiles.map((file, i) => uploadImageFileHandler(file, postId, arr)))

        let time = new Date()
        
        let reserva = {
            _id: postId,
            user_id: user._id,
            user_name: user.name,
            user_phone: phone,
            user_email: user.email,
            title: titulo,
            desc: description,
            localizacao: address,
            task_type: taskType,
            porta: porta,
            andar: andar,
            type: 0,
            workerType: selectedWorker,
            clicks: 0,
            photos: arr,
            photo_principal: photoPrincipal,
            lat: lat,
            lng: lng,
            photoUrl: user.photoUrl,
            timestamp: time.getTime(),
            district: taskType===2?'online':district?.value,
            availableToGo: availableToGo
        }
        axios.post(`${api_url}/reservations/add`, reserva).then(() => {
            setLoadingConfirm(false)
            setPublicationSent(true)
            if(user.phone === "" || user.phone !== phone){
                axios.post(`${api_url}/user/update_phone`, {
                    user_id : user._id,
                    phone: phone
                }).then(res => {
                })
            }
        })
        if(edit) props.refreshWorker()
    }

    const confirmarHandler = () => {
        checkPendingReservations()
    }

    const checkPendingReservations = () => {
        axios.get(`${api_url}/reservations/get_by_id`, { params: {user_id: user._id} }).then(res => {
            if(edit)
            {
                scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                setConfirmationEditPopup(true)
            }
            else if(res.data?.length<5){
                scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                setConfirmationPopup(true)
            }
            else{
                setTooManyReservations(true)
            }
        })
    }

    const handleClick = () => {
        inputRef.current.click();
    }
    
    const handleFileChange = event => {
        const files = event.target.files;
        if (!files) return
        if(images.length + files.length > maxFiles){
            setInPropFoto(true)
            setTimeout(() => setInPropFoto(false), 4000)
            return 
        }

        let images_aux = [...images]
        let files_aux = [...imageFiles]
        for(let img of event.target.files){
            let time = new Date().getTime()
            const objectUrl = URL.createObjectURL(img)
            files_aux.push({
                img: img,
                id:`${img.name}_${time}`
            })
            images_aux.push({
                from_edit:false,
                url:objectUrl,
                id:`${img.name}_${time}`
            })
        }
        if(photoPrincipal===null && images_aux.length>0)
            setPhotoPrincipal(images_aux[0].id)
        setImageFiles(files_aux)
        setImages(images_aux)
        event.target.value = null;
        setEditedPhotos(true)
    }

    const setPhotoPrincipalHandler = img_id => {
        let auximages = [...images]

        let i = 0
        for(let el of auximages)
        {
            if(el.id === img_id)
            {
                auximages.unshift(auximages.splice(i, 1)[0])
                setImages(auximages)
                break
            }
            i++
        }


        setPhotoPrincipal(img_id)
    }

    const deleteImageHandler = img_id => {
        let auximages = [...images]
        let auximagefiles = [...imageFiles]
        let i = 0
        for(let el of auximages)
        {
            if(el.id === img_id)
            {
                auximages.splice(i, 1)
                auximagefiles.splice(i, 1)
                setImages(auximages)
                setImageFiles(auximagefiles)
                break
            }
            i++
        }
        if(img_id === photoPrincipal && auximages.length>0)
            setPhotoPrincipal(auximages[0].id)
        else if(auximages.length===0)
            setPhotoPrincipal(null)
    }

    const getFieldWrong = type => {
        if(editReservation?.refusal_object)
            for(let el of editReservation.refusal_object)
            {
                if(el.type===type) return true
            }
    }

    const getFieldWrongText = type => {
        if(editReservation?.refusal_object)
            for(let el of editReservation.refusal_object)
            {
                if(el.type===type) return el.text
            }
    }

    const setTituloHandler = val => {
        if(titulo.length===0)
            setTitulo(val.replace(/\s/g, ''))
        else
            setTitulo(val)

        let aux = val.replace(/\s/g, '').length
        if(aux>6) setTituloWrong(false)
        else setTituloWrong(true)
    }

    const initiateEmailVerification = () => {
        setSendingError(null)
        var actionCodeSettings = {
            url: 'https://pt-tarefas.pt/confirm-email',
            handleCodeInApp: false
        }

        sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
                setVerifyEmail(2)
            })
            .catch(e => {
                if(e.code === "auth/too-many-requests")
                    setSendingError('Demasiadas tentativas, por favor tente mais tarde.')
                else
                    setSendingError('Erro a enviar o e-mail de verificação, por favor tente mais tarde.')
            })
    }

    const completeEmailVerification = async () => {
        setEmailCodeStatus(null)
        await auth.currentUser.reload()
        if(auth?.currentUser?.emailVerified === true)
        {
            setEmailCodeStatus(true)
            dispatch(user_update_email_verified(true))
            axios.post(`${api_url}/user/verify_email`, {user_id: user._id})
        }
        else
        {
            setEmailCodeStatus(false)
        }
    }

    const initiatePhoneVerification = () => {
        if(recaptchaObject.current?.destroyed===false && recaptchaWrapperRef.current!==null)
        {
            recaptchaObject.current.clear()
            recaptchaWrapperRef.current.innerHTML = `<div id="recaptcha-container"></div>`
        }

        setSendingError(null)
        var recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {'size': 'invisible'});

        recaptcha.render()
        recaptchaObject.current = recaptcha

        scrolltopref.current.scrollIntoView({behavior: 'smooth'})

        recaptcha.verify().then(() => {
            var provider = new PhoneAuthProvider(auth)
            provider.verifyPhoneNumber(`+351${user.phone}`, recaptcha).then(verificationId => {
                    setVerificationId(verificationId)
                    setVerifyPhone(2)
                }).catch(function (error) {
                    alert(error)
                    recaptcha.clear()
                    setVerificationId(null)
                })
        })
        .catch(e => {
        })
    }

    const completePhoneVerification = (code) => {
        setSendingError(null)
        var phoneCredential = PhoneAuthProvider.credential(verificationId, code)
        try {
            linkWithCredential(auth.currentUser, phoneCredential)
                .then(() => {
                    dispatch(user_update_phone_verified(true))
            
                    axios.post(`${api_url}/user/phone_verification_status`, {
                        user_id : user._id,
                        value: true
                    }).then(() => {
                        setCodeStatus(true)
                        setVerifyPhone(3)
                    })
                })
                .catch(e => {
                    if(e.code === 'auth/account-exists-with-different-credential')
                        setSendingError('Este número de telemóvel já se encontra associado a outra conta.')
                    else
                        setCodeStatus(false)
                    
                })
            
        }
        catch (error){
            setCodeStatus(false)
        }
    }

    const types = {
        titulo: "Título",
        description: "Descrição",
        photos: "Fotografias",
        location: "Detalhes"
    }

    const mapWrongToField = () => {
        return editReservation?.refusal_object?.map((val, i) => {
            return (
                <div style={{margin:'5px 0'}}>
                    {
                        val.type==='titulo'&&editedTitle?
                        <CheckIcon className={styles.refusal_icon} style={{color:"#0358e5"}}/>
                        :val.type==='titulo'?
                        <CircleIcon className={styles.refusal_icon}/>
                        :null
                    }
                    {
                        val.type==='description'&&editedDesc?
                        <CheckIcon className={styles.refusal_icon} style={{color:"#0358e5"}}/>
                        :val.type==='description'?
                        <CircleIcon className={styles.refusal_icon}/>
                        :null
                    }
                    {
                        val.type==='photos'&&editedPhotos?
                        <CheckIcon className={styles.refusal_icon} style={{color:"#0358e5"}}/>
                        :val.type==='photos'?
                        <CircleIcon className={styles.refusal_icon}/>
                        :null
                    }
                    {
                        val.type==='location'&&editedLocation?
                        <CheckIcon className={styles.refusal_icon} style={{color:"#0358e5"}}/>
                        :val.type==='location'?
                        <CircleIcon className={styles.refusal_icon}/>
                        :null
                    }
                    <span style={{color:
                            val.type==='titulo'&&editedTitle?'#0358e5':
                            val.type==='description'&&editedDesc?'#0358e5':
                            val.type==='photos'&&editedPhotos?'#0358e5':
                            val.type==='location'&&editedLocation?'#0358e5':''}} className={styles.refusal_type}>{types[val.type]} - </span>
                    <span className={styles.refusal_text}>{getFieldWrongText(val.type)}</span>
                </div>
            )
        })
    }

    const setSelectedTabTopHandler = index => {
        if(index===0)
        {
            setSelectedTab(0)
        }
        else if(index===1)
        {
            if(!tituloWrong&&titulo.length>6&&selectedWorker!=null&&(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true))
                setSelectedTab(index)
        }
        else if(index===2)
        {
            if(getFieldWrong('photos')?editedPhotos:true)
                setSelectedTab(index)
        }
        else
        {
            if(!tituloWrong&&titulo.length>6&&selectedWorker!=null && (user.phone===phone&&user_phone_verified)&&user_email_verified&&checkAddressCorrect() &&(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)&&(getFieldWrong('photos')?editedPhotos:true))
            {
                setSelectedTab(index)
            }
        }
    }

    return (
        <div className={styles.reservation}>
            {backdrop?
                <span className={styles.backdrop} onClick={() => setBackdrop(false)}/>
                :null
            }
            <div className={styles.select_wrapper}>
                <CSSTransition 
                    in={backdrop}
                    timeout={100}
                    classNames="banner"
                    unmountOnExit
                    >
                        <SelectHome
                        publicarNew={true}
                        menuOpen={() => {
                            setBackdrop(true)
                        }}
                        menuClose={() => {
                            setBackdrop(false)
                        }}
                        home={true}
                        profs={true}
                        options={profissoesGrouped}
                        option={selectedWorkerObject}
                        optionFirst={{value: 'trabalhos'}} 
                        smallWindow={windowDimensions.width <= 1024}
                        changeOption={val => {
                            setSelectedWorker(val.value)
                            setSelectedWorkerObject(val)
                            setBackdrop(false)
                        }}
                        placeholder={'TIPO DE SERVIÇO'}/>
                </CSSTransition>
            </div>
            {
                edit?
                <div className={styles.previous_voltar} style={{borderBottom:`3px solid #FF785A`}} onClick={() => navigate(-1)}>
                    <ArrowBackIcon className={styles.previous_symbol}/>
                    <span className={styles.previous_voltar_text} style={{marginLeft:'10px'}}>CANCELAR</span>
                </div>
                :null
            }
            <div className={styles.flex}>

            <div className={verifyPhone||confirmationPopup||confirmationEditPopup||tooManyReservations?styles.backdrop:null} onClick={() => !publicationSent&&(setVerifyPhone(false)||setConfirmationPopup(false)||setConfirmationEditPopup(false)||setTooManyReservations(false))}/>
                <div className={styles.main}>
                    <div ref={recaptchaWrapperRef}>
                        <div id='recaptcha-container' className={styles.recaptcha_container}></div>
                    </div>
                    {
                        loading?
                        <div className={styles.frontdrop_helper} style={{backgroundColor:"#00000080"}}/>
                        :null
                    }
                    <Loader2 loading={loading}/>
                    <CSSTransition 
                    in={inPropFoto}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <Sessao text={"Excedeste o limite de fotografias (max. 6)"}/>
                    </CSSTransition>
                    <CSSTransition
                        in={verifyPhone}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <VerificationBannerPhone
                            cancel={() => {
                                setVerifyPhone(0)
                                setCodeStatus(null)
                                setSendingError(null)
                            }}
                            setNext={val => {
                                if(val===2)
                                    initiatePhoneVerification()
                            }}
                            initiatePhoneVerification={initiatePhoneVerification}
                            completePhoneVerification={completePhoneVerification}
                            next={verifyPhone}
                            phone={phone}
                            verificationId={verificationId}
                            codeStatus={codeStatus}
                            clearCodeStatus={() => setCodeStatus(null)}
                            sendingError={sendingError}
                            />
                    </CSSTransition>
                    <CSSTransition
                        in={verifyEmail}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <VerificationBannerEmail
                            cancel={() => {
                                setVerifyEmail(0)
                                setEmailCodeStatus(null)
                                setSendingError(null)
                            }}
                            setNext={val => setVerifyEmail(val)}
                            initiateEmailVerification={initiateEmailVerification}
                            completeEmailVerification={completeEmailVerification}
                            next={verifyEmail} 
                            codeStatus={emailCodeStatus}
                            email={user.email}
                            emailCodeStatus={emailCodeStatus}
                            clearCodeStatus={() => setEmailCodeStatus(null)}
                            sendingError={sendingError}
                            user_email_verified={user_email_verified}
                            />
                    </CSSTransition>
                    <CSSTransition
                        in={confirmationPopup}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <VerificationBannerConfirm
                            confirm={() => confirmarPopupHandler()}
                            cancel={() => setConfirmationPopup(false)}
                            loadingConfirm={loadingConfirm}
                            publicationSent={publicationSent}
                            />
                    </CSSTransition>
                    <CSSTransition
                        in={confirmationEditPopup}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <VerificationBannerEditConfirm
                            confirm={() => confirmarPopupHandler()}
                            cancel={() => setConfirmationEditPopup(false)}
                            loadingConfirm={loadingConfirm}
                            />
                    </CSSTransition>
                    <CSSTransition
                        in={tooManyReservations}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <VerificationBannerTooMany
                            loadingConfirm={loadingConfirm}
                            />
                    </CSSTransition>

                    <div className={styles.reservar}>
                        <div className={styles.reservar_upper} style={{marginTop:edit?"100px":""}} ref={scrolltopref}>
                            <p className={styles.reservar_upper_title}>
                                {edit?
                                    <div><span style={{color:'#FF785A'}}>EDITAR</span><span> TAREFA</span></div>:
                                    'PUBLICAR TAREFA'
                                }
                            </p>
                            {edit?
                                <div className={styles.fieldWrapper_wrapper}>
                                    <div className={styles.fieldWrapper} style={{animationName:
                                            (getFieldWrong('titulo')?editedTitle:true)
                                            &&(getFieldWrong('description')?editedDesc:true)
                                            &&(getFieldWrong('photos')?editedPhotos:true)
                                            &&(getFieldWrong('location')?editedLocation:true)?'none':null
                                    }}>
                                    <span className={styles.editar_oi}>FAZ AS ALTERAÇÕES E <span style={{textDecoration:'underline', textDecorationColor:'#FF785A', textDecorationThickness:'2px'}}>CONFIRMA A EDIÇÃO</span></span>
                                        {mapWrongToField()}
                                    </div>
                                </div>
                                :
                                null
                            }
                            {
                                edit?
                                null
                                :
                                <p className={styles.reservar_upper_desc}>
                                    Publica a tua tarefa e espera o contacto de um <span style={{color:"#FF785A", fontWeight:600}}>profissional</span><br/>
                                    <br></br>
                                </p>
                            }
                        </div>
                        <div className={styles.display}>
                            <div className={styles.display_element} onClick={() => setSelectedTabTopHandler(0)}>
                                <p className={selectedTab===0?styles.display_element_number_selected
                                                :selectedTab>0?styles.display_element_number
                                                :styles.display_element_number_empty}>1</p>
                                {
                                    selectedTab===0?
                                    <span className={styles.display_element_underline}/>
                                    :
                                    <span className={styles.display_element_underline} style={{backgroundColor:"transparent"}}/>
                                }
                                <p className={styles.display_element_text}>Tarefa</p>
                            </div>
                            <span className={!tituloWrong&&titulo.length>6&&selectedWorker!=null&&(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)?styles.display_element_bar:selectedTab===0?styles.display_element_bar_selected:styles.display_element_empty}/>
                            <div className={styles.display_element} onClick={() => setSelectedTabTopHandler(1)}>
                                <p className={selectedTab===1?styles.display_element_number_selected
                                                :selectedTab>1?styles.display_element_number
                                                :styles.display_element_number_empty}>2</p>
                                {
                                    selectedTab===1?
                                    <span className={styles.display_element_underline}/>
                                    :
                                    <span className={styles.display_element_underline} style={{backgroundColor:"transparent"}}/>
                                }
                                <p className={styles.display_element_text}>Fotografias</p>
                            </div>
                            <span className={selectedTab>2?styles.display_element_bar:!tituloWrong&&titulo.length>6&&selectedWorker!=null&&(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)&&(getFieldWrong('photos')?editedPhotos:true)?styles.display_element_bar:styles.display_element_empty}/>
                            <div className={styles.display_element} onClick={() => setSelectedTabTopHandler(2)}>
                                <p className={selectedTab===2?styles.display_element_number_selected
                                                :selectedTab>2?styles.display_element_number
                                                :styles.display_element_number_empty}>3</p>
                                {
                                    selectedTab===2?
                                    <span className={styles.display_element_underline}/>
                                    :
                                    <span className={styles.display_element_underline} style={{backgroundColor:"transparent"}}/>
                                }
                                <p className={styles.display_element_text}>Detalhes</p>
                            </div>
                            <span className={!tituloWrong&&titulo.length>6&&selectedWorker!=null && (user.phone===phone&&user_phone_verified)&&user_email_verified&&checkAddressCorrect()&&(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)&&(getFieldWrong('photos')?editedPhotos:true)&&(getFieldWrong('location')?editedLocation:true)?styles.display_element_bar:selectedTab===2?styles.display_element_bar_selected:styles.display_element_empty}/>
                            <div className={styles.display_element} onClick={() => setSelectedTabTopHandler(3)}>
                                <p className={selectedTab===3?styles.display_element_number_selected
                                                :selectedTab>3?styles.display_element_number
                                                :styles.display_element_number_empty}>4</p>
                                {
                                    selectedTab===3?
                                    <span className={styles.display_element_underline}/>
                                    :
                                    <span className={styles.display_element_underline} style={{backgroundColor:"transparent"}}/>
                                }
                                <p className={styles.display_element_text}>Concluir</p>
                            </div>
                        </div>
                        {/* <div className={styles.display_divider}/> */}
                        <Carousel 
                            swipeable={false}
                            showArrows={false} 
                            showStatus={false} 
                            showIndicators={false} 
                            showThumbs={false}
                            selectedItem={selectedTab}>
                            <div className={styles.carousel_div}>
                                <PublicarService 
                                    setBackdrop={val => setBackdrop(val)}
                                    selectedWorker={selectedWorker}
                                    setSelectedWorker={setSelectedWorker}
                                    editReservation={editReservation}
                                    getFieldWrong={getFieldWrong}
                                    getFieldWrongText={getFieldWrongText}
                                    setTitulo={setTituloHandler}
                                    titulo={titulo}
                                    tituloWrong={tituloWrong}
                                    description={description}
                                    setDescription={setDescription}
                                    correct={(!tituloWrong)&&selectedWorker!=null&&(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)}
                                    selectedTab={selectedTab}
                                    setEditedTitle={setEditedTitle}
                                    setEditedDesc={setEditedDesc}
                                    editedTitle={editedTitle}
                                    editedDesc={editedDesc}
                                    />
                            </div>
                            <div className={styles.carousel_div}>
                                <PublicarPhoto
                                    edit={edit}
                                    editReservation={editReservation}
                                    images={images}
                                    maxFiles={maxFiles}
                                    inputRef={inputRef}
                                    photoPrincipal={photoPrincipal}
                                    getFieldWrong={getFieldWrong}
                                    getFieldWrongText={getFieldWrongText}
                                    handleFileChange={handleFileChange}
                                    handleClick={handleClick}
                                    deleteImageHandler={deleteImageHandler}
                                    setPhotoPrincipal={setPhotoPrincipalHandler}
                                    selectedTab={selectedTab}
                                    editedPhotos={editedPhotos}
                                    setEditedPhotos={setEditedPhotos}
                                    />
                            </div>
                            <div className={styles.carousel_div}>
                                <PublicarDetails
                                    edit={edit}
                                    editReservation={editReservation}
                                    nome={nome}
                                    phone={phone}
                                    phoneVisual={phoneVisual}
                                    setPhone={setPhoneHandler}
                                    phoneWrong={phoneWrong}
                                    email={email}
                                    setDistrict={setDistrict}
                                    setLat={setLat}
                                    setLng={setLng}
                                    setAddressParent={setAddress}
                                    editAddress={editAddress}
                                    divRef={divRef}
                                    user={user}
                                    porta={porta}
                                    setPorta={setPorta}
                                    portaWrong={portaWrong}
                                    setPortaWrong={setPortaWrong}
                                    setAndar={setAndar}
                                    andar={andar}
                                    getFieldWrong={getFieldWrong}
                                    getFieldWrongText={getFieldWrongText}
                                    selectedTab={selectedTab}
                                    correct_location={checkAddressCorrect()&&porta.length>0&&(getFieldWrong('location')?editedLocation:true)}
                                    correct_location_online={checkAddressCorrect()&&(getFieldWrong('location')?editedLocation:true)}
                                    correct_phone={(user.phone===phone||validator.isMobilePhone(phone, "pt-PT"))&&phone.length>0}
                                    correct_email={user_email_verified}
                                    setVerifyPhone={val => {
                                        scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                        setVerifyPhone(val)}}
                                        
                                    setVerifyEmail={val => {
                                        scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                        setVerifyEmail(val)
                                    }}
                                    expired={expired}
                                    seconds={seconds}
                                    setTaskType={val => setTaskType(val)}
                                    taskType={taskType}
                                    setDistrictHelper={val => setDistrict(val)}
                                    district={district}
                                    availableToGo={availableToGo}
                                    setAvailableToGo={setAvailableToGo}
                                    editedLocation={editedLocation}
                                    setEditedLocation={setEditedLocation}
                                    />
                            </div>
                            <div className={styles.carousel_div}>
                                {
                                    loadingConfirm?
                                    <div className={styles.frontdrop_helper} style={{backgroundColor:"#00000080"}}/>
                                    :null
                                }
                                <Loader2 loading={loadingConfirm}/>
                                <div className={styles.top} style={{overflowY:'auto'}}>
                                    <div className={styles.zone} onClick={() => !loadingConfirm&&!publicationSent&&setSelectedTab(0)}>
                                        <div className={styles.zone_number_div}>
                                            <span className={styles.zone_number}>1</span>
                                        </div>
                                        <p className={styles.zone_title}>Tarefa</p>
                                        <div className={styles.zone_flex}>
                                            <div className={styles.zone_flex_area}>
                                                <div className={styles.zone_service_icon_wrapper}>
                                                    <img className={styles.zone_service_icon} src={profissoesMap[selectedWorker]?.img}/>
                                                </div>
                                                <span className={styles.zone_service_text}>{profissoesMap[selectedWorker]?.label}</span>
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Título</p>
                                                <p className={styles.zone_label_value}>{titulo}</p>
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Descrição da Tarefa</p>
                                                <p className={styles.zone_label_value}>{description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.zone} style={{marginTop:'5px'}} onClick={() => !loadingConfirm&&!publicationSent&&setSelectedTab(1)}>
                                        <div className={styles.zone_number_div}>
                                            <span className={styles.zone_number}>2</span>
                                        </div>
                                        <p className={styles.zone_title}>Fotografias</p>
                                        <p className={styles.zone_label_value} style={{textAlign:"center", margin:"10px 0"}}>{images.length} de 6 Fotografias</p>
                                    </div>
                                    <div className={styles.zone} style={{marginTop:'5px'}} onClick={() => !loadingConfirm&&!publicationSent&&setSelectedTab(2)}>
                                        <div className={styles.zone_number_div}>
                                            <span className={styles.zone_number}>3</span>
                                        </div>
                                        <p className={styles.zone_title}>Detalhes</p>
                                        <div className={styles.zone_flex}>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Localização</p>
                                                {
                                                    taskType===2?
                                                    <span className={styles.zone_label_value}>Tarefa Online</span>
                                                    :
                                                    <span className={styles.zone_label_value}>{address}, {porta}{andar?`, ${andar}`:null}</span>
                                                }
                                                {
                                                    taskType!==2&&availableToGo?
                                                    <span className={styles.zone_label_value_small}>Disponível para ir ao encontro do profissional</span>
                                                    :null
                                                }
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Nome</p>
                                                <p className={styles.zone_label_value}>{nome}</p>
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Telemóvel</p>
                                                <p className={styles.zone_label_value}>{phoneVisual}</p>
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>E-mail</p>
                                                <p className={styles.zone_label_value}>{email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </Carousel>
                        
                        <div className={styles.buttons}>
                            {
                                selectedTab===0?
                                <div data-tooltip- data-tooltip-id={!tituloWrong&&titulo.length>6&&selectedWorker!=null?'':"publicar"} className={(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)&&!tituloWrong&&titulo.length>6&&selectedWorker!=null?styles.login_button:styles.login_button_disabled}
                                    style={{marginTop:0}}
                                    onClick={() => {(getFieldWrong('titulo')?editedTitle:true)&&(getFieldWrong('description')?editedDesc:true)&&!tituloWrong&&titulo.length>6&&selectedWorker!=null&&setSelectedTab(1)}}>
                                    <p className={styles.login_text}>Continuar</p>
                                </div>
                                :
                                selectedTab===1?
                                <div className={styles.buttons_flex}>
                                    <div className={styles.login_button_voltar}
                                        onClick={() => setSelectedTab(selectedTab-1)}>
                                    <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                    </div>
                                    <div className={(getFieldWrong('photos')?editedPhotos:true)?styles.login_button:styles.login_button_disabled}
                                        style={{marginLeft:'10px', marginTop:0}}
                                        onClick={() => (getFieldWrong('photos')?editedPhotos:true)&&setSelectedTab(selectedTab+1)}>
                                        <p className={styles.login_text}>Continuar</p>
                                    </div>
                                </div>
                                :
                                selectedTab===2?
                                <div className={styles.buttons_flex}>
                                    <div className={styles.login_button_voltar}
                                        onClick={() => {setSelectedTab(selectedTab-1)}}>
                                    <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                    </div>
                                    <div className={(((user.phone===phone||validator.isMobilePhone(phone, "pt-PT"))&&phone.length>0)&&user_email_verified)&&checkAddressCorrect()&&(getFieldWrong('location')?editedLocation:true)?styles.login_button:styles.login_button_disabled}
                                        style={{marginLeft:'10px', marginTop:0}}
                                        onClick={() => {(((user.phone===phone||validator.isMobilePhone(phone, "pt-PT"))&&phone.length>0)&&user_email_verified)&&checkAddressCorrect()&&setSelectedTab(selectedTab+1)}}>
                                        <p className={styles.login_text}>Continuar</p>
                                    </div>
                                </div>
                                :
                                selectedTab===3?
                                <div style={{paddingBottom:"20px"}}>
                                    <div className={styles.login_button}
                                        style={{marginTop:0, backgroundColor:"#ffffff", color:"#161F28"}}
                                        onClick={() => {!loadingConfirm&&!publicationSent&&setSelectedTab(selectedTab-1)}}>
                                        <p className={styles.login_text}>EDITAR</p>
                                    </div>
                                    <div className={checkAllFieldsCorrect()?styles.login_button:styles.login_button_disabled}
                                        style={{marginTop:'5px', backgroundColor:edit?"#FF785A":""}}
                                        onClick={() => !publicationSent&&checkAllFieldsCorrect()&&confirmarHandler()}>
                                        {
                                            edit?
                                            <p className={styles.login_text}>CONFIRMAR EDIÇÃO</p>
                                            :
                                            <p className={styles.login_text}>PUBLICAR</p>
                                        }
                                    </div>
                                </div>
                                :null
                                
                            }  
                        </div>
                    </div>
                    
                </div>
                <div className={styles.right}></div>
            </div>
            <Tooltip effect='solid' place='top' id="publicar" className={styles.publicar_tooltip}
                style={{display:selectedTab===0&&(tituloWrong||!titulo.length>6||selectedWorker==null)?"block":selectedTab===2&&(user.phone!==phone||!user_phone_verified||!user_email_verified||!checkAddressCorrect())?"block":"none"}}
                render={() => (
                    <span>Por-favor preenche todos os campos assinalados com um<span style={{color:"#0358e5", fontWeight:"700", fontSize:"1.6rem", marginTop:"5px"}}> *</span> antes de continuares.</span>
                  )}/>
        </div>
    )
}

export default Publicar