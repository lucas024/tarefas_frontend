import React, { useEffect, useState } from 'react'
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
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import {Tooltip} from 'react-tooltip';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import BackHandIcon from '@mui/icons-material/BackHand';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import { useDispatch, useSelector } from 'react-redux';
import { search_scroll_save } from '../store';
import Welcome from './welcome'

import logo_text from '../assets/logo_text.png'
import logo_text_worker from '../assets/logo_text_worker.png'

const firstOptions = [
    { value: 'trabalhadores', label: 'Trabalhadores' },
    { value: 'trabalhos', label: 'Tarefas' },
]


const Home = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => {return state.user})

    const [workerBanner, setWorkerBanner] = useState(false)

    const [mensagemPopup, setMensagemPopup] = useState(false)
    const [loginPopup, setLoginPopup] = useState(false)
    const [registerPopup, setRegisterPopup] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const [first, setFirst] = useState({ value: 'trabalhadores', label: 'Trabalhadores' })
    const [second, setSecond] = useState(null)
    const [third, setThird] = useState(null)

    const [showWelcomeTrigger, setShowWelcomeTrigger] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if(!parseInt(localStorage.getItem('firstAccessMade')))
            setShowWelcomeTrigger(true)
        if(user.type===1) setFirst({ value: 'trabalhos', label: 'Tarefas' })
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
        // Tooltip.rebuild()
    }, [location, user, loaded])

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

    
    const showWelcomeHandler = () => {
        localStorage.setItem('firstAccessMade', 1)
        setShowWelcomeTrigger(false)
    }
    
    return(
        <div className={styles.home}>
            <CSSTransition 
                in={showWelcomeTrigger}
                timeout={1000}
                classNames="fade"
                unmountOnExit
                >
                <Welcome closeWelcome={() => showWelcomeHandler()}/>
            </CSSTransition>


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
                <Sessao text={registerPopup==="skippedVerification"?"Conta criada com sucesso! Não se esqueça de verificar os seus dados de contacto.":"Conta criada com sucesso!"}/>
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
            <div className={styles.home_back}>
            {/* <img className={styles.text_brand} src={logo_text}/> */}
                <div className={styles.home_back_top}>
                    <img className={styles.text_brand} src={logo_text} style={{opacity:first?.value==='trabalhos'?1:0}}/>
                    <img className={styles.text_brand} src={logo_text_worker} style={{opacity:first?.value==='trabalhadores'?1:0}}/>
                    
                    {/* <span className={styles.text_title}>O que procura hoje?</span> */}
                    {
                        loaded?
                        <div className={styles.main_wrapper}>
                            <div className={styles.main}>
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{backgroundColor:first?.value==="trabalhadores"?"#FF785A":"#0358e5", borderColor:first?.value==="trabalhadores"?"#FF785A":"#0358e5"}}>
                                        {
                                            first?.value==="trabalhadores"?
                                            <BackHandIcon className={styles.zone_person_icon} style={{transform: 'scaleX(-1)', color:"#ffffff"}}/>
                                            :
                                            <AssignmentIcon className={styles.zone_build_icon} style={{color:"#ffffff"}}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome
                                            home={true}
                                            options={firstOptions} 
                                            optionFirst={first} 
                                            option={first} 
                                            changeOption={val => setFirst(val)}
                                            placeholder={"Secção..."}/>
                                    </div>
                                </div>
                                <div className={styles.zone_arrow_div}>
                                    <span className={first?.value==="trabalhos"?second?.value?styles.zone_arrow_trabalhos:styles.zone_arrow_trabalhos_half
                                                    :second?.value?styles.zone_arrow_trabalhadores:styles.zone_arrow_trabalhadores_half}>
                                        {/* arrow */}
                                    </span>
                                </div>
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{borderColor:second?.value?first?.value==="trabalhadores"?"#FF785A":"#0358e5":"#252d36",
                                                backgroundColor:second?.value?'#161F28':'#252d36'}}>
                                        {
                                            second?.value? 
                                            <img src={second.img} className={styles.zone_image_prof}/>
                                            :
                                            <BuildIcon className={styles.zone_build_icon}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome 
                                            home={true}
                                            options={profissoesGrouped}
                                            optionFirst={first} 
                                            option={second} 
                                            changeOption={val => setSecond(val)}
                                            placeholder={'Tarefa...'}/>
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
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{borderColor:third?first.value==="trabalhadores"?"#FF785A":"#0358e5":"#252d36",
                                                backgroundColor:third?'#161F28':'#252d36'}}>
                                        {
                                            third? 
                                            <span className={styles.zone_image_region}>{regioesOptions[third.value]}</span>
                                            :
                                            <LocationOnIcon className={styles.zone_build_icon}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome
                                            home={true}
                                            options={regioes}
                                            optionFirst={first} 
                                            option={third} 
                                            changeOption={val => setThird(val)}
                                            placeholder={'Região...'}/>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => second&&third&&searchHandler()} className={second&&third?styles.search_wrapper:styles.search_wrapper_disabled} 
                                            style={{backgroundColor:second&&third?first?.value==="trabalhadores"?"#FF785A":"#0358e5":"#ffffff10",
                                                    borderColor:(!second||!third)?first?.value==="trabalhadores"?"#FF785A":"#0358e5":"#ffffff10"}}>
                                <SearchIcon className={styles.zone_search_icon} style={{color:second&&third?"#ffffff":"#ffffff90"}}/>
                                <span className={styles.zone_search_button} style={{color:second&&third?"#ffffff":"#ffffff90"}}>PROCURAR</span>
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
                <div className={styles.home_divider} style={{backgroundColor:first?.value==="trabalhadores"?"#FF785A":"#0358e5"}}>_</div>
                <span className={styles.home_explorar}>EXPLORAR</span>
                {
                    loaded?
                    <div>
                        <div className={styles.home_back_publish}>
                            <p className={styles.back_publish_title}>PUBLICAR</p>
                            {
                                user._id!=null?
                                <div className={styles.back_publish_div} onClick={() => navigate('/publicar/novo')}>
                                    <div className={styles.home_back_publish_wrapper}>
                                        <PostAddIcon className={styles.section_img_mini}/>
                                        <span className={styles.section_publicar}>NOVA TAREFA</span>
                                    </div>
                                </div>
                                :
                                <div className={styles.back_publish_div_disabled} data-tooltip-id={'home'} data-tooltip-content="Por favor entra na tua conta ou regista-te para publicares uma tarefa.">
                                    <div className={styles.home_back_publish_wrapper} style={{opacity:0.3}}>
                                        <PostAddIcon className={styles.section_img_mini}/>
                                        <span className={styles.section_publicar}>NOVA TAREFA</span>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            user._id!=null?
                            null
                            :
                            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", marginTop:'0px'}}>
                                <span className={styles.auth}><span onClick={() => handleMoveAuth(1)} className={styles.auth_specific}>Iniciar Sessão</span> | <span onClick={() => handleMoveAuth(0)} className={styles.auth_specific}>Criar Conta</span></span>
                            </div>
                        }
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
                    
                    <div className={styles.home_back_bottom}>
                        <div className={styles.section_one}>
                            {
                                user&&loaded?
                                <div className={styles.section_content}>
                                    <div className={styles.section_image_wrapper}>
                                        <AssignmentIcon className={styles.section_img} style={{color:"white"}}/>
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
                                        <BackHandIcon className={styles.section_img} style={{color:"#ffffff", transform: 'scaleX(-1)'}}/>
                                    </div>
                                    <span className={styles.section_image_text_title} style={{color:"#FF785A"}}>
                                        TRABALHADORES
                                    </span>
                                    <span className={styles.section_image_text}>
                                        Ver todos os trabalhadores disponíveis
                                    </span>
                                    <div className={styles.section_button_right} onClick={() => navigate('/main/publications/trabalhadores')}>
                                        <p className={styles.section_title_right} style={{fontSize: '0.9rem'}}>
                                            VER TRABALHADORES
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
                </div>
                <div className={styles.footer}>
                    <div className={styles.footer_div}>
                        <div className={styles.footer_div_column}>
                            <p className={styles.footer_div_text}>APP Tarefas</p>
                            <p className={styles.footer_div_text}>Ajuda e contactos</p>
                            <p className={styles.footer_div_text} style={{color:"#FF785A"}} onClick={() => setWorkerBanner(true)}>Tornar-me trabalhador</p>
                        </div>
                        {/* <div className={styles.footer_div_column}>
                            
                        </div> */}
                        <div className={styles.footer_div_column}>
                            <div>
                                <p className={styles.footer_div_text} style={{fontWeight:400}}>Segue-nos nas redes:</p>
                                <div className={styles.footer_icon_div}>
                                    <InstagramIcon className={styles.footer_icon}/>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
                <Tooltip effect='solid' place='top' id="home"/>
            </div>
            

        </div>
    )
}

export default Home;