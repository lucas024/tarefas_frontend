import React, {useEffect, useState} from 'react'
import styles from './user.module.css'
import Subscription from './subscription'
import {loadStripe} from '@stripe/stripe-js';
import Details from './details';
import {Elements} from '@stripe/react-stripe-js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

const stripePromise = loadStripe('pk_test_51GttAAKC1aov6F9poPimGBQDSxjDKl0oIEmJ2qEPqWFtRDvikJEt0OojYfKZiiT0YDcfdCvDQ5O3mHs9nyBgUwZU00qt1OdcAd');


const UserProfissional = props => {

    const user = useSelector(state => {return state.user})

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [subTab, setSubTab] = useState('details')

    useEffect(() => {
        let val = Object.fromEntries([...searchParams]).st
        if(val === 'subscription')
            setSubTab('subscription')
        else
            setSubTab('details')
    }, [searchParams])

    const displayCurrentArea = () => {
        if(subTab === 'subscription')
        {
            return (
                <Elements stripe={stripePromise}>
                    <Subscription refreshWorker={() => props.refreshWorker()}/>
                </Elements>
            )
        }
        else
        {
            return <Details />
        }
    }

    return (
        <div className={styles.user}>
            <div className={styles.top_title_wrapper}>
                <span className={styles.top_title}>Profissional</span>
            </div>
            <div className={styles.aba}>
                <span className={subTab==='details'?styles.aba_side_selected:styles.aba_side} onClick={() => navigate('/user?t=profissional')}>
                    Detalhes de Profissional
                </span>
                <span className={subTab==='subscription'?styles.aba_side_selected:styles.aba_side} onClick={() => navigate('/user?t=profissional&st=subscription')}>
                    Subscrição
                </span>
            </div>
            {displayCurrentArea()}
        </div>
    )
}

export default UserProfissional