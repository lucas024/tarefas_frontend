import React, { useState } from 'react'
import Reserva from './reserva'
import styles from './user.module.css'
import UserSidebar from './userSidebar'
import { useSearchParams } from 'react-router-dom';

const User = (props) => {

    const [searchParams] = useSearchParams()

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "upcreservation")
            return <Reserva user={props.user}/>
    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <UserSidebar user={props.user} />
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