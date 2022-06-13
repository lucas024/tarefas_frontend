import React, { useState, useEffect } from 'react'
import styles from './workerSidebar.module.css'
import StarRateIcon from '@mui/icons-material/StarRate';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import FaceIcon from '@mui/icons-material/Face';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TodayIcon from '@mui/icons-material/Today';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

const WorkerSidebar = (props) => {

    const [open, setOpen] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("pedidos")

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "pedidos" || val === "calendario" || val === "trabalhos" || val === "dados"){
            setSelectedSidebar(val)
        } 
        else{
            setSelectedSidebar("pedidos")
            sidebarNavigate('pedidos')
        }
            
        
    }, [searchParams])

    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/trabalhador`,
            search: `?t=${val}`
        })
    }

    return (
        <div className={styles.workerSidebar}>
            <div className={styles.worker_data_flex}>
                <div className={styles.align}>
                    <img src={props.worker.img?props.worker.img:"trabalhador"} className={styles.worker_img}/>
                </div>
                <div className={styles.align}>
                    <span className={styles.name}>{`${props.worker.name.first}`}</span>
                </div>
                <div className={styles.align}>
                    <div className={styles.rating_div}>
                        <StarRateIcon
                            className={styles.star}
                            sx={{fontSize: 10}}/>
                        <span className={styles.rating}>{parseFloat(props.worker.rating).toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <div style={{marginTop:"30px"}}></div>
            <List
                sx={{ width: '100%', maxWidth: 360}}
                component="nav" className={styles.worker_list}
            >
                <ListItemButton onClick={() => sidebarNavigate("pedidos")} style={{borderTop:"1px solid #ccc"}} className={selectedSidebar==="pedidos"?styles.button:""}>
                    <ListItemIcon>
                    <InboxIcon sx={{color:selectedSidebar==="pedidos"?"#FF785A":"#fff"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Pedidos" sx={{color:selectedSidebar==="pedidos"?"#FF785A":"#fff"}} />
                </ListItemButton>
                <ListItemButton onClick={() => {
                    setOpen(!open)}} style={{borderTop:"1px solid #ccc"}}>
                    <ListItemIcon>
                    <FaceIcon sx={{color:"#fff"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Pessoal" sx={{color:"#fff"}}/>
                    {open ? <ExpandLess sx={{color:selectedSidebar==="calendario"||
                                                    selectedSidebar==="trabalhos"||
                                                    selectedSidebar==="dados"?"#FF785A":"#fff"}} /> : 
                            <ExpandMore sx={{color:selectedSidebar==="calendario"||
                                        selectedSidebar==="trabalhos"||
                                        selectedSidebar==="dados"?"#FF785A":"#fff"}} />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => sidebarNavigate("calendario")}  style={{borderTop:"1px dashed #ddd"}} className={selectedSidebar==="calendario"?styles.button:""}>
                        <ListItemIcon>
                        <TodayIcon sx={{color:selectedSidebar==="calendario"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Calendário" sx={{color:selectedSidebar==="calendario"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    <ListItemButton sx={{ pl: 4 }} onClick={() => sidebarNavigate("trabalhos")} className={selectedSidebar==="trabalhos"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:selectedSidebar==="trabalhos"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Trabalhos" sx={{color:selectedSidebar==="trabalhos"?"#FF785A":"#fff"}}/>
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => sidebarNavigate("dados")} className={selectedSidebar==="dados"?styles.button:""}>
                        <ListItemIcon>
                        <SettingsIcon sx={{color:selectedSidebar==="dados"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Dados" sx={{color:selectedSidebar==="dados"?"#FF785A":"#fff"}}/>
                    </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    )
}

export default WorkerSidebar