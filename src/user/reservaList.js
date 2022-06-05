import React, {useEffect, useState} from 'react'
import styles from './reservaList.module.css'
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import Reserva from './reserva'

const ReservaList = (props) => {

    const [typeColor, setTypeColor] = useState("#ffffff")
    const [displayReserva, setDisplayReserva] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if(props.nextReservation.type===0) {setTypeColor("#C3CEDA")}
        if(props.nextReservation.type===1) {setTypeColor("#fdd835")}
        if(props.nextReservation.type===2) {setTypeColor("#30A883")}
        if(props.nextReservation.type===3) {setTypeColor("#1EACAA")}
    }, [props.nextReservation])

    const getTime = (val) => {
        let time = new Date(val)
        return time.toISOString().split("T")[0]
    }

    const displayReservations = () => {
        return props.reservations.map((res, i) => {
            return (
                <div key={i} className={styles.item_wrapper} style={{borderColor:typeColor}} onClick={() => {
                    if(res.type<4){
                        navigate('/user?t=upcreservation')
                    } 
                    else {
                        setDisplayReserva(res)
                    }
                }}>
                    <div className={styles.item}>
                        <div className={styles.item_flex}>
                            <span className={styles.item_indicator} style={{backgroundColor:typeColor}}></span>
                            <span className={styles.item_type} style={{color:typeColor}}>
                                {
                                    res.type===1?"Por confirmar":
                                    res.type===2?"Confirmada":
                                    res.type===3?"Por pagar":
                                    res.type===4?"Concluído":
                                        "A processar"
                                }
                            </span>
                        </div>
                        <div className={styles.item_flex}>
                            {
                                res.workerType==="eletricista"?
                                <img src={elec} className={styles.item_flex_worker}></img>
                                :res.workerType==="canalizador"?
                                <img src={cana} className={styles.item_flex_worker}></img>
                                :
                                <img src={carp} className={styles.item_flex_worker}></img>
                            }
                            <span className={styles.item_flex_worker_text}>{res.workerType}</span>
                        </div>
                        <div className={styles.item_flex}>
                            <EventIcon className={styles.item_flex_symbol}/>
                            {
                                res.date?
                                <span></span>
                                :<span className={styles.text_tbd}>Por determinar</span>
                            }
                        </div>
                        <div className={styles.item_flex}>
                            <AccessTimeIcon className={styles.item_flex_symbol}/>
                            {
                                res.startTime?
                                <span></span>
                                :<span className={styles.text_tbd}>Por determinar</span>
                            }  
                        </div>
                        <span className={styles.request_date}>{getTime(res.requestedDate)}</span>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={styles.reserva_list}>
            {
                displayReserva?
                <Reserva 
                    nextReservation={displayReserva} 
                    previous={true} 
                    previous_date={getTime(displayReserva.requestedDate)}
                    back_handler={() => setDisplayReserva(null)}/>
                :
                <div>
                    <div className={styles.list_title}>
                        <span className={styles.top_title}>Reservas</span>
                    </div>

                    <div className={styles.list}>
                        <div className={styles.list_prox}>
                        <span className={styles.list_prox_text}>A próxima Reserva</span>
                    </div>
                        <div>
                            {
                            props.nextReservation?
                            <div className={styles.item_wrapper} style={{borderColor:typeColor}}>
                                <div className={styles.item} onClick={() => navigate('/user?t=upcreservation')}>
                                    <div className={styles.item_flex}>
                                        <span className={styles.item_indicator} style={{backgroundColor:typeColor}}></span>
                                        <span className={styles.item_type} style={{color:typeColor}}>
                                            {
                                                props.nextReservation.type===1?"Por confirmar":
                                                props.nextReservation.type===2?"Confirmada":
                                                props.nextReservation.type===3?"Por pagar":
                                                props.nextReservation.type===4?"Concluído":
                                                    "A processar"
                                            }
                                        </span>
                                    </div>
                                    <div className={styles.item_flex}>
                                        {
                                            props.nextReservation.workerType==="eletricista"?
                                            <img src={elec} className={styles.item_flex_worker}></img>
                                            :props.nextReservation.workerType==="canalizador"?
                                            <img src={cana} className={styles.item_flex_worker}></img>
                                            :
                                            <img src={carp} className={styles.item_flex_worker}></img>
                                        }
                                        <span className={styles.item_flex_worker_text}>{props.nextReservation.workerType}</span>
                                    </div>
                                    <div className={styles.item_flex}>
                                        <EventIcon className={styles.item_flex_symbol}/>
                                        {
                                            props.nextReservation.date?
                                            <span></span>
                                            :<span className={styles.text_tbd}>Por determinar</span>
                                        }
                                    </div>
                                    <div className={styles.item_flex}>
                                        <AccessTimeIcon className={styles.item_flex_symbol}/>
                                        {
                                            props.nextReservation.startTime?
                                            <span></span>
                                            :<span className={styles.text_tbd}>Por determinar</span>
                                        }  
                                    </div>
                                    <span className={styles.request_date}>{getTime(props.nextReservation.requestedDate)}</span>
                                </div>
                            </div>
                            
                            :
                            <div className={styles.item}>
                                <div className={styles.item_flex}>
                                    <span className={styles.item_indicator}></span>
                                    <span className={styles.item_type_tbd}>Sem reserva marcada</span>
                                </div>
                            </div>
                            }
                            </div>
                            <div className={styles.list_prox} style={{marginTop:0}}>
                                <span className={styles.list_prox_text}>Todas as suas Reservas</span>
                            </div>
                            {
                                props.reservations?
                                    displayReservations()
                                :
                                <div className={styles.item}>
                                    <div className={styles.item_flex}>
                                        <span className={styles.item_indicator}></span>
                                        <span className={styles.item_type_tbd}>Sem reservas prévias</span>
                                    </div>
                                </div>
                                }
                        </div>
                </div>

            }
            
        </div>
    )
}

export default ReservaList