import React, { useState } from 'react'
import styles from './user.module.css'

const User = () => {

    const [currentArea, updateCurrentArea] = useState()

    const displayCurrentArea = () => {

    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <div className={styles.right_top}>
                        <div className={styles.top_flex}>
                            <div className={styles.worker_data_flex}>
                                <img className={styles.worker_img}/>
                                <div className={styles.worker_personal_flex_column}>
                                    <span className={styles.name}></span>
                                    <div className={styles.rating_div}>
                                        <img className={styles.star}/>
                                        <span className={styles.rating}></span>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={styles.worker_desc_div}>
                                <span className={styles.worker_desc}></span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.worker_area}>
                        <div className={styles.area_tabs_div}>
                            <span>Reservas</span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={styles.area}>
                            {displayCurrentArea}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User