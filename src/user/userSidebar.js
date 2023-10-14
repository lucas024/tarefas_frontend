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


const UserSidebar = (props) => {

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")
    const [loading, setLoading] = useState(false)
    const [loadingSub, setLoadingSub] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications" || val === "support" ||  val === "personal" ||  val === "messages" || val === "subscription"){
            setSelectedSidebar(val)
        }
    }, [searchParams])

    useEffect(() => {
        if(props.hasSubscription!=null || props.hasSubscription===false)
        {
            setLoadingSub(false)
        }
    }, [props.hasSubscription])

    // useEffect(() => {
    //     if(props.user?.subscription && props.user.type){
    //         setLoading(true)
    //         axios.post(`${props.api_url}/retrieve-subscription-and-schedule`, {
    //             subscription_id: props.user.subscription.id,
    //             schedule_id: props.user.subscription.sub_schedule
    //         })
    //         .then(res => {
    //             if(res.data.schedule){
    //                 if(new Date().getTime() < new Date(res.data.schedule.current_phase.end_date*1000)){
    //                     setSubscriptionIsActive(true)
    //                     setLoading(false)
    //                 }
    //             }
    //         })
    //     }
    // }, [props.user])
    

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
                        props.user&&props.user.photoUrl?
                        <img className={styles.sidebar_img} src={props.user.photoUrl}/>
                        :!loading?
                        <FaceIcon className={styles.sidebar_img_icon}/>
                        :null
                    }
                </div>
                <div className={styles.align}>
                    <span className={styles.name}>{props.user?props.user.name:null}</span>
                </div>
            </div>
            <div className={styles.flex_10px}></div>
            <div className={styles.sidebar_flex}>
                <div>
                <List
                    component="nav" className={styles.sidebar_list}
                >
                    {
                        props.user?.type?
                        null:
                        <ListItemButton style={{borderTop:"1px solid #ffffff50"}} onClick={() => sidebarNavigate("publications")}  className={selectedSidebar==="publications"?styles.button:""}>
                            <ListItemIcon>
                            <AssignmentdIcon sx={{color:selectedSidebar==="publications"?"#FF785A":"#fff"}}/>
                            </ListItemIcon>
                            <ListItemText primary={<span className={styles.prox}>Meus Trabalhos</span>} sx={{color:selectedSidebar==="publications"?"#FF785A":"#fff"}}/>
                        </ListItemButton >
                    }
                    
                    <ListItemButton onClick={() => sidebarNavigate("personal")} 
                        //className={selectedSidebar==="personal"?styles.button:""}
                    >
                        <ListItemIcon>
                        <AccountCircleIcon sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox}>Perfil</span>
                                {
                                !props.incompleteUser&&props.user?.type?
                                <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                :props.user?.type?
                                <UnpublishedOutlinedIcon className={styles.off_icon}/>
                                :null
                                }
                            </div>
                            } sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    {
                        props.user?.type?
                        <ListItemButton onClick={() => sidebarNavigate("subscription")}  className={selectedSidebar==="subscription"?styles.button:""}>
                            <ListItemIcon>
                            <CardMembershipIcon sx={{color:selectedSidebar==="subscription"?"#FF785A":"#fff"}}/>
                            </ListItemIcon>
                            <ListItemText primary={
                                <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                    <span className={styles.prox}>Subscrição</span>
                                    {
                                    props.hasSubscription?
                                    <CheckCircleOutlineOutlinedIcon className={styles.on_icon}/>
                                    :
                                    <div style={{position:"relative"}}>
                                        {/* <Loader small={true} loading={true}/> */}
                                        <UnpublishedOutlinedIcon className={styles.off_icon}/>
                                    </div>
                                    }
                                </div>
                            } sx={{color:selectedSidebar==="subscription"?"#FF785A":"#fff"}}/>
                        </ListItemButton >
                        :null
                    }
                    <ListItemButton onClick={() => sidebarNavigate("messages")} className={selectedSidebar==="messages"?styles.button:""}>
                        <ListItemIcon>
                        <ChatIcon sx={{color:selectedSidebar==="messages"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <span style={{display:"flex"}}>
                                <span className={styles.prox}>Mensagens</span>
                                {props.notifications?.length>0? <CircleIcon className={styles.drop_div_notification}></CircleIcon>:null}
                            </span>
                        } sx={{color:selectedSidebar==="messages"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
                {
                    props.user?.type?
                    <div className={styles.status}>
                        <Loader loading={loadingSub}/>
                        <div className={styles.status_top}>
                            <span className={styles.status_top_val} style={{color:!props.incompleteUser&&props.user?.state===1&&props.hasSubscription?"#0358e5":"#fdd835"}}>
                                {
                                    !props.incompleteUser&&props.user?.state===1&&props.hasSubscription?
                                    "CONTA ATIVA"
                                    :"CONTA INATIVA"
                                }
                            </span>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("personal")} style={{backgroundColor:!props.incompleteUser&&props.user?.state===1?"#0358e5":props.incompleteUser===false?"#0358e5bb":"#fdd835bb"}}>
                            <span className={styles.status_div_title}>Perfil</span>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val}>
                                {
                                    !props.incompleteUser?
                                    "COMPLETO"
                                    :props.incompleteUser===false?
                                    "A VERIFICAR"
                                    :"INCOMPLETO"
                                }
                                </span>
                                {/* {
                                    !props.incompleteUser?
                                    <CheckCircleOutlineOutlinedIcon className={styles.status_icon}/>
                                    :<UnpublishedOutlinedIcon className={styles.status_icon}/>
                                } */}
                            </div>
                        </div>
                        <div className={styles.status_div} onClick={() => sidebarNavigate("subscription")} style={{backgroundColor:props.hasSubscription?"#0358e5":"#fdd835bb", borderBottom:"none", borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                            <span className={styles.status_div_title}>Subscrição</span>
                            <div className={styles.status_div_flex}>
                                <span className={styles.status_div_val}>
                                {
                                    props.hasSubscription?
                                    "ATIVADA"
                                    :"DESATIVADA"
                                }
                                </span>
                                {/* {
                                    props.hasSubscription?
                                    <CheckCircleOutlineOutlinedIcon className={styles.status_icon}/>
                                    :<UnpublishedOutlinedIcon className={styles.status_icon}/>
                                } */}
                            </div>
                        </div>
                    </div>
                    :null
                }
                

                </div>
                
                <List
                    component="nav" className={styles.sidebar_list_bottom}
                >
                    <ListItemButton onClick={() => sidebarNavigate("support")} className={selectedSidebar==="support"?styles.button:""}>
                        <ListItemIcon>
                        <SupportAgentIcon sx={{color:selectedSidebar==="support"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Suporte</span>} sx={{color:selectedSidebar==="support"?"#FF785A":"#fff"}} />
                    </ListItemButton>
                    <ListItemButton onClick={() => logoutHandler()} >
                        <ListItemIcon>
                        <LogoutIcon sx={{color:"#fff"}} style={{transform:'rotate(180deg)'}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Logout</span>} sx={{color:selectedSidebar===""?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
            </div>            
        </div>
    )
}

export default UserSidebar