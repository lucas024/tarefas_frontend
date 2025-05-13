import React from 'react'
import styles from './notification.module.css'
import ClearIcon from '@mui/icons-material/Clear';

const Notification = (props) => {
    return (
        <div className={styles.notification_backdrop}>
            <div className={styles.notification}>
                <span className={styles.value}>{props.val}</span>
                <div className={styles.buttons}>
                    <span 
                        className={styles.buttonYes}
                        onClick={() => props.updateWorkerWeekends(true)}
                        >CONFIRMAR</span>
                    <span 
                        className={styles.buttonNo}
                        onClick={() => props.updateWorkerWeekends(false)}
                        >CANCELAR</span>
                </div>
                <ClearIcon 
                    className={styles.x}
                    sx={{fontSize: 20}}
                    onClick={() => props.updateWorkerWeekends(false)}
                    >X</ClearIcon>
            </div>
        </div>
    )
}

export default Notification