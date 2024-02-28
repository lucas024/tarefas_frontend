import React, {useState} from 'react'
import styles from './banner.module.css'
import { useNavigate } from 'react-router-dom';

const VerificationBannerTooMany = (props) => {

    const navigate = useNavigate()

    return (
        <div className={styles.verification}>
            <div className={styles.main} style={{borderColor:"#0358e5"}} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>5 Publicações ativas</p>
                <span className={styles.title_separator}/>
                <div className={styles.main_inner}>
                    <p className={styles.phone_description} style={{textAlign:"center"}}>
                    Já tem 5 publicações activas/pendentes. Conclua ou remova uma ou mais publicações anteriores para publicar uma nova tarefa.
                    </p>
                    
                    <div className={styles.button} style={{backgroundColor:"#0358e5"}} onClick={() => navigate('/user?t=publications', {replace:true})}>
                        <span className={styles.button_text}>GERIR PUBLICAÇÕES</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerificationBannerTooMany