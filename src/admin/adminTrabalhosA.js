import React, {useEffect, useState} from 'react'
import styles from './publications.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../general/loader';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';

const AdminTrabalhosA = (props) => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [activeReservations, setActiveReservations] = useState(false)
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        setLoading(true)
        axios.post(`${props.api_url}/reservations/get_by_type`, {type: 1})
            .then(r => {
                setReservations(r.data)
                if(r.data.length>0)
                {
                    setActiveReservations(true)
                }
                setLoading(false)
            })
    }, [props.api_url])

    const getTime = (val) => {
        let time = new Date(val)
        return time.toISOString().split("T")[0]
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#1EACAA"
        return "#FFFFFF"
    }

    const interromperHandler = (e, id) => {
        e.stopPropagation()
        let reservationsAux = [...reservations]
        for(let el of reservationsAux)
        {
            if(el._id === id)
            {
                console.log('teste')
                el.type=2
                break
            }
        }
        axios.post(`${props.api_url}/reservations/update_reservation_type`, {id:id, type:2})
        setReservations(reservationsAux)
    }

    const getMainPhoto = (photos, main_photo) => {
        for(let el of photos)
            if(el.id === main_photo) return el?.url

        return photos[0]?.url
    }


    const displayReservations = () => {
        return reservations.map((res, i) => {
            return (
                <div key={i} className={styles.item_wrapper} onClick={() => navigatePubHandler(res._id)}>
                    <div className={styles.item} style={{borderColor:getTypeColor(res.type)}}>
                        <div className={styles.item_left}>
                            {
                                res?.photos?.length>0?
                                <img className={styles.item_img} src={getMainPhoto(res.photos, res.photo_principal)}/>
                                :<NoPhotographyIcon className={styles.item_no_img}/>
                            }
                            <div className={styles.item_title_div}>
                                <span className={styles.item_title}>
                                        {res.title}
                                </span>
                                <span className={styles.item_desc}>
                                        {res.desc}
                                </span>
                                <span className={styles.item_id}>
                                        {res._id}
                                </span>
                            </div>
                        </div>
                        <span className={styles.item_middle_stop} onClick={e => interromperHandler(e, res._id)}>
                            INTERROMPER
                        </span>
                        <div className={styles.item_right}>
                            <div className={styles.top_left_indicator_more}>
                                <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(res.type)}}>
                                    <span className={styles.item_indicator}></span>
                                    <span className={styles.item_type}>Processar</span>
                                </div>
                            </div>
                            <div className={styles.item_flex}>
                                <div className={styles.item_time}>{getTime(res.timestamp)}</div>
                            </div>
                            <div className={styles.item_flex}>
                                <span className={styles.item_flex_worker_text}>{res.workerType}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            )
        })
    }

    const navigatePubHandler = (id) => {
        navigate(`/main/publications/publication?id=${id}`, 
                {
                state: {
                    fromUserPage: true,
                }
                }
            )
    }

    return (
        <div className={styles.reserva_list}>
            <Loader loading={loading}/>
            <div className={styles.list_title}>
                <span className={styles.top_title} style={{color:"#6EB241"}}>TRABALHOS ACEITES</span>
            </div>

            <div className={styles.list}>
                <div className={styles.list_prox}>
                    <span className={styles.list_prox_text} style={{color:"white", fontStyle:"normal"}}>Trabalhos Aceites</span>
                </div>
                    <div>
                    {
                        activeReservations?
                            displayReservations()
                        :
                        <div className={styles.item_none}>
                            <div className={styles.item_flex}>
                                <span className={styles.item_type_tbd} style={{color:"white"}}>Sem Trabalhos Por Activar</span>
                            </div>
                        </div>
                    }
                    </div>
                </div>
        </div>
    )
}

export default AdminTrabalhosA