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

import PublicarService from '../publicar/publicar_service';
import PublicarPhoto from '../publicar/publicar_photo';
import PublicarDetails from '../publicar/publicar_details';

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
    const [badAddress, setBadAddress] = useState(false)
    const [wrongAddress, setWrongAddress] = useState(false)
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

    const [photoPrincipal, setPhotoPrincipal] = useState(null)



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

    useEffect(() => {
        if(location.state && location.state.carry){
            setDescription(location.state.desc)
            setImages(location.state.images)
            setImageFiles(location.state.imageFiles)
            setTitulo(location.state.title)
            setInProp(true)
            setTimeout(() => setInProp(false), 4000)
        }
    }, [location])

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
        props.loadingHandler(true)
        const paramsAux = Object.fromEntries([...searchParams])
        if(paramsAux && !paramsAux.editar){
            setSelectedWorker(paramsAux.t)
        }
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
                    let arr = []
                    for(let img_url of res.data.photos){
                        arr.push({
                            from_edit:true,
                            url:img_url
                        })
                    }
                    setImages(arr)
                    props.loadingHandler(false)
                    console.log(res.data);
                }
                else{
                    setEditReservation(null)
                    props.loadingHandler(false)
                }
            })
        }
        else{
            setEdit(false)
            setEditReservation(null)
            setTitulo('')
            setDescription('')
            setEditAddress(null)
            setPorta('')
            setLat('')
            setLng('')
            setDistrict('')
            props.loadingHandler(false)
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
        return uploadBytes(storageRef, file).then(() => {
            return getDownloadURL(storageRef).then(url => {
                arr.push(url)
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
        props.loadingHandler(true)
        let arr = []
        let postId = ObjectID()
        if(edit){
            for(let img_obj of images)
            {
                if(img_obj.from_edit)
                    arr.push(img_obj.url)
            }
            postId = editReservation._id
        }
        await Promise.all(imageFiles.map((file, i) => uploadImageFileHandler(file, postId, i, arr)))
        let time = new Date()

        let final_images = []
        let i=0
        for(let url of arr)
        {
            final_images.push(
                {
                    url: url,
                    id: i
                }
            )
            i++
        }
        
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
            photos: final_images,
            photo_principal: photoPrincipal,
            lat: lat,
            lng: lng,
            photoUrl: user.photoUrl,
            timestamp: time.getTime(),
            district: district
        }
        axios.post(`${api_url}/reservations/add`, reserva).then(() => {
            setConfirmationPopup(false)
            setConfirmationEditPopup(false)
            props.loadingHandler(false)
            if(user.phone === "" || user.phone !== phone){
                axios.post(`${api_url}/user/update_phone`, {
                    user_id : user._id,
                    phone: phone
                }).then(res => {
                    console.log(res);
                })
            }
            navigate('/user?t=publications')
        })
    }

    const confirmarHandler = () => {
        if(!user && checkAll()){
            navigate('/authentication?type=0',
                {
                    state: {
                        carry: true,
                        desc: description,
                        nameCarry: nome,
                        phoneCarry: phone,
                        emailCarry: email,
                        worker: selectedWorker,
                        title: titulo,
                        images: images,
                        imageFiles: imageFiles
                    }
                })
        }
        else if(checkAll()){
            props.loadingHandler(true)
            checkPendingReservations()
        }
    }

    const checkPendingReservations = () => {
        axios.get(`${api_url}/reservations/get_by_id`, { params: {user_id: user._id} }).then(res => {
            if(edit)
            {
                props.loadingHandler(false)
                setConfirmationEditPopup(true)
            }
            else if(res.data?.length<3){
                props.loadingHandler(false)
                setConfirmationPopup(true)
            }
            else{
                props.loadingHandler(false)
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
            const objectUrl = URL.createObjectURL(img)
            console.log(objectUrl, img);
            files_aux.push(img)
            images_aux.push({
                from_edit:false,
                url:objectUrl,
                id:`${img.name}_${new Date().getTime()}`
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
                    <span className={styles.previous_voltar_text}>CANCELAR<span style={{color:'#FF785A'}}> EDIÇÃO</span></span>
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
            {
                confirmationPopup?
                    <Popup
                        type = 'confirm'
                        confirmRes = {true}
                        worker={selectedWorker}
                        confirmHandler={() => confirmarPopupHandler()}
                        cancelHandler={() => setConfirmationPopup(false)}
                        />
                    :null
            }
            <div className={styles.flex}>
                <div className={styles.main}>
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
                                <p className={styles.reservar_upper_desc} style={{display:"flex", justifyContent:"center", marginBottom:"10px"}}>
                                    <span className={styles.action} style={{fontSize:"1rem"}}>EDITAR</span>
                                </p>
                                :
                                <p className={styles.reservar_upper_desc}>
                                    Criar e publicar o seu <span className={styles.action}>trabalho</span>.<br/>
                                    <br></br>
                                </p>
                            }
                        </div>
                        {
                            edit?
                            <span className={styles.button_type} style={{backgroundColor:getTypeColor(editReservation?.type)}}>
                                {
                                    editReservation?
                                        editReservation.type===0?
                                        "PROCESSAR"
                                        :editReservation.type===1?
                                        "ACTIVO"
                                        :editReservation.type===2?
                                        "RECUSADO"
                                        :"COMPLETO"
                                    :null
                                }
                            </span>
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
                                <p className={styles.display_element_text}>Localização</p>
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
                                    edit={edit}
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
                                    />
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
                                    <div className={((user.phone===phone&&user.phone_verified)&&user.email_verified)?styles.login_button:styles.login_button_disabled}
                                        style={{marginLeft:'10px', marginTop:0}}
                                        onClick={() => {setSelectedTab(selectedTab+1)}}>
                                        <p className={styles.login_text}>Continuar</p>
                                    </div>
                                </div>
                                :
                                selectedTab===5?
                                <div ref={divRef} data-tip={complete?"":"Preenche todos os campos assinalados com *"} style={{backgroundColor:edit?"#FF785A":""}} className={complete?styles.bot_button:styles.bot_button_disabled} onClick={() => {
                                            if(complete) confirmarHandler()}}>
                                    <span className={complete?styles.bot_button_text:styles.bot_button_text_disabled}>{edit?"Confirmar edição do Trabalho":user?"Publicar Trabalho":"Criar conta e Publicar trabalho" }</span>
                                </div>
                                :null
                                
                            }  
                        </div>
                        {
                            edit?
                            <div style={{display:"flex", marginTop:"-50px", marginBottom:"20px"}} onClick={() => navigate(-1)}>
                                <span className={styles.cancelar_editar} >CANCELAR EDITAR</span>
                            </div>
                            :null
                        }
                    </div>
                    
                </div>
                <div className={styles.right}></div>
            </div>
            <Tooltip effect='solid'/>
        </div>
    )
}

export default Publicar