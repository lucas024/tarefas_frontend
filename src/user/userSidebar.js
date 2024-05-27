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
import AssignmentdIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';


const UserSidebar = (props) => {
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user = useSelector(state => {return state.user})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")
    const [loading, setLoading] = useState(false)
    const [loadingSub, setLoadingSub] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications" || val === "support" ||  val === "personal" ||  val === "messages" || val === "subscription"){
            setSelectedSidebar(val)
        }
    }, [searchParams])
    

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
                        <img className={styles.sidebar_img} src={user.photoUrl}/>
                        :!loading?
                        user?.type===0?
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
                    {
                        user?.type?
                        null:
                        <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("publications")}>
                            {
                                selectedSidebar==="publications"?
                                    <div className={styles.sidebar_item_opacity}/>
                                :null
                            }
                            <ListItemIcon>
                                <AssignmentdIcon sx={{color:"#ffffff", zIndex:1}} className={styles.sidebar_small_icon}/>
                            </ListItemIcon>
                            <ListItemText primary={<span className={styles.prox}>Minhas Tarefas</span>} sx={{color:"#ffffff", zIndex:1}}/>
                        </ListItemButton >
                    }
                    
                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("personal")}>
                        {
                            selectedSidebar==="personal"?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <AccountCircleIcon sx={{color:"#ffffff", zIndex:1}} className={styles.sidebar_small_icon}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox}>Perfil</span>
                                {
                                    user.type===0&&!(user_phone_verified&&user_email_verified)?
                                    <span className={styles.drop_div_notification}/>
                                    :
                                    user.type===1&&!(user.regioes?.length>0&&user.trabalhos?.length>0&&user_phone_verified&&user_email_verified)?
                                    <span className={styles.drop_div_notification}/>
                                    :null
                                }
                            </div>
                            } sx={{color:"#ffffff"}}/>
                    </ListItemButton >
                    {
                        user?.type?
                        <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("subscription")}>
                            {
                                selectedSidebar==="subscription"?
                                    <div className={styles.sidebar_item_opacity}/>
                                :null
                            }
                            <ListItemIcon>
                                <CardMembershipIcon sx={{color:"#fff", zIndex:1}} className={styles.sidebar_small_icon}/>
                            </ListItemIcon>
                            <ListItemText primary={
                                <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                    <span className={styles.prox}>Subscrição</span>
                                    {
                                    !worker_is_subscribed?
                                    <span className={styles.drop_div_notification}/>
                                    :null
                                    }
                                </div>
                            } sx={{color:"#fff", zIndex:1}}/>
                        </ListItemButton >
                        :null
                    }
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
                </List>
                {
                    user?.type?
                    <div className={styles.status} style={{borderColor:(user_phone_verified&&user_email_verified)&&user?.state!==2&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0?"#0358e5":"#fdd835"}}>
                        <Loader loading={loadingSub}/>
                        <div className={styles.status_top}>
                            <p className={styles.status_top_val} style={{color:(user_phone_verified&&user_email_verified)&&user?.state!==2&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0?"#0358e5":"#fdd835"}}>
                                {
                                    user.state!==2&&user_phone_verified&&user_email_verified&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0?
                                    "CONTA ATIVADA"
                                    :"CONTA DESATIVADA"
                                }
                            </p>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("personal")} style={{backgroundColor:(user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)?"#0358e540":"#fdd83540"}}>
                            <AccountCircleIcon sx={{color:"#fff", zIndex:1}} className={styles.status_icon}/>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val} style={{color:(user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)?"#0358e5":"#fdd835"}}>
                                {
                                    (user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)?
                                    "PERFIL COMPLETO"
                                    :"PERFIL INCOMPLETO"
                                }
                                </span>
                            </div>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("subscription")} style={{backgroundColor:worker_is_subscribed?"#0358e540":"#fdd83540"}}>
                            <CardMembershipIcon sx={{color:"#fff", zIndex:1}} className={styles.status_icon}/>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val} style={{color:worker_is_subscribed?"#0358e5":"#fdd835"}}>
                                {
                                    worker_is_subscribed?
                                    "SUBSCRIÇÃO ATIVADA"
                                    :"SUBSCRIÇÃO DESATIVADA"
                                }
                                </span>
                            </div>
                        </div>
                    </div>
                    :null
                }
                {
                    user?.type && !worker_is_subscribed && ((user_phone_verified&&user_email_verified)&&user?.state!==2&&worker_is_subscribed&&user.regioes?.length>0&&user.trabalhos?.length>0)?
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