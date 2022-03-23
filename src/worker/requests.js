import React, { useState } from 'react'
import styles from './requests.module.css'

const Requests = () => {

    const [requests, setRequests] = useState([])

    const requestsDisplay = () => {
        return requests.map((req,i) => {
            return (
                <div>
                    
                </div>
            )
        })
    }
    return (
        <div className={styles.requests}>
            <div className={styles.requests_top}>
                <span className={styles.requests_title}></span>
            </div>
            <div className={styles.requests_bottom}>
                {requestsDisplay}
            </div>
        </div>
    )
}

export default Requests