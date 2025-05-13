import React, { useEffect, useState } from 'react'
import styles from './user.module.css'
import UserSidebar from './userSidebar'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Publications from './publications';
import Personal from './personal';
import Suporte from './suporte';
import Messages from './messages';
import Loader from '../general/loader';
import { useSelector } from 'react-redux'
import UserProfissional from './user_profissional';

const User = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})

    const [searchParams] = useSearchParams()
    const [reservations, setReservations] = useState([])
    const [nextReservation, setNextReservation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

    useEffect(() => {
        updateReservations()
    }, [user])

    const updateReservations = () => {
        setLoading(true)
        axios.get(`${api_url}/reservations/get_by_id`, { params: {user_id: user._id} }).then(res => {
            for(let el of res.data){
                if(el.type<2){
                    setNextReservation(el)
                }
            }
            setReservations(res.data)
            setLoading(false)
        })
        
    }

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications")
            return <Publications reservations={reservations} user={user} refreshPublications={() => updateReservations()} loaded={loaded}/>
        else if(val === "conta")
            return <Personal loaded={loaded}/>
        else if(val === "support")
            return <Suporte/>
        else if(val === "messages")
            return <Messages/>
        else if(val === "profissional")
            return <UserProfissional refreshWorker={props.refreshWorker}/>
        return null
    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}>
                    {
                        loaded?
                        <UserSidebar
                            nextReservation={nextReservation} 
                            notifications={props.notifications}
                            />
                        :<div className={styles.sidebar_skeleton}>
                            <Loader loading={loading}/>
                        </div>
                    }
                    
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