import React from 'react'
import styles from './welcome.module.css'
import logo_text from '../assets/logo_text.png'

const Welcome = (props) => {

    return (
        <div className={styles.welcome_wrapper}>

            <div className={styles.welcome}>
                <div className={styles.main}>
                    <img className={styles.text_brand} src={logo_text}/>
                    {/* <span className={styles.sub_title_title}>No Serviços poderás:</span> */}
                    <div className={styles.sub_main}>
                    <span className={styles.sub_title_separator}>O lugar ideal para</span>
                        <div className={styles.sub_sub_main}>
                            <span className={styles.sub_title}>
                                <span className={styles.sub_title_special} style={{color:"#FF785A"}}> encontrar profissionais </span> 
                                para realizar o teu trabalho.
                            </span>
                        </div>
                        <span className={styles.sub_title_separator}>OU</span>
                        <div className={styles.sub_sub_main}>
                            <span className={styles.sub_title}>
                                <span className={styles.sub_title_special} style={{color:"#0358e5"}}> publicar </span>
                                o teu trabalho e receber contacto dos profissionais.
                            </span>
                        </div>
                    </div>
                    <span className={styles.button}>
                        <span className={styles.button_text} onClick={() => props.closeWelcome()}>CONTINUAR PARA A PÁGINA INICIAL</span>
                    </span>
                </div>
            </div>
        </div>
        
    )
}

export default Welcome