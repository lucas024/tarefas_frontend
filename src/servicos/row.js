import React from 'react'
import styles from './row.module.css'
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Row = (props) => {

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const getDate = () => {
        let date = new Date(props.item.publication_time)
        return `${date.getDate()} de ${monthNames[date.getMonth()]}`
    }

    const getTime = () => {
        let date = props.item.publication_time
        return `${date?.split("T")[1].slice(0, 5)}`
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#1EACAA"
        return "#FFFFFF"
    }

    return (
        <div className={styles.row} style={{border:props.item.user_id===props.user?._id?`3px solid ${getTypeColor(props.item.type)}`:"none"}}>
            <div className={styles.row_time}>
                <span className={styles.row_time_date}>{props?.item?.publication_time&&getDate()}</span>
                <span className={styles.row_time_hour}>{getTime()}</span>
            </div>
            <div className={styles.row_right}>
                <div className={styles.row_right_left}>
                    {
                        props.item.photos?
                        <img className={styles.row_img} src={props.item.photos[0]}/>
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
                        props.item.user_id===props.user?._id?
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
                        :<span style={{opacity:"0"}}>_</span>
                    }
                    <div>
                        <div className={styles.right_flex}>
                            <LocationOnIcon className={styles.right_type_icon} style={{color:props.locationActive?"#FF785A":"#71848d"}}/>
                            <span className={styles.right_type} style={{color:props.locationActive?"#FF785A":"#71848d"}}>Lisboa</span>
                        </div>
                        <div className={styles.right_flex}>
                            <PersonIcon className={styles.right_type_icon} style={{color:props.workerActive?"#FF785A":"#71848d"}}/>
                            <span className={styles.right_type} style={{color:props.workerActive?"#FF785A":"#71848d"}}>{props.item.workerType}</span>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
    )
}

export default Row