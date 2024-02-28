import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './publicar.module.css'
import validator from 'validator';
import {Tooltip} from 'react-tooltip';

import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import Popup from '../transitions/popup';
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
import {profissoesPngs, profissoesOptions} from '../general/util'
import Loader2 from '../general/loader';
import VerificationBannerConfirm from '../general/verificationBannerConfirm';
import VerificationBannerEditConfirm from '../general/verificationBannerEditConfirm';
import VerificationBannerTooMany from '../general/verificationBannerTooMany';
import { auth } from '../firebase/firebase'
import { user_update_field, user_update_phone_verified, user_update_email_verified } from '../store';
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, sendEmailVerification, unlink } from 'firebase/auth';
import VerificationBannerEmail from '../general/verificationBannerEmail';

const Publicar = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})

    const dispatch = useDispatch()

    const [selectedWorker, setSelectedWorker] = useState(null)
    const [titulo, setTitulo] = useState('')
    const [tituloWrong, setTituloWrong] = useState(false)
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
    const [editAddress, setEditAddress] = useState(null)
    const [activateEditAddress, setActivateEditAddress] = useState(false)
    const [confirmationEditPopup, setConfirmationEditPopup] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [verifyPhone, setVerifyPhone] = useState(0)
    const [verifyEmail, setVerifyEmail] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)

    const [photoPrincipal, setPhotoPrincipal] = useState(null)
    const [expired, setExpired] = useState(true)

    const [publicationSent, setPublicationSent] = useState(false)

    const recaptchaWrapperRef = useRef(null)
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaObject = useRef(null)

    const [codeStatus, setCodeStatus] = useState(null)
    const [emailCodeStatus, setEmailCodeStatus] = useState(null)

    const [sendingError, setSendingError] = useState(null)

    const allFieldsCorrect = (user.phone===phone&&user_phone_verified)&&user_email_verified&&titulo.length>5&&selectedWorker!=null&&address!=null&&porta.length>0&&!loadingConfirm

    const maxFiles = 6
    const inputRef = useRef(null);
    const ObjectID = require("bson-objectid");
    const divRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [searchParams] = useSearchParams()

    // useEffect(() => {
    //     textareaRef.current.style.height = "100px";
    //     const scrollHeight = textareaRef.current.scrollHeight;
    //     if(scrollHeight <= 400)
    //         textareaRef.current.style.height = scrollHeight + "px";
    //     else textareaRef.current.style.height = "400px";
    // }, [textareaHeight]);

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

    // useEffect(() => {
    //     if(location.state && location.state.carry){
    //         setDescription(location.state.desc)
    //         setImages(location.state.images)
    //         setImageFiles(location.state.imageFiles)
    //         setTitulo(location.state.title)
    //         setInProp(true)
    //         setTimeout(() => setInProp(false), 4000)
    //     }
    // }, [location])

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
            axios.get(`${api_url}/reservations/get_single_by_id`, { params: {_id: paramsAux.res_id} }).then(res => {
                if(res.data){
                    !editReservation&&setSelectedWorker(res.data.workerType)
                    setEditReservation(res.data)
                    setTitulo(res.data.title)
                    setDescription(res.data.desc)
                    setEditAddress(res.data.localizacao)
                    setPorta(res.data.porta)
                    setLat(res.data.lat)
                    setLng(res.data.lng)
                    setDistrict(res.data.district)
                    setPhotoPrincipal(res.data.photo_principal)
                    setImages(res.data.photos)
                    setLoading(false)
                    console.log(res.data);
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
            // setEditAddress(null)
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
    
    const checkAll = () => {
        return nome.length>0 && 
        validator.isMobilePhone(phone, "pt-PT") && 
        validator.isEmail(email) && 
        (address.length>0 || editAddress?.length>0) && 
        titulo.length>5 && 
        porta.length>0 &&
        selectedWorker != null
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
        // setLoadingConfirm(true)
        // setPublicationSent(true)
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
                    console.log('teste')
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
            localizacao: address || editAddress,
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
            district: district
        }
        axios.post(`${api_url}/reservations/add`, reserva).then(() => {
            setLoadingConfirm(false)
            if(user.phone === "" || user.phone !== phone){
                axios.post(`${api_url}/user/update_phone`, {
                    user_id : user._id,
                    phone: phone
                }).then(res => {
                    console.log(res);
                })
            }
        })
    }

    const confirmarHandler = () => {
        checkPendingReservations()
    }

    const checkPendingReservations = () => {
        axios.get(`${api_url}/reservations/get_by_id`, { params: {user_id: user._id} }).then(res => {
            if(edit)
            {
                setConfirmationEditPopup(true)
            }
            else if(res.data?.length<3){
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
            console.log(objectUrl, img);
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
    }

    const setPhotoPrincipalHandler = img_id => {
        console.log(img_id)
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
        for(let el of editReservation.refusal_object)
        {
            if(el.type===type) return true
        }
    }

    const getFieldWrongText = type => {
        for(let el of editReservation.refusal_object)
        {
            if(el.type===type) return el.text
        }
    }

    const setTituloHandler = val => {
        setTitulo(val)
        if(titulo.length>5) setTituloWrong(false)
    }

    const setActivateEditAddressHandler = () => {
        setActivateEditAddress(true)
        setPorta('')
        setAndar('')
        setAddress('')
    }

    const initiateEmailVerification = () => {
        setSendingError(null)
        var actionCodeSettings = {
            url: 'https://google.com',
            handleCodeInApp: false
        }

        sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
                setVerifyEmail(2)
                console.log('sent')
            })
            .catch(e => {
                console.log(e)
                if(e.code === "auth/too-many-requests")
                    setSendingError('Demasiadas tentativas, por-favor tente mais tarde.')
                else
                    setSendingError('Erro a enviar o e-mail de verificação, por-favor tente mais tarde.')
            })
    }

    const completeEmailVerification = async () => {
        setEmailCodeStatus(null)
        await auth.currentUser.reload()
        if(auth?.currentUser?.emailVerified === true)
        {
            setEmailCodeStatus(true)
            dispatch(user_update_email_verified(true))
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

        recaptcha.verify().then(() => {
            var provider = new PhoneAuthProvider(auth)
            provider.verifyPhoneNumber(`+351${user.phone}`, recaptcha).then(verificationId => {
                    console.log(verificationId)
                    setVerificationId(verificationId)
                    setVerifyPhone(2)
                }).catch(function (error) {
                    alert(error)
                    recaptcha.clear()
                    setVerificationId(null)
                })
        })
        .catch(e => {
            console.log(e)
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

    return (
        <div className={styles.reservation}>
            {
                edit?
                <div className={styles.previous_voltar} style={{borderBottom:`3px solid #FF785A`}} onClick={() => navigate(-1)}>
                    <ArrowBackIcon className={styles.previous_symbol}/>
                    <span className={styles.previous_voltar_text} style={{marginLeft:'10px'}}>CANCELAR</span>
                </div>
                :null
            }
            <div className={styles.flex}>
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
                    <div className={verifyPhone||confirmationPopup||confirmationEditPopup||tooManyReservations?styles.backdrop:null} onClick={() => !publicationSent&&(setVerifyPhone(false)||setConfirmationPopup(false)||setConfirmationEditPopup(false)||setTooManyReservations(false))}/>
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
                        <div className={styles.reservar_upper} style={{marginTop:edit?"100px":""}}>
                            <p className={styles.reservar_upper_title}>
                                {edit?
                                <div><span style={{color:'#FF785A'}}>EDITAR</span><span> TAREFA</span></div>:
                                'PUBLICAR TAREFA'
                                }
                            </p>
                            {
                                edit?
                                null
                                :
                                <p className={styles.reservar_upper_desc}>
                                    Criar e publicar a tua <span className={styles.action}>tarefa</span>.<br/>
                                    <br></br>
                                </p>
                            }
                        </div>
                        <div className={styles.display}>
                            <div className={styles.display_element}>
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
                            <span className={selectedTab===0?styles.display_element_bar_selected:selectedTab>0?styles.display_element_bar:styles.display_element_empty}/>
                            <div className={styles.display_element}>
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
                            <span className={selectedTab===1?styles.display_element_bar_selected:selectedTab>1?styles.display_element_bar:styles.display_element_empty}/>
                            <div className={styles.display_element}>
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
                            <span className={selectedTab===2?styles.display_element_bar_selected:selectedTab>2?styles.display_element_bar:styles.display_element_empty}/>
                            <div className={styles.display_element}>
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
                                    correct={titulo.length>5&&selectedWorker!=null}
                                    selectedTab={selectedTab}
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
                                    divRef={divRef}
                                    user={user}
                                    porta={porta}
                                    setPorta={setPorta}
                                    portaWrong={portaWrong}
                                    setPortaWrong={setPortaWrong}
                                    setAndar={setAndar}
                                    andar={andar}
                                    setActivateEditAddress={setActivateEditAddressHandler}
                                    activateEditAddress={activateEditAddress}
                                    editAddress={editAddress}
                                    getFieldWrong={getFieldWrong}
                                    getFieldWrongText={getFieldWrongText}
                                    selectedTab={selectedTab}
                                    correct_location={address!==null&&porta.length>0}
                                    correct_phone={user.phone===phone&&user_phone_verified}
                                    correct_email={user_email_verified}
                                    setVerifyPhone={val => setVerifyPhone(val)}
                                    setVerifyEmail={val => setVerifyEmail(val)}
                                    expired={expired}
                                    seconds={seconds}
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
                                                    <img className={styles.zone_service_icon} src={profissoesPngs[selectedWorker]}/>
                                                </div>
                                                <span className={styles.zone_service_text}>{profissoesOptions[selectedWorker]}</span>
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Título</p>
                                                <p className={styles.zone_label_value}>{titulo}</p>
                                            </div>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Descrição</p>
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
                                                <span className={styles.zone_label_value}>{address||editAddress}, {porta}{andar?`, ${andar}`:null}</span>
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
                                <div className={titulo.length>5&&selectedWorker!=null?styles.login_button:styles.login_button_disabled}
                                    style={{marginTop:0}}
                                    onClick={() => {titulo.length>5&&selectedWorker!=null&&setSelectedTab(1)}}>
                                    <p className={styles.login_text}>Continuar</p>
                                </div>
                                :
                                selectedTab===1?
                                <div className={styles.buttons_flex}>
                                    <div className={styles.login_button_voltar}
                                        onClick={() => setSelectedTab(selectedTab-1)}>
                                    <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                    </div>
                                    <div className={styles.login_button}
                                        style={{marginLeft:'10px', marginTop:0}}
                                        onClick={() => setSelectedTab(selectedTab+1)}>
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
                                    <div className={((user.phone===phone&&user_phone_verified)&&user_email_verified)&&address!=null&&porta!=null?styles.login_button:styles.login_button_disabled}
                                        style={{marginLeft:'10px', marginTop:0}}
                                        onClick={() => {setSelectedTab(selectedTab+1)}}>
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
                                    <div className={allFieldsCorrect?styles.login_button:styles.login_button_disabled}
                                        style={{marginTop:'5px', backgroundColor:edit?"#FF785A":""}}
                                        onClick={() => !loadingConfirm&&!publicationSent&&allFieldsCorrect&&confirmarHandler()}>
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
            <Tooltip effect='solid'/>
        </div>
    )
}

export default Publicar