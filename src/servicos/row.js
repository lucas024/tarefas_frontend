import React from 'react'
import styles from './row.module.css'
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {regioesOptions, profissoesOptions, profissoesPngs} from '../general/util'
import VisibilityIcon from '@mui/icons-material/Visibility';
import BuildIcon from '@mui/icons-material/Build';

const Row = (props) => {

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const getDate = () => {
        let date = new Date(props.item.timestamp)
        return `${date.getDate()} de ${monthNames[date.getMonth()]}`
    }

    const getTime = () => {
        let date = new Date(props.item.timestamp).toISOString()
        return `${date.split("T")[1].slice(0, 5)}`
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#1EACAA"
        return "#FFFFFF"
    }

    const getMainPhoto = (photos, main_photo) => {
        for(let el of photos)
            if(el.id === main_photo) return el.url

        return photos[0].url
    }

    return (
        <div className={styles.row} style={{border:props.item.user_id===props.user?._id?`3px solid ${getTypeColor(props.item.type)}`:"none"}}>
            <div className={props.trabalhoVisto?styles.row_time_seen:styles.row_time}>
                {
                    props.trabalhoVisto?
                        <div className={styles.row_eye}>
                            {/* <span className={styles.eye_text}>VISTO</span> */}
                            <VisibilityIcon className={styles.eye}/>
                        </div>
                    :null
                }
                {
                    props.item.user_id===props.user?._id?
                    <div className={styles.item_user}>
                        <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(props.item.type)}}>
                            <span className={styles.item_indicator}></span>
                            <span className={styles.item_type}>
                                {
                                    props.item.type===1?"Activo":
                                    props.item.type===2?"Concluído":
                                        "Processar"
                                }
                            </span>
                        </div>
                    </div>
                    :null
                }
                <span className={styles.row_time_date}>{props?.item?.timestamp&&getDate()}</span>
                <span className={styles.row_time_hour}>{getTime()}</span>
            </div>
            <div className={styles.row_right}>
                <div className={styles.row_right_left}>
                    {
                        props.item.photos?
                        <img className={styles.row_img} src={getMainPhoto(props.item.photos, props.item.photo_principal)}/>
                        :
                        <NoPhotographyIcon className={styles.item_no_img}/>
                    }
                    <div className={styles.title_div}>
                        <span className={styles.title}>{props.item.title}</span>
                        <span className={styles.desc}>{props.item.desc}</span>
                    </div>
                </div>
                
                <div className={styles.row_right_right}>
                    {
                        <img src={profissoesPngs[props.item.workerType]} className={styles.item_worker_type}/>
                    }
                    <div>
                        <div className={styles.right_flex}>
                            <BuildIcon className={styles.right_type_icon} style={{color:props.workerActive?"#0358e5":"#71848d"}}/>
                            <span className={styles.right_type} style={{color:props.workerActive?"#0358e5":"#71848d"}}>{profissoesOptions[props.item.workerType]}</span>
                        </div>
                        <div className={styles.right_flex}>
                            <LocationOnIcon className={styles.right_type_icon} style={{color:props.locationActive?"#0358e5":"#71848d"}}/>
                            <span className={styles.right_type} style={{color:props.locationActive?"#0358e5":"#71848d"}}>{regioesOptions[props.item.district]}</span>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
    )
}

export default Row