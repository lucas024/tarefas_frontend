import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './userReservationPage.module.css'
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import TopSelect from '../styling/selectStyling';
import dayjs from 'dayjs';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode from "react-geocode";
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import Popup from '../transitions/popup';
import axios from 'axios'
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader } from '@googlemaps/js-api-loader'

Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')

const UserReservationPage = (props) => {

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

    const maxFiles = 6
    const inputRef = useRef(null);
    const ObjectID = require("bson-objectid");
    const divRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [searchParams] = useSearchParams()

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
        if(Object.fromEntries([...searchParams]).w){
            setSelectedWorker(Object.fromEntries([...searchParams]).w)
        }
        else {
            setSelectedWorker('eletricista')
        }
        props.loadingHandler(false)
    }, [searchParams])

    useEffect(() => {
        if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
        else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
        else{
            setPhoneVisual(`${phone.slice(0,3)}`)
        }
    }, [phone])

    useEffect(() => {
        if(nome.length>0 && validator.isMobilePhone(phone, "pt-PT") && validator.isEmail(email) && address.length>0 && titulo.length>5 && porta.length>0)
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
    }, [nome, phone, email, address, phoneFocused, emailFocused, porta, portaFocused, addressFocused, titulo, tituloFocused])

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
              const { lat, lng } = response.results[0].geometry.location;
              setLat(lat)
              setLng(lng)
              setAddress(val.label)
              setBadAddress(false)
              setWrongAddress(false)

            //   if(38.84>=lat && lat>=38.68 && -9.06>lng && lng>-9.34){
            //       setBadAddress(false)
            //       setWrongAddress(false)
            //       setLat(lat)
            //       setLng(lng)
            //       setAddress(val.label)
            //   }
            //   else{
            //       setBadAddress(true)
            //       setAddress('')
            //   }
            })
    }

    const uploadImageFileHanlder = (file, postId, it, arr) => {
        const storageRef = ref(storage, `posts/${postId}/${it}`);
        return uploadBytes(storageRef, file).then(() => {
            return getDownloadURL(storageRef).then(url => {
                arr.push(url)
            })
        })
    }

    const confirmarPopupHandler = async () => {
        props.loadingHandler(true)
        const arr = []
        const postId = ObjectID()
        await Promise.all(imageFiles.map((file, i) => uploadImageFileHanlder(file, postId, i, arr)))
        let reserva = {
            _id: postId,
            user_id: props.user._id,
            user_name: props.user.name,
            user_phone: phone,
            user_email: props.user.email,
            publication_time: new Date(),
            title: titulo,
            desc: description,
            localizacao: address,
            porta: porta,
            andar: andar,
            type:0,
            workerType: selectedWorker,
            clicks: 0,
            photos: arr,
            lat: lat,
            lng: lng,
            photoUrl: props.user.photoUrl
        }
        axios.post(`${props.api_url}/reservations/add`, reserva).then(() => {
            setConfirmationPopup(false)
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
        if(!props.user){
            navigate('/authentication',
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
        else{
            props.loadingHandler(true)
            checkPendingReservations()
        }
    }

    const checkPendingReservations = () => {
        axios.get(`${props.api_url}/reservations/get_by_id`, { params: {user_id: props.user._id} }).then(res => {
            console.log(res.data);
            if(res.data?.length<3){
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
        // 👇️ open file input box on click of other element
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
            files_aux.push(img)
            images_aux.push(objectUrl)
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
            return images.map((img, i) => {
                return (
                    <div key={i} className={styles.foto_img_wrapper} onClick={() => deleteImageHandler(img)}>
                        <DeleteIcon className={styles.foto_img_delete}/>
                        <img key={i} src={img} className={styles.foto_img}></img>
                        <span className={styles.foto_img_number}>Fotografia {i+1}</span>
                    </div>
                    
                )
            })
        }
        else {
            let arr = [...images]
            arr.push({blank:true})
            return arr.map((img, i) => {
                if(!img.blank){
                    return (
                        <div key={i} className={styles.helper_img_div}>
                            <div className={styles.foto_img_wrapper} onClick={() => deleteImageHandler(img)}>
                                <span className={styles.frontdrop_helper}></span>
                                <DeleteIcon className={styles.foto_img_delete}/>
                                <img key={i} src={img} className={styles.foto_img}></img>
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

    return (
        <div className={styles.reservation}>
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
                {/* <div className={styles.left}>
                    <div className={styles.left_title_area}>
                        <span className={styles.left_title}>Publicar</span>
                    </div>
                    <div className={styles.left_description_area}>
                        <span className={styles.left_description}>
                            <p>
                            Nesta página pode criar uma <span className={styles.action}>publicação</span> para o serviço 
                            de que precisa.<br/>
                            <br></br>
                            </p>
                            

                        </span>
                    </div>
                    
                    <div className={styles.left_list}>
                        <span className={styles.list_element_div}>
                            <span className={styles.element_symbol}></span>
                            <span className={styles.element_title}>
                                
                            </span>
                            <span className={styles.element_desc}>

                            </span>
                            
                        </span>
                    </div>
                </div> */}
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
                        <div className={styles.reservar_upper}>
                            <p className={styles.reservar_upper_title}>PUBLICAR</p>
                            <p className={styles.reservar_upper_desc}>
                                Nesta página pode criar uma <span className={styles.action}>trabalho</span> para o serviço 
                                de que precisa.<br/>
                                <br></br>
                            </p>
                        </div>
                        <div className={styles.bot_title_wrapper}>
                            <span className={styles.bot_title_indicator}>1</span>
                            <span className={styles.bot_title}>Detalhes da Publicação</span>
                        </div>
                        
                        <div className={styles.top}>
                            <div className={styles.top_left}>
                                <img src={selectedWorker==="eletricista"?elec:
                                            selectedWorker==="canalizador"?cana
                                            :carp} className={styles.left_img}></img>
                                <div className={styles.left_select}>
                                    <TopSelect
                                        id={selectedWorker}
                                        changeWorker={val => {
                                            navigate(`/reserva?w=${val}`)
                                            setSelectedWorker(val)}}
                                    />
                                </div>
                            </div>
                            <div className={styles.top_right}>
                                <div className={styles.diff_right}>
                                    <span className={styles.diff_right_title}>Título<span className={styles.action}>*</span></span>
                                    <input onFocus={() => {setTituloFocused(true)}} placeholder="Título da publicação..." maxLength={40} onChange={e => setTitulo(e.target.value)} value={titulo} className={styles.top_input_short} style={{borderColor:tituloWrong&&titulo.length>0?"red":!tituloWrong&&tituloFocused&&titulo.length>0?"#26B282":""}}></input>
                                </div>
                                <div className={styles.diff_right}>
                                    <span className={styles.diff_right_title}>Descrição</span>
                                    <div className={styles.top_desc}>
                                        <textarea className={styles.top_desc_area} placeholder="Descrição do problema..." value={description} onChange={e => setDescription(e.target.value)}>
                                        
                                        </textarea>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.foto_div}>
                            <span className={styles.diff_right_title}>Adicionar Fotografias</span>
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
                                    <span className={styles.bot_title_indicator}>2</span>
                                    <span className={styles.bot_title}>Detalhes de contacto</span>
                                </div>
                                <div className={styles.contact_area} onClick={() => divRef.current.scrollIntoView({ behavior: 'smooth' })}>
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
                                <div className={styles.bot_title_wrapper}>
                                    <span className={styles.bot_title_indicator}>3</span>
                                    <span className={styles.bot_title}>Localização</span>
                                </div>
                                <div className={styles.contact_area} onClick={() => divRef.current.scrollIntoView({ behavior: 'smooth' })}>
                                    <div className={styles.bot_address_flex}>
                                        <div className={styles.bot_input_div_search} onClick={() => setAddressFocused(true)}>
                                            <span  style={{borderColor:badAddress||wrongAddress?"red":!badAddress&&!wrongAddress&&addressFocused?"#26B282":"", borderRight:(badAddress||wrongAddress)?"red":!badAddress&&!wrongAddress&&addressFocused?"#26B282":""}} className={styles.area_label_inverse}>Morada<span className={styles.asterisc}>*</span></span>
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
                                </div>
                            </div>
                        </div>
                        <div ref={divRef} data-tip={complete?"":"Preenche todos os campos assinalados com *"} className={complete?styles.bot_button:styles.bot_button_disabled} onClick={() => {
                                    if(complete) confirmarHandler()}}>
                                <span className={complete?styles.bot_button_text:styles.bot_button_text_disabled} >{props.user?"Publicar Trabalho":"Criar conta e Publicar trabalho" }</span>
                            </div>
                    </div>
                    
                </div>
                <div className={styles.right}></div>
            </div>
            <ReactTooltip effect='solid'/>
        </div>
    )
}

export default UserReservationPage