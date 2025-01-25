import React, { useEffect, useRef, useState } from 'react'
import styles from './home.module.css'
import {useLocation, useNavigate} from 'react-router-dom'
import WorkerBanner from './workerBanner';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import {auth} from '../firebase/firebase'
import SelectHome from '../selects/selectHome';
import {profissoesGrouped, regioes, regioesOptions} from './util'
import InstagramIcon from '@mui/icons-material/Instagram';
import {Tooltip} from 'react-tooltip';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import TitleIcon from '@mui/icons-material/Title';
import { useDispatch, useSelector } from 'react-redux';
import { search_scroll_save, user_sort_chats, user_update_chats } from '../store';
import TosBanner from './tosBanner';
import SuggestionBanner from './suggestionBanner';
import ContactosBanner from './contactosBanner';
import ConstructionIcon from '@mui/icons-material/Construction';
import FacebookIcon from '@mui/icons-material/Facebook';
import ChatIcon from '@mui/icons-material/Chat';
import FaceIcon from '@mui/icons-material/Face';
import axios from 'axios';
import home_arrow_right from '../assets/home_arrow_right.png'
import home_arrow_left from '../assets/home_arrow_left.png'
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import EmailUnverified from '@mui/icons-material/UnsubscribeOutlined';
import moment from 'moment';

import hero_1 from '../assets/new_assets/hero_1.png'
import hero_2 from '../assets/new_assets/hero_2.png'
import icon_1 from '../assets/new_assets/icon_1.png'
import icon_2 from '../assets/new_assets/icon_2.png'

import {
    DefineAdSlot,
    RequestAds,
    InitializeGPT
  } from '../adsense/google-publisher-tag';
import PpBanner from './ppBanner';
import Row from '../servicos/row';
import InformationBanner from './informationBanner';
import SelectHomeMain from '../selects/selectHomeMain';


const firstOptions = [
    { value: 'trabalhos', label: 'Tarefas', img: icon_1, desc: 'Ver tarefas para realizar' },
    { value: 'profissionais', label: 'Profissionais', img: icon_2, desc: 'Ver e contratar profissionais' },
]

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
}

const Home = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => {return state.user})
    const chats = useSelector(state => {return state.chats})
    const api_url = useSelector(state => {return state.api_url})

    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const worker_profile_complete = useSelector(state => {return state.worker_profile_complete})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})


    const [items, setItems] = useState([])
    const [workerBanner, setWorkerBanner] = useState(false)
    const [tosBanner, setTosBanner] = useState(false)
    const [ppBanner, setPpBanner] = useState(false)
    const [suggestionBanner, setSuggestionBanner] = useState(false)
    const [contactosBanner, setContactosBanner] = useState(false)
    const [informationBanner, setInformationBanner] = useState(false)
    const [hasUnreadTexts, setHasUnreadTexts] = useState(false)
    const [unreadTexts, setUnreadTexts] = useState([])
    const [newPopup, setNewPopup] = useState(false)

    const [searchPosition, setSearchPosition] = useState(0)

    const [mensagemPopup, setMensagemPopup] = useState(false)
    const [loginPopup, setLoginPopup] = useState(false)
    const [registerPopup, setRegisterPopup] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const [first, setFirst] = useState(firstOptions[0])
    const [second, setSecond] = useState(null)
    const [third, setThird] = useState(null)

    const [backdrop, setBackdrop] = useState(false)

    const [showArrow, setShowArrow] = useState(false)
    const [showArrowFlag, setShowArrowFlag] = useState(true)

    const totalNotifications = [1, 2, 3]
    

    const location = useLocation()
    const navigate = useNavigate()

    const select_profissionais = useRef(null)
    const select_regioes = useRef(null)
    const top = useRef(null)

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        if(window.localStorage.getItem('exploredHome')===null)
        {
            const interval = setInterval(() => {
                setShowArrow(true)        
            }, 5000)

            return () => clearInterval(interval);
        }

        let last_timestamp = window.localStorage.getItem('last_search_timestamp')
        if(last_timestamp!==null)
        {
            if(moment().diff(new Date(last_timestamp), 'minutes') > 10)
                setSearchPosition(0)
            else
                setSearchPosition(1)
        }
            
        fetchJobs()

        
      }, []);

    useEffect(() => {
        if(!parseInt(localStorage.getItem('firstAccessMade')))
            navigate('/landing')
        
        let aux2 = window.localStorage.getItem('last_search_type')
        if(aux2 !== null)
        {
            if(aux2 === 'trabalhos')
                setFirst(firstOptions[0])
            else
                setFirst(firstOptions[1])
        }
        else if(user?.worker) setFirst(firstOptions[0])
        else if(user!=null && user?._id!=null) setFirst(firstOptions[0])

        if(location.state?.carry==="login"){
            setLoginPopup(true)
            setTimeout(() => setLoginPopup(false), 4000)
            navigate(location.pathname, {}); 
        }
        else if(location.state?.carry==="register"){
            setRegisterPopup(location.state?.skippedVerification?"skippedVerification":"didVerification")
            setTimeout(() => setRegisterPopup(false), 4000)
            navigate(location.pathname, {});
        }
        else if(location.state?.refreshWorker){
            props.refreshWorker()
            setLoginPopup(true)
            setTimeout(() => setLoginPopup(false), 4000)
        }
        dispatch(search_scroll_save(null))
        // if(chats?.length===0 || chats === undefined)
        // {
        //     dispatch(user_update_chats(user?.chats))
        // }     
    }, [location, user, loaded])

    const sortByTimestamp = (a, b) => {
        return a.last_text.timestamp < b.last_text.timestamp ? 1 : -1
    }

    useEffect(() => {
        function handleResize() {
          setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, [])

    useEffect(() => {
        if(user){
            setShowArrowFlag(false)
            axios.get(`${api_url}/user/get_user_by_mongo_id`, { params: {_id: user._id} })
            .then(res => {
                if(res.data!==''){
                    if(res.data?.chats?.length>0)
                    {
                        let chats_aux = JSON.parse(JSON.stringify(([...res.data.chats].sort(sortByTimestamp))))
                        dispatch(user_update_chats(chats_aux))
                    }
                }
            })
        }

    }, [user])

    useEffect(() => {
        if(chats?.length>0){
            let clear = true
            let aux = []
            for(const el of chats){
                if(user?._id===el.approacher_id&&!el.approacher_read){
                    aux.push(el)
                    clear = false
                }
                else if(user?._id===el.approached_id&&!el.approached_read){
                    aux.push(el)
                    clear = false
                }
            }
            if(clear)
            {
                setHasUnreadTexts(false)
                setUnreadTexts([])
            }
            else{
                setHasUnreadTexts(true)
                setUnreadTexts(aux)
            } 
        }
        else{
            setHasUnreadTexts(false)
        }
    }, [user, chats])

    

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
        if(!props.userLoggedIn&&window.localStorage.getItem('dismissedBanner')===null)
        {
            setTimeout(() => {
                setNewPopup(true)
            }, 1000);
        }
        else{
            setNewPopup(false)
        }
    }, [props.userLoadAttempt, props.userLoggedIn])


    useEffect(() => {
        // Confirm the link is a sign-in with email link.
        if (isSignInWithEmailLink(auth, location.pathname)) {
            let email = localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = prompt('Please provide your email for confirmation');
            }
            // The client SDK will parse the code from the link for you.
            signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                localStorage.removeItem('emailForSignIn');
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
            })
            .catch((error) => {
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
            });
        }
    }, [location])

    const handleMoveAuth = type => {
        navigate(`/authentication?type=${type}`)
    }

    const searchHandler = () => {
        if(second&&third){
            navigate(`/main/publications/${first?.value}?work=${second?.value}&region=${third.value}`)
        }
        else if(second){
            navigate(`/main/publications/${first?.value}?work=${second?.value}`)
        }
        else if(third){
            navigate(`/main/publications/${first?.value}?region=${third.value}`)
        }
        else{
            navigate(`/main/publications/${first?.value}`)
        }

        window.localStorage.setItem('last_search_timestamp', new Date())
        window.localStorage.setItem('last_search_type', first?.value)
    }

    const clearTopSearch = () => {
        setSecond(null)
        setThird(null)
    }

    const getTime = (val) => {
        let time = new Date(val)
        return time.toISOString().split("T")[0]
    }

    const getDisplayTime = time => {
        let val = new Date(time).toLocaleTimeString()
        return val.slice(0,5)
    }

    const emptyNotifications = () => {
        return unreadTexts.length===0 && (!user?.worker || worker_profile_complete&&worker_is_subscribed&&user_email_verified) && props.badPublications?.length===0
    }

    const mapWrapper = () => {
        
        if(emptyNotifications)
            return (
                <div className={styles.notification_empty}>
                    <p className={styles.notification_empty_text}>Sem mensagens novas ou outras notificações, por enquanto.</p>
                </div>
            )
        else{
            return(
                <div>
                    {
                        (user?.worker&&(!worker_profile_complete||!worker_is_subscribed))||!user_email_verified?
                        <div>
                            <div className={styles.banner} style={{marginTop:hasUnreadTexts?"3px":""}}>
                                <p className={styles.banner_text}>Notificações de conta</p>
                            </div>
                            {mapNotifications()}
                        </div>
                        :null
                    }
                    {
                        props.badPublications?.length>0?
                        <div>
                            <div className={styles.banner} style={{marginTop:hasUnreadTexts?"3px":"",}}>
                                <p className={styles.banner_text} style={{backgroundColor:"#ff3b30"}}>Problema na Tarefa</p>
                            </div>
                            {mapBadPublications()}
                        </div>
                        :null
                    }
                    {
                        unreadTexts.length>0?
                        <div>
                            <div className={styles.banner}>
                                <p className={styles.banner_text}>Mensagens</p>
                                {mapMessages()}
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
            )
        }
                                        
    }

    const mapMessages = () => {
        return unreadTexts.map(el => {
            return (
                <div className={
                    el.approached_id !== user?._id?
                        el.approached_type==='worker'?
                        `${styles.notification} ${styles.notification_worker}`
                        :`${styles.notification} ${styles.notification_user}`
                    :
                        el.approacher_type==='worker'?
                        `${styles.notification} ${styles.notification_worker}`
                        :`${styles.notification} ${styles.notification_user}`
                    } 
                // onClick={() => navigate(`/user?t=messages&id=${el.chat_id}`)}
                onClick={() => navigate(`/user?t=messages`)}
                >
                    <div className={styles.notification_left}>
                        <ChatIcon className={styles.notification_left_icon}/>
                    </div>
                    <div className={styles.notification_right}>
                        <div className={styles.notification_right_column}>
                            <div className={styles.notification_right_flex}>
                                {
                                    el.approached_id !== user?._id?
                                        el.approached_photoUrl !== ""?
                                        <img src={el.approached_photoUrl} className={styles.notification_right_image}/>
                                        :
                                        el.approached_type==="worker"?
                                        <EmojiPeopleIcon className={styles.notification_right_image} style={{transform: 'scaleX(-1)', color:"#FF785A"}}/>
                                        :<FaceIcon className={styles.notification_right_image}/>
                                    :
                                    el.approacher_photoUrl !== ""?
                                        <img src={el.approacher_photoUrl} className={styles.notification_right_image}/>
                                        :
                                        el.approacher_type==="worker"?
                                        <EmojiPeopleIcon className={styles.notification_right_image} style={{transform: 'scaleX(-1)', color:"#FF785A"}}/>
                                        :<FaceIcon className={styles.notification_right_image}/>
                                }
                                <p className={styles.notification_right_name}>{el.approached_id !== user?._id?el.approached_name:el.approacher_name}</p>
                            </div>
                            <span className={styles.notification_right_text}>
                                {el.last_text.text}
                            </span>
                        </div>
                        <div className={styles.notification_right_column}>
                            {
                                el.reservation_title?
                                <p className={styles.notification_right_reservation}>{el.reservation_title}</p>
                                :
                                <p className={styles.notification_right_reservation}>mensagem por ler</p>
                            }
                            <div className={styles.notification_right_time}>
                                <p className={styles.notification_right_date}>{getTime(el.last_text.timestamp)}</p>
                                <p className={styles.notification_right_hour}>{getDisplayTime(el.last_text.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    const mapNotifications = () => {
            return (
                <div>
                    {                    
                    !user_email_verified?
                        <div className={styles.notification} onClick={() => navigate(`/user?t=conta`)}>
                            <div className={styles.notification_left}>
                                <EmailUnverified className={styles.notification_left_icon}/>
                            </div>
                            <div className={styles.notification_short}>
                                <p className={styles.notification_short_text}>VERIFICA O TEU E-MAIL</p>
                            </div>
                        </div>
                    :null
                    }
                                        {                    
                    user.worker&&!worker_profile_complete?
                        <div className={styles.notification} onClick={() => navigate(`/user?t=profissional`)}>
                            <div className={styles.notification_left}>
                                <DisplaySettingsIcon className={styles.notification_left_icon}/>
                            </div>
                            <div className={styles.notification_short}>
                                <p className={styles.notification_short_text}>PREENCHE OS DETALHES DE PROFISSIONAL</p>
                            </div>
                        </div>
                    :null
                    }
                    {                    
                    user.worker&&!worker_is_subscribed?
                        <div className={styles.notification} onClick={() => navigate(`/user?t=profissional&st=subscription`)}>
                            <div className={styles.notification_left}>
                                <CardMembershipIcon className={styles.notification_left_icon}/>
                            </div>
                            <div className={styles.notification_short}>
                                <p className={styles.notification_short_text}>ATIVA A TUA SUBSCRIÇÃO</p>
                            </div>
                        </div>
                    :null
                    }

                </div>
                
            )
    }

    const mapBadPublications = () => {
        return props.badPublications.map((val, i) => {
            return (
                <div>
                    <div className={`${styles.notification} ${styles.notification_red}`} onClick={() => navigate(`/publicar/editar?editar=true&res_id=${val._id}`)}>
                        <div className={styles.notification_left}>
                            <TitleIcon className={styles.notification_left_icon}/>
                        </div>
                        <div className={styles.notification_short}>
                        <p className={styles.notification_short_text_helper}>Tens um problema na tua tarefa: <strong>{val.title}</strong></p>
                            <p className={styles.notification_short_text}>ALTERAR TAREFA</p>
                        </div>
                    </div>
    
                </div>
            )
        })
    }

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        const position = Math.ceil(
            (scrollTop / (scrollHeight - clientHeight)) * 100
        )
        if(position > 50) {
            window.localStorage.setItem('exploredHome', true)
            setShowArrowFlag(false)
        }
    }

    const mapRowsToDisplay = () => {
        return items.map((item, i) => {
            return(
                <div key={i} className={styles.row}>
                    <div onClick={() => {
                            navigate(`/main/publications/publication?id=${item._id}`, {
                                    state: {
                                        fromUserPage: false,
                                    }
                                }
                            )}
                        }>
                        <Row
                            home={true}
                            item={item}
                            locationActive={null}
                            workerActive={false}let listaTrabalhosVistos
                            user_id={user?._id}
                            trabalhoVisto={JSON.parse(window.localStorage.getItem('listaTrabalhosVistos'))?.includes(item._id)}
                        />
                    </div>
                    
                </div>
            )
        })
    }

    const fetchJobs = () => {
        axios.get(`${api_url}/reservations`,{ params: {limit: 5} }).then(res => {
            if(res.data!==null){
                setItems(res.data.data)
            }
        })
    }
    
    return(
        <div className={styles.home}>
            {backdrop?
                <span className={styles.backdrop}/>
                :null
            }
            <CSSTransition 
                in={loginPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao removePopin={() => setLoginPopup(false)} text={"Sessão iniciada com sucesso!"}/>
            </CSSTransition>
            <CSSTransition 
                in={registerPopup!==false}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao removePopin={() => setRegisterPopup(false)} text={registerPopup==="skippedVerification"?"Conta criada com sucesso! Não te esqueças de verificar o teu e-mail.":"Conta criada com sucesso!"}/>
            </CSSTransition>
            <CSSTransition 
                in={mensagemPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >{
                <Sessao removePopin={() => setMensagemPopup(false)} text={"Completa o teu perfil!"}/>
                }
            </CSSTransition>
            {
                workerBanner?
                <WorkerBanner 
                    cancel={() => setWorkerBanner(false)}/>
                :null
            }
            {
                tosBanner?
                <TosBanner 
                    confirm={() => {
                        setTosBanner(false)
                    }}
                    cancel={() => setTosBanner(false)}/>
                :null
            }
            {
                ppBanner?
                <PpBanner 
                    confirm={() => {
                        setPpBanner(false)
                    }}
                    cancel={() => setPpBanner(false)}/>
                :null
            }
            {
                suggestionBanner?
                <SuggestionBanner
                    confirm={() => {
                        setSuggestionBanner(false)
                    }}
                    cancel={() => setSuggestionBanner(false)}/>
                :null
            }
            {
                contactosBanner?
                <ContactosBanner
                    confirm={() => {
                        setContactosBanner(false)
                    }}
                    cancel={() => setContactosBanner(false)}/>
                :null
            }
            {
                informationBanner?
                <InformationBanner
                    confirm={() => {
                        setInformationBanner(false)
                    }}
                    cancel={() => setInformationBanner(false)}/>
                :null
            }
            <div ref={top} className={styles.home_wrapper} onScroll={val => {
                showArrowFlag&&handleScroll(val)
            }}>
                {
                    showArrowFlag?
                    <div className={styles.arrow_wrapper_2} style={{opacity:showArrow?1:0}}>
                        <p className={styles.arrow_wrapper_text}>Explora o resto da página!</p>
                        <div className={styles.arrow_wrapper_div}> 
                            <ArrowDownwardIcon className={styles.arrow_wrapper_icon}/>
                        </div>
                    </div> 
                    :null
                }
                {/* {
                    window.adsbygoogle?
                    <div>
                        <div className={styles.ad}>
                            <ins
                                className={styles.ad_inner}
                                data-ad-client="ca-pub-1542751279392735"
                                data-ad-slot="0"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins>
                            
                            <DefineAdSlot adUnit={0}/>
                        </div>
                        
                    </div>
                    :null
                } */}
                <CSSTransition 
                    in={false&&newPopup&&windowDimensions.width>500}
                    timeout={1000}
                    classNames="welcome"
                    unmountOnExit
                    >
                        <div className={styles.upper_wrapper}>
                            <div className={styles.upper_wrapper_text}>
                                <p className={styles.upper_wrapper_text_title}>NOVO NO TAREFAS?</p>
                                {/* <p className={styles.upper_wrapper_text_subtitle}>Esta plataforma junta <span style={{fontWeight:600, textDecoration:'underline', textDecorationColor:"#0358e5"}}>clientes</span> e <span style={{fontWeight:600, textDecoration:'underline', textDecorationColor:"#FF785A"}}>profissionais</span>.</p> */}
                                {/* <p className={styles.upper_wrapper_text_subtitle}>O cliente publica as tarefas que quer ver realizadas e espera o contacto de profissionais. O profissional encontra as tarefas e contacta os clientes, simultaneamente expondo o seu negócio.</p> */}
                                <p className={styles.upper_wrapper_text_subtitle}>O Tarefas é uma plataforma que permite aos clientes procurar profissionais ou esperar que eles venham até si. Os profissionais, por outro lado, podem encontrar tarefas para realizar ao mesmo tempo que expôem o seu negócio através do seu perfil publicamente visível.</p>
                                <div className={styles.new}>
                                    <div className={styles.new_side} style={{marginRight:'5px'}}>
                                        <span className={styles.new_title} style={{color:'#0358e5'}}>CLIENTE</span>
                                        <p className={styles.upper_wrapper_text_subtitle} style={{color:"#0358e5", fontWeight:600, textDecoration:'none', textDecorationColor:'#0358e5', textDecorationThickness:'1px'}}>Como cliente, basta criares a tua conta e publicares uma tarefa ou procurares um profissional.</p>
                                    </div>
                                    <div className={styles.new_side} style={{marginLeft:'5px'}}>
                                        <span className={styles.new_title} style={{color:'#FF785A'}}>PROFISSIONAL</span>
                                        <p className={styles.upper_wrapper_text_subtitle} style={{color:"#FF785A", fontWeight:600, textDecoration:'none', textDecorationColor:'#FF785A', textDecorationThickness:'1px'}}>Como profissional, depois de criares a tua conta segue os passos de ativar o modo profissional e começa a realizar tarefas.</p>
                                    </div>
                                </div>
                                
                                
                            </div>
                            <div className={styles.upper}>
                                    <div className={styles.upper_side_wrapper} style={{marginRight:'20px'}}>
                                        <div className={styles.upper_side_text_helper}>
                                            <p className={styles.upper_side_text}>Quero publicar a minha tarefa e ser contactado por profissionais</p>
                                        </div>
                                    </div>
                                
                                <div className={styles.upper_side_wrapper}>
                                    <div className={styles.upper_side_text_helper} style={{borderColor:"#FF785A"}}>
                                        <p className={styles.upper_side_text}>Quero realizar tarefas e expôr o meu negócio</p>
                                    </div>                                    
                                </div>
                            </div>
                            <div className={styles.upper_two} style={{marginTop:'0px'}}>
                                <div className={styles.upper_side_wrapper}>
                                    <img src={home_arrow_left} className={styles.home_arrow}/>
                                </div>
                                
                                <div className={styles.upper_side_wrapper}>
                                    <img src={home_arrow_right} className={styles.home_arrow}/>
                                </div>
                            </div>
                            <div className={styles.upper_two}>
                                <div className={styles.upper_side_wrapper} style={{display:'block', width:"80%"}}>
                                    <div className={styles.upper_side}>
                                        <div className={styles.upper_button} style={{backgroundColor:"#ffffff", borderColor:"#ffffff"}} onClick={() => {
                                            handleMoveAuth(0)
                                            window.localStorage.setItem('dismissedBanner', true)
                                        }} >
                                            <AddBoxIcon className={styles.section_img_mini_mini} style={{color:"#161F28"}}/>
                                            <span className={styles.section_publicar_mini} style={{color:"#161F28"}}>CRIAR CONTA</span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={styles.upper_side_wrapper}>
                                    <div className={styles.upper_side}>
                                        <span className={styles.upper_button} onClick={() => setWorkerBanner(true)} style={{backgroundColor:"#ffffff",  borderColor:"#ffffff"}}>
                                        <EmojiPeopleIcon className={styles.section_img_mini_mini} style={{transform: 'scaleX(-1)', color:"#FF785A"}}/>
                                            <span className={styles.section_publicar_mini} style={{color:"#FF785A"}}>CRIAR CONTA MODO PROFISSIONAL</span>
                                        </span>
                                    </div>
                                </div> */}
                            </div>
                            <span className={styles.upper_wrapper_close} onClick={() => {
                                setNewPopup(false)
                                window.localStorage.setItem('dismissedBanner', true)
                            }}>FECHAR</span>
                        </div>
                        
                </CSSTransition>
                <div className={styles.home_hero}>
                    {
                        hasUnreadTexts?
                        <div className={styles.has_messages} onClick={() => navigate(`/user?t=messages`)}>  
                            <p>Tens mensagens por ler</p>
                        </div> 
                        :null
                    }                    
                               
                    <div className={styles.home_hero_inner}>
                        {
                            loaded?
                            <img src={hero_1} className={styles.hero_image}/>
                            :null
                        }
                        {
                            loaded?
                            <div className={styles.main_wrapper}>
                                <span className={styles.main_wrapper_title}>Conectamos tarefas a</span>
                                <span className={styles.main_wrapper_title}>profissionais de confiança</span>
                                <div className={styles.main_select}>
                                    <div className={styles.main_select_element} style={{backgroundColor:searchPosition===0?first?.value==="profissionais"?"#FF785A":"#0358e5":''}} onClick={() => setSearchPosition(0)}>
                                        <SearchIcon className={styles.element_icon}/>
                                        <span className={styles.element_text}>Procurar</span>
                                    </div>
                                    <div className={styles.main_select_element} style={{backgroundColor:searchPosition===1?'#0358e5':''}} onClick={() => setSearchPosition(1)}>
                                        <AddIcon className={styles.element_icon}/>
                                        <span className={styles.element_text}>Publicar</span>
                                    </div>
                                </div>
                                <div className={styles.main}>
                                    <div className={styles.zone_wrapper}>
                                        <div className={styles.zone}>
                                            <div className={styles.zone_select}>
                                                <SelectHomeMain
                                                    menuOpen={() => {
                                                        if(windowDimensions.width <= 768)
                                                            setTimeout(() => {
                                                                select_profissionais.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                            }, 200)
                                                        else
                                                            setTimeout(() => {
                                                                top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                            }, 200)

                                                        setBackdrop(true)
                                                    }}
                                                    menuClose={() => {
                                                        setBackdrop(false)
                                                        // if(windowDimensions.width <= 768)
                                                        //     top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                    }}
                                                    options={firstOptions}
                                                    option={first}
                                                    smallWindow={windowDimensions.width <= 1024}
                                                    mediumWindow={windowDimensions.width <= 1440}
                                                    changeOption={val => {
                                                        // if(windowDimensions.width <= 768)
                                                        //     top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                        setFirst(val)
                                                        setBackdrop(false)
                                                    }}/>
                                            </div>
                                        </div>
                                        <span className={styles.zone_seperator}></span>
                                        <div className={styles.zone}>
                                            <div className={styles.zone_select}>
                                                <div className={styles.placeholder_title_wrapper}>
                                                    <span className={styles.placeholder_title}>Tipo de serviço</span>
                                                </div>
                                                <SelectHome 
                                                    menuOpen={() => {
                                                        if(windowDimensions.width <= 768)
                                                            setTimeout(() => {
                                                                select_profissionais.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                            }, 200)
                                                        else
                                                            setTimeout(() => {
                                                                top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                            }, 200)

                                                        setBackdrop(true)
                                                    }}
                                                    menuClose={() => {
                                                        setBackdrop(false)
                                                        // if(windowDimensions.width <= 768)
                                                        //     top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                    }}
                                                    home={true}
                                                    profs={true}
                                                    options={profissoesGrouped}
                                                    optionFirst={first} 
                                                    option={second} 
                                                    smallWindow={windowDimensions.width <= 1024}
                                                    mediumWindow={windowDimensions.width <= 1440}
                                                    changeOption={val => {
                                                        // if(windowDimensions.width <= 768)
                                                        //     top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                        setSecond(val)
                                                        setBackdrop(false)
                                                    }}
                                                    placeholder={'Tipo de serviço'}
                                                    placeholder_desc={'Pesquisa por um serviço'}/>
                                            </div>
                                        </div>
                                        <span className={styles.zone_seperator}></span>
                                        <div className={styles.zone} ref={select_regioes}>
                                            <div className={styles.zone_select}>
                                                <div className={styles.placeholder_title_wrapper}>
                                                    <span className={styles.placeholder_title}>Região</span>
                                                </div>
                                                <SelectHome
                                                    menuOpen={() => {
                                                        if(windowDimensions.width <= 768)
                                                            setTimeout(() => {
                                                                select_regioes.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                            }, 200)
                                                    }}
                                                    menuClose={() => {
                                                        if(windowDimensions.width <= 768)
                                                            select_profissionais.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                    }}
                                                        
                                                    home={true}
                                                    regioes={true}
                                                    options={regioes}
                                                    optionFirst={first} 
                                                    option={third}
                                                    second={second}
                                                    smallWindow={windowDimensions.width <= 1024}
                                                    mediumWindow={windowDimensions.width <= 1440}
                                                    changeOption={val => {
                                                        if(windowDimensions.width <= 768)
                                                            select_profissionais.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                        setThird(val)}}
                                                    placeholder={'Região'}
                                                    placeholder_desc={'Pesquisa por um local'}/>
                                            </div>
                                        </div>
                                        <div onClick={() => {
                                                        searchHandler()
                                                    }} className={styles.search_wrapper} 
                                                    style={{backgroundColor:first?.value==="profissionais"?"#FF785A":"#0358e5",
                                                            borderColor:first?.value==="profissionais"?"#FF785A":"#0358e5"}}>
                                            <SearchIcon className={styles.zone_search_icon} style={{color:"#ffffff"}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className={styles.section_content} style={{backgroundColor:"transparent"}}>
                                <p className={styles.skeleton_content_in}></p>
                            </div>  
                        }
                        {
                            loaded?
                            <img src={hero_2} className={styles.hero_image}/>
                            :null
                        }
                    </div>

                </div>
                

                {
                    user?._id!=null && !emptyNotifications?
                    <div style={{width:'80%', margin: '0 auto', marginTop:'30px'}}>
                        <p className={styles.back_publish_title}>CENTRO DE NOTIFICAÇÕES</p>
                    </div>
                    
                    :null
                }
                {
                    user?._id!=null && !emptyNotifications?
                    <div className={styles.home_back_publish} style={{marginTop:'0px'}}>
                    {
                        <div className={styles.notification_area}>
                            {   
                                
                                mapWrapper()
                            }
                        </div>
                    }
                    </div>
                    :null
                }

                {/* <span className={styles.home_explorar} style={{marginBottom:'15px'}}>EXPLORAR</span> */}

                {/* ULTIMAS 5 TAREFAS */}
                {/* {
                    items?.length>0?
                    <div style={{width:'80%', margin: '0 auto', marginTop:'30px'}}>
                        <p className={styles.back_publish_title}>ÚLTIMAS TAREFAS PUBLICADAS</p>
                    </div>
                    
                    :null
                }
                {
                    loaded?
                        items?.length>0?
                            <div className={styles.home_back_publish} style={{marginTop:'0px'}}>
                                <div className={styles.notification_area} style={{paddingTop:0}}>
                                    {mapRowsToDisplay()}
                                </div>
                                
                            </div>
                        :null
                    :
                    <div>
                        <div className={styles.loading_skeleton}/>
                        <div className={styles.loading_skeleton}/>
                        <div className={styles.loading_skeleton}/>
                        <div className={styles.loading_skeleton}/>
                        <div className={styles.loading_skeleton}/>
                    </div>
                } */}
                
{/*                 
                <div className={styles.home_geral} style={{marginTop:'50px', marginBottom:'70px'}}>
                    {
                        loaded?
                        <p className={styles.back_publish_title}>VER</p>
                        :null
                    }
                    
                    {
                        user!=null&&user?._id!==null&&!user?.worker&&loaded?
                        <div className={styles.home_back_bottom}>
                            <div className={styles.section_content}>
                                <div className={styles.section_image_wrapper}>
                                    <EmojiPeopleIcon className={styles.section_img} style={{color:"#ffffff", transform: 'scaleX(-1)'}}/>
                                </div>
                                <span className={styles.section_image_text_title} style={{color:"#FF785A"}}>
                                    PROFISSIONAIS
                                </span>
                                <span className={styles.section_image_text}>
                                    Ver todos os profissionais disponíveis
                                </span>
                                <div className={styles.section_button_right} onClick={() => navigate('/main/publications/profissionais')}>
                                    <p className={styles.section_title_right} style={{fontSize: '0.9rem', color:"#FF785A"}}>
                                        VER PROFISSIONAIS
                                    </p>
                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles.home_back_bottom}>
                            <div className={styles.section_one}>
                                {
                                    loaded?
                                    <div className={styles.section_content}>
                                        <div className={styles.section_image_wrapper}>
                                            <TitleIcon className={styles.section_img} style={{color:"white"}}/>
                                        </div>
                                        <span className={styles.section_image_text_title} style={{color:"#0358e5"}}>
                                            TAREFAS
                                        </span>
                                        <span className={styles.section_image_text}>
                                            Ver todas as tarefas disponíveis
                                        </span>
                                        <div className={styles.section_button} onClick={() => navigate('/main/publications/trabalhos')}>
                                            <p className={styles.section_title} style={{fontSize: '0.9rem', color:"#0358e5"}}>
                                                VER TAREFAS
                                            </p>
                                        </div>
                                    </div> 
                                    :
                                    <div className={styles.section_content}>
                                        <span className={styles.skeleton_content_in_img}></span>
                                        <p className={styles.skeleton_content_in}></p>
                                    </div>        
                                }
                            </div>
                            <span className={styles.section_spacer}></span>
                            {
                                user?.worker&&loaded?
                                <div className={styles.section_two}>
                                    <div className={styles.section_content}>
                                        <div className={styles.section_image_wrapper}>
                                            <AccessibilityIcon className={styles.section_img} style={{color:"#ffffff"}}/>
                                        </div>
                                        <span className={styles.section_image_text_title} style={{color:"#FF785A"}}>
                                            CONTA
                                        </span>
                                        <span className={styles.section_image_text}>
                                            Ver ou editar conta
                                        </span>
                                        <div className={styles.section_button_right} onClick={() => navigate('/user?t=conta')}>
                                            <p className={styles.section_title_right} style={{fontSize: '0.9rem', color:"#FF785A"}}>
                                                VER CONTA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                :
                                loaded?
                                <div className={styles.section_two}>
                                    <div className={styles.section_content}>
                                        <div className={styles.section_image_wrapper}>
                                            <EmojiPeopleIcon className={styles.section_img} style={{color:"#ffffff", transform: 'scaleX(-1)'}}/>
                                        </div>
                                        <span className={styles.section_image_text_title} style={{color:"#FF785A"}}>
                                            PROFISSIONAIS
                                        </span>
                                        <span className={styles.section_image_text}>
                                            Ver todos os profissionais disponíveis
                                        </span>
                                        <div className={styles.section_button_right} onClick={() => navigate('/main/publications/profissionais')}>
                                            <p className={styles.section_title_right} style={{fontSize: '0.9rem', color:"#FF785A"}}>
                                                VER PROFISSIONAIS
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={styles.section_two}>
                                    <div className={styles.section_content}>
                                        <span className={styles.skeleton_content_in_img}></span>
                                        <p className={styles.skeleton_content_in}></p>
                                    </div>
                                </div>
                                
                                
                            }
                        </div>
                    }
                </div>

                {
                    loaded?
                    <div className={`${styles.home_back_publish}`} style={{marginTop:'30px'}}>
                        {
                            user?._id===null||!user?
                            <p className={styles.back_publish_title}>TORNAR-ME PROFISSIONAL</p>
                            :null
                        }
                        {
                            user?._id===null||!user?
                            <div className={styles.back_publish_div} style={{backgroundColor:"#ffffff"}}
                                onClick={() => setWorkerBanner(true)}
                                >
                                <EmojiPeopleIcon className={styles.section_img_mini} style={{transform: 'scaleX(-1)', color:"#FF785A"}}/>
                                <span className={styles.section_publicar} style={{color:"#FF785A"}}>MODO PROFISSIONAL</span>
                            </div>
                            :null
                        }
                    </div>

                    :!loaded?
                    <div className={styles.section_content}>
                        <p className={styles.skeleton_content_in}></p>
                        <p className={styles.skeleton_content_in}></p>
                    </div>
                    :null
                } */}
                    
                <div className={styles.footer} style={{paddingBottom:window.adsbygoogle?"60px":"20px"}}>
                    <div className={styles.footer_div}>
                        <div className={styles.footer_div_column}>
                            <p className={styles.footer_div_text} style={{color: '#71848d', textDecoration:'none !important', cursor:'default'}}>APP Tarefas (brevemente)</p>
                            <p className={styles.footer_div_text} onClick={() => setContactosBanner(true)}>Contactos</p>
                            <p className={styles.footer_div_text} onClick={() => setSuggestionBanner(true)}>Dá uma sugestão</p>
                            <p className={styles.footer_div_text} onClick={() => setTosBanner(true)}>Termos de utilização</p>
                            <p className={styles.footer_div_text} onClick={() => setPpBanner(true)}>Política de privacidade</p>
                            <p className={styles.footer_div_text} onClick={() => setInformationBanner(true)}>Sou novo no TAREFAS</p>
                            <p className={styles.footer_div_text} style={{color:"#FF785A"}} onClick={() => setWorkerBanner(true)}>Tornar-me profissional</p>
                        </div>
                        <div className={styles.footer_div_column}>
                            <div>
                                <p className={styles.footer_div_text} style={{fontWeight:400, textDecoration:'none', cursor:"default"}}>Segue-nos nas redes:</p>
                                <div className={styles.footer_icon_div}>
                                    <InstagramIcon className={styles.footer_icon} onClick={() => window.open('https://instagram.com/tarefaspt', "_blank", "noreferrer")}/>
                                    <FacebookIcon className={styles.footer_icon} onClick={() => window.open('https://www.facebook.com/profile.php?id=61559666542359', "_blank", "noreferrer")}/>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
                <Tooltip effect='solid' place='top' id="home"/>
            </div>
            <InitializeGPT />
            <RequestAds/>
        </div>
    )
}

export default Home;