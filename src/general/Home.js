import React, { useEffect, useRef, useState } from 'react'
import styles from './home.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import WorkerBanner from './workerBanner';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { CSSTransition } from 'react-transition-group';
import Sessao from '../transitions/sessao';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import SelectHomeOther from '../selects/selectHomeOther';
import { profissoesGrouped, regioes, regioesOptions, profissoesMap } from './util'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Tooltip } from 'react-tooltip';
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
import ChatIcon from '@mui/icons-material/Chat';
import FaceIcon from '@mui/icons-material/Face';
import axios from 'axios';
import ConstructionIcon from '@mui/icons-material/Construction';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import EmailUnverified from '@mui/icons-material/UnsubscribeOutlined';
import moment from 'moment';
import { motion } from 'framer-motion';

import { Carousel } from 'react-responsive-carousel';

import hero_1 from '../assets/new_assets/hero_1.png'
import hero_2 from '../assets/new_assets/hero_2.png'
import icon_1 from '../assets/new_assets/icon_1.png'
import icon_2 from '../assets/new_assets/icon_2.png'
import icon_3 from '../assets/new_assets/worker_small.png'
import icon_4 from '../assets/new_assets/tasks_small.png'
import more_1 from '../assets/new_assets/more_1.png'
import more_2 from '../assets/new_assets/more_2.png'
import rocket from '../assets/new_assets/rocket_launch.png'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    const user = useSelector(state => { return state.user })
    const chats = useSelector(state => { return state.chats })
    const api_url = useSelector(state => { return state.api_url })

    const user_email_verified = useSelector(state => { return state.user_email_verified })
    const worker_profile_complete = useSelector(state => { return state.worker_profile_complete })
    const worker_is_subscribed = useSelector(state => { return state.worker_is_subscribed })

    const [items, setItems] = useState([])
    const [workers, setWorkers] = useState([])
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
        if (window.localStorage.getItem('exploredHome') === null) {
            const interval = setInterval(() => {
                setShowArrow(true)
            }, 5000)

            return () => clearInterval(interval);
        }

        fetchJobs()
        fetchWorkers()

    }, []);

    useEffect(() => {
        if (!parseInt(localStorage.getItem('firstAccessMade')))
            navigate('/landing')

        let aux2 = window.localStorage.getItem('last_search_type')
        if (aux2 !== null) {
            if (aux2 === 'trabalhos')
                setFirst(firstOptions[0])
            else
                setFirst(firstOptions[1])
        }
        else if (user?.worker) setFirst(firstOptions[0])
        else if (user != null && user?._id != null) setFirst(firstOptions[0])

        if (location.state?.carry === "login") {
            setLoginPopup(true)
            setTimeout(() => setLoginPopup(false), 4000)
            navigate(location.pathname, {});
        }
        else if (location.state?.carry === "register") {
            setRegisterPopup(location.state?.skippedVerification ? "skippedVerification" : "didVerification")
            setTimeout(() => setRegisterPopup(false), 4000)
            navigate(location.pathname, {});
        }
        else if (location.state?.refreshWorker) {
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
        if (user) {
            setShowArrowFlag(false)
            axios.get(`${api_url}/user/get_user_by_mongo_id`, { params: { _id: user._id } })
                .then(res => {
                    if (res.data !== '') {
                        if (res.data?.chats?.length > 0) {
                            let chats_aux = JSON.parse(JSON.stringify(([...res.data.chats].sort(sortByTimestamp))))
                            dispatch(user_update_chats(chats_aux))
                        }
                    }
                })
        }

    }, [user])

    useEffect(() => {
        if (chats?.length > 0) {
            let clear = true
            let aux = []
            for (const el of chats) {
                if (user?._id === el.approacher_id && !el.approacher_read) {
                    aux.push(el)
                    clear = false
                }
                else if (user?._id === el.approached_id && !el.approached_read) {
                    aux.push(el)
                    clear = false
                }
            }
            if (clear) {
                setHasUnreadTexts(false)
                setUnreadTexts([])
            }
            else {
                setHasUnreadTexts(true)
                setUnreadTexts(aux)
            }
        }
        else {
            setHasUnreadTexts(false)
        }
    }, [user, chats])



    useEffect(() => {
        props.userLoadAttempt && setLoaded(true)
        if (!props.userLoggedIn && window.localStorage.getItem('dismissedBanner') === null) {
            setTimeout(() => {
                setNewPopup(true)
            }, 1000);
        }
        else {
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
        if (second && third) {
            navigate(`/main/publications/${first?.value}?work=${second?.value}&region=${third.value}`)
        }
        else if (second) {
            navigate(`/main/publications/${first?.value}?work=${second?.value}`)
        }
        else if (third) {
            navigate(`/main/publications/${first?.value}?region=${third.value}`)
        }
        else {
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
        return val.slice(0, 5)
    }

    const emptyNotifications = () => {
        return unreadTexts.length === 0 && (!user?.worker || worker_profile_complete && worker_is_subscribed && user_email_verified) && props.badPublications?.length === 0
    }

    const mapWrapper = () => {

        if (emptyNotifications)
            return (
                <div className={styles.notification_empty}>
                    <p className={styles.notification_empty_text}>Sem mensagens novas ou outras notificações, por enquanto.</p>
                </div>
            )
        else {
            return (
                <div>
                    {
                        (user?.worker && (!worker_profile_complete || !worker_is_subscribed)) || !user_email_verified ?
                            <div>
                                <div className={styles.banner} style={{ marginTop: hasUnreadTexts ? "3px" : "" }}>
                                    <p className={styles.banner_text}>Notificações de conta</p>
                                </div>
                                {mapNotifications()}
                            </div>
                            : null
                    }
                    {
                        props.badPublications?.length > 0 ?
                            <div>
                                <div className={styles.banner} style={{ marginTop: hasUnreadTexts ? "3px" : "", }}>
                                    <p className={styles.banner_text} style={{ backgroundColor: "#ff3b30" }}>Problema na Tarefa</p>
                                </div>
                                {mapBadPublications()}
                            </div>
                            : null
                    }
                    {
                        unreadTexts.length > 0 ?
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
                    el.approached_id !== user?._id ?
                        el.approached_type === 'worker' ?
                            `${styles.notification} ${styles.notification_worker}`
                            : `${styles.notification} ${styles.notification_user}`
                        :
                        el.approacher_type === 'worker' ?
                            `${styles.notification} ${styles.notification_worker}`
                            : `${styles.notification} ${styles.notification_user}`
                }
                    // onClick={() => navigate(`/user?t=messages&id=${el.chat_id}`)}
                    onClick={() => navigate(`/user?t=messages`)}
                >
                    <div className={styles.notification_left}>
                        <ChatIcon className={styles.notification_left_icon} />
                    </div>
                    <div className={styles.notification_right}>
                        <div className={styles.notification_right_column}>
                            <div className={styles.notification_right_flex}>
                                {
                                    el.approached_id !== user?._id ?
                                        el.approached_photoUrl !== "" ?
                                            <img src={el.approached_photoUrl} className={styles.notification_right_image} />
                                            :
                                            el.approached_type === "worker" ?
                                                <EmojiPeopleIcon className={styles.notification_right_image} style={{ transform: 'scaleX(-1)', color: "#E56144" }} />
                                                : <FaceIcon className={styles.notification_right_image} />
                                        :
                                        el.approacher_photoUrl !== "" ?
                                            <img src={el.approacher_photoUrl} className={styles.notification_right_image} />
                                            :
                                            el.approacher_type === "worker" ?
                                                <EmojiPeopleIcon className={styles.notification_right_image} style={{ transform: 'scaleX(-1)', color: "#E56144" }} />
                                                : <FaceIcon className={styles.notification_right_image} />
                                }
                                <p className={styles.notification_right_name}>{el.approached_id !== user?._id ? el.approached_name : el.approacher_name}</p>
                            </div>
                            <span className={styles.notification_right_text}>
                                {el.last_text.text}
                            </span>
                        </div>
                        <div className={styles.notification_right_column}>
                            {
                                el.reservation_title ?
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
                    !user_email_verified ?
                        <div className={styles.notification} onClick={() => navigate(`/user?t=conta`)}>
                            <div className={styles.notification_left}>
                                <EmailUnverified className={styles.notification_left_icon} />
                            </div>
                            <div className={styles.notification_short}>
                                <p className={styles.notification_short_text}>VERIFICA O TEU E-MAIL</p>
                            </div>
                        </div>
                        : null
                }
                {
                    user.worker && !worker_profile_complete ?
                        <div className={styles.notification} onClick={() => navigate(`/user?t=profissional`)}>
                            <div className={styles.notification_left}>
                                <DisplaySettingsIcon className={styles.notification_left_icon} />
                            </div>
                            <div className={styles.notification_short}>
                                <p className={styles.notification_short_text}>PREENCHE OS DETALHES DE PROFISSIONAL</p>
                            </div>
                        </div>
                        : null
                }
                {
                    user.worker && !worker_is_subscribed ?
                        <div className={styles.notification} onClick={() => navigate(`/user?t=profissional&st=subscription`)}>
                            <div className={styles.notification_left}>
                                <CardMembershipIcon className={styles.notification_left_icon} />
                            </div>
                            <div className={styles.notification_short}>
                                <p className={styles.notification_short_text}>ATIVA A TUA SUBSCRIÇÃO</p>
                            </div>
                        </div>
                        : null
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
                            <TitleIcon className={styles.notification_left_icon} />
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
        if (position > 50) {
            window.localStorage.setItem('exploredHome', true)
            setShowArrowFlag(false)
        }
    }

    const mapContentToDisplay = () => {
        return items.map((item, i) => {
            return (
                <div key={i} className={styles.content_item}
                    onClick={() => {
                        navigate(`/main/publications/publication?id=${item._id}`, {
                            state: {
                                fromUserPage: false,
                            }
                        }
                        )
                    }}>
                    <div className={styles.item}>
                        <div className={styles.item_top}>
                            <img className={styles.top_image} src={profissoesMap[item.workerType]?.img} />
                            <div className={styles.top_arrow_wrapper}>
                                <ArrowForwardIcon className={styles.top_arrow} />
                            </div>
                        </div>
                        <div className={styles.item_middle}>
                            <p className={styles.middle_title}>{item.title}</p>
                            <p className={styles.middle_desc}>{item.desc}</p>
                        </div>
                        <div className={styles.item_bottom}>
                            <LocationOnIcon className={styles.bottom_icon} />
                            <p className={styles.bottom_location}>{regioesOptions[item.district]}</p>
                        </div>
                    </div>

                </div>
            )
        })
    }

    const mapWorkersToDisplay = () => {
        return workers.map((item, i) => {
            return (
                <div key={i} className={styles.content_item_worker}
                    onClick={() => {
                        navigate(`/main/publications/profissional?id=${item._id}`, {
                            state: {
                                fromUserPage: false,
                            }
                        }
                        )
                    }}>
                    <div className={styles.worker}>
                        <div className={styles.worker_top}>
                            <img className={styles.worker_image} referrerPolicy="no-referrer" src={item.photoUrl} />
                        </div>
                        <div className={styles.worker_bottom}>
                            <div className={styles.worker_bottom_title}>
                                <p className={styles.middle_title_worker}>{item.name}</p>
                                <div className={styles.top_arrow_wrapper}>
                                    <ArrowForwardIcon className={styles.top_arrow} />
                                </div>
                            </div>
                            <div className={styles.worker_bottom_info_wrapper}>
                                <div className={styles.worker_bottom_info}>
                                    <ConstructionIcon className={styles.bottom_icon} />
                                    <div className={styles.worker_bottom_info_wrapper_deep}>
                                        <p className={styles.bottom_info}>{profissoesMap[item.trabalhos[0]]?.label}</p>
                                        {
                                            item.trabalhos?.length > 1 ?
                                                <p className={styles.bottom_info}> +{item.trabalhos?.length - 1}</p>
                                                : null
                                        }
                                    </div>
                                </div>
                                <div className={styles.worker_bottom_info}>
                                    <LocationOnIcon className={styles.bottom_icon} />
                                    <div className={styles.worker_bottom_info_wrapper_deep}>
                                        <p className={styles.bottom_info}>{regioesOptions[item.regioes[0]]}</p>
                                        {
                                            item.regioes?.length > 1 ?
                                                <p className={styles.bottom_info}> +{item.regioes?.length - 1}</p>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.item_bottom}>


                        </div>
                    </div>

                </div>
            )
        })
    }



    const fetchJobs = () => {
        axios.get(`${api_url}/reservations`, { params: { limit: 3 } }).then(res => {
            if (res.data !== null) {
                setItems(res.data.data)
            }
        })
    }

    const fetchWorkers = () => {
        axios.get(`${api_url}/workers`, { params: { limit: 3 } }).then(res => {
            if (res.data !== null) {
                setWorkers(res.data.data)
            }
        })
    }

    return (
        <div className={styles.home}>
            {backdrop ?
                <span className={styles.backdrop} />
                : null
            }
            <CSSTransition
                in={loginPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
            >
                <Sessao removePopin={() => setLoginPopup(false)} text={"Sessão iniciada com sucesso!"} />
            </CSSTransition>
            <CSSTransition
                in={registerPopup !== false}
                timeout={1000}
                classNames="transition"
                unmountOnExit
            >
                <Sessao removePopin={() => setRegisterPopup(false)} text={registerPopup === "skippedVerification" ? "Conta criada com sucesso! Não te esqueças de verificar o teu e-mail." : "Conta criada com sucesso!"} />
            </CSSTransition>
            <CSSTransition
                in={mensagemPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
            >{
                    <Sessao removePopin={() => setMensagemPopup(false)} text={"Completa o teu perfil!"} />
                }
            </CSSTransition>
            {
                workerBanner ?
                    <WorkerBanner
                        cancel={() => setWorkerBanner(false)} />
                    : null
            }
            {
                tosBanner ?
                    <TosBanner
                        confirm={() => {
                            setTosBanner(false)
                        }}
                        cancel={() => setTosBanner(false)} />
                    : null
            }
            {
                ppBanner ?
                    <PpBanner
                        confirm={() => {
                            setPpBanner(false)
                        }}
                        cancel={() => setPpBanner(false)} />
                    : null
            }
            {
                suggestionBanner ?
                    <SuggestionBanner
                        confirm={() => {
                            setSuggestionBanner(false)
                        }}
                        cancel={() => setSuggestionBanner(false)} />
                    : null
            }
            {
                contactosBanner ?
                    <ContactosBanner
                        confirm={() => {
                            setContactosBanner(false)
                        }}
                        cancel={() => setContactosBanner(false)} />
                    : null
            }
            {
                informationBanner ?
                    <InformationBanner
                        confirm={() => {
                            setInformationBanner(false)
                        }}
                        cancel={() => setInformationBanner(false)} />
                    : null
            }
            <div ref={top} className={styles.home_wrapper} onScroll={val => {
                showArrowFlag && handleScroll(val)
            }}>
                {/* {
                    showArrowFlag ?
                        <div className={styles.arrow_wrapper_2} style={{ opacity: showArrow ? 1 : 0 }}>
                            <p className={styles.arrow_wrapper_text}>Explora o resto da página!</p>
                            <div className={styles.arrow_wrapper_div}>
                                <ArrowDownwardIcon className={styles.arrow_wrapper_icon} />
                            </div>
                        </div>
                        : null
                } */}
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
                <div className={styles.home_hero}>
                    {/* {
                        hasUnreadTexts ?
                            <div className={styles.has_messages} onClick={() => navigate(`/user?t=messages`)}>
                                <p>Tens mensagens por ler</p>
                            </div>
                            : null
                    } */}

                    <div className={styles.home_hero_inner}>
                        {
                            loaded ?
                                <img src={hero_1} className={styles.hero_image} />
                                : null
                        }
                        {
                            loaded ?
                                <div className={styles.main_wrapper}>
                                    <span className={styles.main_wrapper_title}>Conectamos tarefas a</span>
                                    <span className={styles.main_wrapper_title}>profissionais</span>
                                    <div className={styles.main_select}>
                                        <div className={styles.main_select_element} style={{ backgroundColor: searchPosition === 0 ? first?.value === "profissionais" ? "#E56144" : "#0358e5" : '' }} onClick={() => setSearchPosition(0)}>
                                            <SearchIcon className={styles.element_icon} />
                                            <span className={styles.element_text}>Procurar</span>
                                        </div>
                                        <div className={styles.main_select_element} style={{ backgroundColor: searchPosition === 1 ? '#0358e5' : '' }} onClick={() => setSearchPosition(1)}>
                                            <AddIcon className={styles.element_icon} />
                                            <span className={styles.element_text}>Publicar</span>
                                        </div>
                                    </div>
                                    <div className={styles.main}>
                                        <motion.div
                                            style={{ display: searchPosition ? 'inherit' : 'none' }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: searchPosition === 1 ? 1 : 0 }}
                                            transition={{ duration: 0.15 }}
                                            className={styles.zone_wrapper}>
                                            <div className={styles.zone_publicar}>
                                                <p className={styles.zone_publicar_text}>Conta-nos o que precisas, o profissional trata do resto!</p>
                                            </div>
                                            <div className={styles.zone_publicar_right} onClick={() => {
                                                user?._id ? navigate(`/publicar`, {
                                                    state: {
                                                        carry: true
                                                        // publicar a seguir
                                                    }
                                                })
                                                    :
                                                    handleMoveAuth(0)
                                            }}>
                                                <p className={styles.zone_publicar_right_text}>
                                                    {user?._id ?
                                                        'Publicar'
                                                        : 'Começar'}
                                                </p>
                                                <div onClick={() => {
                                                    searchHandler()
                                                }} className={styles.zone_publicar_right_icon}>
                                                    <ArrowForwardIcon className={styles.zone_search_icon} style={{ color: "#ffffff", }} />
                                                </div>
                                            </div>

                                        </motion.div>
                                        <motion.div
                                            style={{ display: !searchPosition ? 'inherit' : 'none' }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: searchPosition === 0 ? 1 : 0 }}
                                            transition={{ duration: 0.15 }}
                                            className={styles.zone_wrapper}>
                                            <div className={styles.zone}>
                                                <div className={styles.zone_select} style={{width:'none'}}>
                                                    <SelectHomeMain
                                                        menuOpen={() => {
                                                            if (windowDimensions.width <= 768)
                                                                setTimeout(() => {
                                                                    select_profissionais.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
                                                                }, 200)
                                                            else
                                                                setTimeout(() => {
                                                                    top.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                                                                }, 200)

                                                            // setBackdrop(true)
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
                                                        }} />
                                                </div>
                                            </div>
                                            <span className={styles.zone_seperator}></span>
                                            <div className={styles.zone}>
                                                <div className={styles.zone_select}>
                                                    <div className={styles.placeholder_title_wrapper}>
                                                        <span className={styles.placeholder_title}>Tipo de serviço</span>
                                                    </div>
                                                    <SelectHomeOther
                                                        ref={select_profissionais}
                                                        menuOpen={() => {
                                                            if (windowDimensions.width <= 768)
                                                                setTimeout(() => {
                                                                    select_profissionais.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
                                                                }, 200)
                                                            else
                                                                setTimeout(() => {
                                                                    top.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                                                                }, 200)

                                                            // setBackdrop(true)
                                                        }}
                                                        menuClose={() => {
                                                            setBackdrop(false)
                                                            // if(windowDimensions.width <= 768)
                                                            //     top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                        }}
                                                        home={true}
                                                        professions={true}
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
                                                        placeholder_desc={'Pesquisa por um serviço'} />
                                                </div>
                                            </div>
                                            <span className={styles.zone_seperator}></span>
                                            <div className={styles.zone} ref={select_regioes}>
                                                <div className={styles.zone_select}>
                                                    <div className={styles.placeholder_title_wrapper}>
                                                        <span className={styles.placeholder_title}>Região</span>
                                                    </div>
                                                    <SelectHomeOther
                                                        menuOpen={() => {
                                                            if (windowDimensions.width <= 768)
                                                                setTimeout(() => {
                                                                    select_regioes.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
                                                                }, 200)
                                                        }}
                                                        menuClose={() => {
                                                            if (windowDimensions.width <= 768)
                                                                select_profissionais.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
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
                                                            if (windowDimensions.width <= 768)
                                                                select_profissionais.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
                                                            setThird(val)
                                                        }}
                                                        placeholder={'Região'}
                                                        placeholder_desc={'Pesquisa por um local'} />
                                                </div>
                                            </div>
                                            <div onClick={() => {
                                                searchHandler()
                                            }} className={styles.search_wrapper}
                                                style={{
                                                    backgroundColor: first?.value === "profissionais" ? "#E56144" : "#0358e5",
                                                    borderColor: first?.value === "profissionais" ? "#E56144" : "#0358e5"
                                                }}>
                                                <SearchIcon className={styles.zone_search_icon} style={{ color: "#ffffff" }} />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                :
                                <div className={styles.section_content} style={{ backgroundColor: "transparent" }}>
                                    <p className={styles.skeleton_content_in}></p>
                                </div>
                        }
                        {
                            loaded ?
                                <img src={hero_2} className={styles.hero_image} />
                                : null
                        }
                    </div>

                </div>

                <div className={styles.hero_separator}>
                    <div className={styles.hero_separator_wrapper}>
                        <div className={styles.separator_zone}>
                            <RocketLaunchIcon className={styles.sep_img} style={{color: first?.value === 'profissionais'?'#E56144':''}}/>
                            <p className={styles.sep_text}>Em destaque</p>
                        </div>
                        <div className={styles.separator_zone}>
                            <div className={styles.sep_button_wrapper}>
                                <div className={first?.value === 'profissionais' ? styles.sep_button_action : styles.sep_button}>
                                    <p className={styles.sep_button_text}>Canalização</p>
                                </div>
                            </div>
                            <div className={styles.sep_button_wrapper}>
                                <div className={first?.value === 'profissionais' ? styles.sep_button_action : styles.sep_button}>
                                    <p className={styles.sep_button_text}>Informática</p>
                                </div>
                            </div>
                            <div className={styles.sep_button_wrapper}>
                                <div className={first?.value === 'profissionais' ? styles.sep_button_action : styles.sep_button}>
                                    <p className={styles.sep_button_text}>Eletricista</p>
                                </div>
                            </div>
                            <div className={styles.sep_button_wrapper}>
                                <div className={first?.value === 'profissionais' ? styles.sep_button_action : styles.sep_button}>
                                    <p className={styles.sep_button_text}>Tradutor</p>
                                </div>
                            </div>
                            <div className={styles.sep_button_wrapper}>
                                <div className={first?.value === 'profissionais' ? styles.sep_button_action : styles.sep_button}>
                                    <p className={styles.sep_button_text}>Advocacia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    

                </div>

                <div className={styles.home_content}>
                    <div className={styles.more}>
                        <Carousel
                            autoPlay={false}
                            interval={5000}
                            showStatus={false}
                            showArrows={false}
                            infiniteLoop={true}
                            className={styles.more_carousel}
                            renderIndicator={(clickHandler, isSelected, index, label) => {
                                const indicatorStyles = {
                                    marginLeft: 10,
                                    cursor: "pointer",
                                    display: "inline-block",
                                    width: 8,
                                    height: 8,
                                    backgroundColor: isSelected ? "#FAFAFA" : "#ccc",
                                    borderRadius: "50%",
                                }
                                return (
                                    <div
                                        style={indicatorStyles}
                                        onClick={clickHandler}
                                        onKeyDown={clickHandler}
                                        value={index}
                                        key={index}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${label} ${index + 1}`}
                                        aria-selected={isSelected}
                                    />
                                )
                            }}
                        >
                            <div className={styles.more_content}>
                                <div className={styles.content_left}>
                                    <img className={styles.content_img} src={more_1} />
                                </div>
                                <div className={styles.content_right}>
                                    <div className={styles.content_right_top}>
                                        <p className={styles.content_title}>Encontra o profissional ideal</p>
                                        <p className={styles.content_description}>Publica a tua tarefa ou pesquisa entre os profissionais para encontrares a ajuda que precisas</p>
                                    </div>
                                    <div className={styles.content_right_bottom}>
                                        <div className={styles.content_button}>
                                            <p className={styles.content_button_text}>Publicar uma tarefa</p>
                                            <ArrowForwardIcon className={styles.content_button_icon} />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className={styles.more_content}>
                                <div className={styles.content_left}>
                                    <img className={styles.content_img} src={more_2} />
                                </div>
                                <div className={styles.content_right}>
                                    <div className={styles.content_right_top}>
                                        <p className={styles.content_title}>Dá visibilidade ao teu negócio</p>
                                        <p className={styles.content_description}>Encontra tarefas para realizar e mostra o teu trabalho através do teu perfil, atraindo mais clientes e oportunidades.</p>
                                    </div>
                                    <div className={styles.content_right_bottom}>
                                        <div className={styles.content_button}>
                                            <p className={styles.content_button_text}>Criar conta profissional</p>
                                            <ArrowForwardIcon className={styles.content_button_icon} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Carousel>
                    </div>
                    {/* 
                        {
                            user?._id != null && !emptyNotifications ?
                                <div style={{ width: '80%', margin: '0 auto', marginTop: '30px' }}>
                                    <p className={styles.back_publish_title}>CENTRO DE NOTIFICAÇÕES</p>
                                </div>

                                : null
                        }
                        {
                            user?._id != null && !emptyNotifications ?
                                <div className={styles.home_back_publish} style={{ marginTop: '0px' }}>
                                    {
                                        <div className={styles.notification_area}>
                                            {

                                                mapWrapper()
                                            }
                                        </div>
                                    }
                                </div>
                                : null
                        } */}

                    <div className={styles.explore}>
                        <div className={styles.explore_row} style={{ paddingTop: 0 }}>
                            <div className={styles.row_header}>
                                <div className={styles.header_widget_wrapper}>
                                    <img src={icon_4} className={styles.widget_image_tarefas} />
                                    <p className={styles.widget_title}>Tarefas</p>
                                </div>
                                <div className={styles.header_title_wrapper}>
                                    <p>Últimas tarefas <br />publicadas</p>
                                </div>
                                <div className={styles.header_button_wrapper}>
                                    <div className={styles.header_button}>Explorar tarefas</div>
                                </div>

                            </div>
                            <div className={styles.row_content}>
                                {
                                    loaded ?
                                        items?.length > 0 ?
                                            mapContentToDisplay()
                                            : null
                                        :
                                        <div className={styles.row_content_skeleton}>
                                            <div className={styles.content_item_skeleton} />
                                            <div className={styles.content_item_skeleton} />
                                            <div className={styles.content_item_skeleton} />
                                        </div>
                                }
                            </div>
                        </div>

                        <div className={styles.explore_row} style={{marginTop: 0}}>
                            <div className={styles.row_content}>
                                {
                                    loaded ?
                                        workers?.length > 0 ?
                                            mapWorkersToDisplay()
                                            : null
                                        :
                                        <div className={styles.row_content_skeleton}>
                                            <div className={styles.content_item_skeleton} />
                                            <div className={styles.content_item_skeleton} />
                                            <div className={styles.content_item_skeleton} />
                                        </div>
                                }
                            </div>
                            <div className={styles.row_header_right}>
                                <div className={styles.row_header} style={{ width: 'fit-content' }}>
                                    <div className={styles.header_widget_wrapper}>
                                        <img src={icon_3} className={`${styles.widget_image} ${styles.action}`} />
                                        <p className={`${styles.widget_title} ${styles.action}`}>Profissionais</p>
                                    </div>
                                    <div className={styles.header_title_wrapper}>
                                        <p>Deixa para <br />quem sabe</p>
                                    </div>
                                    <div className={styles.header_button_wrapper}>
                                        <div className={styles.header_button} style={{ backgroundColor: '#E56144' }}>Ver lista de profissionais</div>
                                        <p className={styles.header_worker_text}>Tornar-me um profissional</p>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                

                
                
                <span className={styles.footer_separator}/>

                <div className={styles.footer} style={{ paddingBottom: window.adsbygoogle ? "60px" : "20px" }}>
                    <div className={styles.footer_div}>
                        <div className={styles.footer_div_column}>
                            <p className={styles.footer_div_text_title}>Informações legais</p>
                            <p className={styles.footer_div_text} onClick={() => setTosBanner(true)}>Termos de utilização</p>
                            <p className={styles.footer_div_text} onClick={() => setPpBanner(true)}>Política de privacidade</p>
                        </div>
                        <div className={styles.footer_div_column}>
                            <p className={styles.footer_div_text_title}>Conta e profissionais</p>
                            <p className={styles.footer_div_text} onClick={() => setContactosBanner(true)}>Suporte</p>
                            <p className={styles.footer_div_text} style={{ color: "#E56144" }} onClick={() => setWorkerBanner(true)}>Tornar-me um profissional</p>
                        </div>
                        <div className={styles.footer_div_column}>
                            <p className={styles.footer_div_text_title}>Sugestões e contactos</p>
                            <p className={styles.footer_div_text} onClick={() => setSuggestionBanner(true)}>Dá uma sugestão</p>
                            <p className={styles.footer_div_text_no_style}>Outros assuntos: <span style={{ textDecoration: 'underline' }}>noreply@pt-tarefas.pt</span></p>
                        </div>
                        <div className={styles.footer_div_column}>
                            <div>
                                <p className={styles.footer_div_text_title}>Segue-nos nas redes:</p>
                                <div className={styles.footer_icon_div}>
                                    <InstagramIcon className={styles.footer_icon} onClick={() => window.open('https://instagram.com/tarefaspt', "_blank", "noreferrer")} />
                                    <FacebookIcon style={{marginLeft:'3px'}} className={styles.footer_icon} onClick={() => window.open('https://www.facebook.com/profile.php?id=61559666542359', "_blank", "noreferrer")} />
                                </div>
                                <p className={styles.footer_div_text_no_style} style={{ color: '#71848d' }}>APP Tarefas (brevemente)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Tooltip effect='solid' place='top' id="home" />
            </div>
            <InitializeGPT />
            <RequestAds />
        </div>
    )
}

export default Home;