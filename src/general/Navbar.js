import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import {logout} from '../firebase/firebase'
import ChatIcon from '@mui/icons-material/Chat';
import UnpublishedOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { sendSignInLinkToEmailHandler } from '../firebase/firebase'

const Navbar = (props) => {

    const navigate = useNavigate()
    const [dropdown, setDropdown] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        console.log(props.userLoadAttempt);
        setLoaded(props.userLoadAttempt)
    }, [props.userLoadAttempt])

    const logoutHandler = () => {
        setDropdown(false)
        logout()
        navigate('/authentication')
    }

    return (
        <div className={styles.navbar} onClick={() => sendSignInLinkToEmailHandler(props.user.email)}>
            <div className={styles.flex}>
                <div className={styles.flex_end}>
                    <p className={styles.title} 
                        onClick={() => navigate('/')}>Logo</p>
                </div>
                    <div className={styles.flex_end}>
                        <div className={styles.flex_right}>
                            {
                                props.user?.type?
                                <span className={styles.user_button} onClick={() => {navigate('/main/publications/trabalhos')}}>
                                        TRABALHOS
                                </span>
                                :loaded?
                                <span className={styles.user_button} onClick={() => {navigate('/publicar?t=eletricista')}}>
                                    PUBLICAR
                                </span>
                                :
                                <span className={styles.skeleton_button}></span>
                                
                                
                            }
                            {
                                props.user?
                                <div className={styles.chat_div} onClick={() => navigate('/user?t=messages')}>
                                    {
                                        props.hasTexts?
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
                                    props.user?
                                    <div className={styles.user_main} 
                                            onMouseEnter={() => setDropdown(true)} 
                                            onMouseOut={() => setDropdown(false)}
                                            onMouseMove={() => setDropdown(true)} 
                                            >
 
                                        <div className={styles.user}>
                                            {
                                                props.hasSubscription!=null &&
                                                (props.incompleteUser&&props.user.type || !props.hasSubscription&&props.user.type)?
                                                <span className={styles.drop_div_notification_big}/>
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
                                                <FaceIcon sx={{fontSize: "30px"}} className={styles.user_icon}/>
                                                <span className={styles.drop_user_text}>{props.user.name} {props.user.surname}</span>
                                            </div>
                                            {
                                                props.user?.type===0?
                                                <div className={styles.drop_div_main} onClick={() => {
                                                    navigate('/user?t=publications')
                                                    setDropdown(false)}
                                                    }>
                                                    <div className={styles.drop_div}>
                                                        <div className={styles.drop_div_special}>
                                                            <div style={{display:"flex"}}>
                                                                <span className={styles.drop_div_text}>Publicações</span>
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
                                                            <div style={{display:"flex"}}>
                                                                <span className={styles.drop_div_text}>Perfil</span>
                                                            </div>
                                                            {
                                                                !props.incompleteUser&&props.user.type?
                                                                <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                                                :props.user.type?
                                                                <UnpublishedOutlinedIcon className={styles.off_icon}/>
                                                                :null
                                                            }
                                                            
                                                    </div>  
                                                </div>
                                            </div>
                                            {
                                                props.user?.type===1?
                                                <div className={styles.drop_div_main} onClick={() => {
                                                    navigate('/user?t=subscription')
                                                    setDropdown(false)}
                                                    }>
                                                    <div className={styles.drop_div}>
                                                        <div className={styles.drop_div_special}>
                                                            <div style={{display:"flex"}}>
                                                                <span className={styles.drop_div_text}>Subscrição</span>
                                                            </div>
                                                            {
                                                                props.hasSubscription?
                                                                <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                                                :props.user.type?
                                                                <UnpublishedOutlinedIcon className={styles.off_icon}/>
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
                                                    <span className={styles.drop_div_text}>Suporte</span>
                                                </div>
                                            </div>
                                        
                                            <div onClick={() => logoutHandler()} className={styles.drop_div_main} style={{borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                                                <div className={styles.drop_div}>
                                                    <span className={styles.drop_div_text}>Logout</span>
                                                </div>
                                            </div>
                                            </div>
                                            
                                            

                                        </div>
                    
                                    </div>
                                    :loaded?
                                    <p className={styles.user_login} 
                                    onClick={() => navigate('/authentication')}>
                                    Iniciar Sessão</p>
                                    :<span className={styles.skeleton_text}></span>
                                }
                            </div>
                            
                    </div>
                </div>               
            </div>
        </div>
    )
}

export default Navbar;

