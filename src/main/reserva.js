import React, {useEffect, useState, useRef} from 'react'
import styles from './reserva.module.css'
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FaceIcon from '@mui/icons-material/Face';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import GoogleMapReact from 'google-map-react';
import ImageGallery from 'react-image-gallery';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Marker from './marker';
import PopupElimination from '../transitions/popupElimination';
import axios from 'axios';
import { storage } from '../firebase/firebase'
import { ref, deleteObject } from "firebase/storage";
import NoPage from '../general/noPage';
import { useSearchParams } from 'react-router-dom';
import Loader2 from '../general/loader';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { Loader } from '@googlemaps/js-api-loader'
import blurredMap from '../assets/blurredMap.png'
import arrow from '../assets/curve-down-arrow.png'
import WorkerBanner from '../general/workerBanner';
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';

const ObjectID = require("bson-objectid");


const Reserva = (props) => {

    const [reservation, setReservation] = useState({})
    const [images, setImages] = useState(null)
    const [text, setText] = useState("")
    const [more, setMore] = useState(false)
    const [eliminationPopup, setEliminationPopup] = useState(false)
    const [publicationUser, setPublicationUser] = useState({})
    const [workerBanner, setWorkerBanner] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)

    const [userView, setUserView] = useState(false)
    const [noAccountView, setNoAccountView] = useState(false)
    const [noSubView, setNoSubView] = useState(false)
    const [noProfileView, setNoProfileView] = useState(false)
    const [noneView, setNoneView] = useState(false)

    const [noRepeatedChats, setNoRepeatedChats] = useState(false)

    const [isMapApiLoaded, setIsMapApiLoaded] = useState(false)

    const scrollRef = useRef(null)
    const messageRef = useRef(null)

    const navigate = useNavigate()
    const location = useLocation()

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const [searchParams] = useSearchParams()
    const [params, setParams] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(null)

    useEffect(() => {
        if(isMapApiLoaded || window.google){
        }
        else{
            const loader = new Loader({
                apiKey: "AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk",
                libraries: ["places"]
              });
            loader.load().then(() => setIsMapApiLoaded(true))
        }
    }, [])

    useEffect( () => {
        setLoading(true)
        const paramsAux = Object.fromEntries([...searchParams])
        setParams(paramsAux)
        setPage(paramsAux.prevpage)
        axios.get(`${props.api_url}/reservations/get_single_by_id`, { params: {_id: paramsAux.id} }).then(res => {
            if(res.data){
                setReservation(res.data)
                let arr = []
                for(let img of res.data.photos){
                    arr.push({
                        original: img,
                        thumbnail: img,
                        originalHeight: "300px",
                        originalWidth: "700px",
                        thumbnailHeight: "50px",
                        thumbnailWidth: "100px",
                    })
                }
                setImages(arr)
                if(props.user){
                    axios.get(`${props.api_url}/user/get_user_by_mongo_id`, { params: {_id: res.data.user_id} })
                    .then(res2 => {
                        setPublicationUser(res2.data)
                        if(props.user?._id === res.data.user_id){
                            setUserView(true)
                        }
                        else if(!(props.user.subscription&&!props.incompleteUser)){
                            setNoneView(true)
                        }
                        else if(props.user.subscription){
                            axios.post(`${props.api_url}/retrieve-subscription-and-schedule`, {
                                subscription_id: props.user.subscription.id,
                                schedule_id: props.user.subscription.sub_schedule
                            })
                            .then(res => {
                                if(!isActiveSub(res.data.schedule.current_phase.end_date)){
                                    setNoSubView(true)
                                }
                                else if(props.incompleteUser){
                                    setNoProfileView(true)
                                }
                            })
                            
                        }
                        else if(props.incompleteUser){
                            setNoProfileView(true)
                        }
                        setLoading(false)
                        })

                        if(props.user.chats.includes(res.data.user_id)){
                            console.log("teste");
                            setNoRepeatedChats(true)
                        }
                    }
                }
            else{
                setReservation(null)
            }
        })

    }, [searchParams, props.user, props.incompleteUser])

    const isActiveSub = date => {
        if(new Date().getTime() < new Date(date*1000)){
            return true
        }
    }

    useEffect(() => {
        if(eliminationPopup){
            scrollRef.current.scrollIntoView()  
        }
        
    }, [eliminationPopup])

    const getPublicationDate = () => {
        if(reservation.publication_time){
            let date = new Date(reservation.publication_time)
            return <span>{`Publicado a ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`}</span>
        }
        else{
            return <span>_</span>
        }
    }
    const getNumberDisplay = number => {
        return number&&`${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6)}`
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#1EACAA"
        return "#FFFFFF"
    }

    const deleteHandler = async () => {
        setLoading(true)
        const obj = {
            _id:reservation._id
        }
        console.log(obj);
        await Promise.all(reservation.photos.map((photo, key) => {
            const deleteRef = ref(storage, `/posts/${reservation._id}/${key}`)
            return deleteObject(deleteRef)
        }))
        axios.post(`${props.api_url}/reservations/remove`, obj)
            .then(() => {
                setEliminationPopup(false)
                setLoading(false)
                navigate('/user')
            })
        
    }

    const backHandler = () => {
        navigate(-1)
    }

    const sendMessageHandler = async () => {
        if(text!==""&&reservation.user_id!==props.user._id){
            setLoadingChat(true)

            let text_object = {
                origin_id : props.user._id,
                timestamp : new Date().getTime(),
                text: text
            }
            let objID = ObjectID()

            await axios.post(`${props.api_url}/chats/update_user_chat`, {
                user_name: props.user.name,
                user_photoUrl: props.user.photoUrl,
                user_phone: props.user.phone,
                user_id: props.user._id,
                user_type: props.user.type,
                other_user_name: publicationUser.name,
                other_user_photoUrl: publicationUser.photoUrl,
                other_user_phone: publicationUser.phone,
                other_user_id: publicationUser._id,
                other_user_type: publicationUser.type,
                text: text_object,
                updated: new Date().getTime(),
                chat_id: objID,
                reservation_id: reservation._id,
                reservation_title: reservation.title
            })
            .then(() => {
                
            })
            await axios.post(`${props.api_url}/user/update_user_notifications`, {
                _id: reservation.user_id,
                notification_id: objID
            })
            setText("")
            setLoadingChat(false)
            setSuccessPopin(true)
            setTimeout(() => setSuccessPopin(false), 4000)
            setNoRepeatedChats(true)
            props.refreshWorker()
            
            //navigate('/user?t=messages')
        }
    }

    return (
        <div style={{position:"relative"}}>
            {
                workerBanner?
                <WorkerBanner cancel={() => setWorkerBanner(false)}/>
                :null
            }

            <CSSTransition 
                in={successPopin}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao text="Mensagem enviada com sucesso!"/>
            </CSSTransition>
            
            {
                reservation?.user_id?
                <div className={styles.test} style={{overflowY:eliminationPopup?"hidden":"auto"}}>
                    <div ref={scrollRef}></div>
                    {
                        eliminationPopup?
                        <PopupElimination 
                            cancelHandler={() => setEliminationPopup(false)}
                            confirmDeleteHandler={() => deleteHandler()}/>
                        :null
                    }
                    {
                        location.state&&location.state.fromUserPage&&userView?
                        <div className={styles.previous_voltar} onClick={() => backHandler()}>
                            <ArrowBackIcon className={styles.previous_symbol}/>
                            <span className={styles.previous_voltar_text}>VOLTAR ÀS <span className={styles.action}>MINHAS PUBLICAÇÕES</span></span>
                        </div>
                        :
                        <div className={styles.normal_back}>
                            <div className={styles.normal_back_left} onClick={() => navigate(-1)}>
                                <ArrowBackIosIcon className={styles.normal_back_left_symbol}/>
                                <span className={styles.normal_back_left_text}>TRABALHOS</span>
                            </div>
                            <div className={styles.normal_back_right} onClick={() => navigate(-1)}>
                                <span className={styles.normal_back_right_dir}>Trabalhos</span>
                                <span className={styles.normal_back_right_sep}>/</span>
                                <span className={styles.normal_back_right_dir}>Página {page}</span>
                            </div>
                        </div>
                    }
                    
                    <div className={styles.reserva} onClick={() => more&&setMore(false)} >
                        <Loader2 loading={loading}/>
                        <div className={styles.top_top} style={{marginTop:location.state&&location.state.fromUserPage&&userView?"80px":"10px"}}>
                            <div className={styles.top_left} style={{borderColor:userView&&getTypeColor(reservation.type)}}>
                                {
                                    /* Indicator + more */
                                    userView?
                                    <div className={styles.top_left_indicator_more}>
                                        <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(reservation.type)}}>
                                            <span className={styles.item_indicator}></span>
                                            <span className={styles.item_type}>
                                                {
                                                    reservation.type===1?"Activo":
                                                    reservation.type===2?"Concluído":
                                                        "Processar"
                                                }
                                            </span>
                                        </div>
                                        <MoreVertIcon className={styles.more} onClick={() => setMore(!more)}/>
                                        
                                        <div className={styles.dropdown} hidden={!more}>
                                            <div className={styles.dropdown_top}>
                                                <span className={styles.dropdown_top_text}>Publicação</span>
                                            </div>
                                            <div onClick={() => {}} className={styles.drop_div_main} style={{borderTop:"1px solid #ccc", borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                                                <div className={styles.drop_div} onClick={() => setEliminationPopup(true)}>
                                                    <DeleteOutlineIcon className={styles.drop_div_symbol}/>
                                                    <span className={styles.drop_div_text} >Eliminar</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :null

                                }
                                <div className={styles.top_left_top}>
                                    <span className={styles.top_date}>{getPublicationDate()}</span>
                                    <div className={styles.top_title}>
                                        {
                                        <div className={styles.previous_wrapper}>
                                            <span className={styles.previous_text}>{reservation.title}</span>
                                        </div>
                                        }
                                    </div>
                                    <span className={styles.top_desc_text}>DESCRIÇÃO</span>
                                    {   
                                        reservation.desc!==""?
                                            <span className={styles.top_desc}>
                                                {reservation.desc}
                                            </span>
                                        :
                                        <span className={styles.top_desc_no}>
                                            Sem descrição
                                        </span>
                                    }
                                </div>
                                
                                <div>
                                    <div className={styles.divider}></div>
                                        <div className={styles.details}>
                                            <span className={styles.details_id}>ID: {reservation._id}</span>
                                            <span className={styles.details_id}>Visualizações: {reservation.clicks}</span>
                                        </div>
                                    </div>
                                </div>
                            <div className={styles.top_right}>
                                {
                                    !userView?
                                    <span className={styles.top_right_message} onClick={() => messageRef.current.scrollIntoView() }>
                                        Enviar Mensagem
                                    </span>
                                    :null
                                }
                                
                                <span className={styles.top_right_user}>Utilizador</span>
                                <div className={styles.top_right_div}>
                                    {
                                        publicationUser.photoUrl!==""?
                                        <img src={publicationUser?.photoUrl} className={styles.top_right_img}></img>
                                        :<FaceIcon className={styles.top_right_img}/>
                                    }
                                    <div className={styles.user_info}>
                                        {
                                            noAccountView?
                                            <div className={styles.market}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Gostava de contacar <span style={{color:"white", textTransform:"uppercase"}}>{reservation.user_name.split(" ")[0]}</span>?</span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto", textTransform:"uppercase"}} onClick={() => setWorkerBanner(true)}>Tornar-me Trabalhador</span>
                                            </div>
                                            :
                                            noneView?
                                            <div className={styles.market} style={{width:"200px", bottom:"-95px"}}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Completa o teu <span style={{color:"white", textTransform:"uppercase"}}>perfil</span> e <span style={{color:"white", textTransform:"uppercase"}}>subscreve</span> para contactar o/a <span style={{color:"white"}}>{reservation.user_name.split(" ")[0]}</span></span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto", textTransform:"uppercase"}} onClick={() => navigate('/user?t=personal')}>Ir para Utilizador</span>
                                            </div>
                                            :
                                            noSubView?
                                            <div className={styles.market} style={{width:"200px", bottom:"-95px"}}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Só falta completares a tua <span style={{color:"white", textTransform:"uppercase"}}>subscrição</span> para poderes contactar o/a <span style={{color:"white"}}>{reservation.user_name.split(" ")[0]}</span></span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto", textTransform:"uppercase"}} onClick={() => navigate('/user?t=subscription')}>Ir para Subscrição</span>
                                            </div>
                                            :
                                            noProfileView?
                                            <div className={styles.market} style={{width:"200px", bottom:"-95px"}}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Só falta completares o teu <span style={{color:"white", textTransform:"uppercase"}}>perfil</span> para poderes contactar o/a <span style={{color:"white"}}>{reservation.user_name.split(" ")[0]}</span></span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto", textTransform:"uppercase"}} onClick={() => navigate('/user?t=personal')}>Ir para Perfil</span>
                                            </div>
                                            :null
                                            
                                        }
                                        <span className={styles.user_info_name}>{reservation.user_name}</span>
                                        <span style={{display:"flex", alignItems:"center", marginTop:"5px"}}>
                                            <PhoneOutlinedIcon className={styles.user_info_number_symbol}/>
                                            {
                                                !noAccountView&&!noneView&&!noSubView&&!noProfileView?
                                                <span className={styles.user_info_number}>{getNumberDisplay(publicationUser?.phone)}</span> 
                                                :<span className={styles.user_info_number_blur}>123 456 789</span> 
                                            }
                                              
                                        </span>
                                    </div>                                    
                                </div>
                                <span className={styles.top_right_user} style={{marginTop:"40px"}}>Localização</span>
                                <div className={styles.location_div}>
                                    <LocationOnIcon className={styles.location_pin}/>
                                    {
                                            !noAccountView&&!noneView&&!noSubView&&!noProfileView?
                                            <span className={styles.location}>{`${reservation.localizacao} - ${reservation.porta}, ${reservation.andar}`}</span>
                                            :<span className={styles.location_blur}>R. Abcdefg Hijklmonpqrstuvxyz 99, Porta 99</span> 
                                        }
                                </div>
                                {
                                    !noAccountView&&!noneView&&!noSubView&&!noProfileView?
                                    <div className={styles.map_div}>
                                        <GoogleMapReact 
                                            bootstrapURLKeys={{ key:"AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk", libraries: ["places"]}}
                                            defaultZoom={14}
                                            center={{ lat: reservation.lat, lng: reservation.lng}}   
                                            >
                                            <Marker lat={reservation.lat} lng={reservation.lng}/>
                                        </GoogleMapReact>
                                    </div>
                                    :
                                    <div className={styles.map_div}>
                                        <img src={blurredMap} className={styles.blurred_map}/>
                                    </div>

                                }
                                
                            </div>
                        </div>
                        <div className={styles.photos}>
                            <span className={styles.top_right_user}>Fotografias</span>
                            {
                                images?.length>0?
                                <ImageGallery 
                                items={images} 
                                infinite={false} 
                                showPlayButton={false}/>
                                :<NoPhotographyIcon className={styles.no_photos}/>
                            }
                            
                        </div>
                        {
                            !userView?
                            <div className={styles.message}>
                                <div className={styles.message_top_flex}>
                                    <div className={styles.message_left}>
                                        {
                                            publicationUser.photoUrl!==""?
                                            <img src={publicationUser?.photoUrl} className={styles.top_right_img}></img>
                                            :<FaceIcon className={styles.top_right_img}/>
                                        }
                                        <span className={styles.message_left_user_name}>{reservation.user_name}</span>
                                    </div>
                                    <span style={{display:"flex", alignItems:"center", marginTop:"5px"}}>
                                        <PhoneOutlinedIcon className={styles.user_info_number_symbol}/>
                                        {
                                            !noAccountView&&!noneView&&!noSubView&&!noProfileView?
                                            <span className={styles.user_info_number}>{getNumberDisplay(publicationUser?.phone)}</span> 
                                            :<span className={styles.user_info_number_blur}>123 456 789</span> 
                                        }
                                    </span>
                                </div>
                                {
                                    noAccountView&&noneView&&noSubView&&noProfileView?
                                    <div className={styles.textarea_wrapper}>
                                        <textarea 
                                            className={styles.message_textarea_disabled}
                                            placeholder="Escrever mensagem..."
                                        />
                                        <div className={styles.frontdrop}>
                                            <span className={styles.frontdrop_text}>Para enviar mensagem à/ao <span style={{color:"white"}}>{reservation.user_name.split(" ")[0]}</span>,</span>
                                            {
                                                noAccountView?
                                                <span className={styles.frontdrop_text}>torne-se um trabalhador Arranja.</span>
                                                :noneView?
                                                <span className={styles.frontdrop_text}>complete o seu <span style={{color:"white"}}>PERFIL</span> e <span style={{color:"white"}}>SUBSCRIÇÃO</span>.</span>
                                                :noSubView?
                                                <span className={styles.frontdrop_text}>complete a sua <span style={{color:"white"}}>SUBSCRIÇÃO</span>.</span>
                                                :noProfileView?
                                                <span className={styles.frontdrop_text}>complete o seu <span style={{color:"white"}}>PERFIL</span>.</span>
                                                :null
                                            }
                                            {
                                                noAccountView?
                                                <span className={styles.frontdrop_text_action} onClick={() => setWorkerBanner(true)}>Tornar-me Trabalhador</span>
                                                :noneView?
                                                <span className={styles.frontdrop_text_action} onClick={() => navigate('/user?t=personal')}>Ir para Utilizador</span>
                                                :noSubView?
                                                <span className={styles.frontdrop_text_action} onClick={() => navigate('/user?t=subscription')}>Ir para Subscrição</span>
                                                :noProfileView?
                                                <span className={styles.frontdrop_text_action} onClick={() => navigate('/user?t=personal')}>Ir para Perfil</span>
                                                :null
                                            }
                                        </div>
                                    </div>
                                    :noRepeatedChats?
                                    <div className={styles.textarea_wrapper}>
                                        <textarea 
                                            className={styles.message_textarea_disabled}
                                            style={{backgroundColor:"#ddd"}}
                                            placeholder="Escrever mensagem..."
                                        />
                                        <div className={styles.frontdrop}>
                                            <span className={styles.frontdrop_text}>Mensagem Enviada.</span>
                                            <span className={styles.frontdrop_text_action} onClick={() => 
                                            navigate('/user?t=messages', {
                                                state: {
                                                    from_page: true,
                                                    worker_id: props.user._id,
                                                    user_id: reservation.user_id
                                                }})}>Ir para Conversa</span>
                                        </div>
                                    </div>
                                    :
                                    <div style={{position:"relative"}}>
                                        <Loader2 loading={loadingChat}/>
                                        <textarea 
                                        className={styles.message_textarea}
                                        placeholder="Escrever mensagem..."
                                        value={text}
                                        onChange={e => setText(e.target.value)} />
                                    </div>
                                    
                                }
                                
                                <div className={styles.message_enviar_div} ref={messageRef} onClick={() => !noRepeatedChats&&sendMessageHandler()}>
                                    <span className={!noRepeatedChats&&text!==""?styles.message_enviar:styles.message_enviar_disabled}>
                                        Enviar
                                    </span>
                                </div>
                            </div>
                            :
                            <div style={{marginTop:"40px"}}></div>
                        }
                        
                    </div>
                </div>
                :reservation===null?<NoPage object="publicação"/>:null
            }
            
        </div>
        
    )
}

export default Reserva