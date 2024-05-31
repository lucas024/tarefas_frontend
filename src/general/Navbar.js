import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLocation, useNavigate } from 'react-router-dom';
import {logout} from '../firebase/firebase'
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {Tooltip} from 'react-tooltip';
import TitleIcon from '@mui/icons-material/Title';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useSelector, useDispatch } from 'react-redux'
import logo from '../assets/logo_inicio.png'
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SettingsIcon from '@mui/icons-material/Settings';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import EmailUnverified from '@mui/icons-material/UnsubscribeOutlined';


const Navbar = (props) => {
    const dispatch = useDispatch()

    const location = useLocation()
    const arr_pathname = location?.pathname?.split('/')

    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const worker_profile_complete = useSelector(state => {return state.worker_profile_complete})
    const user = useSelector(state => {return state.user})
    const chats = useSelector(state => {return state.chats})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})

    const navigate = useNavigate()
    const [dropdown, setDropdown] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [hasUnreadTexts, setHasUnreadTexts] = useState(false)

    const [display, setDisplay] = useState(true)

    useEffect(() => {
        setLoaded(props.userLoadAttempt)
        if(arr_pathname[1]==='confirm-email') setDisplay(false)
        else setDisplay(true)

    }, [props.userLoadAttempt])

    useEffect(() => {
        if(chats?.length>0){
            let clear = true
            for(const el of chats){
                //user
                if(user?.type===0&&!el.user_read){
                    setHasUnreadTexts(true)
                    clear = false
                    break
                }
                //worker
                else if(user?.type===1&&!el.worker_read){
                    setHasUnreadTexts(true)
                    clear = false
                    break
                }
            }
            if(clear) setHasUnreadTexts(false)
        }
    }, [user, chats])

    const logoutHandler = () => {
        setDropdown(false)
        logout()
        navigate('/authentication?type=1')
    }

    return (
        display?
        <div className={styles.navbar}>
            <div className={styles.flex}>
                <div className={styles.flex_end}>
                    <img className={styles.logo} src={logo}
                        onClick={() => navigate('/')}/>
                    <p></p>
                </div>
                    <div className={styles.flex_end}>
                        <div className={styles.flex_right}>
                            {
                                user?.admin?
                                <span className={styles.user_button} onClick={() => {navigate('/admin')}}>
                                        ADMIN
                                </span>
                                :loaded&&user?.worker?
                                <span className={styles.mode}>
                                        <EmojiPeopleIcon className={styles.mode_icon} style={{transform: 'scaleX(-1)'}}/>
                                        <span>MODO PROFISSIONAL</span>
                                </span> 
                                :loaded?
                                // <div className={styles.user_button_disabled} data-tooltip-id='navbar' data-tooltip-content="Por favor inicia sessão ou cria conta para publicares uma tarefa.">
                                //         <span className={styles.back_publish_div_frontdrop}></span>
                                //         <span>NOVA TAREFA</span>
                                // </div>
                                null
                                :
                                <span className={styles.mode}>
                                    <span className={styles.skeleton_button}></span>
                                </span>
                                
                                
                            }
                            {
                                user?._id?
                                <div className={styles.chat_div} onClick={() => navigate('/user?t=messages')}>
                                    {
                                        hasUnreadTexts?
                                        <span className={styles.chat_notification}></span>
                                        :null
                                    }   
                                    
                                    <ChatIcon className={styles.chat}/>
                                </div>
                                :loaded?
                                null
                                :
                                <span className={styles.skeleton_message}></span>
                            }
                            <div className={styles.flex_end}>
                                {
                                    user?._id?
                                    <div className={styles.user_main} 
                                            onMouseEnter={() => setDropdown(true)} 
                                            onMouseOut={() => setDropdown(false)}
                                            onMouseMove={() => setDropdown(true)} 
                                            >
 
                                        <div className={styles.user_wrapper} onMouseMove={() => setDropdown(true)} >
                                            
                                            <div className={styles.user}>
                                                <p className={styles.user_text} onClick={() => navigate('/user?t=conta')}>Área Pessoal</p>
                                                <div className={styles.user_short}>
                                                    <span className={styles.drop_div_notification}/>
                                                    <MenuIcon />
                                                    
                                                </div>
                                            </div>
                                            <div className={styles.disabled_icons_wrapper}>
                                                {
                                                    (user?.worker&&!worker_is_subscribed || user?.worker&&!worker_profile_complete || user?.worker&&!(user_phone_verified&&user_email_verified))?
                                                    <div className={styles.disabled_icons}>
                                                        {
                                                            !user_email_verified?
                                                            <EmailUnverified className={styles.disabled_icon} style={{margin:'0px 3px'}} onClick={() => {
                                                                setDropdown(false)
                                                                navigate('/user?t=conta')}}/>
                                                            :null
                                                        }
                                                        {
                                                            !worker_profile_complete?
                                                            <DisplaySettingsIcon className={styles.disabled_icon} style={{margin:'0px 3px'}} onClick={() => {
                                                                setDropdown(false)
                                                                navigate('/user?t=profissional')}}/> 
                                                            :null
                                                        }
                                                        {
                                                            !worker_is_subscribed?
                                                            <CardMembershipIcon className={styles.disabled_icon} style={{margin:'0px 3px'}} onClick={() => {
                                                                setDropdown(false)
                                                                navigate('/user?t=profissional&st=subscription')}}/> 
                                                            :null
                                                        }
                                                    </div>
                                                    :
                                                    (!user?.worker&&!(user_phone_verified&&user_email_verified))?
                                                    <div className={styles.disabled_icons}>
                                                        <EmailUnverified className={styles.disabled_icon} onClick={() => {
                                                            setDropdown(false)
                                                            navigate('/user?t=conta')}}/>     
                                                    </div>                                    
                                                    :null
                                                }
                                            </div>
                                            
                                            
                                        </div>
                                        <div hidden={!dropdown} onMouseMove={() => setDropdown(true)} >
                                            <div className={styles.dropdown_invis}>
                                            
                                            </div>
                                            <div className={styles.user_dropdown}>   
                                            <div className={styles.drop_user}>
                                                <span className={styles.drop_user_text}>{user?.name} {user?.surname}</span>
                                            </div>
                                            <div onClick={() =>{ 
                                                setDropdown(false)
                                                navigate('/user?t=conta')}} className={styles.drop_div_main}>
                                                <div className={styles.drop_div}>
                                                    <div className={styles.drop_div_special}>
                                                            <div className={styles.drop_div_flex}>
                                                                <SettingsIcon className={styles.drop_div_flex_icon}/>
                                                                <span className={styles.drop_div_text}>Conta</span>
                                                            </div>
                                                            <div className={styles.disabled_wrapper}>
                                                                {
                                                                    user&&user_email_verified&&user_phone_verified?
                                                                    null
                                                                    :<EmailUnverified className={styles.disabled_icon_small}/>
                                                                }
                                                            </div>
                                                            
                                                    </div>  
                                                </div>
                                            </div>
                                            <div className={styles.drop_div_main} onClick={() => {
                                                navigate('/user?t=publications')
                                                setDropdown(false)}
                                                }>
                                                <div className={styles.drop_div}>
                                                    <div className={styles.drop_div_special}>
                                                        <div className={styles.drop_div_flex}>
                                                            <TitleIcon className={styles.drop_div_flex_icon}/>
                                                            <span className={styles.drop_div_text}>Tarefas</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                                
                                            <div className={styles.drop_div_main} onClick={() => {
                                                navigate('/user?t=messages')
                                                setDropdown(false)}
                                                }>
                                                <div className={styles.drop_div}>
                                                    <div className={styles.drop_div_special}>
                                                        <div style={{display:"flex"}}>
                                                            <ChatOutlinedIcon className={styles.drop_div_flex_icon}/>
                                                            <span className={styles.drop_div_text}>Mensagens</span>
                                                        </div>
                                                        {
                                                            props.notifications?.length>0?
                                                            <span className={styles.drop_div_notification} />
                                                            :null
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.drop_div_main} onClick={() => {
                                                navigate('/user?t=profissional')
                                                setDropdown(false)}
                                                }>
                                                <div className={styles.drop_div}>
                                                    <div className={styles.drop_div_special}>
                                                        {
                                                            user.worker?
                                                            <div className={styles.drop_div_flex}>
                                                                <EmojiPeopleIcon className={styles.drop_div_flex_icon} style={{color:"#FF785A", transform: 'scaleX(-1)'}}/>
                                                                <span className={styles.drop_div_text} style={{color:"#FF785A"}}>Profissional</span>
                                                            </div>
                                                            :
                                                            <div className={styles.drop_div_flex}>
                                                                <span className={styles.drop_div_text_worker} style={{color:"#FF785A"}}>Tornar-me profissional</span>
                                                            </div>
                                                        }
                                                        {
                                                            user.worker?
                                                            <div className={styles.disabled_wrapper}>
                                                                {
                                                                    !worker_profile_complete?
                                                                    <DisplaySettingsIcon className={styles.disabled_icon_small}/> 
                                                                    :null
                                                                }
                                                                {
                                                                    !worker_is_subscribed?
                                                                    <CardMembershipIcon className={styles.disabled_icon_small}/>
                                                                    :null
                                                                }
                                                            </div>
                                                            :null
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div onClick={() =>{
                                                setDropdown(false)
                                                navigate('/user?t=support')}} className={styles.drop_div_main} style={{borderTop:"1px solid #ccc"}}>
                                                <div className={styles.drop_div}>
                                                    <SupportAgentIcon className={styles.drop_div_flex_icon}/>
                                                    <span className={styles.drop_div_text} style={{marginTop:'2px'}}>Suporte</span>
                                                </div>
                                            </div>
                                        
                                            <div onClick={() => logoutHandler()} className={styles.drop_div_main} style={{borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                                                <div className={styles.drop_div}>
                                                    <LogoutIcon className={styles.drop_div_flex_icon} style={{transform:'rotate(180deg)'}}/>
                                                    <span className={styles.drop_div_text} style={{marginTop:'1px'}}>Sair da Conta</span>
                                                </div>
                                            </div>
                                            </div>
                                            
                                            

                                        </div>
                    
                                    </div>
                                    :loaded?
                                    <div>
                                        <p className={styles.user_login} 
                                            onClick={() => navigate('/authentication?type=1')}>
                                            Iniciar Sessão</p>
                                        <div className={styles.user_login_short} onClick={() => navigate('/authentication?type=1')}>
                                            <LoginIcon className={styles.user_login_icon} />
                                        </div>
                                    </div>
                                    :<span className={styles.skeleton_text}></span>
                                }
                            </div>
                            
                    </div>
                </div>               
            </div>
            <Tooltip id={"navbar"} effect='solid' place='left'/>
        </div>
        :null
    )
}

export default Navbar;

