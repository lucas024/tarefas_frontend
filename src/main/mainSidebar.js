import React, { useState, useEffect } from 'react'
import styles from '../general/sidebar.module.css'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useSearchParams } from 'react-router-dom'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const MainSidebar = (props) => {

    const [searchParams] = useSearchParams()
    const [selectedSidebar, setSelectedSidebar] = useState("trabalhadores")

    const navigate = useNavigate()

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "trabalhadores" || val === "trabalhos"){
            setSelectedSidebar(val)
        } 
    }, [searchParams])

    const sidebarNavigate = (val) => {
        navigate({
            pathname: `/main/publication/${selectedSidebar}`,
            search: `?page=${val}`
        })
    }

    const handleSelectedSidebar = val => {
        setSelectedSidebar(val)
        navigate(`/main/publications/${val}`)
    }
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_icon_wrapper}>
                {
                    selectedSidebar==="trabalhadores"?
                    <div className={styles.sidebar_top}>
                        <span className={styles.sidebar_top_text}>TRABALHADORES</span>
                        <PersonSearchIcon className={styles.sidebar_top_icon}/>
                    </div>
                    :
                    <div className={styles.sidebar_top}>
                        <span className={styles.sidebar_top_text}>TRABALHOS</span>
                        <ManageSearchIcon className={styles.sidebar_top_icon}/>
                    </div>
                }
            </div>
            
            
            <div className={styles.sidebar_flex}>
                <List
                    component="nav" className={styles.sidebar_list}
                >
                    <ListItemButton style={{borderTop:"3px solid #71848d"}} onClick={() => handleSelectedSidebar("trabalhadores")}  className={selectedSidebar==="trabalhadores"?styles.button:""}>
                        <ListItemIcon>
                        <PersonSearchIcon sx={{color:selectedSidebar==="trabalhadores"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhadores</span>} sx={{color:selectedSidebar==="trabalhadores"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                    <ListItemButton onClick={() => handleSelectedSidebar("trabalhos")} className={selectedSidebar==="trabalhos"?styles.button:""}>
                        <ListItemIcon>
                        <ManageSearchIcon sx={{color:selectedSidebar==="trabalhos"?"#FF785A":"#fff"}}/>
                        </ListItemIcon>
                        <ListItemText primary={<span className={styles.prox}>Trabalhos</span>} sx={{color:selectedSidebar==="trabalhos"?"#FF785A":"#fff"}}/>
                    </ListItemButton >
                </List>
                
            </div>
            
        </div>
    )
}

export default MainSidebar