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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader } from '@googlemaps/js-api-loader'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux'
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

const Publicar = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})

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
    const [complete, setComplete] = useState(false)
    const [inProp, setInProp] = useState(false)
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
    const [verifyPhone, setVerifyPhone] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)

    const [photoPrincipal, setPhotoPrincipal] = useState(null)
    const [expired, setExpired] = useState(true)

    const allFieldsCorrect = (user.phone===phone&&!user.phone_verified)&&!user.email_verified&&titulo.length>5&&selectedWorker!=null&&address!=null&&porta.length>0&&!loadingConfirm

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
                    let arr = []
                    for(let img of res.data.photos){
                        arr.push({
                            from_edit:true,
                            url:img.url,
                            id:img.id
                        })
                    }
                    setImages(arr)
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

    const uploadImageFileHandler = async (file, postId, it, arr) => {
        const storageRef = ref(storage, `posts/${postId}/${it}`);
        return uploadBytes(storageRef, file.img).then(() => {
            return getDownloadURL(storageRef).then(url => {
                arr.push({
                    url: url,
                    id: file.id
                })
            })
        })
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#ff3b30"
        if(type===3) return "#1EACAA"
        return "#FFFFFF"
    }

    const confirmarPopupHandler = async () => {
        setLoadingConfirm(true)
        let arr = []
        let postId = ObjectID()
        if(edit){
            for(let img_obj of images)
            {
                if(img_obj.from_edit)
                    arr.push({
                        url: img_obj.url,
                        id: img_obj.id
                    })
            }
            postId = editReservation._id
        }
        await Promise.all(imageFiles.map((file, i) => uploadImageFileHandler(file, postId, i, arr)))
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
        let auximages = [...images]
        let auximagefiles = [...imageFiles]
        let i = 0
        for(let el of auximages)
        {
            if(el.id === img_id)
            {
                auximages.unshift(auximages.splice(i, 1)[0])
                auximagefiles.unshift(auximagefiles.splice(i, 1)[0])
                setImages(auximages)
                setImageFiles(auximagefiles)
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
            {
                confirmationEditPopup?
                <Popup
                        type = 'confirm_edit'
                        confirmRes = {true}
                        worker={selectedWorker}
                        confirmHandler={() => confirmarPopupHandler()}
                        cancelHandler={() => setConfirmationEditPopup(false)}
                        />
                    :null
            }
            {
                tooManyReservations?
                <Popup
                    type = 'error_to_many'
                    cancelHandler={() => setTooManyReservations(false)}
                    />
                :null
            }
            <div className={styles.flex}>
                <div className={styles.main}>
                    {
                        loading?
                        <div className={styles.frontdrop_helper} style={{backgroundColor:"#00000080"}}/>
                        :null
                    }
                    <Loader2 loading={loading}/>
                    <CSSTransition 
                    in={inProp}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                        <Sessao text={"Sessão iniciada com Sucesso!"}/>
                    </CSSTransition>
                    <CSSTransition 
                    in={inPropFoto}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <Sessao text={"Excedeste o limite de fotografias (max. 6)"}/>
                    </CSSTransition>
                    <div className={verifyPhone||confirmationPopup?styles.backdrop:null} onClick={() => setVerifyPhone(false)||setConfirmationPopup(false)}/>
                    <CSSTransition
                        in={verifyPhone}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <VerificationBannerPhone 
                            cancel={() => setVerifyPhone(0)}
                            setNext={val => {
                                if(val===2)
                                {
                                    setVerifyPhone(2)
                                    handlerVerifyPressed()
                                }
                            }}
                            next={verifyPhone} 
                            phone={phone}
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

                    <div className={styles.reservar}>
                        <div className={styles.reservar_upper} style={{marginTop:edit?"100px":""}}>
                            <p className={styles.reservar_upper_title}>
                                {edit?
                                <div><span style={{color:'#FF785A'}}>EDITAR</span><span> TRABALHO</span></div>:
                                'PUBLICAR TRABALHO'
                                }
                            </p>
                            {
                                edit?
                                null
                                :
                                <p className={styles.reservar_upper_desc}>
                                    Criar e publicar o seu <span className={styles.action}>trabalho</span>.<br/>
                                    <br></br>
                                </p>
                            }
                        </div>
                        {
                            edit?
                            <div className={styles.button_type_wrapper} onClick={() => navigate(-1)}>
                                <span className={styles.button_type} style={{backgroundColor:'#FF785A'}}>
                                CANCELAR
                            </span>

                            </div>
                            
                        :null
                        }
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
                                <p className={styles.display_element_text}>Serviço</p>
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
                                    setActivateEditAddress={setActivateEditAddress}
                                    activateEditAddress={activateEditAddress}
                                    getFieldWrong={getFieldWrong}
                                    getFieldWrongText={getFieldWrongText}
                                    selectedTab={selectedTab}
                                    correct_location={address!==null&&porta.length>0}
                                    correct_phone={user.phone===phone&&user.phone_verified}
                                    correct_email={user.email_verified}
                                    setVerifyPhone={val => setVerifyPhone(val)}
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
                                    <div className={styles.zone} onClick={() => !loadingConfirm&&setSelectedTab(0)}>
                                        <div className={styles.zone_number_div}>
                                            <span className={styles.zone_number}>1</span>
                                        </div>
                                        <p className={styles.zone_title}>Serviço</p>
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
                                    <div className={styles.zone} style={{marginTop:'5px'}} onClick={() => !loadingConfirm&&setSelectedTab(1)}>
                                        <div className={styles.zone_number_div}>
                                            <span className={styles.zone_number}>2</span>
                                        </div>
                                        <p className={styles.zone_title}>Fotografias</p>
                                        <p className={styles.zone_label_value} style={{textAlign:"center", margin:"10px 0"}}>{images.length} de 6 Fotografias</p>
                                    </div>
                                    <div className={styles.zone} style={{marginTop:'5px'}} onClick={() => !loadingConfirm&&setSelectedTab(2)}>
                                        <div className={styles.zone_number_div}>
                                            <span className={styles.zone_number}>3</span>
                                        </div>
                                        <p className={styles.zone_title}>Detalhes</p>
                                        <div className={styles.zone_flex}>
                                            <div className={styles.zone_label_div}>
                                                <p className={styles.zone_label}>Localização</p>
                                                <span className={styles.zone_label_value}>{address}, {porta}{andar?`, ${andar}`:null}</span>
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
                                    <div className={((user.phone===phone&&user.phone_verified)&&user.email_verified)&&address!=null&&porta!=null?styles.login_button:styles.login_button_disabled}
                                        style={{marginLeft:'10px', marginTop:0}}
                                        onClick={() => {setSelectedTab(selectedTab+1)}}>
                                        <p className={styles.login_text}>Continuar</p>
                                    </div>
                                </div>
                                :
                                selectedTab===3?
                                <div>
                                    <div className={styles.login_button}
                                        style={{marginTop:0, backgroundColor:"#ffffff", color:"#161F28"}}
                                        onClick={() => {!loadingConfirm&&setSelectedTab(selectedTab-1)}}>
                                        <p className={styles.login_text}>EDITAR</p>
                                    </div>
                                    <div className={allFieldsCorrect?styles.login_button:styles.login_button_disabled}
                                        style={{marginTop:'5px'}}
                                        onClick={() => allFieldsCorrect&&confirmarHandler()}>
                                        <p className={styles.login_text}>PUBLICAR</p>
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