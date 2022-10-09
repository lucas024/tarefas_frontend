import React, {useEffect, useState, useRef} from 'react'
import styles from './trabalho.module.css'
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import Sessao from '../transitions/sessao';

const ObjectID = require("bson-objectid");


const Trabalho = (props) => {

    const [reservation, setReservation] = useState({})
    const [images, setImages] = useState(null)
    const [text, setText] = useState("")
    const [more, setMore] = useState(false)
    const [eliminationPopup, setEliminationPopup] = useState(false)
    const [publicationUser, setPublicationUser] = useState({})
    const [workerBanner, setWorkerBanner] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)

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
    const [noSubView, setNoSubView] = useState(false)
    const [noProfileView, setNoProfileView] = useState(false)
    const [noneView, setNoneView] = useState(false)
    const [showFull, setShowFull] = useState(false)
    const [locationActive, setLocationActive] = useState(false)
    const [workerActive, setWorkerActive] = useState(false)

    const [loaded, setLoaded] = useState(false)

    const setViewTo = (view) => {
        console.log(view);
        if(view !== "none")
        {
            setNoneView(false)
        }
        else
        {
            setNoneView(true)
        }
        if(view !== "noProfile")
        {
            setNoProfileView(false)
        }
        else
        {
            setNoProfileView(true)
        }
        if(view !== "noSub")
        {
            setNoSubView(false)
        }
        else
        {
            setNoSubView(true)
        }
        if(view !== "noAccount")
        {
            setNoAccountView(false)
        }
        else
        {
            setNoAccountView(true)
        }
        if(view !== "user")
        {
            setUserView(false)
        }
        else
        {
            setUserView(true)
        }
        if(view !== "showFull")
        {
            setShowFull(false)
        }
        else
        {
            setShowFull(true)
        }
    }

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
        const paramsAux = Object.fromEntries([...searchParams])
        console.log(paramsAux);
        paramsAux.region&&setLocationActive(paramsAux.region)
        paramsAux.work&&setWorkerActive(paramsAux.work)
        setPage(paramsAux.page)
        paramsAux.id&&axios.get(`${props.api_url}/reservations/get_single_by_id`, { params: {_id: paramsAux.id} }).then(res => {
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
            }
            else{
                setReservation(null)
            }
        })

    }, [searchParams])

    useEffect(() => {
        props.user!=null&&reservation&&axios.get(`${props.api_url}/user/get_user_by_mongo_id`, { params: {_id: reservation.user_id} })
            .then(res => {
                setPublicationUser(res.data)
                if(props.user?._id === reservation.user_id){
                    setViewTo('user')
                    setLoading(false)
                }
            })
    }, [reservation, props.user])

    useEffect(() => {
        if(!props.user){
            setViewTo('noAccount')
            setLoading(false)
        }
        else if(!(props.user?.subscription&&!props.incompleteUser)){
            setViewTo('none')
            setLoading(false)
        }
        else if(props.user?.subscription){
            axios.post(`${props.api_url}/retrieve-subscription-and-schedule`, {
                subscription_id: props.user.subscription.id,
                schedule_id: props.user.subscription.sub_schedule
            })
            .then(res2 => {
                if(!isActiveSub(res2.data.schedule.current_phase.end_date)){
                    setViewTo('noSub')
                }
                else if(isActiveSub(res2.data.schedule.current_phase.end_date)&&props.user.state===1)
                {
                    setViewTo("showFull")
                }
                else if(props.incompleteUser || props.user.state===0){
                    setViewTo('noProfile')
                }
                setLoading(false)
            })
            
        }
        else if(props.incompleteUser || props.user?.state===0){
            setViewTo('noProfile')
            setLoading(false)
        }
        else
        {
            setViewTo('noAccount')
            setLoading(false)
        }
    }, [props.user, props.incompleteUser])

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt, props.incompleteUser])

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
        if(type===2) return "#1EACAA"
        return "#FFFFFF"
    }

    const deleteHandler = async () => {
        setLoading(true)
        const obj = {
            _id:reservation._id
        }
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

            let time = new Date().getTime()
            let text_object = {
                origin_type : props.user.type,
                timestamp : time,
                text: text,
                starter: true
            }
            let chatId = ObjectID()

            await axios.post(`${props.api_url}/chats/create_user_chat_from_worker`, {
                worker_name: props.user.name,
                worker_photoUrl: props.user.photoUrl,
                worker_phone: props.user.phone,
                worker_id: props.user._id,
                user_name: publicationUser.name,
                user_photoUrl: publicationUser.photoUrl,
                user_phone: publicationUser.phone,
                user_id: publicationUser._id,
                text: text_object,
                updated: time,
                chat_id: chatId,
                reservation_id: reservation._id,
                reservation_title: reservation.title
            })
            .then(() => {
                
            })
            // await axios.post(`${props.api_url}/user/update_user_notifications`, {
            //     _id: publicationUser._id,
            //     notification_id: chatId
            // })
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
                        <div>
                            <p className={styles.reservar_upper_title}>TRABALHO</p>
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
                                    })}>Trabalhos</span>
                                    <div className={styles.normal_back_right_sep_wrapper}>
                                        <div className={styles.normal_back_right_sep}>|</div>
                                    </div>
                                    <span className={styles.normal_back_right_dir} onClick={() => navigate({
                                    pathname: '/main/publications/trabalhos',
                                    search: `?page=${page}`,
                                    state: {from_page: true}
                                    })}>Página {page}</span>
                                </div>
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
                                    !userView&&loaded?
                                    <span className={styles.top_right_message} onClick={() => {
                                        if(showFull) messageAreaRef.current.focus()
                                        messageRef.current.scrollIntoView()
                                    }}>
                                        Enviar Mensagem
                                    </span>
                                    :<span className={`${styles.top_right_message} ${styles.skeleton}`} style={{height:"40px", width:"150px"}}></span>
                                }
                                
                                <span className={styles.top_right_user}>Utilizador</span>
                                <div className={styles.top_right_div}>
                                    {
                                        publicationUser?.photoUrl!==""?
                                        <img src={publicationUser?.photoUrl} className={styles.top_right_img}></img>
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
                                                <span className={styles.market_text}>Gostava de contacar <span className={styles.text_special}>{reservation.user_name.split(" ")[0]}</span>?</span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => setWorkerBanner(true)}>Tornar-me Trabalhador</span>
                                            </div>
                                            :
                                            loaded&&noneView?
                                            <div className={styles.market} style={{width:"200px", bottom:"-95px"}}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Completa o teu <span className={styles.text_special}>PERFIL</span> e <span  className={styles.text_special}>SUBSCREVE</span> para contactar <span className={styles.text_special}>{reservation.user_name.split(" ")[0]}</span></span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => navigate('/user?t=personal')}>Ir para Utilizador</span>
                                            </div>
                                            :
                                            loaded&&noSubView?
                                            <div className={styles.market} style={{width:"200px", bottom:"-95px"}}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Só falta completares a tua <span className={styles.text_special}>subscrição</span> para poderes contactar <span className={styles.text_special}>{reservation.user_name.split(" ")[0]}</span></span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => navigate('/user?t=subscription')}>Ir para Subscrição</span>
                                            </div>
                                            :
                                            loaded&&noProfileView?
                                            <div className={styles.market} style={{width:"200px", bottom:"-95px"}}>
                                                <img src={arrow} className={styles.market_arrow}/>
                                                <span className={styles.market_text}>Só falta completares o teu <span className={styles.text_special}>PERFIL</span> para poderes contactar <span className={styles.text_special}>{reservation.user_name.split(" ")[0]}</span></span>
                                                <span className={styles.frontdrop_text_action_top} style={{margin:"5px auto"}} onClick={() => navigate('/user?t=personal')}>Ir para Perfil</span>
                                            </div>
                                            :
                                            <div className={styles.market_skeleton} style={{width:"200px", bottom:"-95px"}}>
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
                                <div className={styles.location_div}>
                                    <LocationOnIcon className={styles.location_pin}/>
                                    {
                                        loaded&&(showFull||userView)?
                                        <span className={styles.location}>{`${reservation.localizacao} - ${reservation.porta}, ${reservation.andar}`}</span>
                                        :loaded&&(!showFull&&!userView)?
                                        <span className={`${styles.location_blur} ${styles.unselectable}`}>R. Abcdefg Hijklmonpqrstuvxyz 99, Porta 99</span> 
                                        :<span className={styles.skeleton} style={{width:"490px", height:"20px", marginLeft:"10px", borderRadius:"5px"}}></span>
                                        }
                                </div>
                                {
                                    loaded&&(showFull||userView)?
                                    <div className={styles.map_div}>
                                        <GoogleMapReact 
                                            bootstrapURLKeys={{ key:"AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk", libraries: ["places"]}}
                                            defaultZoom={14}
                                            center={{ lat: reservation.lat, lng: reservation.lng}}   
                                            >
                                            <Marker lat={reservation.lat} lng={reservation.lng}/>
                                        </GoogleMapReact>
                                    </div>
                                    :<div className={styles.map_div}>
                                        <img src={blurredMap} className={`${styles.blurred_map} ${styles.unselectable}`}/>
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
                                    noAccountView||noneView||noSubView||noProfileView?
                                    <div className={styles.textarea_wrapper}>
                                        <textarea 
                                            className={styles.message_textarea_disabled}
                                            placeholder="Escrever mensagem..."
                                        />
                                        <div className={styles.frontdrop}>
                                            <span className={styles.frontdrop_text}>Para enviar mensagem a <span style={{color:"white", textTransform:"capitalize"}}>{reservation.user_name.split(" ")[0]}</span>,</span>
                                            {
                                                noAccountView?
                                                <span className={styles.frontdrop_text}>registe ou entre numa conta TRABALHADOR!</span>
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
                                            navigate(`/user?t=messages&id=${chatId}`, {
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
                            :
                            <div className={styles.skeleton} style={{marginTop:"10px", width:"100%", height:"200px", marginBottom:"20px", borderRadius:"5px"}}></div>
                        }
                        
                    </div>
                </div>
                :reservation===null?<NoPage object="publicação"/>:null
            }
            
        </div>
        
    )
}

export default Trabalho