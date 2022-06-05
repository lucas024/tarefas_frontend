import React, { useEffect, useState } from 'react'
import Reserva from './reserva'
import styles from './user.module.css'
import UserSidebar from './userSidebar'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ReservaList from './reservaList';
import Personal from './personal';

const User = (props) => {

    const [searchParams] = useSearchParams()
    const [reservations, setReservations] = useState([])
    const [nextReservation, setNextReservation] = useState(null)

    useEffect(() => {
        props.loadingHandler(true)
        if(props.user){
            axios.get(`http://localhost:5000/reservations`, { params: {user_id: props.user._id} }).then(res => {
            console.log(res.data)
            for(let el of res.data){
                if(el.type<2){
                    setNextReservation(el)
                }
            }
            setReservations(res.data)
            props.loadingHandler(false)
            })
        }
        
    }, [props.user])

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "upcreservation")
            return <Reserva nextReservation={nextReservation}/>
        if(val === "reservations")
            return <ReservaList nextReservation={nextReservation} reservations={reservations}/>
        if(val === "personal")
            return <Personal user={props.user}/>
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