import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import {logout} from '../firebase/firebase'
import ChatIcon from '@mui/icons-material/Chat';
import UnpublishedOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {Tooltip} from 'react-tooltip';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { useSelector, useDispatch } from 'react-redux'
import { user_reset } from '../store';

const Navbar = (props) => {
    const dispatch = useDispatch()

    const user_profile_complete = useSelector(state => {return state.user_profile_complete})
    const worker_profile_complete = useSelector(state => {return state.worker_profile_complete})
    const user = useSelector(state => {return state.user})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})

    const navigate = useNavigate()
    const [dropdown, setDropdown] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [hasUnreadTexts, setHasUnreadTexts] = useState(false)

    useEffect(() => {
        setLoaded(props.userLoadAttempt)
        console.log(user_profile_complete)
    }, [props.userLoadAttempt])

    useEffect(() => {
        if(user.chats?.length>0){
            for(const el of user.chats){
                //user
                if(user.type===0&&!el.user_read){
                    setHasUnreadTexts(true)
                    break
                }
                //worker
                else if(user.type===1&&!el.worker_read){
                    setHasUnreadTexts(true)
                    break
                }
            }
        }
    }, [user])

    const logoutHandler = () => {
        setDropdown(false)
        logout()
        dispatch(user_reset())
        navigate('/authentication?type=1')
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.flex}>
                <div className={styles.flex_end}>
                    <p className={styles.title} 
                        onClick={() => navigate('/')}>Logo</p>
                </div>
                    <div className={styles.flex_end}>
                        <div className={styles.flex_right}>
                            {
                                user?.admin?
                                <span className={styles.user_button} onClick={() => {navigate('/admin')}}>
                                        ADMIN
                                </span>
                                :user?.type?
                                <span className={styles.user_button} style={{backgroundColor:"#0358e5", borderColor:"#0358e5"}} onClick={() => {navigate('/main/publications/trabalhos')}}>
                                        TRABALHOS
                                </span>
                                :loaded&&user?
                                <span className={styles.user_button} style={{backgroundColor:"#0358e5", borderColor:"#0358e5"}} onClick={() => {navigate('/publicar/novo', {replace: true})}}>
                                        PUBLICAR
                                </span>
                                :loaded?
                                <div className={styles.user_button_disabled} data-tooltip-id='navbar' data-tooltip-content="Por favor crie conta ou inicie sessão para publicar.">
                                        <span className={styles.back_publish_div_frontdrop}></span>
                                        <span style={{fontSize:'0.9rem'}}>PUBLICAR</span>
                                </div>

                                
                                :
                                <span className={styles.skeleton_button}></span>
                                
                                
                            }
                            {
                                user._id?
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
                                    user._id?
                                    <div className={styles.user_main} 
                                            onMouseEnter={() => setDropdown(true)} 
                                            onMouseOut={() => setDropdown(false)}
                                            onMouseMove={() => setDropdown(true)} 
                                            >
 
                                        <div className={styles.user}>
                                            {
                                                (!worker_is_subscribed&&user.type || !worker_profile_complete&&user.type)?
                                                <span className={styles.drop_div_notification_text}>CONTA DESATIVADA</span>
                                                :
                                                (!user_profile_complete || user.phone==="")?
                                                <span className={styles.drop_div_notification_text} style={{marginRight:'10px'}}>VERIFICAR PERFIL</span>                                              
                                                :null
                                            }
                                            
                                            <p className={styles.user_text}>Àrea Pessoal</p>
                                            <KeyboardArrowDownIcon sx={{fontSize: "30px"}} className={styles.user_arrow}/>
                                        </div>
                                        <div hidden={!dropdown}>
                                            <div className={styles.dropdown_invis}>
                                            
                                            </div>
                                            <div className={styles.user_dropdown}>   
                                            <div className={styles.drop_user}>
                                                <span className={styles.drop_user_text}>{user.name} {user.surname}</span>
                                            </div>
                                            {
                                                user?.type===0?
                                                <div className={styles.drop_div_main} onClick={() => {
                                                    navigate('/user?t=publications')
                                                    setDropdown(false)}
                                                    }>
                                                    <div className={styles.drop_div}>
                                                        <div className={styles.drop_div_special}>
                                                            <div className={styles.drop_div_flex}>
                                                                <AssignmentOutlinedIcon className={styles.drop_div_flex_icon}/>
                                                                <span className={styles.drop_div_text}>Meus Trabalhos</span>
                                                                {/* <span className={styles.drop_div_number}>
                                                                    <span className={styles.drop_div_number_text}>1</span>
                                                                </span> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                null                                                
                                            }
                                            <div onClick={() =>{ 
                                                setDropdown(false)
                                                navigate('/user?t=personal')}} className={styles.drop_div_main}>
                                                <div className={styles.drop_div}>
                                                    <div className={styles.drop_div_special}>
                                                            <div className={styles.drop_div_flex}>
                                                                <AccountCircleOutlinedIcon className={styles.drop_div_flex_icon}/>
                                                                <span className={styles.drop_div_text}>Perfil</span>
                                                            </div>
                                                            {
                                                                worker_profile_complete||user_profile_complete?
                                                                <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                                                :!worker_profile_complete&&!user_profile_complete?
                                                                <span className={styles.drop_div_notification}/>
                                                                :null
                                                            }
                                                            
                                                    </div>  
                                                </div>
                                            </div>
                                            {
                                                user?.type===1?
                                                <div className={styles.drop_div_main} onClick={() => {
                                                    navigate('/user?t=subscription')
                                                    setDropdown(false)}
                                                    }>
                                                    <div className={styles.drop_div}>
                                                        <div className={styles.drop_div_special}>
                                                            <div className={styles.drop_div_flex}>
                                                                <CardMembershipIcon className={styles.drop_div_flex_icon}/>
                                                                <span className={styles.drop_div_text}>Subscrição</span>
                                                            </div>
                                                            {
                                                                !worker_is_subscribed?
                                                                <span className={styles.drop_div_notification}/>
                                                                :null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                :null
                                                
                                            }
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
                                    <p className={styles.user_login} 
                                    onClick={() => navigate('/authentication?type=1')}>
                                    Iniciar Sessão</p>
                                    :<span className={styles.skeleton_text}></span>
                                }
                            </div>
                            
                    </div>
                </div>               
            </div>
            <Tooltip id={"navbar"} effect='solid' place='left'/>
        </div>
    )
}

export default Navbar;

