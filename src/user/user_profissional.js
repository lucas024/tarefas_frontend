import React, {useEffect, useState} from 'react'
import styles from './user.module.css'
import Subscription from './subscription'
import Details from './details';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import WorkerBannerContent from '../general/workerBannerContent';
import Loader from '../general/loader';
import axios from 'axios';
import Sessao from '../transitions/sessao';
import {CSSTransition}  from 'react-transition-group';
import ModeBanner from '../general/modeBanner';


const UserProfissional = props => {
    const dispatch = useDispatch()
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})
    const worker_profile_complete = useSelector(state => {return state.worker_profile_complete})
    const user = useSelector(state => {return state.user})
    const api_url = useSelector(state => {return state.api_url})

    const [loading, setLoading] = useState(false)
    const [modeActivated, setModeActivated] = useState(false)
    const [preMode, setPreMode] = useState(false)

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [subTab, setSubTab] = useState('details')

    useEffect(() => {
        setLoading(true)
        let val = Object.fromEntries([...searchParams]).st
        if(val === 'subscription')
            setSubTab('subscription')
        else
            setSubTab('details')
        if(user) setLoading(false)
    }, [searchParams, user])

    const displayCurrentArea = () => {
        if(subTab === 'subscription')
        {
            return (
                <Subscription refreshWorker={() => props.refreshWorker()}/>
            )
        }
        else
        {
            return <Details />
        }
    }

    const userSetMode = () => {
        setLoading(true)
        axios.post(`${api_url}/user/update_worker`, {
            user_id : user._id,
        }).then(() => {
            props.refreshWorker()
            setModeActivated(true)
            setTimeout(() => setModeActivated(false), 4000)
            setPreMode(false)
            setLoading(false)
        })
    }

    return (
        <div className={styles.user}>
            <div className={preMode?styles.backdrop:null}/>
            <CSSTransition
                in={preMode?true:false}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <ModeBanner
                    cancel={() => setPreMode(false)}
                    confirm={() => userSetMode()}
                    profissional={true}
                    />
            </CSSTransition>
            <CSSTransition 
                in={modeActivated}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao text={"Modo Profissional ativado com sucesso!"}/>

            </CSSTransition>

            {
                loading?
                <div className={styles.backdrop}/>
                :null
            }
            <Loader loading={loading}/>
            <div className={styles.top_title_wrapper} style={{borderBottom:!user?.worker?"1px solid white":""}}>
                <span className={styles.top_title}>Profissional</span>
            </div>
            {
                user?.worker?
                <div className={styles.aba}>
                    <span className={subTab==='details'?styles.aba_side_selected:styles.aba_side} 
                        style={{borderBottom:worker_profile_complete?'':'2px solid #fdd835'}}
                        onClick={() => navigate('/user?t=profissional')}>
                        Detalhes de Profissional
                    </span>
                    <span className={subTab==='subscription'?styles.aba_side_selected:styles.aba_side}
                        style={{borderBottom:worker_is_subscribed?'':'2px solid #fdd835'}} onClick={() => navigate('/user?t=profissional&st=subscription')}>
                        Subscrição
                    </span>
                </div>
                :null
            }
            {
                user?.worker?
                displayCurrentArea()
                :
                !loading?
                <div className={styles.worker_wrapper_wrapper}>
                    <div className={styles.worker_wrapper}>
                        <WorkerBannerContent workerPage={true}/>
                        
                    </div>
                    <span className={styles.edit}  onClick={() => setPreMode(true)}>
                        ATIVAR MODO PROFISSIONAL
                    </span>
                </div>
                :null
                
            }
            
        </div>
    )
}

export default UserProfissional