import React, { useEffect, useState } from 'react'
import Reserva from '../main/reserva'
import styles from './user.module.css'
import UserSidebar from './userSidebar'
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReservaList from './reservaList';
import Personal from './personal';
import Suporte from './suporte';

const User = (props) => {

    const [searchParams] = useSearchParams()
    const [reservations, setReservations] = useState([])
    const [nextReservation, setNextReservation] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        props.loadingHandler(true)
        if(props.user){
            updateReservations()
        }
    }, [props.user])

    const updateReservations = () => {
        axios.get(`http://localhost:5000/reservations`, { params: {user_id: props.user._id} }).then(res => {
            for(let el of res.data){
                if(el.type<2){
                    setNextReservation(el)
                }
            }
            setReservations(res.data)
            props.loadingHandler(false)
            })
    }

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications")
            return <ReservaList api_url={props.api_url} reservations={reservations} user={props.user} refreshPublications={() => updateReservations()}/>
        else if(val === "personal")
            return <Personal user={props.user} api_url={props.api_url} refreshUser={() => props.refreshUser()}/>
        else if(val === "support")
            return <Suporte user={props.user} api_url={props.api_url}/>
        return <span>page not exist</span>
    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <UserSidebar user={props.user} nextReservation={nextReservation}/>
                </div>
                <div className={styles.right}>
                    <div className={styles.worker_area}>
                        <div className={styles.area}>
                            {displayCurrentArea()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User