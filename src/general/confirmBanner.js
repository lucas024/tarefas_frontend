import React, {useEffect, useState} from 'react'
import styles from './banner.module.css'

const ConfirmBanner = (props) => {

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            <div className={styles.main} style={{borderColor:props.color?props.color:""}} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>Cancelar Alteração</p>
                <span className={styles.title_separator}/>
                <div className={styles.main_inner}>
                    <p className={styles.phone_description}>Quer proceder com o <strong>cancelemento</strong> da alteração de plano?</p>                     
                    <div className={styles.button} style={{backgroundColor:props.color?props.color:""}} onClick={() => props.confirm()}>
                        <span className={styles.button_text}>CONFIRMAR</span>
                    </div>
                </div>
                <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
            </div>
        </div>
    )
}

export default ConfirmBanner