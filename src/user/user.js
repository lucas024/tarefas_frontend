import React, { useEffect, useState } from 'react'
import styles from './user.module.css'
import UserSidebar from './userSidebar'
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Publications from './publications';
import Personal from './personal';
import Suporte from './suporte';
import Messages from './messages';
import Subscription from './subscription';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Loader from '../general/loader';
import { useSelector } from 'react-redux'

const stripePromise = loadStripe('pk_live_ypMbNWLAJDZYOWG4JqncBktA00qBx03bOR');

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
        if(user?.type===0)
        {
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
        
    }

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications" && user?.type!==1)
            return <Publications reservations={reservations} user={user} refreshPublications={() => updateReservations()} loaded={loaded}/>
        else if(val === "personal")
            return <Personal loaded={loaded}/>
        else if(val === "support")
            return <Suporte/>
        else if(val === "messages")
            return <Messages/>
        else if(val === "subscription" && user?.type===1)
            return (
                <Elements stripe={stripePromise}>
                    <Subscription refreshWorker={() => props.refreshWorker()}/>
                </Elements>
            ) 
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