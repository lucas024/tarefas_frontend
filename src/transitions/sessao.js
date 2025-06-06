import React from 'react'
import styles from './sessao.module.css'

const Sessao = (props) => {
    return (
        <div onClick={props.removePopin} className={props.user_page?styles.sessao_sub:styles.sessao} style={{borderColor:props.error?"#ff3b30":"#0358e5"}}>
            <span className={styles.sessao_text}>
                {props.text}
            </span>
        </div>
    )
}

export default Sessao