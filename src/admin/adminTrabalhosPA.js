import React, {useEffect, useState} from 'react'
import styles from './publications.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../general/loader';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import Popup from './../transitions/popup';

const AdminTrabalhosPA = (props) => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [notActiveReservations, setNotActiveReservations] = useState(false)
    const [reservations, setReservations] = useState([])
    const [refusePopup, setRefusePopup] = useState(false)
    const [refuseUserReservationId, setRefuseUserReservationId] = useState(null)
    const [refuseReservation, setRefuseReservation] = useState(null)

    useEffect(() => {
        getPAReservations()
    }, [props.api_url])

    const getPAReservations = async () => {
        setLoading(true)
        axios.post(`${props.api_url}/reservations/get_by_type`, {type: 0})
            .then(r => {
                setReservations(r.data)
                if(r.data.length>0)
                {
                    setNotActiveReservations(true)
                }
                setLoading(false)
            })
    }

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

    const acceptHandler = (e, id) => {
        e.stopPropagation()
        let reservationsAux = [...reservations]
        for(let el of reservationsAux)
        {
            if(el._id === id)
            {
                el.type=1
                break
            }
        }
        axios.post(`${props.api_url}/reservations/update_reservation_type`, {id:id, type:1})
        setReservations(reservationsAux)
    }

    const refuseHandler = (e, user_id, reservation) => {
        e.stopPropagation()
        setRefusePopup(true)
        setRefuseUserReservationId(user_id)
        setRefuseReservation(reservation)
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
                            <div className={styles.item_middle}>
                                <span className={styles.item_middle_accept} onClick={e => acceptHandler(e, res._id)}>
                                    ACEITAR
                                </span>
                                <span className={styles.item_middle_deny} onClick={e => refuseHandler(e, res.user_id, res)}>
                                    RECUSAR
                                </span>
                            </div>

                        <div className={styles.item_right}>
                            <div className={styles.top_left_indicator_more}>
                                <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(res.type)}}>
                                    <span className={styles.item_indicator}></span>
                                    <span className={styles.item_type}>Em Análise</span>
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

    const confirmarPopupHandler = () => {
        setRefusePopup(false)
        getPAReservations()
    }

    return (
        <div className={styles.reserva_list}>
            <Loader loading={loading}/>
            {
                refusePopup?
                    <Popup
                        type = 'refuse_publication'
                        confirmHandler={() => confirmarPopupHandler()}
                        cancelHandler={() => setRefusePopup(false)}
                        user_id={refuseUserReservationId}
                        reservation={refuseReservation}
                        />
                    :null
            }
            <div className={styles.list_title}>
                <span className={styles.top_title} style={{color:"#fdd835"}}>TRABALHOS POR ACEITAR</span>
            </div>

            <div className={styles.list}>
                <div className={styles.list_prox}>
                    <span className={styles.list_prox_text}>Trabalhos Por Aceitar</span>
                </div>
                    <div>
                    {
                        notActiveReservations?
                            displayReservations()
                        :
                        <div className={styles.item_none}>
                            <div className={styles.item_flex}>
                                <span className={styles.item_type_tbd}>Sem Trabalhos Por Activar</span>
                            </div>
                        </div>
                    }
                    </div>
                </div>
        </div>
    )
}

export default AdminTrabalhosPA