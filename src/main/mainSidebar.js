import React, { useState, useEffect } from 'react'
import styles from '../general/sidebar.module.css'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useSearchParams } from 'react-router-dom'
// import PersonSearchIcon from '@mui/icons-material/PersonSearch';
// import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';

const MainSidebar = (props) => {

    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        //page
    }, [searchParams])


    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/main/publication/${props.selected}`,
            search: `?page=${val}`
        })
    }

    const handleSelectedSidebar = val => {
        navigate(`/main/publications/${val}`)
    }
    return (
        <div className={props.selected==="trabalhadores"?styles.sidebar_workers:styles.sidebar_jobs}>
            <div className={styles.sidebar_icon_wrapper}>
                {
                    props.selected==="trabalhadores"?
                    <div className={styles.sidebar_top}>
                        <span className={styles.sidebar_top_text}>TRABALHADORES</span>
                        <PersonIcon sx={{width:"150px", height:"150px"}} className={styles.sidebar_top_icon} style={{color:"#fff"}}/>
                    </div>
                    :
                    <div className={styles.sidebar_top}>
                        <span className={styles.sidebar_top_text}>TRABALHOS</span>
                        <BuildIcon sx={{width:"130px", height:"130px", padding:"10px 0"}} className={styles.sidebar_top_icon}/>
                    </div>
                }
            </div>
            
            
            <div className={styles.sidebar_flex}>
                <List
                    component="nav" className={styles.sidebar_list} style={{borderBottom:"none", background:"transparent"}}
                >
                    <ListItemButton 
                        onClick={() => handleSelectedSidebar("trabalhos")} 
                        className={styles.button_main_trabalhos}
                        style={{border:props.selected==="trabalhos"?"4px dashed white":"2px solid #FF785A", background:props.selected==="trabalhos"?"#ffffff20":""}}>
                        <ListItemIcon>
                        <BuildIcon sx={{color:props.selected==="trabalhos"?"#fff":"#ffffffaa", fontSize:"2rem", padding:props.selected==="trabalhos"?"4px 0":"6px 0"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhos</span>} sx={{color:props.selected==="trabalhos"?"#fff":"#ffffffaa"}}/>
                    </ListItemButton >
                    <ListItemButton 
                        onClick={() => handleSelectedSidebar("trabalhadores")} 
                        className={styles.button_main_trabalhadores}
                        style={{border:props.selected==="trabalhadores"?"4px dashed white":"2px solid #161F28", background:props.selected==="trabalhadores"?"#ffffff20":""}}>
                        <ListItemIcon>
                        <PersonIcon sx={{color:props.selected==="trabalhadores"?"#fff":"#ffffffaa", fontSize:"2.5rem", padding:props.selected==="trabalhadores"?"0":"2px 0"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhadores</span>} sx={{color:props.selected==="trabalhadores"?"#fff":"#ffffffaa"}}/>
                    </ListItemButton >
                </List>
                
            </div>
            
        </div>
    )
}

export default MainSidebar