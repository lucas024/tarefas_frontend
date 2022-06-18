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

const UserSidebar = (props) => {

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications" || val === "support" ||  val === "personal"){
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
            pathname: `/authentication`,
        })
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_data_flex}>
                <div className={styles.align}>
                    {
                        props.user&&props.user.photoUrl?
                        <img className={styles.sidebar_img} src={props.user.photoUrl}/>
                        :<FaceIcon className={styles.sidebar_img_icon}/>
                    }
                </div>
                <div className={styles.align}>
                    <span className={styles.name}>{props.user?props.user.name:null}</span>
                </div>
            </div>
            <div style={{marginTop:"10px"}}></div>
            <div className={styles.sidebar_flex}>
                <List
                    component="nav" className={styles.sidebar_list}
                >
                    <ListItemButton style={{borderTop:"3px solid #71848d"}} onClick={() => sidebarNavigate("publications")}  className={selectedSidebar==="publications"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:selectedSidebar==="publications"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Publicações</span>} sx={{color:selectedSidebar==="publications"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    <ListItemButton onClick={() => sidebarNavigate("personal")} className={selectedSidebar==="personal"?styles.button:""}>
                        <ListItemIcon>
                        <AccessibilityIcon sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Dados pessoais</span>} sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
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