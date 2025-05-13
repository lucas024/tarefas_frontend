import React, {useEffect, useState, useRef} from 'react'
import styles from './banner.module.css'



const ModeBanner = props => {

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            <div className={styles.main} onClick={e => e.stopPropagation()} style={{borderColor:props.profissional?'#FF785A':''}}>
                <p className={styles.title}>Ativar modo profissional</p>
                <span className={styles.title_separator}/>
                <div className={styles.main_inner}>
                    <p className={styles.phone_description}>Ao ativares este modo, passarás a ter uma conta profissional. Após <strong>verificares o teu e-mail</strong>, <strong>preencheres os teus detalhes de profissional</strong> e <strong>ativares a tua subscrição</strong>, poderás começar a contactar os clientes.</p>
                    <p className={styles.phone_description}>Poderás continuar a publicar tarefas e contactar outros profissionais, mesmo tendo o modo profissional ativo.</p>
                </div>

                <div 
                    className={styles.button}
                    style={{backgroundColor:"#FF785A"}}
                    onClick={() => props.confirm()}>
                    <span className={styles.button_text} style={{color:"white"}}>ATIVAR</span>
                </div>

                <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                
            </div>

        </div>
    )
}

export default ModeBanner