import React from 'react'
import styles from './noPage.module.css'
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';

const NoPage = (props) => {

    const navigate = useNavigate()

    return (
        <div className={styles.blank}>
            <div className={styles.blank_flex}>
                <span className={styles.blank_text}>Esta {props.object} não existe</span>
                <Sad className={styles.blank_face}/>
                <span className={styles.blank_request}>
                    Voltar à <span className={styles.blank_request_click} onClick={() => navigate('/main/publications')}>página inícial</span>
                </span>
            </div>
        </div>
    )
}

export default NoPage