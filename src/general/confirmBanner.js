import React, {useEffect, useState} from 'react'
import styles from './banner.module.css'

const ConfirmBanner = (props) => {

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            {
                props.type==='alterar'?
                <div className={styles.main} style={{borderColor:props.color?props.color:""}} onClick={e => e.stopPropagation()}>
                    <p className={styles.title}>Cancelar Alteração</p>
                    <span className={styles.title_separator}/>
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Quer proceder com o <strong>cancelemento</strong> da alteração de plano?</p>                     
                        <div className={styles.button} style={{backgroundColor:'#FF785A'}} onClick={() => props.confirm()}>
                            <span className={styles.button_text}>CONFIRMAR</span>
                        </div>
                    </div>
                    <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                </div>
                :
                props.type==='three_months'?
                <div className={styles.main} style={{borderColor:props.color?props.color:""}} onClick={e => e.stopPropagation()}>
                    <p className={styles.title}>Ativar Subscrição gratuita</p>
                    <span className={styles.title_separator}/>
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Ao proceder com a <strong>subscrição gratuita de 100 dias</strong>, não poderá usufruir do desconto exclusivo de primeira ativação, após o periodo gratuíto.</p>                     
                        <div className={styles.button} style={{backgroundColor:'#FF785A'}} onClick={() => props.confirm()}>
                            <span className={styles.button_text} style={{color:"white"}}>Ativar 100 dias Gratuitos</span>
                        </div>
                    </div>
                    <p className={styles.cancel} onClick={() => props.cancel()}>Cancelar</p>
                </div>
                :null
            }
        </div>
    )
}

export default ConfirmBanner