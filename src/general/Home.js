import React, { useEffect, useRef, useState } from 'react'
import styles from './home.module.css'
import PostAddIcon from '@mui/icons-material/PostAdd';
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import BackHandIcon from '@mui/icons-material/BackHand';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import TitleIcon from '@mui/icons-material/Title';
import { useDispatch, useSelector } from 'react-redux';
import { search_scroll_save, user_sort_chats, user_update_chats } from '../store';
import LoginIcon from '@mui/icons-material/Login';
import logo_text from '../assets/logo_text.png'
import logo_text_worker from '../assets/logo_text_worker.png'
import TosBanner from './tosBanner';
import SuggestionBanner from './suggestionBanner';
import ContactosBanner from './contactosBanner';
import ConstructionIcon from '@mui/icons-material/Construction';
import FacebookIcon from '@mui/icons-material/Facebook';
import ChatIcon from '@mui/icons-material/Chat';
import FaceIcon from '@mui/icons-material/Face';
import axios from 'axios';


import {
    DefineAdSlot,
    RequestAds,
    InitializeGPT
  } from '../adsense/google-publisher-tag';
import PpBanner from './ppBanner';


const firstOptions = [
    { value: 'profissionais', label: 'Profissionais' },
    { value: 'trabalhos', label: 'Tarefas' },
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

    const [workerBanner, setWorkerBanner] = useState(false)
    const [tosBanner, setTosBanner] = useState(false)
    const [ppBanner, setPpBanner] = useState(false)
    const [suggestionBanner, setSuggestionBanner] = useState(false)
    const [contactosBanner, setContactosBanner] = useState(false)
    const [hasUnreadTexts, setHasUnreadTexts] = useState(false)
    const [unreadTexts, setUnreadTexts] = useState([])

    const [mensagemPopup, setMensagemPopup] = useState(false)
    const [loginPopup, setLoginPopup] = useState(false)
    const [registerPopup, setRegisterPopup] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const [first, setFirst] = useState({ value: 'profissionais', label: 'Profissionais' })
    const [second, setSecond] = useState(null)
    const [third, setThird] = useState(null)

    const totalNotifications = [1, 2, 3]
    

    const location = useLocation()
    const navigate = useNavigate()

    const select_profissionais = useRef(null)
    const select_regioes = useRef(null)
    const top = useRef(null)

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        if(!parseInt(localStorage.getItem('firstAccessMade')))
            navigate('/landing')
            
        if(user?.type===1) setFirst({ value: 'trabalhos', label: 'Tarefas' })
        else if(location.state?.carry==="login"){
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
        if(user){
            if(user.type===1){
                axios.get(`${api_url}/worker/get_worker_by_mongo_id`, { params: {_id: user._id} })
                .then(res => {
                    if(res.data!==''){
                        if(res.data?.chats.length>0)
                        {
                            let chats_aux = JSON.parse(JSON.stringify(([...res.data.chats].sort(sortByTimestamp))))
                            dispatch(user_update_chats(chats_aux))
                        }
                            
                    } 
                })
            }
            else{
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
        }

    }, [user])

    useEffect(() => {
        if(chats?.length>0){
            let clear = true
            let aux = []
            for(const el of chats){
                //user
                if(user?.type===0&&!el.user_read){
                    aux.push(el)
                    clear = false
                }
                //worker
                else if(user?.type===1&&!el.worker_read){
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
    }, [props.userLoadAttempt])


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

    const mapNotifications = () => {
        return unreadTexts.map(el => {
            return (
                <div className={styles.notification} onClick={() => navigate(`/user?t=messages&id=${el.chat_id}`)}>
                    <div className={styles.notification_left}>
                        <ChatIcon className={styles.notification_left_icon}/>
                    </div>
                    <div className={styles.notification_right}>
                        <div className={styles.notification_right_column}>
                            <div className={styles.notification_right_flex}>
                                {
                                    el.last_text.origin_type===1?
                                    el.worker_photoUrl != ""?
                                        <img src={el.worker_photoUrl} className={styles.notification_right_image}/>
                                        :
                                        <FaceIcon className={styles.notification_right_image}/>
                                    :
                                    el.user_photoUrl != ""?
                                        <img src={el.user_photoUrl} className={styles.notification_right_image}/>
                                        :
                                        <FaceIcon className={styles.notification_right_image}/>
                                }
                                <p className={styles.notification_right_name}>{user?.type===0?el.worker_name:el.user_name}</p>
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
    
    return(
        <div className={styles.home}>
            <CSSTransition 
                in={loginPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao text={"Sessão iniciada com Sucesso!"}/>
            </CSSTransition>
            <CSSTransition 
                in={registerPopup!==false}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao text={registerPopup==="skippedVerification"?"Conta criada com sucesso! Não te esqueças de verificar o teu e-mail.":"Conta criada com sucesso!"}/>
            </CSSTransition>
            <CSSTransition 
                in={mensagemPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >{
                <Sessao text={"Completa o teu perfil!"}/>
                }
            </CSSTransition>
            {
                workerBanner?
                <WorkerBanner 
                    confirm={() => {
                        setWorkerBanner(false)
                        navigate('/authentication/worker?type=0')
                    }}
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
            <div ref={top} className={styles.home_back}>
                {
                    window.adsbygoogle?
                    <div>
                        <div className={styles.ad}>
                            <ins class="adsbygoogle"
                                className={styles.ad_inner}
                                data-ad-client="ca-pub-1542751279392735"
                                data-ad-slot="0"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins>
                            
                            <DefineAdSlot adUnit={0}/>
                        </div>
                        
                    </div>
                    :null
                }
           
                <div className={styles.home_back_top}>

                    
                    <img className={styles.text_brand} src={logo_text} style={{opacity:first?.value==='trabalhos'?1:0}}/>
                    <img className={styles.text_brand} src={logo_text_worker} style={{opacity:first?.value==='profissionais'?1:0}}/>
                    
                    <span className={styles.text_title}>Procuras <span className={styles.text_title_underscore} style={{textDecorationColor:"#FF785A"}}>profissionais</span> ou <span className={styles.text_title_underscore} style={{textDecorationColor:"#0358e5"}}>tarefas</span>?</span>
                    {
                        loaded?
                        <div className={styles.main_wrapper}>
                            <div className={styles.main}>
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{backgroundColor:first?.value==="profissionais"?"#FF785A":"#0358e5", borderColor:first?.value==="profissionais"?"#FF785A":"#0358e5"}}>
                                        {
                                            first?.value==="profissionais"?
                                            <EmojiPeopleIcon className={styles.zone_person_icon} style={{transform: 'scaleX(-1)', color:"#ffffff"}}/>
                                            :
                                            <TitleIcon className={styles.zone_build_icon} style={{color:"#ffffff"}}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        {/* <SelectHome
                                            menuOpen={() => {}}
                                            menuClose={() => {}}
                                            searcheable={false}
                                            home={true}
                                            options={firstOptions} 
                                            optionFirst={first} 
                                            option={first} 
                                            changeOption={val => setFirst(val)}
                                            placeholder={"Tipo"}/> */}
                                        <div className={styles.zone_select_buttons}>
                                            <span className={first?.value==="profissionais"?styles.zone_select_button:styles.zone_select_button_off_profissional}
                                                onClick={() => setFirst({ value: 'profissionais', label: 'Profissionais' })}
                                                style={{marginRight:'2px',
                                                        width:first?.value==="profissionais"?"80%":"20%",
                                                        backgroundColor:first?.value==="profissionais"?"#FF785A":"#FF785A20",
                                                        fontWeight:first?.value==="profissionais"?600:600,
                                                        color:first?.value==="profissionais"?'white':'#FF785Abb',
                                                        fontSize: first?.value==="profissionais"?'0.9rem':'0.8rem',
                                                        borderColor:"#FF785A"}}>
                                                            <span style={{position:'absolute', zIndex:3}}>{
                                                            first?.value==="profissionais"?
                                                            'PROFISSIONAIS'
                                                            :<EmojiPeopleIcon className={styles.zone_person_icon_small} style={{transform: 'scaleX(-1)'}}/>
                                                        }</span>
                                                        </span>

                                            <span className={first?.value==="trabalhos"?styles.zone_select_button:styles.zone_select_button_off} 
                                                onClick={() => setFirst({ value: 'trabalhos', label: 'Trabalhos' })}
                                                style={{marginLeft:'2px', 
                                                        width:first?.value==="trabalhos"?"80%":"20%",
                                                        backgroundColor:first?.value==="trabalhos"?"#0358e5":"#0358e520", 
                                                        fontWeight:first?.value==="trabalhos"?600:600,
                                                        fontSize: first?.value==="trabalhos"?'0.9rem':'0.8rem',
                                                        color:first?.value==="trabalhos"?'white':'#0358e5bb',
                                                        borderColor:"#0358e5"}}>
                                                            <span style={{position:'absolute', zIndex:3}}>
                                                            {
                                                                first?.value==="trabalhos"?
                                                                'TAREFAS'
                                                                :<TitleIcon className={styles.zone_person_icon_small} style={{transform: 'scaleX(-1)'}}/>
                                                            }
                                                            </span>
                                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.zone_arrow_div}>
                                    <span className={first?.value==="trabalhos"?second?.value?styles.zone_arrow_trabalhos:styles.zone_arrow_trabalhos_half
                                                    :second?.value?styles.zone_arrow_trabalhadores:styles.zone_arrow_trabalhadores_half}>
                                        {/* arrow */}
                                    </span>
                                </div>
                                <div className={styles.zone} ref={select_profissionais}>
                                    <div className={styles.zone_img} style={{borderColor:second?.value?first?.value==="profissionais"?"#FF785A":"#0358e5":"#252d36",
                                                backgroundColor:second?.value?'#161F28':'#252d36'}}>
                                        {
                                            second?.value? 
                                            <img src={second.img} className={styles.zone_image_prof}/>
                                            :
                                            <ConstructionIcon className={styles.zone_build_icon} style={{transform: 'scaleX(-1)'}}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome 
                                            menuOpen={() => {
                                                if(windowDimensions.width <= 768)
                                                    setTimeout(() => {
                                                        select_profissionais.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                    }, 200)
                                            }}
                                            menuClose={() => {
                                                if(windowDimensions.width <= 768)
                                                    top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})}}
                                            home={true}
                                            options={profissoesGrouped}
                                            optionFirst={first} 
                                            option={second} 
                                            changeOption={val => {
                                                top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                setSecond(val)
                                            }}
                                            placeholder={'serviço'}/>
                                    </div>
                                </div>
                                <div className={styles.zone_arrow_div}>
                                    <span className={second&&third?first?.value==='trabalhos'?styles.zone_arrow_trabalhos:styles.zone_arrow_trabalhadores
                                                    :second?first?.value==='trabalhos'?styles.zone_arrow_trabalhos_half:styles.zone_arrow_trabalhadores_half
                                                    :third?first?.value==='trabalhos'?styles.zone_arrow_trabalhos_half_reverse:styles.zone_arrow_trabalhadores_half_reverse
                                                    :styles.zone_arrow_none}>
                                        {/* arrow */}
                                    </span>
                                </div>
                                <div className={styles.zone} ref={select_regioes}>
                                    <div className={styles.zone_img} style={{borderColor:third?first.value==="profissionais"?"#FF785A":"#0358e5":"#252d36",
                                                backgroundColor:third?'#161F28':'#252d36'}}>
                                        {
                                            third? 
                                            <span className={styles.zone_image_region} style={{color:third.value==='online'?'#398606':'#fff'}}>{regioesOptions[third.value]}</span>
                                            :
                                            <LocationOnIcon className={styles.zone_build_icon}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome
                                            menuOpen={() => {
                                                if(windowDimensions.width <= 768)
                                                    setTimeout(() => {
                                                        select_regioes.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
                                                    }, 200)
                                            }}
                                            menuClose={() => top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})}
                                            home={true}
                                            regioes={true}
                                            options={regioes}
                                            optionFirst={first} 
                                            option={third} 
                                            changeOption={val => {
                                                top.current?.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                                                setThird(val)}}
                                            placeholder={'Região'}/>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => {
                                                // second&&third&&
                                                searchHandler()
                                            }} className={styles.search_wrapper} 
                                            style={{backgroundColor:first?.value==="profissionais"?"#FF785A":"#0358e5",
                                                    borderColor:first?.value==="profissionais"?"#FF785A":"#0358e5"}}>
                                <SearchIcon className={styles.zone_search_icon} style={{color:"#ffffff"}}/>
                                <span className={styles.zone_search_button} style={{color:"#ffffff", marginTop:'3px'}}>PROCURAR {first?.value==='profissionais'?'profissionais':'tarefas'}</span>
                            </div>
                            <div onClick={() => (second||third)&&clearTopSearch()} className={second||third?styles.search_clear_wrapper:styles.search_clear_wrapper_disabled} style={{borderColor:second||third?'#ffffff':"#ffffff80"}}>
                                {/* <SearchOffIcon className={styles.zone_search_icon} style={{color:second&&third?"#ffffff":"#ffffff90"}}/> */}
                                <span className={styles.zone_search_button} style={{color:second||third?'#ffffff':"#ffffff80"}}>LIMPAR</span>
                            </div>
                        </div>
                        
                        :
                        <div className={styles.section_content} style={{backgroundColor:"transparent"}}>
                            <p className={styles.skeleton_content_in}></p>
                        </div>  
                    }
                    
                </div>
                <div className={styles.home_divider} style={{backgroundColor:first?.value==="profissionais"?"#FF785A":"#0358e5"}}>_</div>
                <span className={styles.home_explorar}>EXPLORAR</span>
                {
                    loaded?
                    <div>
                        <div className={styles.home_back_publish}>
                            {
                                user?._id!=null?
                                <p className={styles.back_publish_title}>CENTRO DE NOTIFICAÇÕES</p>
                                :null
                            }
                            {
                                user?._id!=null?
                                <div className={styles.notification_area}>
                                    {
                                        unreadTexts.length>0?
                                        mapNotifications()
                                        :
                                        <div className={styles.notification_empty}>
                                            <p className={styles.notification_empty_text}>Sem mensagens novas ou notificações, por enquanto.</p>
                                        </div>
                                    }
                                </div>
                                :null
                            }
                        </div>

                        <div className={styles.home_back_publish}>
                            {
                                user?.type!==1?
                                <p className={styles.back_publish_title}>PUBLICAR</p>
                                :null
                            }
                            {
                                user?._id!==null&&user?.type===0?
                                <div className={styles.back_publish_div} onClick={() => navigate('/publicar/novo')}>
                                    <div className={styles.home_back_publish_wrapper}>
                                        <PostAddIcon className={styles.section_img_mini}/>
                                        <span className={styles.section_publicar}>PUBLICAR TAREFA</span>
                                    </div>
                                </div>
                                :
                                user?._id===null||!user?
                                <div className={styles.back_publish_div} style={{backgroundColor:"#0358e520", border:"2px solid #0358e5"}} onClick={() => handleMoveAuth(1)} 
                                    data-tooltip-id={'home'} data-tooltip-content="Por favor inicia sessão ou cria conta para publicares uma tarefa.">
                                    <LoginIcon className={styles.section_img_mini}/>
                                    <span className={styles.section_publicar} style={{color:"#0358e5"}}>INICIAR SESSÃO | CRIAR CONTA UTILIZADOR</span>
                                </div>
                                :null
                            }
                        </div>

                    </div>
                    :!loaded?
                    <div style={{marginTop:"50px"}}>
                        <div className={styles.section_content} style={{paddingBottom:"30px"}}>
                            <p className={styles.skeleton_content_in}></p>
                            <p className={styles.skeleton_content_in}></p>
                        </div>
                        <div className={styles.section_content} style={{marginTop:"30px", paddingBottom:"30px"}}>
                            <p className={styles.skeleton_content_in}></p>
                            <p className={styles.skeleton_content_in}></p>
                        </div>
                    </div>
                    :null
                }

                {
                    loaded?
                    <div>
                        <div className={styles.home_back_publish}>
                            {
                                user?._id===null||!user?
                                <p className={styles.back_publish_title}>PROFISSIONAL EM 3 PASSOS</p>
                                :null
                            }
                            {
                                user?._id===null||!user?
                                <div className={styles.back_publish_div} style={{backgroundColor:"#FF785A20", border:"2px solid #FF785A"}}
                                    onClick={() => setWorkerBanner(true)}
                                    >
                                    <EmojiPeopleIcon className={styles.section_img_mini} style={{transform: 'scaleX(-1)'}}/>
                                    <span className={styles.section_publicar} style={{color:"#FF785A"}}>TORNAR-ME UM PROFISSIONAL</span>
                                </div>
                                :null
                            }
                        </div>

                    </div>
                    :!loaded?
                    <div className={styles.section_content}>
                        <p className={styles.skeleton_content_in}></p>
                        <p className={styles.skeleton_content_in}></p>
                    </div>
                    :null
                }

                
                <div className={styles.home_geral}>
                    {
                        loaded?
                        <p className={styles.back_publish_title}>VER</p>
                        :null
                    }
                    
                    {
                        user?.type===0&&loaded?
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
                                    <p className={styles.section_title_right} style={{fontSize: '0.9rem'}}>
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
                                            <p className={styles.section_title} style={{fontSize: '0.9rem'}}>
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
                                user?.type===1&&loaded?
                                <div className={styles.section_two}>
                                    <div className={styles.section_content}>
                                        <div className={styles.section_image_wrapper}>
                                            <AccessibilityIcon className={styles.section_img} style={{color:"#ffffff"}}/>
                                        </div>
                                        <span className={styles.section_image_text_title} style={{color:"#FF785A"}}>
                                            PERFIL
                                        </span>
                                        <span className={styles.section_image_text}>
                                            Ver ou editar perfil
                                        </span>
                                        <div className={styles.section_button_right} onClick={() => navigate('/user?t=personal')}>
                                            <p className={styles.section_title_right} style={{fontSize: '0.9rem'}}>
                                                VER PERFIL
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
                                            <p className={styles.section_title_right} style={{fontSize: '0.9rem'}}>
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
                    
                <div className={styles.footer} style={{paddingBottom:window.adsbygoogle?"60px":"20px"}}>
                    <div className={styles.footer_div}>
                        <div className={styles.footer_div_column}>
                            <p className={styles.footer_div_text} style={{color: '#71848d'}}>APP Tarefas (brevemente)</p>
                            <p className={styles.footer_div_text} onClick={() => setContactosBanner(true)}>Contactos</p>
                            <p className={styles.footer_div_text} onClick={() => setSuggestionBanner(true)}>Dá uma sugestão</p>
                            <p className={styles.footer_div_text} onClick={() => setTosBanner(true)}>Termos de utilização</p>
                            <p className={styles.footer_div_text} onClick={() => setPpBanner(true)}>Política de privacidade</p>
                            <p className={styles.footer_div_text} style={{color:"#FF785A"}} onClick={() => setWorkerBanner(true)}>Tornar-me um profissional</p>
                        </div>
                        <div className={styles.footer_div_column}>
                            <div>
                                <p className={styles.footer_div_text} style={{fontWeight:400}}>Segue-nos nas redes:</p>
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