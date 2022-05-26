import React from 'react'
import styles from './sessao.module.css'

const Sessao = (props) => {
    return (
        <div className={styles.sessao}>
            <span className={styles.sessao_text}>
                {props.text}
            </span>
        </div>
    )
}

export default Sessao