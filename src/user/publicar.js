import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './publicar.module.css'
import TopSelect from '../selects/selectStyling';
import dayjs from 'dayjs';
import validator from 'validator';
import {Tooltip} from 'react-tooltip';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode, { setLanguage } from "react-geocode";
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import Popup from '../transitions/popup';
import axios from 'axios'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader } from '@googlemaps/js-api-loader'
import TextareaAutosize from 'react-textarea-autosize';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {profissoesPngs} from '../general/util'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';

Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')

const Publicar = (props) => {

    const [selectedWorker, setSelectedWorker] = useState('eletricista')
    const [titulo, setTitulo] = useState('')
    const [tituloFocused, setTituloFocused] = useState(false)
    const [tituloWrong, setTituloWrong] = useState(false)
    const [description, setDescription] = useState('')
    const [nome, setNome] = useState('')
    const [nomeWrong, setNomeWrong] = useState(false)
    const [nomeFocused, setNomeFocused] = useState(false)
    const [phone, setPhone] = useState('')
    const [phoneVisual, setPhoneVisual] = useState('')
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [phoneFocused, setPhoneFocused] = useState(false)
    const [email, setEmail] = useState('')
    const [emailWrong, setEmailWrong] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [address, setAddress] = useState('')
    const [badAddress, setBadAddress] = useState(false)
    const [wrongAddress, setWrongAddress] = useState(false)
    const [addressFocused, setAddressFocused] = useState(false)
    const [porta, setPorta] = useState('')
    const [portaFocused, setPortaFocused] = useState(false)
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

    const textareaRef = useRef(null);
    const [textareaHeight, setTextareaHeight ] = useState("");

    const maxFiles = 6
    const inputRef = useRef(null);
    const ObjectID = require("bson-objectid");
    const divRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [searchParams] = useSearchParams()

    const regioes = [
        { value: 'acores', label: 'Açores' },
        { value: 'aveiro', label: 'Aveiro' },
        { value: 'beja', label: 'Beja' },
        { value: 'braga', label: 'Braga' },
        { value: 'braganca', label: 'Bragança' },
        { value: 'castelo_branco', label: 'Castelo Branco' },
        { value: 'coimbra', label: 'Coimbra' },
        { value: 'evora', label: 'Évora' },
        { value: 'faro', label: 'Faro' },
        { value: 'guarda', label: 'Guarda' },
        { value: 'leiria', label: 'Leiria' },
        { value: 'lisboa', label: 'Lisboa' },
        { value: 'madeira', label: 'Madeira' },
        { value: 'portalegre', label: 'Portalegre' },
        { value: 'porto', label: 'Porto' },
        { value: 'santarem', label: 'Santarém' },
        { value: 'setubal', label: 'Setúbal' },
        { value: 'viana_do_castelo', label: 'Viana do Castelo' },
        { value: 'vila_real', label: 'Vila Real' },
        { value: 'viseu', label: 'Viseu' }
    ]

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
        if(props.user){
            setNome(`${props.user.name} ${props.user.surname}`)
            setEmail(props.user.email)
            if(props.user.phone){
                setPhone(props.user.phone)
                setPhoneVisual(props.user.phone)
            }            
        }
    }, [props.user])

    useEffect(() => {
        props.loadingHandler(true)
        const paramsAux = Object.fromEntries([...searchParams])
        if(paramsAux && !paramsAux.editar){
            setSelectedWorker(paramsAux.t)
        }
        else if(!paramsAux.editar)
        {
            setSelectedWorker('eletricista')
        }
        if(paramsAux.editar && paramsAux.res_id)
        {   
            setEdit(true)
            axios.get(`${props.api_url}/reservations/get_single_by_id`, { params: {_id: paramsAux.res_id} }).then(res => {
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

    useEffect(() => {
        if(checkAll())
            setComplete(true)
        else{
            setComplete(false)
        }
        if(!validator.isMobilePhone(phone, "pt-PT") && phoneFocused){
            if(!phoneWrong) setPhoneWrong(true)
        }
        else{
            setPhoneWrong(false)
        }
        if(!validator.isEmail(email) && emailFocused){
            if(!emailWrong) setEmailWrong(true)
        }
        else{
            setEmailWrong(false)
        }
        if(nome.length>0) setNomeWrong(false)
        else if(nomeFocused) setNomeWrong(true)
        if(porta.length>0) setPortaWrong(false)
        else if(portaFocused) setPortaWrong(true)
        if(address.length===0 && addressFocused) setWrongAddress(true)
        if(titulo.length>5) setTituloWrong(false)
        else if(tituloFocused) setTituloWrong(true)
    }, [nome, phone, email, address, phoneFocused, emailFocused, porta, portaFocused, addressFocused, titulo, tituloFocused, editAddress, selectedWorker])

    const checkAll = () => {
        return nome.length>0 && 
        validator.isMobilePhone(phone, "pt-PT") && 
        validator.isEmail(email) && 
        (address.length>0 || editAddress?.length>0) && 
        titulo.length>5 && 
        porta.length>0 &&
        selectedWorker != null
    }

    const nameFocused = () => {
        if(nome.length===0) setNomeWrong(true)
        setNomeFocused(true)
    }

    const setPhoneHandler = (val) => {
        let phone = val.replace(/\s/g, '')
        setPhone(phone)
    }
    const setAddressHandler = (val) => {
        Geocode.fromAddress(val.label).then(
            (response) => {
                let longDistrict = null
                console.log(response.results[0].address_components);
                for(let el of response.results[0].address_components){
                    if(el.types.includes("administrative_area_level_1")){
                        console.log(el.long_name);
                        longDistrict = el.long_name
                        break
                    }
                }
                if(longDistrict){
                    for(let obj of regioes){
                        if(obj.label === longDistrict){
                            setDistrict(obj.value)
                        }
                    }
                }
                const { lat, lng } = response.results[0].geometry.location
                setLat(lat)
                setLng(lng)
                setAddress(val.label)
                setBadAddress(false)
                setWrongAddress(false)
            })
    }

    const uploadImageFileHanlder = async (file, postId, it, arr) => {
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
        await Promise.all(imageFiles.map((file, i) => uploadImageFileHanlder(file, postId, i, arr)))
        let time = new Date()
        let reserva = {
            _id: postId,
            user_id: props.user._id,
            user_name: props.user.name,
            user_phone: phone,
            user_email: props.user.email,
            title: titulo,
            desc: description,
            localizacao: address || editAddress,
            porta: porta,
            andar: andar,
            type: 0,
            workerType: selectedWorker,
            clicks: 0,
            photos: arr,
            lat: lat,
            lng: lng,
            photoUrl: props.user.photoUrl,
            timestamp: time.getTime(),
            district: district
        }
        axios.post(`${props.api_url}/reservations/add`, reserva).then(() => {
            setConfirmationPopup(false)
            setConfirmationEditPopup(false)
            props.loadingHandler(false)
            if(props.user.phone === "" || props.user.phone !== phone){
                axios.post(`${props.api_url}/user/update_phone`, {
                    user_id : props.user._id,
                    phone: phone
                }).then(res => {
                    console.log(res);
                })
            }
            navigate('/user?t=publications')
        })
    }

    const confirmarHandler = () => {
        if(!props.user && checkAll()){
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
        axios.get(`${props.api_url}/reservations/get_by_id`, { params: {user_id: props.user._id} }).then(res => {
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
      };
    
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
                url:objectUrl
            })
        }
        setImageFiles(files_aux)
        setImages(images_aux)
        event.target.value = null;
    }

    const deleteImageHandler = img => {
        let auximages = [...images]
        let auximagefiles = [...imageFiles]
        let index = auximages.indexOf(img)
        auximages.splice(index, 1)
        auximagefiles.splice(index, 1)
        setImages(auximages)
        setImageFiles(auximagefiles)
    }

    const displayImages = () => {
        if(images.length===6){
            return images.map((img_obj, i) => {
                return (
                    <div key={i} className={styles.foto_img_wrapper} onClick={() => deleteImageHandler(img_obj)}>
                        <DeleteIcon className={styles.foto_img_delete}/>
                        <img key={i} src={img_obj.url} className={styles.foto_img}></img>
                        <span className={styles.foto_img_number}>Fotografia {i+1}</span>
                    </div>
                    
                )
            })
        }
        else {
            let arr = [...images]
            arr.push({blank:true})
            return arr.map((img_obj, i) => {
                if(!img_obj.blank){
                    return (
                        <div key={i} className={styles.helper_img_div}>
                            <div className={styles.foto_img_wrapper} onClick={() => deleteImageHandler(img_obj)}>
                                <span className={styles.frontdrop_helper}></span>
                                <DeleteIcon className={styles.foto_img_delete}/>
                                <img key={i} src={img_obj.url} className={styles.foto_img}></img>
                            </div>
                            <span className={styles.foto_img_number}>Fotografia {i+1}</span>
                        </div>
                        
                        
                    )
                }
                else {
                    return (
                        <div key={i} className={styles.foto_img_wrapper_add} onClick={() => handleClick()}>
                            <AddCircleOutlineIcon className={styles.foto_symbol_add}/>
                            <span className={styles.foto_symbol_indicator}>Adicionar</span>
                        </div>
                        
                    )
                }
                
            })
        }
        
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
                                    Criar e publicar o seu <span className={styles.action}>trabalho</span><br/>
                                    <br></br>
                                </p>
                            }
                        </div>
                        <div style={{width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                            <div className={styles.bot_title_wrapper}>
                                <div className={styles.bot_title_indicator_wrapper}>
                                    <span className={styles.bot_title_indicator}>1</span>
                                </div>
                                <span className={styles.bot_title}>Detalhes do Trabalho</span>
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
                            
                        </div>
                        
                        
                        <div className={styles.top}>
                            {
                                edit?
                                <BorderColorIcon className={styles.top_abs_edit}/>
                                :null
                            }
                            <div className={styles.top_left}>
                                <span className={styles.left_image_border}>
                                    {
                                        selectedWorker?
                                        <img src={profissoesPngs[selectedWorker]} className={styles.left_img}></img>
                                        :
                                        <div>
                                            <QuestionMarkOutlinedIcon className={styles.left_img_qm}/>
                                            <span className={styles.left_img_qm_asterisc}>*</span>
                                        </div>
                                        
                                    }                                    
                                </span>
                                
                                <div className={styles.left_select}>
                                    <TopSelect
                                        id={selectedWorker}
                                        changeWorker={val => {
                                            if(edit)
                                            {
                                                setSelectedWorker(val)
                                            }
                                            else
                                            {
                                                navigate({
                                                    pathname: `/publicar`,
                                                    search: `?t=${val}`
                                                })
                                            }}}
                                    />
                                </div>
                            </div>
                            <div className={styles.top_right}>
                                <div className={styles.diff_right}>
                                        {
                                            editReservation?.type===2&&getFieldWrong('titulo')?
                                            <div className={styles.diff_right_title_container}>
                                                <span className={styles.diff_right_title}
                                                    style={{marginBottom:0}}>Título<span className={styles.action}>*</span>
                                                </span>
                                                <span className={styles.diff_right_title_wrong_div}>
                                                    <span className={styles.editar_tit}>editar</span> {getFieldWrongText('titulo')}
                                                </span>
                                            </div>
                                            :
                                            <span className={styles.diff_right_title}>Título<span className={styles.action}>*</span>
                                            </span>
                                        }
                                    
                                    <input onFocus={() => {setTituloFocused(true)}} placeholder="Título do trabalho..." maxLength={40} onChange={e => setTitulo(e.target.value)} value={titulo} className={styles.top_input_short} style={{borderColor:tituloWrong&&titulo.length>0?"red":!tituloWrong&&tituloFocused&&titulo.length>0?"#26B282":""}}></input>
                                </div>
                                <div className={styles.diff_right}>
                                        {
                                            editReservation?.type===2&&getFieldWrong('description')?
                                            <div style={{marginTop:"10px"}} className={styles.diff_right_title_container}>
                                                <span className={styles.diff_right_title} 
                                                    style={{ marginBottom:0}}>Descrição
                                                </span>
                                                <span className={styles.diff_right_title_wrong_div}>
                                                <span className={styles.editar_tit}>editar</span> {getFieldWrongText('description')}
                                                </span>
                                            </div>
                                            :
                                            <span style={{marginTop:"10px"}} className={styles.diff_right_title}>Descrição
                                            </span>
                                        }
                                    <div className={styles.top_desc}>
                                        <TextareaAutosize 
                                            maxRows={20}
                                            minRows={8}
                                            maxLength={400}
                                            className={styles.top_desc_area} placeholder="Descrição do trabalho..." 
                                            value={description} onChange={e => {
                                            setTextareaHeight(e.target.value)
                                            setDescription(e.target.value)}}>
                                        
                                        </TextareaAutosize>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.foto_div}>
                            {
                                edit?
                                <BorderColorIcon className={styles.top_abs_edit}/>
                                :null
                            }
                            {
                                editReservation?.type===2&&getFieldWrong('photos')?
                                <div className={styles.diff_right_title_container}>
                                    <span className={styles.diff_right_title} 
                                        style={{ marginBottom:0}}>Adicionar Fotografias
                                    </span>
                                    <span className={styles.diff_right_title_wrong_div}>
                                    <span className={styles.editar_tit}>editar</span> {getFieldWrongText('photos')}
                                    </span>
                                </div>
                                :
                                <span className={styles.diff_right_title}>Adicionar Fotografias
                                </span>
                            }
                            <input
                                style={{display: 'none'}}
                                ref={inputRef}
                                type="file"
                                multiple
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                            />
                            <div className={styles.foto_area}>
                                {
                                    images.length>0?
                                    <div className={styles.foto_img_div}>
                                       {displayImages()}
                                    </div>
                                    :
                                    <div className={styles.foto_area_div} onClick={handleClick}>
                                        <AddCircleOutlineIcon className={styles.foto_symbol}/>
                                        <span className={styles.foto_text}>adicionar</span>
                                    </div>
                                }
                                    
                                
                                <span className={styles.foto_number}>({images.length}/{maxFiles})</span>
                            </div>
                        </div>
                        <div className={styles.devider}></div>
                        
                        <div className={styles.bottom}>
                            <div className={styles.bottom_area}>
                                <div className={styles.bot_title_wrapper}>
                                    <div className={styles.bot_title_indicator_wrapper}>
                                        <span className={styles.bot_title_indicator}>2</span>
                                    </div>
                                    <span className={styles.bot_title}>Detalhes de contacto</span>
                                </div>
                                <div className={styles.contact_area} onClick={() => divRef.current.scrollIntoView({ behavior: 'smooth' })}>
                                    {
                                        edit?
                                        <BorderColorIcon className={styles.top_abs_edit}/>
                                        :null
                                    }
                                    <div className={styles.bot_input_div} style={{marginTop:"0"}}>
                                        <span style={{borderColor:nomeWrong?"red":!nomeWrong&&nomeFocused?"#26B282":!nomeWrong&&nome.length>0?"#26B282":"", borderRight:nomeWrong?"red":!nomeWrong&&nomeFocused?"#26B282":!nomeWrong&&nome.length>0?"#26B282":"transparent"}} className={styles.area_label_inverse}>Nome<span className={styles.asterisc}>*</span></span>
                                        <input placeholder='Nome...' style={{borderColor:nomeWrong?"red":!nomeWrong&&nomeFocused?"#26B282":!nomeWrong&&nome.length>0?"#26B282":""}} disabled={props.user} onFocus={() => {nameFocused()}} maxLength={36} onChange={e => setNome(e.target.value)} value={nome} className={styles.bot_input_short}></input>
                                    </div>
                                    <div className={styles.bot_input_div}>
                                        <span style={{borderColor:phoneWrong?"red":!phoneWrong&&phoneFocused?"#26B282":!phoneFocused&&phone.length===9?"#26B282":"", borderRight:phoneWrong?"red":!phoneWrong&&phoneFocused?"#26B282":!phoneFocused&&phone.length===9?"#26B282":"transparent"}} className={styles.area_label_inverse}>Telefone<span className={styles.asterisc}>*</span></span>
                                        <input placeholder='91...' style={{borderColor:phoneWrong?"red":!phoneWrong&&phoneFocused?"#26B282":!phoneFocused&&phone.length===9?"#26B282":""}} onFocus={() => {setPhoneFocused(true)}} maxLength={11} onChange={e => setPhoneHandler(e.target.value)} value={phoneVisual} className={styles.bot_input_short}></input>
                                    </div>
                                    <div className={styles.bot_input_div}>
                                        <span style={{borderColor:emailWrong?"red":!emailWrong&&emailFocused?"#26B282":!emailWrong&&email.length>3?"#26B282":"", borderRight:emailWrong?"red":!emailWrong&&emailFocused?"#26B282":!emailWrong&&email.length>3?"#26B282":"transparent"}} className={styles.area_label_inverse}>E-mail<span className={styles.asterisc}>*</span></span>
                                        <input placeholder='Email...' style={{borderColor:emailWrong?"red":!emailWrong&&emailFocused?"#26B282":!emailWrong&&email.length>3?"#26B282":""}} disabled={props.user} onFocus={() => {setEmailFocused(true)}} maxLength={80} onChange={e => setEmail(e.target.value)} value={email} className={styles.bot_input_long}></input>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            <div className={styles.bottom_area_second}>
                                <div className={styles.bot_title_wrapper} style={{alignItems:editReservation?.type===2&&getFieldWrong('location')?'flex-start':""}}>
                                    <div className={styles.bot_title_indicator_wrapper}>
                                        <span className={styles.bot_title_indicator}>3</span>
                                    </div>
                                    {
                                        editReservation?.type===2&&getFieldWrong('location')?
                                        <div className={styles.diff_right_title_container} style={{alignItems:"flex-start"}}>
                                            <span className={styles.bot_title} 
                                                style={{ marginBottom:0}}>Localização
                                            </span>
                                            <span className={styles.diff_right_title_wrong_div}>
                                            <span className={styles.editar_tit}>editar</span> {getFieldWrongText('location')}
                                            </span>
                                        </div>
                                        :
                                        <span className={styles.bot_title}>Localização
                                        </span>
                                    }
                                </div>
                                <div className={styles.contact_area} onClick={() => divRef.current.scrollIntoView({ behavior: 'smooth' })}>
                                    {
                                        edit?
                                        <BorderColorIcon className={styles.top_abs_edit}/>
                                        :null
                                    }
                                    {
                                        edit&&!activateEditAddress?
                                            <div>
                                                <div className={styles.edit_address_line}>
                                                    <div className={styles.bot_input_div} style={{marginTop:0}}>
                                                        <span style={{borderColor:"#26B282"}} className={styles.area_label_inverse}>Rua<span className={styles.asterisc}>*</span></span>
                                                        <input disabled={true} value={editAddress} className={styles.bot_input_long}></input>
                                                    </div>
                                                </div>
                                                <div className={styles.address_flex}>
                                                    <div className={styles.bot_input_div}>
                                                        <span style={{borderColor:"#26B282"}} className={styles.area_label_inverse}>Porta<span className={styles.asterisc}>*</span></span>
                                                        <input disabled={true} style={{width:"100px"}} maxLength={5} value={porta} className={styles.bot_input_short}></input>
                                                    </div>
                                                    <div className={styles.bot_input_div}>
                                                        <span style={{borderColor:"#26B282"}} className={styles.area_label_inverse}>Andar</span>
                                                        <input disabled={true} style={{width:"100px", marginLeft:"10px"}} maxLength={11} onChange={e => setAndar(e.target.value)} value={andar} className={styles.bot_input_short}></input>
                                                    </div>
                                                </div>
                                                <div style={{marginTop:"10px", display:"flex"}} onClick={() => setActivateEditAddress(true)}>
                                                    <span className={styles.nova_morada}>Nova morada</span>
                                                </div>
                                            </div>
                                        :
                                        <div>
                                            <div className={styles.bot_address_flex}>
                                                <div className={styles.bot_input_div_search} onClick={() => setAddressFocused(true)}>
                                                    <span style={{borderColor:badAddress||wrongAddress?"red":!badAddress&&!wrongAddress&&addressFocused?"#26B282":"", borderRight:(badAddress||wrongAddress)?"red":!badAddress&&!wrongAddress&&addressFocused?"#26B282":""}} className={styles.area_label_inverse}>Morada<span className={styles.asterisc}>*</span></span>
                                                    <GooglePlacesAutocomplete
                                                    apiKey="AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk"
                                                    autocompletionRequest={{
                                                        // bounds: [ //BOUNDS LISBOA
                                                        // { lat: 38.74, lng: -9.27 },
                                                        // { lat: 38.83, lng: -9.17 },
                                                        // { lat: 38.79, lng: -9.09 },
                                                        // { lat: 38.69, lng: -9.21 },
                                                        // ],
                                                        componentRestrictions: {
                                                        country: ['pt'],
                                                        }
                                                    }}
                                                    selectProps={{
                                                        address,
                                                        onChange: setAddressHandler,
                                                        styles: {
                                                        input: (provided) => ({
                                                            ...provided,
                                                            color: '#161F28',
                                                            fontWeight: 600,
                                                        }),
                                                        option: (provided) => ({
                                                            ...provided,
                                                            color: '#161F28',
                                                            fontWeight: 600
                                                        }),
                                                        singleValue: (provided) => ({
                                                            ...provided,
                                                            color: '#161F28',
                                                            fontWeight: 600
                                                        }),
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            width: "100%",
                                                            borderRadius: "5px",
                                                            height: "40px",
                                                            fontSize:"0.9rem",
                                                            backgroundColor: "#f2f4f5",
                                                            border:"none",
                                                            borderBottom: state.isFocused?"2px solid #FF785A":"2px solid #161F28",
                                                            "&:hover": {
                                                                borderBottom: "2px solid #FF785A",
                                                                cursor: "text",
                                                            },
                                                            boxShadow: state.isFocused?"none":"none",
                                                            zIndex: 1
                                                        }),
                                                        container: (provided, state) => ({
                                                            ...provided,
                                                            border: state.isFocused?"none":"none",
                                                            zIndex: 1
                                                        }),
                                                        dropdownIndicator: () => ({
                                                            color:"#fff",
                                                            zIndex: 4
                                                        }),
                                                        indicatorSeparator: () => null
                                                        },
                                                        IndicatorsContainer:()=>(<></>),
                                                        placeholder: "Pesquisar...",
                                                        noOptionsMessage: () => "Pesquisar morada",
                                                        loadingMessage: () => "A pesquisar...",
                                                    }}
                                                    />
                                                    </div>
                                                </div>
                                                <div className={styles.address_flex}>
                                                    <div className={styles.bot_input_div}>
                                                        <span style={{borderColor:portaWrong?"red":!portaWrong&&portaFocused?"#26B282":""}} className={styles.area_label_inverse}>Porta<span className={styles.asterisc}>*</span></span>
                                                        <input style={{width:"100px", borderColor:portaWrong?"red":!portaWrong&&portaFocused?"#26B282":""}} onFocus={() => {setPortaFocused(true)}} maxLength={5} onChange={e => setPorta(e.target.value)} value={porta} className={styles.bot_input_short}></input>
                                                    </div>
                                                    <div className={styles.bot_input_div}>
                                                        <span className={styles.area_label_inverse}>Andar</span>
                                                        <input style={{width:"100px", marginLeft:"10px"}} maxLength={11} onChange={e => setAndar(e.target.value)} value={andar} className={styles.bot_input_short}></input>
                                                    </div>
                                                </div>

                                            {
                                                edit&&!address?
                                                <div style={{display:"flex", justifyContent:"center", marginTop:"20px"}}>
                                                    <div style={{marginLeft:"10px"}} onClick={() => setActivateEditAddress(false)}>
                                                        <span className={styles.nova_morada_cancelar}>Cancelar</span>
                                                    </div>
                                                </div>

                                                :null
                                            }
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div ref={divRef} data-tip={complete?"":"Preenche todos os campos assinalados com *"} style={{backgroundColor:edit?"#FF785A":""}} className={complete?styles.bot_button:styles.bot_button_disabled} onClick={() => {
                                    if(complete) confirmarHandler()}}>
                            <span className={complete?styles.bot_button_text:styles.bot_button_text_disabled}>{edit?"Confirmar edição do Trabalho":props.user?"Publicar Trabalho":"Criar conta e Publicar trabalho" }</span>
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