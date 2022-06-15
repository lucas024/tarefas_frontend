import React, {useEffect, useState} from 'react'
import styles from './reservaList.module.css'
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Reserva from './reserva'

const ReservaList = (props) => {

    const [displayReserva, setDisplayReserva] = useState(null)
    const [activeReservations, setActiveReservations] = useState(false)
    const [notActiveReservations, setNotActiveReservations] = useState(false)
    

    useEffect(() => {
        for(let res of props.reservations){
            if(res.type<2){
                setActiveReservations(true)
            } 
            else{
                setNotActiveReservations(true)
            }
        }
    }, [props.reservations])

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

    const displayActiveReservations = () => {
        return props.reservations.map((res, i) => {
            if(res.type<2){
                return (
                    <div key={i} className={styles.item_wrapper} onClick={() => {setDisplayReserva(res)}}>    
                        <div className={styles.item} style={{borderColor:getTypeColor(res.type)}}>
                            <div className={styles.item_left}>
                                <img src={res.photos[0]?res.photos[0]:""} className={styles.item_img}></img>
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
                            <div className={styles.item_right}>
                                <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(res.type)}}>
                                    <span className={styles.item_indicator}></span>
                                    <span className={styles.item_type}>
                                        {
                                            res.type===1?"Activo":
                                            res.type===2?"Concluído":
                                                "Processar"
                                        }
                                    </span>
                                </div>
                                <div className={styles.item_flex}>
                                    <div className={styles.item_time}>{getTime(res.publication_time)}</div>
                                </div>
                                <div className={styles.item_flex}>
                                    <span className={styles.item_flex_worker_text}>{res.workerType}</span>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                )
            }
        })
    }

    const displayNonActiveReservations = () => {
        return props.reservations.map((res, i) => {
            if(res.type===2){
                return (
                    <div key={i} className={styles.item_wrapper} style={{borderColor:getTypeColor(res.type)}} 
                        onClick={() => {setDisplayReserva(res)}}>
                        <div className={styles.item}>
                            <div className={styles.item_flex}>
                                <span className={styles.item_indicator} style={{backgroundColor:getTypeColor(res.type)}}></span>
                                <span className={styles.item_type} style={{color:getTypeColor(res.type)}}>
                                    {
                                        res.type===1?"Publicado":
                                        res.type===2?"Concluído":
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
            }
        })
    }

    return (
        <div className={styles.reserva_list}>
            {
                displayReserva?
                <Reserva 
                    nextReservation={displayReserva} 
                    previous={true} 
                    back_handler={() => setDisplayReserva(null)}/>
                :
                <div>
                    <div className={styles.list_title}>
                        <span className={styles.top_title}>As Minhas Publicações</span>
                    </div>

                    <div className={styles.list}>
                        <div className={styles.list_prox}>
                            <span className={styles.list_prox_text}>Publicações Activas</span>
                        </div>
                            <div>
                            {
                            activeReservations?
                                displayActiveReservations()
                            :
                            <div className={styles.item_none}>
                                <div className={styles.item_flex}>
                                    <span className={styles.item_type_tbd}>Sem publicações activas</span>
                                </div>
                            </div>
                            }
                            </div>
                            <div className={styles.list_prox} style={{marginTop:0}}>
                                <span className={styles.list_prox_text}>Publicações Concluídas</span>
                            </div>
                            {
                                notActiveReservations?
                                displayNonActiveReservations()
                                :
                                <div className={styles.item_none}>
                                    <div className={styles.item_flex}>
                                        <span className={styles.item_type_tbd}>Sem publicações concluídas</span>
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