import React, {useEffect, useState} from 'react'
import styles from './publications.module.css'
import { useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { storage } from '../firebase/firebase'
import { ref, deleteObject } from "firebase/storage";
import axios from 'axios';
import Loader from '../general/loader';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { useSelector } from 'react-redux'

const Publications = (props) => {
    const api_url = useSelector(state => {return state.api_url})

    const navigate = useNavigate()
    const [removeArray, setRemoveArray] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeReservations, setActiveReservations] = useState(false)
    const [notActiveReservations, setNotActiveReservations] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        console.log(props.reservations)
        for(let res of props.reservations){
            if(res.type<3){
                setActiveReservations(true)
            } 
            else{
                setNotActiveReservations(true)
            }
        }
        if(props.reservations.length===0)
        {
            setActiveReservations(false)
            setNotActiveReservations(false)
        }
    }, [props.reservations])

    useEffect(() => {
        props.loaded&&setLoaded(true)
    }, [props.loaded])

    const getTime = (val) => {
        let time = new Date(val)
        return time.toISOString().split("T")[0]
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#ff3b30"
        if(type===3) return "#1EACAA"
        return "#FFFFFF"
    }

    const deleteHandler = async (e, reservation) => {
        e.stopPropagation()
        setLoading(true)
        const obj = {
            _id:reservation._id
        }
        axios.post(`${api_url}/reservations/remove`, obj)
        .then(() => {
            setLoading(false)
            props.refreshPublications()
        })
        await Promise.all(reservation.photos.map((photo, key) => {
            const deleteRef = ref(storage, `/posts/${reservation._id}/${key}`)
            console.log(deleteRef)
            return deleteObject(deleteRef)
        }))

    }

    const cancelHandler = (e, reservationID) => {
        e.stopPropagation()
        let val = [...removeArray]
        val.splice(val.indexOf(reservationID), 1)
        setRemoveArray(val)
    }

    const getPhotoPrincipal = (array_photos, photo_principal) => {
        for(let el of array_photos){
            if(el.id === photo_principal){
                return el.url
            }
        }
        return array_photos[0].url
    }

    const displayReservations = (num1, num2, num3) => {
        return props.reservations.map((res, i) => {
            if(res.type===num1 || res.type===num2 || res.type===num3){
                return (
                    <div key={i} className={styles.item_wrapper} 
                            onClick={() => navigatePubHandler(res._id)}
                            style={{borderBottom:removeArray.includes(res._id)?'none':""}}>
                        {
                            removeArray.includes(res._id)?
                                <div className={styles.remove_div}>
                                    <div className={styles.center_text_div}>
                                        <span className={styles.center_text}>
                                            Tem a certeza de que quer <span className={styles.center_text_special}>eliminar</span> a publicação?
                                        </span>
                                    </div>
                                    <span className={styles.button_eliminate} onClick={e => deleteHandler(e, res)}>
                                        Eliminar
                                    </span>
                                    <span className={styles.button_cancel} onClick={e => cancelHandler(e, res._id)}>
                                        Cancelar
                                    </span>
                                </div>
                            :null
                        }
                        <div className={styles.item} style={{borderColor:getTypeColor(res.type)}}>
                            <div className={styles.item_left}>
                                {
                                    res?.photos[0]?
                                    <img src={getPhotoPrincipal(res?.photos, res.photo_principal)} className={styles.item_img}></img>
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
                            <div className={styles.item_right}>
                                <div className={styles.top_left_indicator_more}>
                                    <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(res.type)}}>
                                        <span className={styles.item_indicator}></span>
                                        <span className={styles.item_type}>
                                            {
                                                res.type===1?"Activo":
                                                res.type===2?"Incorreto":
                                                res.type===3?"Concluído":
                                                    "Processar"
                                            }
                                        </span>
                                    </div>
                                    <div className={styles.more_wrapper} onClick={e => {
                                            e.stopPropagation()
                                            let val = [...removeArray]
                                            val.push(res._id)
                                            setRemoveArray(val)}}>
                                        <DeleteOutlineIcon className={styles.more} />
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
            }
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
                <span className={styles.top_title}>Os Meus Trabalhos</span>
            </div>

            <div className={styles.list}>
                <div className={styles.list_prox}>
                    <span className={styles.list_prox_text}>Trabalhos</span>
                </div>
                    <div>
                    {
                        activeReservations?
                            displayReservations(0, 1, 2)
                        :
                        loaded?
                        <div className={styles.item_none} style={{padding:"30px 0"}}>
                            <div className={styles.item_flex}>
                                <span className={styles.item_type_tbd}>Sem trabalhos activos</span>
                                <span className={styles.publicar} onClick={() => {navigate('/publicar')}}>
                                    PUBLICAR
                                </span>
                            </div>
                        </div>
                        :<div style={{height:"120px", width:"100%", backgroundColor:"white"}} />
                    }
                    </div>
                    <div className={styles.list_prox} style={{marginTop:0, backgroundColor:"#0358e530"}}>
                        <span className={styles.list_prox_text}>Trabalhos Concluídos</span>
                    </div>
                    {
                        notActiveReservations?
                            displayReservations(3, 3, 3)
                        :
                        <div className={styles.item_none}>
                            <div className={styles.item_flex}>
                                <span className={styles.item_type_tbd}>Sem trabalhos concluídos</span>
                            </div>
                        </div>
                        }
                </div>
        </div>
    )
}

export default Publications