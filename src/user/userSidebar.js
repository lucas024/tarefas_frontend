import React, { useState, useEffect } from 'react'
import styles from './userSidebar.module.css'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from '../firebase/firebase'

const UserSidebar = (props) => {

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")
    const [typeColor, setTypeColor] = useState("#C3CEDA")
    const [type, setType] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "upcreservation" || val === "reservations" || val === "support" ||  val === "personal"){
            setSelectedSidebar(val)
        } 
        else{
            setSelectedSidebar("upcreservation")
            sidebarNavigate("upcreservation")
        }        
    }, [searchParams])

    useEffect(() => {
        if(props.nextReservation){
            if(props.nextReservation.type===0){
                setType(props.nextReservation.type)
                {setTypeColor("#C3CEDA")}
            }
            if(props.nextReservation.type===1){
                setType(props.nextReservation.type)
                {setTypeColor("#fdd835")}
            } 
            if(props.nextReservation.type===2){
                setType(props.nextReservation.type)
                {setTypeColor("#30A883")}
            } 
            if(props.nextReservation.type===3){
                setType(props.nextReservation.type)
                {setTypeColor("#1EACAA")}
            } 
        }
        
    }, [props.nextReservation])

    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/user`,
            search: `?t=${val}`
        })
    }

    const logoutHandler = () => {
        logout()
        navigate({
            pathname: `/authentication`,
        })
    }

    return (
        <div className={styles.workerSidebar}>
            <div className={styles.worker_data_flex}>
                <div className={styles.align}>
                    {
                        props.user&&props.user.photoUrl?
                        <img className={styles.worker_img} src={props.user.photoUrl}/>
                        :<FaceIcon className={styles.worker_img_icon}/>
                    }
                </div>
                <div className={styles.align}>
                    <span className={styles.name}>{props.user?props.user.name:null}</span>
                </div>
            </div>
            <div style={{marginTop:"10px"}}></div>
            <div className={styles.sidebar_flex}>
                <List
                    component="nav" className={styles.worker_list}
                >
                    <ListItemButton onClick={() => sidebarNavigate("upcreservation")}  
                            className={selectedSidebar==="upcreservation"?styles.button_special:styles.button_special_nonselected}
                            style={{borderTop:`3px solid ${typeColor}`, borderBottom:`3px solid ${typeColor}`}}>
                        <ListItemIcon >
                        <UpcomingIcon sx={{color:selectedSidebar==="upcreservation"?typeColor:"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<div className={styles.prox_wrapper}>
                                <span className={styles.prox}>Próxima reserva</span>
                                {
                                    type===0?<span className={styles.prox_aux}>(a processar)</span>
                                    :type===1?<span className={styles.prox_aux} style={{marginLeft:"25px"}}>(por confirmar)</span>
                                    :type===2?<span className={styles.prox_aux}>(confirmado)</span>
                                    :type===3?<span className={styles.prox_aux}>(por pagar)</span>
                                    :null
                                }
                                
                            </div> }sx={{color:selectedSidebar==="upcreservation"?typeColor:"#fff"}} />
                    </ListItemButton>
                    <ListItemButton onClick={() => sidebarNavigate("reservations")}  className={selectedSidebar==="reservations"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:selectedSidebar==="reservations"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Reservas</span>} sx={{color:selectedSidebar==="reservations"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    <ListItemButton onClick={() => sidebarNavigate("personal")} className={selectedSidebar==="personal"?styles.button:""}>
                        <ListItemIcon>
                        <AccessibilityIcon sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Dados pessoais</span>} sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
                <List
                    component="nav" className={styles.worker_list_bottom}
                >
                    <ListItemButton onClick={() => sidebarNavigate("support")} className={selectedSidebar==="support"?styles.button:""}>
                        <ListItemIcon>
                        <SupportAgentIcon sx={{color:selectedSidebar==="support"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Suporte</span>} sx={{color:selectedSidebar==="support"?"#FF785A":"#fff"}} />
                    </ListItemButton>
                    <ListItemButton onClick={() => logoutHandler()} >
                        <ListItemIcon>
                        <LogoutIcon sx={{color:"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Logout</span>} sx={{color:selectedSidebar===""?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
            </div>
            
        </div>
    )
}

export default UserSidebar