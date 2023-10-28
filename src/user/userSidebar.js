import React, { useState, useEffect } from 'react'
import styles from '../general/sidebar.module.css'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from '../firebase/firebase'
import ChatIcon from '@mui/icons-material/Chat';
import CircleIcon from '@mui/icons-material/Circle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Loader from '../general/loader';
import UnpublishedOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AssignmentdIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux'


const UserSidebar = (props) => {
    const user_profile_complete = useSelector(state => {return state.user_profile_complete})
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
                        <FaceIcon className={styles.sidebar_img_icon}/>
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
                                <AssignmentdIcon sx={{color:selectedSidebar==="publications"?"#FF785A":"#fff"}}/>
                            </ListItemIcon>
                            <ListItemText primary={<span className={styles.prox}>Meus Trabalhos</span>} sx={{color:selectedSidebar==="publications"?"#FF785A":"#fff"}}/>
                        </ListItemButton >
                    }
                    
                    <ListItemButton className={styles.sidebar_item} onClick={() => sidebarNavigate("personal")}>
                        {
                            selectedSidebar==="personal"?
                                <div className={styles.sidebar_item_opacity}/>
                            :null
                        }
                        <ListItemIcon>
                            <AccountCircleIcon sx={{color:"#ffffff", zIndex:1}}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox}>Perfil</span>
                                {
                                    user_profile_complete&&user?.type?
                                    <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                    :user?.type?
                                    <UnpublishedOutlinedIcon className={styles.off_icon}/>
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
                                <CardMembershipIcon sx={{color:"#fff", zIndex:1}}/>
                            </ListItemIcon>
                            <ListItemText primary={
                                <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                    <span className={styles.prox}>Subscrição</span>
                                    {
                                    worker_is_subscribed?
                                    <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                    :
                                    <div style={{position:"relative"}}>
                                        <UnpublishedOutlinedIcon className={styles.off_icon}/>
                                    </div>
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
                            <ChatIcon sx={{color:"#fff", zIndex:1}}/>
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
                    <div className={styles.status}>
                        <Loader loading={loadingSub}/>
                        <div className={styles.status_top}>
                            <span className={styles.status_top_val} style={{color:user_profile_complete&&user?.state===1&&worker_is_subscribed?"#0358e5":"#fdd835"}}>
                                {
                                    user_profile_complete&&user?.state===1&&worker_is_subscribed?
                                    "CONTA ATIVA"
                                    :"CONTA INATIVA"
                                }
                            </span>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("personal")} style={{backgroundColor:user_profile_complete&&user?.state===1?"#0358e5":"#fdd835bb"}}>
                            <span className={styles.status_div_title}>Perfil</span>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val}>
                                {
                                    user_profile_complete?
                                    "COMPLETO"
                                    :"INCOMPLETO"
                                }
                                </span>
                            </div>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("subscription")} style={{backgroundColor:worker_is_subscribed?"#0358e5":"#fdd835bb", borderBottom:"none", borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                            <span className={styles.status_div_title}>Subscrição</span>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val}>
                                {
                                    worker_is_subscribed?
                                    "ATIVADA"
                                    :"DESATIVADA"
                                }
                                </span>
                            </div>
                        </div>
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
                            <LogoutIcon sx={{color:"#fff", zIndex:1}} style={{transform:'rotate(180deg)'}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Logout</span>} sx={{color:"#fff", zIndex:1}}/>
                    </ListItemButton>
                </List>
            </div>            
        </div>
    )
}

export default UserSidebar