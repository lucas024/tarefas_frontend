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

const stripePromise = loadStripe('pk_test_51GttAAKC1aov6F9poPimGBQDSxjDKl0oIEmJ2qEPqWFtRDvikJEt0OojYfKZiiT0YDcfdCvDQ5O3mHs9nyBgUwZU00qt1OdcAd');

const User = (props) => {

    const [searchParams] = useSearchParams()
    const [reservations, setReservations] = useState([])
    const [nextReservation, setNextReservation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const publishableKey = "pk_test_51GttAAKC1aov6F9poPimGBQDSxjDKl0oIEmJ2qEPqWFtRDvikJEt0OojYfKZiiT0YDcfdCvDQ5O3mHs9nyBgUwZU00qt1OdcAd"

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

    useEffect(() => {
        updateReservations()
    }, [props.user])

    const updateReservations = () => {
        setLoading(true)
        if(props.user?.type===0)
        {
            axios.get(`http://localhost:5000/reservations/get_by_id`, { params: {user_id: props.user._id} }).then(res => {
                console.log(res.data)
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
        if(val === "publications" && props.user?.type!==1)
            return <Publications api_url={props.api_url} reservations={reservations} user={props.user} refreshPublications={() => updateReservations()} loaded={loaded}/>
        else if(val === "personal")
            return <Personal loaded={loaded} user={props.user} api_url={props.api_url} incompleteUser={props.incompleteUser} updateUser={(val, what) => props.updateUser(val, what)} />
        else if(val === "support")
            return <Suporte user={props.user} api_url={props.api_url}/>
        else if(val === "messages")
            return <Messages user={props.user} api_url={props.api_url} updateChatReadLocal={chat_id => props.updateChatReadLocal(chat_id)}/>
        else if(val === "subscription" && props.user?.type===1)
            return (
                <Elements stripe={stripePromise}>
                    <Subscription user={props.user} api_url={props.api_url} refreshWorker={() => props.refreshWorker()}/>
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
                            api_url={props.api_url} 
                            incompleteUser={props.incompleteUser}
                            hasSubscription={props.hasSubscription}
                            user={props.user} 
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