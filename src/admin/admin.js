import React, { useEffect, useState } from 'react'
import styles from '../user/user.module.css'
import AdminSidebar from './adminSidebar'
import AdminMessages from './adminMessages';
import AdminTrabalhosPA from './adminTrabalhosPA';
import { useSearchParams } from 'react-router-dom';
import Loader from '../general/loader';
import AdminTrabalhosA from './adminTrabalhosA';

const Admin = (props) => {

    const [searchParams] = useSearchParams()
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        //ver se e admin
    }, [props.user])

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "publications_PA")
            return <AdminTrabalhosPA api_url={props.api_url} user={props.user} loaded={loaded}/>
        else if(val === "publications_A")
            return <AdminTrabalhosA api_url={props.api_url} user={props.user} loaded={loaded}/>
        else if(val === "messages")
            return <AdminMessages user={props.user} api_url={props.api_url}/>
        return null
    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}>
                    {
                        loaded?
                        <AdminSidebar
                            api_url={props.api_url} 
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

export default Admin