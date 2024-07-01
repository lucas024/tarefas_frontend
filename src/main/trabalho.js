import React, {useEffect, useState, useRef} from 'react'
import styles from './trabalho.module.css'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FaceIcon from '@mui/icons-material/Face';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ImageGallery from 'react-image-gallery';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ComputerIcon from '@mui/icons-material/Computer';
import Marker2 from './marker';
import PopupElimination from '../transitions/popupElimination';
import axios from 'axios';
import { storage } from '../firebase/firebase'
import { ref, deleteObject } from "firebase/storage";
import NoPage from '../general/noPage';
import { useSearchParams } from 'react-router-dom';
import Loader2 from '../general/loader';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import blurredMap from '../assets/blurredMap.png'
import arrow from '../assets/curve-down-arrow.png'
import WorkerBanner from '../general/workerBanner';
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import EditIcon from '@mui/icons-material/Edit';
import Popup2 from '../transitions/popup';
import {profissoesMap} from '../general/util'
import { useSelector } from 'react-redux'
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import marker from '../assets/map_marker.png'
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import SignpostIcon from '@mui/icons-material/Signpost';
import { regioesOptions } from '../general/util';
import ChatIcon from '@mui/icons-material/Chat';
import {Tooltip} from 'react-tooltip';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Loader from '../general/loader';

const ObjectID = require("bson-objectid");

const myIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor:  [-0, -0],
    iconSize: [130,130],     
});


const Trabalho = (props) => {

    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const worker_profile_complete = useSelector(state => {return state.worker_profile_complete})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})

    const [reservation, setReservation] = useState({})
    const [images, setImages] = useState(null)
    const [text, setText] = useState("")
    const [more, setMore] = useState(false)
    const [eliminationPopup, setEliminationPopup] = useState(false)
    const [publicationUser, setPublicationUser] = useState({})
    const [workerBanner, setWorkerBanner] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)
    const [refusePopup, setRefusePopup] = useState(false)
    const [refuseUserReservationId, setRefuseUserReservationId] = useState(null)
    const [refuseReservation, setRefuseReservation] = useState(null)

    const [noRepeatedChats, setNoRepeatedChats] = useState(false)

    const [isMapApiLoaded, setIsMapApiLoaded] = useState(false)

    const [chatId, setChatId] = useState("")

    const scrollRef = useRef(null)
    const messageRef = useRef(null)
    const messageAreaRef = useRef(null)

    const navigate = useNavigate()
    const location = useLocation()

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(null)

    const [userView, setUserView] = useState(false)
    const [noAccountView, setNoAccountView] = useState(false)
    const [noModeView, setNoModeView] = useState(false)
    const [noSubView, setNoSubView] = useState(false)
    const [noProfileView, setNoProfileView] = useState(false)
    const [noneView, setNoneView] = useState(false)
    const [showFull, setShowFull] = useState(false)
    const [locationActive, setLocationActive] = useState(false)
    const [workerActive, setWorkerActive] = useState(false)

    const [loaded, setLoaded] = useState(false)

    // useEffect(() => {
    //     if(isMapApiLoaded){
    //     }
    //     else{
    //         const loader = new Loader({
    //             apiKey: "AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk",
    //             libraries: ["places"]
    //           });
    //         loader.load().then(() => setIsMapApiLoaded(true))
    //     }
    // }, [])

    useEffect( () => {
        const paramsAux = Object.fromEntries([...searchParams])
        paramsAux.region&&setLocationActive(paramsAux.region)
        paramsAux.work&&setWorkerActive(paramsAux.work)
        setPage(paramsAux.page)
        setLoading(true)
        paramsAux.id&&axios.get(`${api_url}/reservations/get_single_by_id`, { params: {_id: paramsAux.id} }).then(res => {
            if(res.data){
                setReservation(res.data)
                let arr = []
                for(let img of res.data.photos){
                    if(img.id === res.data.photo_principal)
                        arr.unshift({
                            original: img.url,
                            thumbnail: img.url,
                            originalHeight: "300px",
                            originalWidth: "700px",
                            thumbnailHeight: "50px",
                            thumbnailWidth: "100px",
                        })
                    else
                        arr.push({
                            original: img.url,
                            thumbnail: img.url,
                            originalHeight: "300px",
                            originalWidth: "700px",
                            thumbnailHeight: "50px",
                            thumbnailWidth: "100px",
                        })
                }
                setImages(arr)
                let listaTrabalhosVistos = JSON.parse(window.localStorage.getItem('listaTrabalhosVistos'))
                if(listaTrabalhosVistos?.length>0 && !listaTrabalhosVistos.includes(res.data?._id))
                {
                    listaTrabalhosVistos.push(res.data?._id)
                    window.localStorage.setItem('listaTrabalhosVistos', JSON.stringify(listaTrabalhosVistos))
                }
                else if(listaTrabalhosVistos?.length===0 || !listaTrabalhosVistos)
                {
                    let arr = []
                    arr.push(res.data?._id)
                    window.localStorage.setItem('listaTrabalhosVistos', JSON.stringify(arr))
                }
            }
            else{
                setReservation(null)
            }
        })

    }, [searchParams])

    useEffect(() => {
        if(props.userLoadAttempt)
        {
            if(reservation)
            {

                axios.get(`${api_url}/user/get_user_by_mongo_id`, { params: {_id: reservation.user_id} })
                    .then(res => {
                        setPublicationUser(res.data)
                        if(user?._id === reservation.user_id && user?._id!==undefined){
                            setViewTo('user')
                            setLoading(false)
                            setLoaded(true)
                        }
                        else{
                            viewToAux()
                        }
                    })
            }
            else
            {
                viewToAux()
            }
            if(user?.chats)
            {
                for(let chat of user?.chats)
                {
                    if(chat.reservation_id === reservation?._id)
                    {
                        setNoRepeatedChats(true)
                        setChatId(chat.chat_id)
                        break
                    }
                }
            }
        }

        return () => setLoaded(false)
    }, [props.userLoadAttempt, reservation, user])

    // const isActiveSub = date => {
    //     if(new Date().getTime() < new Date(date*1000)){
    //         return true
    //     }
    // }

    useEffect(() => {
        if(eliminationPopup){
            scrollRef.current.scrollIntoView()  
        } 
    }, [eliminationPopup])

    const viewToAux = () => {
        if(user?.admin)
        {
            setViewTo("showFull")
            setLoading(false)
            setLoaded(true)
        }
        else if(!user?._id){
            setViewTo('noAccount')
            setLoading(false)
            setLoaded(true)
        }
        else if(user?._id&&!user?.worker){
            setViewTo('noMode')
            setLoading(false)
            setLoaded(true)
        }
        else if((!worker_profile_complete||!worker_is_subscribed||!(user_phone_verified&&user_email_verified))){
            setViewTo('none')
            setLoading(false)
            setLoaded(true)           
        }
        else if(worker_is_subscribed&&worker_profile_complete&&user_email_verified){
            setViewTo("showFull")
            setLoading(false)
            setLoaded(true)
        }
        // else if(worker_profile_complete){
        //     setViewTo('noSub')
        //     setLoading(false)
        //     setLoaded(true)
        // }
        // else if(!worker_profile_complete){
        //     setViewTo('noProfile')
        //     setLoading(false)
        //     setLoaded(true)
        // }
        else
        {
            setViewTo('noAccount')
            setLoading(false)
            setLoaded(true)
        }
    }

    const setViewTo = (view) => {
        if(view !== "none")
        {
            setNoneView(false)
        }
        else if(view === "none")
        {
            setNoneView(true)
        }
        if(view !== "noProfile")
        {
            setNoProfileView(false)
        }
        else if(view === "noProfile")
        {
            setNoProfileView(true)
        }
        if(view !== "noSub")
        {
            setNoSubView(false)
        }
        else if(view === "noSub")
        {
            setNoSubView(true)
        }
        if(view !== "noAccount")
        {
            setNoAccountView(false)
        }
        else if(view === "noAccount")
        {
            setNoAccountView(true)
        }
        if(view !== "noMode")
        {
            setNoModeView(false)
        }
        else if(view === "noMode")
        {
            setNoModeView(true)
        }
        if(view !== "user")
        {
            setUserView(false)
        }
        else if(view === "user")
        {
            setUserView(true)
        }
        if(view !== "showFull")
        {
            setShowFull(false)
        }
        else if(view === "showFull")
        {
            setShowFull(true)
        }
    }

    const getPublicationDate = () => {
        if(reservation.timestamp){
            let date = new Date(reservation.timestamp)
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
        if(type===2) return "#ff3b30"
        if(type===3) return "#1EACAA"
        return "#FFFFFF"
    }

    const deleteHandler = async () => {
        setLoading(true)
        const obj = {
            _id:reservation._id
        }
        await Promise.all(reservation.photos.map((photo) => {
            const deleteRef = ref(storage, `/posts/${reservation._id}/${photo.id}`)
            return deleteObject(deleteRef)
        }))
        axios.post(`${api_url}/reservations/remove`, obj)
            .then(() => {
                setEliminationPopup(false)
                setLoading(false)
                navigate('/user?t=publications')
            })
        
    }

    const backHandler = () => {
        navigate(-1)
    }

    const sendMessageHandler = async () => {
        if(text!==""&&reservation.user_id!==user?._id){
            setLoadingChat(true)

            let time = new Date().getTime()
            let text_object = {
                origin_type : user?._id,
                timestamp : time,
                text: text,
                starter: true
            }
            let chatId = ObjectID()

            await axios.post(`${api_url}/chats/create_chat`, {
                approached_id: publicationUser._id,
                approached_name: publicationUser.name,
                approached_photoUrl: publicationUser.photoUrl,
                approached_phone: publicationUser.phone,
                approached_read: false,
                approached_type: publicationUser.worker?'worker':'user',

                approacher_id: user?._id,
                approacher_name: user?.name,
                approacher_photoUrl: user?.photoUrl,
                approacher_phone: user?.phone,
                approacher_read: true,
                approacher_type: user?.worker?'worker':'user',

                text: text_object,
                updated: time,
                chat_id: chatId,
                reservation_id: reservation._id,
                reservation_title: reservation.title,
            })

            setChatId(chatId)
            setText("")
            setLoadingChat(false)
            setSuccessPopin(true)
            setTimeout(() => setSuccessPopin(false), 4000)
            setNoRepeatedChats(true)
            props.refreshWorker()
            }
    }

    const getSearchParams = () => {
        if(workerActive&&locationActive){
            return `?page=${page}&work=${workerActive}&region=${locationActive}`
        }
        else if(workerActive){
            return `?page=${page}&work=${workerActive}`
        }
        else if(locationActive){
            return `?page=${page}&region=${locationActive}`
        }
        else{
            return `?page=${page}`
        }
    }

    const refuseHandler = (e, user_id, reservation) => {
        e.stopPropagation()
        setRefusePopup(true)
        setRefuseUserReservationId(user_id)
        setRefuseReservation(reservation)
    }

    const editPublicationHandler = () => {
        navigate({
            pathname: `/publicar/editar`,
            search: `?editar=true&res_id=${reservation._id}`
        })
    }

    return (
        <div style={{position:"relative"}}>
            {
                loading&&<div className={styles.main_frontdrop}/>
            }
            {/* <Loader loading={loading}/> */}
            {
                workerBanner?
                <WorkerBanner 
                    cancel={() => setWorkerBanner(false)}/>
                :null
            }
            {
                refusePopup?
                    <Popup2
                        type = 'refuse_publication'
                        confirmHandler={() => setRefusePopup(false)}
                        cancelHandler={() => setRefusePopup(false)}
                        user_id={refuseUserReservationId}
                        reservation={refuseReservation}
                        api_url={api_url}
                        user={user}
                        />
                    :null
            }

            <CSSTransition 
                in={successPopin}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao removePopin={() => setSuccessPopin(false)} text="Mensagem enviada com sucesso!"/>
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
                        <div className={styles.previous_voltar} style={{borderBottom:`3px solid #0358e5`}} onClick={() => backHandler()}>
                            <ArrowBackIcon className={styles.previous_symbol}/>
                            <span className={styles.previous_voltar_text}>VOLTAR ÀS <span style={{color:"#0358e5"}}>MINHAS TAREFAS</span></span>
                        </div>
                        :
                        <div>
                            <p className={styles.reservar_upper_title}>TAREFA</p>
                            <div className={styles.normal_back}>
                                <Link className={styles.normal_back_left} 
                                    to={-1}
                                    state={{from_page: true}}>
                                    <ArrowBackIosIcon className={styles.normal_back_left_symbol}/>
                                    <span className={styles.normal_back_left_text}>VOLTAR</span>
                                </Link>
                                <div className={styles.normal_back_right}>
                                    <span className={styles.normal_back_right_dir} onClick={() => navigate({
                                    pathname: '/main/publications/trabalhos',
                                    state: {from_page: true}
                                    })}>Tarefas</span>
                                    <div className={styles.normal_back_right_sep_wrapper}>
                                        <div className={styles.normal_back_right_sep}>|</div>
                                    </div>
                                    <span className={styles.normal_back_right_dir} onClick={() => navigate({
                                    pathname: '/main/publications/trabalhos',
                                    search: `?page=${page}`,
                                    state: {from_page: true}
                                    })}>Página {page}</span>
                                </div>
                                {
                                    user?.admin&&reservation?.type===0?
                                    <div className={styles.admin_area}>
                                        <span className={styles.admin_button}>ACEITAR</span>
                                        <span className={styles.admin_button} 
                                            style={{backgroundColor:"#ff3b30"}}
                                            onClick={e => refuseHandler(e, reservation.user_id, reservation)}>RECUSAR</span>
                                    </div>
                                    :null
                                }
                                
                            </div>
                        </div>
                        
                    }
                    
                    <div className={styles.reserva} onClick={() => more&&setMore(false)}>
                        <Loader2 loading={loading}/>
                        {
                            reservation.type===2?
                            <div className={styles.wrong}>
                                <span className={styles.wrong_text}>A tua tarefa encontra-se <span className={styles.wrong_text_special}>INCORRETA</span></span>
                                <p className={styles.wrong_text} style={{fontSize:'1rem'}}>Mais informações sobre o(s) erro(s) no chat de Suporte.</p>
                            </div>
                            
                            :null
                        }
                        <div className={styles.top_top} style={{marginTop:location.state&&location.state.fromUserPage&&userView?"80px":"10px"}}>
                            <div className={styles.top_left} style={{borderColor:userView&&getTypeColor(reservation.type), backgroundColor:userView&&`${getTypeColor(reservation.type)}30`}}>
                                {
                                    /* Indicator + more */
                                    userView?
                                    <div className={styles.top_left_indicator_more}>
                                        <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(reservation.type)}}>
                                            {/* <span className={styles.item_indicator}></span> */}
                                            <span className={styles.item_type}>
                                                {
                                                    reservation.type===1?"Activa":
                                                    reservation.type===2?"Incorreta":
                                                    reservation.type===3?"Concluída":
                                                        "Em Análise"
                                                }
                                            </span>
                                        </div>
                                        <MoreVertIcon className={styles.more} onClick={() => setMore(!more)} style={{color:userView&&"white"}}/>
                                        
                                        <div className={styles.dropdown} hidden={!more}>
                                            <div className={styles.dropdown_top}>
                                                <span className={styles.dropdown_top_text}>TAREFA</span>
                                            </div>
                                            <div onClick={() => {}} className={styles.drop_div_main} style={{borderTop:"1px solid #ccc"}}>
                                                <div className={styles.drop_div} onClick={() => editPublicationHandler()}>
                                                    {/* <EditIcon className={styles.drop_div_symbol}/> */}
                                                    <span className={styles.drop_div_text} >Editar</span>
                                                </div>
                                            </div>
                                            <div onClick={() => {}} className={styles.drop_div_main_delete} style={{borderTop:"1px solid #ccc", borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                                                <div className={styles.drop_div} onClick={() => setEliminationPopup(true)}>
                                                    {/* <DeleteOutlineIcon className={styles.drop_div_symbol}/> */}
                                                    <span className={styles.drop_div_text} >REMOVER</span>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={profissoesMap[reservation.workerType]?.img} className={styles.item_worker_type_in}/>
                                    </div>
                                    :<img src={profissoesMap[reservation.workerType]?.img} className={styles.item_worker_type}/>

                                }
                                <div className={styles.top_left_top}>
                                    <span className={styles.top_date} style={{color:userView&&"white"}}>{getPublicationDate()}</span>
                                    <div className={styles.top_title}>
                                        {
                                        <div className={styles.previous_wrapper}>
                                            <span className={styles.previous_text} style={{color:userView&&"white"}}>{reservation.title}</span>
                                        </div>
                                        }
                                    </div>
                                    <span className={styles.top_desc_text} style={{color:userView&&"white"}}>DESCRIÇÃO DA TAREFA</span>
                                    {   
                                        reservation.desc!==""?
                                            <span className={styles.top_desc} style={{color:userView&&"white"}}>
                                                {reservation.desc}
                                            </span>
                                        :
                                        <span className={styles.top_desc_no} style={{color:userView&&"white"}}>
                                            Sem descrição
                                        </span>
                                    }
                                </div>
                                
                                <div>
                                    <div className={styles.divider} style={{backgroundColor:userView&&"white"}}></div>
                                        <div className={styles.details}>
                                            <span className={styles.details_id} style={{color:userView&&"white"}}>ID: {reservation._id}</span>
                                            {/* <span className={styles.details_id} style={{color:userView&&"white"}}>Visualizações: {reservation.clicks}</span> */}
                                        </div>
                                    </div>
                                </div>
                            <div className={styles.top_right}>
                                {
                                    !userView&&loaded?
                                    <div>
                                    <span className={styles.top_right_message} onClick={() => {
                                        if(showFull) messageAreaRef.current.focus()
                                        messageRef.current.scrollIntoView()
                                    }}>
                                        Enviar Mensagem
                                    </span>
                                    <div className={styles.top_message_icon_wrapper} onClick={() => {
                                        if(showFull) messageAreaRef.current.focus()
                                        messageRef.current.scrollIntoView()
                                    }}>
                                        <ChatIcon className={styles.top_message_icon}/>
                                    </div>
                                    
                                    </div>
                                    :userView?
                                    null
                                    :<span className={`${styles.top_right_message} ${styles.skeleton}`} style={{height:"40px", width:"150px"}}></span>
                                }
                                
                                <span className={styles.top_right_user}>Cliente</span>
                                <div className={styles.top_right_div}>
                                    {
                                        publicationUser?.photoUrl!==""?
                                        <img src={publicationUser?.photoUrl} referrerPolicy="no-referrer" className={styles.top_right_img}></img>
                                        :<FaceIcon className={styles.top_right_img}/>
                                    }
                                    <div className={styles.user_info}>
                                        {
                                            loaded&&(showFull||userView)?
                                            null
                                            :
                                            loaded&&noAccountView?
                                            <div className={styles.market}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <div className={styles.market_background}>
                                                    <span className={styles.market_text}>Gostavas de contacar <span style={{color:"#161F28", fontWeight:700}}>{reservation.user_name.split(" ")[0]}</span>?</span>
                                                    <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => setWorkerBanner(true)}>Criar conta e tornar-me um Profissional</span>
                                                </div>
                                            </div>
                                            :
                                            loaded&&noModeView?
                                            <div className={styles.market}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <div className={styles.market_background}>
                                                    <span className={styles.market_text}>Gostavas de contacar <span style={{color:"#161F28", fontWeight:700}}>{reservation.user_name.split(" ")[0]}</span>?</span>
                                                    <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => setWorkerBanner(true)}>Ativar Modo Profissional</span>
                                                </div>
                                            </div>
                                            :
                                            loaded&&noneView?
                                            <div className={styles.market}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <div className={styles.market_background}>
                                                    <span className={styles.market_text}>Completa os passos em falta para ativares a tua conta e contactares <span style={{color:"#161F28", fontWeight:700}}>{reservation.user_name.split(" ")[0]}</span>.</span>
                                                    <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => navigate('/user?t=conta')}>ativar a minha conta</span>
                                                </div>
                                            </div>
                                            :
                                            // loaded&&noSubView?
                                            // <div className={styles.market}>
                                            //     <img src={arrow} className={styles.market_arrow}/>
                                            //     <div className={styles.market_background}>
                                            //         <span className={styles.market_text}>Só falta activar a tua <span className={styles.text_special}>subscrição</span> para poderes contactar <span style={{color:"#161F28", fontWeight:700}}>{reservation.user_name.split(" ")[0]}</span>.</span>
                                            //         <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => navigate('/user?t=profissional')}>ativar subscrição</span>
                                            //     </div>
                                            // </div>
                                            // :
                                            // loaded&&noProfileView?
                                            // <div className={styles.market}>
                                            //     <img src={arrow} className={styles.market_arrow}/>
                                            //     <div className={styles.market_background}>
                                            //         <span className={styles.market_text}>Só falta completar o teu <span className={styles.text_special}>perfil</span> para poderes contactar <span style={{color:"#161F28", fontWeight:700}}>{reservation.user_name.split(" ")[0]}</span>.</span>
                                            //         <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => navigate('/user?t=personal')}>completar perfil</span>
                                            //     </div>
                                            // </div>
                                            // :
                                            <div className={styles.market_skeleton}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                            </div>
                                            
                                        }
                                        <span className={styles.user_info_name}>{reservation.user_name}</span>
                                        <span style={{display:"flex", alignItems:"center", marginTop:"10px"}}>
                                            <PhoneOutlinedIcon className={styles.user_info_number_symbol}/>
                                            {
                                                showFull||userView?
                                                <span className={styles.user_info_number}>{getNumberDisplay(publicationUser?.phone)}</span>                                                 
                                                :<span className={`${styles.user_info_number_blur} ${styles.unselectable}`}>123 456 789</span> 
                                            }
                                              
                                        </span>
                                    </div>                                    
                                </div>
                                <span className={styles.top_right_user} style={{marginTop:"40px"}}>Localização</span>
                                {
                                    reservation.task_type===2?
                                    null
                                    :
                                    <div className={styles.location_div}>
                                        <LocationOnIcon className={styles.location_pin}/>
                                        {
                                            loaded&&(showFull||userView)?
                                            reservation.task_type===2?
                                            null
                                            :
                                            <span className={styles.location}>{regioesOptions[reservation.district]}</span>
                                            :loaded&&(!showFull&&!userView)?
                                            <span className={`${styles.location_blur} ${styles.unselectable}`}>Abcdefg ab Hijklmonpqrstuv</span> 
                                            :<span className={styles.skeleton} style={{width:"490px", height:"20px", marginLeft:"10px", borderRadius:"5px"}}></span>
                                            }
                                    </div>
                                }

                                <div className={styles.location_div} style={{marginTop:reservation.task_type===2?'10px':'-5px'}}>
                                    {
                                        reservation.task_type===2?
                                        <ComputerIcon className={styles.location_pin}/>
                                        :
                                        <SignpostIcon className={styles.location_pin}/>
                                    }
                                    {
                                        loaded&&(showFull||userView)?
                                        reservation.task_type===2?
                                        <span className={styles.location} style={{fontWeight:600}}>Online</span>
                                        :
                                        <span className={styles.location}>{`${reservation.localizacao} - ${reservation.porta}${reservation.andar?`, ${reservation.andar}`:''}`}</span>
                                        :loaded&&(!showFull&&!userView)?
                                        <span className={`${styles.location_blur} ${styles.unselectable}`}>R. Abcdefg Hijklmonpqrstuvxyz 99, Porta 99</span> 
                                        :<span className={styles.skeleton} style={{width:"490px", height:"20px", marginLeft:"10px", borderRadius:"5px"}}></span>
                                        }
                                </div>

                                {
                                    loaded&&(showFull||userView)&&reservation.availableToGo?
                                    <div className={styles.location_div} style={{marginTop:'-5px'}}>
                                        <DirectionsWalkIcon className={styles.location_pin} style={{color:"#0358e5", backgroundColor:"#fff"}}/>
                                        <span className={styles.location} style={{fontWeight:600}}>Disponível para ir encontro do profissional</span>
                                        <div 
                                            className={styles.help_wrapper}
                                            data-tooltip-id='help' 
                                            data-tooltip-content="Disponível para se deslocar a uma oficina, escritório ou outro local perto da localização.">
                                            <QuestionMarkIcon className={styles.help}/>
                                        </div>
                                    </div>
                                    :null
                                }
                                

                                {
                                    loaded&&(showFull||userView)?
                                    reservation.task_type===2?
                                    null
                                    :
                                    reservation.task_type===1 || reservation?.lat===null || reservation?.lng===null?
                                    <div className={styles.no_map_div}>
                                        <ExploreOffIcon className={styles.no_map_icon}/>
                                        <span className={styles.no_map}>Sem mapa disponível para esta localização</span>
                                    </div>
                                    :
                                    <div className={styles.map_div}>
                                        <MapContainer center={[reservation?.lat, reservation?.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[reservation?.lat, reservation?.lng]} icon={myIcon}>
                                                <Popup>
                                                    A pretty CSS3 popup. <br /> Easily customizable.
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                    :<div className={styles.map_div}>
                                        <img src={blurredMap} className={`${styles.blurred_map} ${styles.unselectable}`}/>
                                    </div>

                                }
                                
                            </div>
                        </div>
                        <div className={styles.photos} style={{marginBottom:userView?"20px":0}}>
                            <span className={styles.top_right_user}>Fotografias</span>
                            {
                                images?.length>0?
                                <div className={styles.image_gallery_wrapper}>
                                    <ImageGallery 
                                    items={images} 
                                    infinite={false} 
                                    showPlayButton={false}/>
                                </div>
                                :<NoPhotographyIcon className={styles.no_photos}/>
                            }
                            
                        </div>
                        {
                            loaded&&!userView?
                            <div className={styles.message}>
                                <div className={styles.message_top_flex}>
                                    <div className={styles.message_left}>
                                        {
                                            publicationUser?.photoUrl!==""?
                                            <img src={publicationUser?.photoUrl} className={styles.top_right_img}></img>
                                            :<FaceIcon className={styles.top_right_img}/>
                                        }
                                        <span className={styles.message_left_user_name}>{reservation.user_name}</span>
                                    </div>
                                    <span className={styles.user_info_number} style={{opacity:"0.6"}}>Mensagem</span> 
                                </div>
                                {
                                    noAccountView||noneView||noSubView||noProfileView||noModeView?
                                    <div className={styles.textarea_wrapper}>
                                        <textarea 
                                            className={styles.message_textarea_disabled}
                                            placeholder="Escrever mensagem..."
                                        />
                                        <div className={styles.frontdrop}>
                                            <span className={styles.frontdrop_text} style={{padding:'0 10px', textAlign:'center'}}>Para enviares uma <span className={styles.action}>mensagem</span> e veres os <span className={styles.action}>detalhes de contacto</span> de <span 
                                                    // style={{color:"#161F28", textTransform:"capitalize", fontWeight:700}}
                                                    >
                                                    {reservation.user_name.split(" ")[0]}
                                                </span>,
                                            {
                                                noAccountView?
                                                <span className={styles.frontdrop_text}> cria uma conta e torna-te um profissional.</span>
                                                :
                                                noModeView?
                                                <span className={styles.frontdrop_text}> ativa o Modo Profissional.</span>
                                                :noneView?
                                                <span className={styles.frontdrop_text}> completa os passos em falta para ativares a tua conta.</span>
                                                :noSubView?
                                                <span className={styles.frontdrop_text}> activa a tua <span style={{color:"white"}}>subscrição</span>.</span>
                                                :noProfileView?
                                                <span className={styles.frontdrop_text}> completa o teu <span style={{color:"white"}}>perfil</span>.</span>
                                                :null
                                            }
                                            </span>
                                            {
                                                noAccountView?
                                                <span className={styles.frontdrop_text_action} onClick={() => setWorkerBanner(true)}>tornar-me um Profissional</span>
                                                :
                                                noModeView?
                                                <span className={styles.frontdrop_text_action} onClick={() => setWorkerBanner(true)}>ativar Modo Profissional</span>
                                                :noneView?
                                                <span className={styles.frontdrop_text_action} onClick={() => navigate('/user?t=conta')}>ativar a minha conta</span>
                                                :noSubView?
                                                <span className={styles.frontdrop_text_action} onClick={() => navigate('/user?t=subscription')}>ativar subscrição</span>
                                                :noProfileView?
                                                <span className={styles.frontdrop_text_action} onClick={() => navigate('/user?t=conta')}>completar perfil</span>
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
                                            navigate(`/user?t=messages`, {
                                                state: {
                                                    from_page: true,
                                                    worker_id: user?._id,
                                                    user_id: reservation.user_id
                                                }})}>Ver mensagens</span>
                                        </div>
                                    </div>
                                    :
                                    <div style={{position:"relative"}}>
                                        <Loader2 loading={loadingChat}/>
                                        <textarea 
                                        ref={messageAreaRef}
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
                            :loaded&&userView?
                            <div style={{width:"100%"}}>
                                <span className={styles.separator}/>
                                <div className={styles.edit} onClick={() => editPublicationHandler()}>
                                    <div className={styles.edit_icon_wrapper}>
                                        <EditIcon className={styles.edit_icon}/>
                                    </div>
                                    <span className={styles.edit_icon_text}>EDITAR TAREFA</span>
                                </div>
                                <div className={styles.delete} onClick={() => setEliminationPopup(true)}>
                                    <span>REMOVER TAREFA</span>
                                </div>
                            </div>
                            :
                            <div className={styles.skeleton} style={{marginTop:"10px", width:"100%", height:"200px", marginBottom:"20px", borderRadius:"5px"}}></div>
                        }
                        
                    </div>
                </div>
                :reservation===null?<NoPage object="publicação"/>:null
            }
            <Tooltip className={styles.helper_tooltip} id={"help"} effect='solid' place='top'/>
        </div>
        
    )
}

export default Trabalho