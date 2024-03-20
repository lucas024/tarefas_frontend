import React, { useState } from 'react'
import styles from './welcome.module.css'
import logo_text from '../assets/logo_text.png'
import {CSSTransition}  from 'react-transition-group';

const Welcome = (props) => {

    const [finalTrigger, setFinalTrigger] = useState(false)

    return (
        <div className={styles.welcome_wrapper}>

            <div className={styles.welcome}>
                <div className={styles.main}>
                    <img className={styles.text_brand} src={logo_text}/>
                    <div className={styles.sub_main_wrapper}>
                        <CSSTransition 
                            in={props.showWelcomeTrigger1000}
                            onEntered={() => setTimeout(() => setFinalTrigger(true), 1000)}
                            timeout={1000}
                            classNames="fade"
                            unmountOnExit
                            >
                            <div className={styles.sub_main}>
                                <span className={styles.sub_title_separator}>O lugar ideal para</span>
                                <div className={styles.sub_sub_main}>
                                    <span className={styles.sub_title}>
                                        <span className={styles.sub_title_special} style={{color:"#0358e5"}}> publicar </span>
                                        a tua tarefa e receber contacto dos profissionais.
                                    </span>
                                </div>
                                <span className={styles.sub_title_separator}>OU</span>
                                <div className={styles.sub_sub_main}>
                                    <span className={styles.sub_title}>
                                        <span className={styles.sub_title_special} style={{color:"#FF785A"}}> encontrar profissionais </span> 
                                        para realizar a tua tarefa.
                                    </span>
                                </div>
                                

                            </div>
                        </CSSTransition>
                    </div>
                    
                    <div className={styles.button_wrapper}>
                        <CSSTransition 
                                in={finalTrigger}
                                timeout={1000}
                                classNames="fade"
                                unmountOnExit
                                >
                            <span className={styles.button} onClick={() => props.closeWelcome()}>
                                <span className={styles.button_text}>CONTINUAR PARA A PÁGINA INICIAL</span>
                            </span>
                        </CSSTransition>
                    </div>                    
                </div>
            </div>
        </div>
        
    )
}

export default Welcome