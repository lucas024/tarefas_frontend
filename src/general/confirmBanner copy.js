import React, {useEffect, useState} from 'react'
import styles from './banner.module.css'

const confirmBanner = (props) => {

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            <div className={styles.main} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>Verificar Telemóvel</p>
                <span className={styles.title_separator}/>
                <div className={styles.main_inner}>                      
                    <div className={styles.button} onClick={() => {}}>
                        <span className={styles.button_text}>VERIFICAR código</span>
                    </div>
                </div>
                <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
            </div>
        </div>
    )
}

export default confirmBanner