import React from 'react'
import styles from './confirmEmail.module.css'
import Lottie from 'lottie-react';
import * as success from '../assets/lotties/success-blue.json'

const ConfirmEmail = (props) => {

    return (
        <div className={styles.email}>
            <div className={styles.main} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>E-mail verificado com sucesso!</p>
                <Lottie
                    loop={false}
                    autoplay={true}
                    animationData={success}
                    rendererSettings= {
                        {preserveAspectRatio: 'xMidYMid slice'}
                    }
                    style={{
                        width:'150px',
                        height:'150px',
                        justifySelf:'center',
                        alignSelf:'center',
                        margin:'auto',
                        marginTop:'50px',
                        marginBottom:'20px'
                    }}
                />

                {/* <div className={styles.main_inner}>                      
                    <div className={styles.button} onClick={() => {
                        window.open("", "_self")
                        window.close()
                    }}>
                        <span className={styles.button_text}>FECHAR PÁGINA</span>
                    </div>
                </div> */}
                <p className={styles.button_text}>PODES FECHAR ESTA PÁGINA</p>
            </div>
        </div>
    )
}

export default ConfirmEmail