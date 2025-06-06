import React, { useState, useEffect } from 'react'
import styles from '../general/sidebar.module.css'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from '../firebase/firebase'
import ChatIcon from '@mui/icons-material/Chat';
import CircleIcon from '@mui/icons-material/Circle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Loader from '../general/loader';
import TitleIcon from '@mui/icons-material/Title';
import { useSelector } from 'react-redux'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import SettingsIcon from '@mui/icons-material/Settings';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import EmailUnverified from '@mui/icons-material/UnsubscribeOutlined';
import moment from 'moment';

const UserSidebar = (props) => {
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user = useSelector(state => {return state.user})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})
    const worker_profile_complete = useSelector(state => {return state.worker_profile_complete})

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")
    const [loading, setLoading] = useState(false)
    const [loadingSub, setLoadingSub] = useState(false)
    const [daysTillCharge, setDaysTillCharge] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        setLoadingSub(true)
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications" || val === "support" ||  val === "conta" ||  val === "messages" || val === "profissional"){
            setSelectedSidebar(val)
        }

        if(user?.subscription)
            setDaysTillCharge(moment(user.subscription.end_date).diff(moment(new Date().getTime()), 'days'))

        if(user?._id){
            setLoading(false)
            setLoadingSub(false)
        }

    }, [searchParams, user])
    

    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/user`,
            search: `?t=${val}`
        })
    }

    const logoutHandler = () => {
        logout()
        navigate({
            pathname: `/authentication?type=1`,
        })
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_data_flex}>
                <div className={styles.align}>
                    {
                        user&&user.photoUrl?
                        <img className={styles.sidebar_img} src={user.photoUrl} referrerPolicy="no-referrer"/>
                        :!loading?
                        !user?.worker?
                        <FaceIcon className={styles.sidebar_img_icon}/>
                        :
                        <EmojiPeopleIcon className={styles.sidebar_img_icon} style={{transform: 'scaleX(-1)', padding:'5px', boxSizing:'border-box'}}/>
                        :null
                    }
                </div>
                <div className={styles.align}>
                    <span className={styles.name}>{user?user.name:null}</span>
                </div>
            </div>
            <div className={styles.flex_10px}></div>
            <div className={styles.sidebar_flex}>
                <div>
                <List
                    component="nav" className={styles.sidebar_list}
                >   
                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("conta")}>
                        {
                            selectedSidebar==="conta"?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <SettingsIcon sx={{color:"#ffffff", zIndex:1}} className={styles.sidebar_small_icon}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox}>Conta</span>
                                {
                                    !(user_phone_verified&&user_email_verified)?
                                    <EmailUnverified className={styles.notification_notification}/>
                                    :null
                                }
                            </div>
                            } sx={{color:"#ffffff"}}/>
                    </ListItemButton >

                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("publications")}>
                        {
                            selectedSidebar==="publications"?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <TitleIcon sx={{color:"#ffffff", zIndex:1}} className={styles.sidebar_small_icon}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Tarefas</span>} sx={{color:"#ffffff", zIndex:1}}/>
                    </ListItemButton >

                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("messages")}>
                        {
                            selectedSidebar==="messages"?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <ChatIcon sx={{color:"#fff", zIndex:1}} className={styles.sidebar_small_icon}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <span style={{display:"flex"}}>
                                <span className={styles.prox}>Mensagens</span>
                                {props.notifications?.length>0? <CircleIcon className={styles.drop_div_notification}></CircleIcon>:null}
                            </span>
                        } sx={{color:"#fff", zIndex:1}}/>
                    </ListItemButton >

                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("profissional")}>
                        {
                            selectedSidebar==="profissional"?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <EmojiPeopleIcon className={styles.sidebar_small_icon} style={{color:'#FF785A', transform: 'scaleX(-1)', zIndex:1}}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            user?.worker?
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox} style={{color:"#FF785A"}}>Profissional</span>
                                <div className={styles.notification_flex}>
                                    {
                                        !worker_profile_complete?
                                        <DisplaySettingsIcon className={styles.notification_notification}/>
                                        :null
                                    }
                                    {
                                        !worker_is_subscribed?
                                        <CardMembershipIcon className={styles.notification_notification}/>
                                        :null
                                    }
                                    
                                </div>
                            </div>
                            :
                            <span style={{display:"flex"}}>
                                <span className={styles.prox} style={{width:'max-content', color:"#FF785A"}}>Tornar-me profissional</span>
                            </span>
                        } sx={{color:"#fff", zIndex:1}}/>
                    </ListItemButton >
                </List>
                {
                    user?.worker?
                    <div className={styles.status} style={{borderColor:(user_phone_verified&&user_email_verified)&&user?.state!==2&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0?"#0358e5":"#fdd835"}}>
                        {/* <Loader loading={loadingSub}/> */}
                        <div className={styles.status_top}>
                            <p className={styles.status_top_val} style={{color:(user_phone_verified&&user_email_verified)&&user?.state!==2&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0?"#0358e5":"#fdd835"}}>
                                {
                                    user.state!==2&&user_phone_verified&&user_email_verified&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0?
                                    "ATIVADO"
                                    :"DESATIVADO"
                                }
                            </p>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("conta")} style={{backgroundColor:(user_phone_verified&&user_email_verified)?"#0358e540":"#fdd83540"}}>
                            <EmailUnverified sx={{color:"#fff", zIndex:1}} className={styles.status_icon}/>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val} style={{color:(user_phone_verified&&user_email_verified)?"#0358e5":"#fdd835"}}>
                                {
                                    (user_phone_verified&&user_email_verified)?
                                    `EMAIL VERIFICADO`
                                    :"EMAIL NÃO VERIFICADO"
                                }
                                </span>
                            </div>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("profissional")} style={{backgroundColor:worker_profile_complete?"#0358e540":"#fdd83540"}}>
                            <DisplaySettingsIcon sx={{color:"#fff", zIndex:1}} className={styles.status_icon}/>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val} style={{color:worker_profile_complete?"#0358e5":"#fdd835"}}>
                                {
                                    worker_profile_complete?
                                    "DETALHES PREENCHIDOS"
                                    :"DETALHES NÃO PREENCHIDOS"
                                }
                                </span>
                            </div>
                        </div>
                        <div className={styles.status_div} onClick={() => navigate({
                                    pathname: `/user`,
                                    search: `?t=profissional&st=subscription`
                                })} style={{backgroundColor:worker_is_subscribed?"#0358e540":"#fdd83540", borderBottom:'none'}}>
                            <CardMembershipIcon sx={{color:"#fff", zIndex:1}} className={styles.status_icon}/>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val} style={{color:worker_is_subscribed?"#0358e5":"#fdd835"}}>
                                {
                                    worker_is_subscribed?
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <span className={styles.status_div_val} style={{fontWeight:'', color:'#fff', fontSize:'0.9rem'}}>{daysTillCharge}</span>
                                        <span style={{color:'#fff'}}>DIAS</span>
                                    </div>
                                    :"SUBSCRIÇÃO DESATIVADA"
                                }
                                </span>
                            </div>
                        </div>
                    </div>
                    :null
                }
                {
                    user?.worker && !worker_is_subscribed && ((user_phone_verified&&user_email_verified)&&user?.state!==2&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0)?
                    <div className={styles.worker_text_div}>
                        Ativa a tua conta tendo o teu
                        <span className={styles.worker_text_text}> perfil completo </span>
                        e a tua
                        <span className={styles.worker_text_text}> subcrição ativada</span>.
                    </div>
                    :
                    user?.state===2?
                    <div className={styles.worker_text_div} style={{color:"#fdd835"}}>
                        A tua conta foi desativada pela equipa do TAREFAS.
                    </div>
                    :null
                }
                

                </div>
                
                <List
                    component="nav" className={styles.sidebar_list_bottom}
                >
                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("support")}>
                    {
                                selectedSidebar==="support"?
                                    <div className={styles.sidebar_item_opacity}/>
                                :null
                            }
                        <ListItemIcon>
                            <SupportAgentIcon sx={{color:"#fff", zIndex:1}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Suporte</span>} sx={{color:"#fff", zIndex:1}} />
                    </ListItemButton>
                    <ListItemButton className={styles.sidebar_item} onClick={() => logoutHandler()}>
                        {
                            selectedSidebar===""?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <LogoutIcon sx={{color:"#fff", zIndex:1}} style={{transform:'rotate(180deg)'}} className={styles.sidebar_small_icon}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Logout</span>} sx={{color:"#fff", zIndex:1}}/>
                    </ListItemButton>
                </List>
            </div>            
        </div>
    )
}

export default UserSidebar