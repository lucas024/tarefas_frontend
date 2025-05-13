import React from 'react'
import styles from './confirmEmail.module.css'
import Lottie from 'lottie-react';
import * as success from '../assets/lotties/success-blue.json'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';


const ConfirmEmail = () => {

    const user = useSelector(state => {return state.user})
    const navigate = useNavigate()

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

                <div className={styles.main_inner}>                      
                    <div className={styles.button} onClick={() => {
                        if(user?.worker&&!user?.subscription)
                        {
                            navigate('/user?t=profissional&st=subscription')
                        }
                        navigate('/')
                    }}>
                        <span className={styles.button_text}>
                            {
                                user?.worker&&!user?.subscription?
                                "Ir para a página de subscrição"
                                :
                                "Ir para a página inicial"
                            }
                        </span>
                    </div>
                </div>
                {/* <p className={styles.button_text}>PODES FECHAR ESTA PÁGINA</p> */}
            </div>
        </div>
    )
}

export default ConfirmEmail