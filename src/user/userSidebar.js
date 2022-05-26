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
import no_pic from '../assets/user.png'
import LogoutIcon from '@mui/icons-material/Logout';

const UserSidebar = (props) => {

    const [open, setOpen] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")

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

    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/user`,
            search: `?t=${val}`
        })
    }

    const logoutHandler = () => {
        
    }

    return (
        <div className={styles.workerSidebar}>
            <div className={styles.worker_data_flex}>
                <div className={styles.align}>
                    <img src={props.user&&props.user.photoUrl?props.user.photoUrl:no_pic} className={styles.worker_img}/>
                </div>
                <div className={styles.align}>
                    <span className={styles.name}>{props.user?props.user.name:null}</span>
                </div>
            </div>
            <div style={{marginTop:"10px"}}></div>
            <div className={styles.sidebar_flex}>
                <List
                    sx={{ width: '100%', maxWidth: 360}}
                    component="nav" className={styles.worker_list}
                >
                    <ListItemButton onClick={() => sidebarNavigate("upcreservation")} className={selectedSidebar==="upcreservation"?styles.button_special:styles.button_special_nonselected}>
                        <ListItemIcon>
                        <UpcomingIcon sx={{color:selectedSidebar==="upcreservation"?"#fdd835":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Próxima reserva" sx={{color:selectedSidebar==="upcreservation"?"#fdd835":"#fff"}} />
                    </ListItemButton>
                    <ListItemButton onClick={() => sidebarNavigate("reservations")}  className={selectedSidebar==="reservations"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:selectedSidebar==="reservations"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Reservas" sx={{color:selectedSidebar==="reservations"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    <ListItemButton onClick={() => sidebarNavigate("personal")} className={selectedSidebar==="personal"?styles.button:""}>
                        <ListItemIcon>
                        <AccessibilityIcon sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Dados pessoais" sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
                <List
                    sx={{ width: '100%', maxWidth: 360}}
                    component="nav" className={styles.worker_list_bottom}
                >
                    <ListItemButton onClick={() => sidebarNavigate("support")} className={selectedSidebar==="support"?styles.button:""}>
                        <ListItemIcon>
                        <SupportAgentIcon sx={{color:selectedSidebar==="support"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Suporte" sx={{color:selectedSidebar==="support"?"#FF785A":"#fff"}} />
                    </ListItemButton>
                    <ListItemButton onClick={() => logoutHandler()} >
                        <ListItemIcon>
                        <LogoutIcon sx={{color:"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Logout" sx={{color:selectedSidebar===""?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
            </div>
            
        </div>
    )
}

export default UserSidebar