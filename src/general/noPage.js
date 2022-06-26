import React from 'react'
import styles from './noPage.module.css'
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

const NoPage = (props) => {

    const navigate = useNavigate()

    return (
        <div className={styles.blank}>
            {
                props.object==="mensagens"?
                <div className={styles.blank_flex}>
                    <span className={styles.blank_text}>Ainda não tens mensagens</span>
                    <ChatIcon className={styles.blank_face}/>
                    <span className={styles.blank_request}>
                        Procurar <span className={styles.blank_request_click} onClick={() => navigate('/main/publications/trabalhos')}>trabalhos</span>
                    </span>
                </div>
                :
                <div className={styles.blank_flex}>
                    <span className={styles.blank_text}>Esta {props.object} não existe</span>
                    <Sad className={styles.blank_face}/>
                    <span className={styles.blank_request}>
                        Voltar à <span className={styles.blank_request_click} onClick={() => navigate('/')}>página inícial</span>
                    </span>
                </div>
            }
            
        </div>
    )
}

export default NoPage