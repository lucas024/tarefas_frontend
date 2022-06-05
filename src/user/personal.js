import React, {useEffect, useState} from 'react'
import styles from './personal.module.css'

const Personal = (props) => {
    return (
        <div className={styles.personal}>
            <div className={styles.personal_title}>
                <span className={styles.top_title}>Dados Pessoais</span>
            </div>
            <div className={styles.flex}>
                <div className={styles.image_wrapper}>
                    <img className={styles.image}></img>
                    {/* edit button */}
                </div>
                <div className={styles.input_flex}>
                    <div className={styles.input_edit_wrapper}>
                        {/* edit button */}
                    </div>
                    <div className={styles.input_div}>
                        <input className={styles.input_input}></input>
                    </div>
                    <div className={styles.input_div}>
                        <input className={styles.input_input}></input>
                    </div>
                    <div className={styles.input_div}>
                        <input className={styles.input_input}></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Personal