import React, { useState, useEffect } from 'react'
import styles from '../general/sidebar.module.css'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat';
import CircleIcon from '@mui/icons-material/Circle';
import PersonSearch from '@mui/icons-material/PersonSearch';

const AdminSidebar = (props) => {

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")
    const [loading, setLoading] = useState(false)
    const [loadingSub, setLoadingSub] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications_A" || val === "publications_PA" ||  val === "publications_R" ||  val === "messages" || val === "subscription"){
            setSelectedSidebar(val)
        }
    }, [searchParams])

    useEffect(() => {
        if(props.hasSubscription!=null || props.hasSubscription===false)
        {
            setLoadingSub(false)
        }
    }, [props.hasSubscription])
    

    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/admin`,
            search: `?t=${val}`
        })
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_data_flex}>
                <div className={styles.align} style={{color:"white", paddingTop:"10px"}}>
                    ADMIN
                </div>
            </div>
            <div style={{marginTop:"10px"}}></div>
            <div className={styles.sidebar_flex}>
                <div>
                <List
                    component="nav" className={styles.sidebar_list}
                >
                    <ListItemButton style={{borderTop:"1px solid white"}} onClick={() => sidebarNavigate("publications_PA")}  className={selectedSidebar==="publications_PA"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:"#fdd835"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhos P.A</span>} sx={{color:"#fdd835"}}/>
                    </ListItemButton >
                    <ListItemButton onClick={() => sidebarNavigate("publications_A")}  className={selectedSidebar==="publications_A"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:"#6EB241"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhos A</span>} sx={{color:"#6EB241"}}/>
                    </ListItemButton >
                    <ListItemButton onClick={() => sidebarNavigate("publications_R")}  className={selectedSidebar==="publications_R"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:"#ff3b30"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhos R</span>} sx={{color:"#ff3b30"}}/>
                    </ListItemButton >
                    
                    <ListItemButton style={{borderTop:props.user?.type?"3px solid #71848d":null}} onClick={() => sidebarNavigate("personal")}>
                        <ListItemIcon>
                        <PersonSearch sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox}>Profissionais P.A</span>
                            </div>
                            } sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    <ListItemButton style={{borderTop:props.user?.type?"3px solid #71848d":null}} onClick={() => sidebarNavigate("personal")} 
                        //className={selectedSidebar==="personal"?styles.button:""}
                    >
                        <ListItemIcon>
                        <PersonSearch sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={
                            <div style={{display:"flex", position:"relative", alignItems:"center", justifyContent:"space-between"}}>
                                <span className={styles.prox}>Profissionais A</span>
                            </div>
                            } sx={{color:selectedSidebar==="personal"?"#FF785A":"#fff"}}/>
                    </ListItemButton >


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
                

                </div>
            </div>            
        </div>
    )
}

export default AdminSidebar