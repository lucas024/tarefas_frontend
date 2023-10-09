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
import {profissoes, profissoesPngs, regioes, regioesOptions} from './util'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import {Tooltip} from 'react-tooltip';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import BackHandIcon from '@mui/icons-material/BackHand';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';

const firstOptions = [
    { value: 'trabalhadores', label: 'Trabalhadores' },
    { value: 'trabalhos', label: 'Trabalhos' },
]


const Home = (props) => {
    const [workerBanner, setWorkerBanner] = useState(false)

    const [mensagemPopup, setMensagemPopup] = useState(false)
    const [loginPopup, setLoginPopup] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const [first, setFirst] = useState('trabalhadores')
    const [second, setSecond] = useState(null)
    const [third, setThird] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if(loaded&&props.user?.type&&props.incompleteUser){
            setMensagemPopup(true)
            setTimeout(() => setMensagemPopup(false), 4000)
        }
        else if(location.state?.carry){
            props.refreshUser()
            setLoginPopup(true)
            setTimeout(() => setLoginPopup(false), 4000)
            navigate(location.pathname, {}); 
        }
        else if(location.state?.refreshWorker){
            props.refreshWorker()
            setLoginPopup(true)
            setTimeout(() => setLoginPopup(false), 4000)
        }
        // Tooltip.rebuild()
    }, [props.incompleteUser, location, props.user, loaded])

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])


    useEffect(() => {
        // Confirm the link is a sign-in with email link.
        if (isSignInWithEmailLink(auth, location.pathname)) {
            console.log("yes");
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
                console.log(result.user)
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
            navigate(`/main/publications/${first}?work=${second}&region=${third}`)
        }
        else if(second){
            navigate(`/main/publications/${first}?work=${second}`)
        }
        else if(third){
            navigate(`/main/publications/${first}?region=${third}`)
        }
        else{
            navigate(`/main/publications/${first}`)
        }
        
    }

    const clearTopSearch = () => {
        setSecond(null)
        setThird(null)
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
                in={mensagemPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >{
                <Sessao text={"Complete o seu perfil!"}/>
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
                <div className={styles.home_back_top}>
                    <span className={styles.text_brand}>Serviços</span>
                    <span className={styles.text_title}>O que procura hoje no Serviços?</span>
                    {
                        loaded?
                        <div className={styles.main_wrapper}>
                            <div className={styles.main}>
                                <div className={styles.search_clear_wrapper} style={{backgroundColor:second||third?'#161F28':"#989898"}} onClick={() => clearTopSearch()}>
                                    <SearchOffIcon className={styles.search_clear_icon}/>
                                </div>
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{backgroundColor:first==="trabalhadores"?"#FF785A":"#0358e5", borderColor:first==="trabalhadores"?"#FF785A":"#0358e5"}}>
                                        {
                                            first==="trabalhadores"?
                                            <BackHandIcon className={styles.zone_person_icon} style={{transform: 'scaleX(-1)'}}/>
                                            :
                                            <AssignmentIcon className={styles.zone_build_icon}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome 
                                            options={firstOptions} 
                                            optionFirst={first} 
                                            option={first} 
                                            changeOption={val => setFirst(val)}
                                            placeholder={"Secção..."}/>
                                    </div>
                                </div>
                                <div className={styles.zone_arrow_div}>
                                    <span className={first==="trabalhos"?second?styles.zone_arrow_trabalhos:styles.zone_arrow_trabalhos_half
                                                    :second?styles.zone_arrow_trabalhadores:styles.zone_arrow_trabalhadores_half}>
                                        {/* arrow */}
                                    </span>
                                </div>
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{borderColor:second?first==="trabalhadores"?"#FF785A":"#0358e5":"#989898",
                                                backgroundColor:second?'#161F28':'#989898'}}>
                                        {
                                            second? 
                                            <img src={profissoesPngs[second]} className={styles.zone_image_prof}/>
                                            :
                                            <BuildIcon className={styles.zone_build_icon}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome 
                                            options={profissoes}
                                            optionFirst={first} 
                                            option={second} 
                                            changeOption={val => setSecond(val)}
                                            placeholder={'Serviço...'}/>
                                    </div>
                                </div>
                                <div className={styles.zone_arrow_div}>
                                    <span className={second&&third?first==='trabalhos'?styles.zone_arrow_trabalhos:styles.zone_arrow_trabalhadores
                                                    :second?first==='trabalhos'?styles.zone_arrow_trabalhos_half:styles.zone_arrow_trabalhadores_half
                                                    :third?first==='trabalhos'?styles.zone_arrow_trabalhos_half_reverse:styles.zone_arrow_trabalhadores_half_reverse
                                                    :styles.zone_arrow_none}>
                                        {/* arrow */}
                                    </span>
                                </div>
                                <div className={styles.zone}>
                                    <div className={styles.zone_img} style={{borderColor:third?first==="trabalhadores"?"#FF785A":"#0358e5":"#989898",
                                                backgroundColor:third?'#161F28':'#989898'}}>
                                        {
                                            third? 
                                            <span className={styles.zone_image_region}>{regioesOptions[third]}</span>
                                            :
                                            <LocationOnIcon className={styles.zone_build_icon}/>
                                        }
                                    </div>
                                    <div className={styles.zone_select}>
                                        <SelectHome 
                                            options={regioes}
                                            optionFirst={first} 
                                            option={third} 
                                            changeOption={val => setThird(val)}
                                            placeholder={'Distrito...'}/>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => second&&third&&searchHandler()} className={second&&third?styles.search_wrapper:styles.search_wrapper_disabled} 
                                            style={{backgroundColor:second&&third?first==="trabalhadores"?"#FF785A":"#0358e5":"#ffffff20"}}>
                                <SearchIcon className={styles.zone_search_icon} style={{color:second&&third?"white":"#989898"}}/>
                                <span className={styles.zone_search_button} style={{color:second&&third?"white":"#989898"}}>PROCURAR</span>
                            </div>
                        </div>
                        
                        :
                        <div className={styles.section_content} style={{backgroundColor:"transparent"}}>
                            <p className={styles.skeleton_content_in}></p>
                        </div>  
                    }
                    
                </div>
                <div className={styles.home_divider} style={{backgroundColor:first==="trabalhadores"?"#FF785A":"#0358e5"}}>_</div>
                <span className={styles.home_explorar}>EXPLORAR</span>
                <div className={styles.home_back_publish}>
                    <p className={styles.back_publish_title}>PUBLICAR</p>

                    {
                        loaded?
                        <div className={styles.back_publish_div}>
                            {
                                props.user?.type===1?
                                <span className={styles.back_publish_div_frontdrop}></span>
                                :null
                            }
                            <PostAddIcon className={styles.section_img_mini}/>
                            <span className={styles.back_publish_text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.</span>
                            {
                                props.user?
                                <span className={styles.back_publish_button} style={{fontSize:'1rem'}} onClick={() => navigate('/publicar')}>PUBLICAR</span>
                                :
                                <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                    <div className={styles.back_publish_button_disabled} data-tooltip-id='home' data-tooltip-content="Por favor crie conta ou inicie sessão para publicar.">
                                        <span className={styles.back_publish_div_frontdrop}></span>
                                        <span style={{fontSize:'0.9rem'}}>PUBLICAR</span>
                                    </div>
                                    <span className={styles.auth}><span onClick={() => handleMoveAuth(1)} className={styles.auth_specific}>Iniciar Sessão</span> | <span onClick={() => handleMoveAuth(0)} className={styles.auth_specific}>Criar Conta</span></span>
                                </div>
                            }
                        </div>
                        :
                        <div className={styles.section_content}>
                            <p className={styles.skeleton_content_in}></p>
                            <p className={styles.skeleton_content_in}></p>
                        </div>    
                    }
                    
                </div>
                
                <div className={styles.home_geral}>
                    <p className={styles.back_publish_title}>VER</p>
                    <div className={styles.home_back_bottom}>
                        <div className={styles.section_one}>
                            {
                                props.user || loaded?
                                <div className={styles.section_content}>
                                    <div className={styles.section_image_wrapper}>
                                        <AssignmentIcon className={styles.section_img}/>
                                    </div>
                                    <span className={styles.section_image_text_title}>
                                        TRABALHOS
                                    </span>
                                    <span className={styles.section_image_text}>
                                        Ver todos os trabalhos disponíveis
                                    </span>
                                    <div className={styles.section_button} onClick={() => navigate('/main/publications/trabalhos')}>
                                        <p className={styles.section_title} style={{fontSize: '0.9rem'}}>
                                            VER TRABALHOS
                                        </p>
                                    </div>
                                </div> 
                                :
                                <div className={styles.section_content}>
                                    <span className={styles.skeleton_content_in_img}></span>
                                    <p className={styles.skeleton_content_in}></p>
                                    <p className={styles.skeleton_content_in}></p>
                                </div>        
                            }
                        </div>
                        <span className={styles.section_spacer}></span>
                        {
                            props.user?.type===1?
                            <div className={styles.section_two}>
                                <div className={styles.section_content}>
                                    <div className={styles.section_image_wrapper}>
                                        <AccessibilityIcon className={styles.section_img} style={{color:"#FF785A"}}/>
                                    </div>
                                    <span className={styles.section_image_text_title}>
                                        PERFIL
                                    </span>
                                    <span className={styles.section_image_text}>
                                        Ver ou editar perfil
                                    </span>
                                    <div className={styles.section_button} onClick={() => navigate('/user?t=personal')}>
                                        <p className={styles.section_title} style={{fontSize: '0.9rem'}}>
                                            VER PERFIL
                                        </p>
                                    </div>
                                </div>
                            </div>
                            :
                            props.user?.type===0 || loaded?
                            <div className={styles.section_two}>
                                <div className={styles.section_content}>
                                    <div className={styles.section_image_wrapper}>
                                        <BackHandIcon className={styles.section_img} style={{color:"#FF785A", transform: 'scaleX(-1)'}}/>
                                    </div>
                                    <span className={styles.section_image_text_title}>
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
                                    <p className={styles.skeleton_content_in}></p>
                                </div>
                            </div>
                            
                            
                        }
                    </div>
                </div>
                <div className={styles.back_bottom_trabalhador}>
                    <div className={styles.home_back_publish} style={{paddingBottom:"20px", marginTop:"10px"}}>
                        <span className={styles.back_publish_title} style={{color:"white", opacity:"0.9"}}>TRABALHADOR</span>

                        {
                            loaded?
                            <div className={styles.back_publish_div}>
                                <span className={styles.back_publish_text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.</span>
                                <span className={styles.back_publish_button_action} style={{fontSize: '0.9rem'}} onClick={() => setWorkerBanner(true)}>TORNAR-ME TRABALHADOR</span>
                            </div>
                            :
                            <div className={styles.section_content}>
                                <p className={styles.skeleton_content_in}></p>
                                <p className={styles.skeleton_content_in}></p>
                            </div>
                        }
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footer_div}>
                        <div className={styles.footer_div_1}>
                            <p className={styles.footer_div_text}>APP Serviços</p>
                        </div>
                        <div className={styles.footer_div_2}>
                            <p className={styles.footer_div_text}>Ajuda e contactos</p>
                        </div>
                        <div className={styles.footer_div_3}>
                            <div>
                                <p className={styles.footer_div_text_3}>Segue-nos nas redes:</p>
                                <div className={styles.footer_icon_div}>
                                    <InstagramIcon className={styles.footer_icon}/>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
                <Tooltip effect='solid' place='right' id="home"/>
            </div>
            

        </div>
    )
}

export default Home;