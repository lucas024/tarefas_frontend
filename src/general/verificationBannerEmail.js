import React, {useEffect, useState, useRef} from 'react'
import styles from './banner.module.css'
import Lottie from 'lottie-react';
import * as planeEmail from '../assets/lotties/plane-email.json'
import * as success from '../assets/lotties/success-blue.json'
import Timer from './timer'


const VerificationBannerEmail = (props) => {

    const [expired, setExpired] = useState(true)
    const [newCodeSent, setNewCodeSent] = useState(false)
    const [deadline, setDeadline] = useState(null)



    const handleSendEmail = () => {
        if(expired)
        {
            props.initiateEmailVerification()
            props.clearCodeStatus()
            const time = new Date()
            time.setSeconds(time.getSeconds() + 59)
            setDeadline(time)
            setExpired(false)
        }
    }

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            <div className={styles.main} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>Verificar e-mail</p>
                <span className={styles.title_separator}/>
                {
                    props.next===1?
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Este passo é importante para o acesso a todas as funcionalidades da plataforma.</p>
                        <div className={styles.phone_wrapper}>
                            <span className={styles.phone_value}>{props.email}</span>
                        </div>

                        {
                            props.sendingError!=null?
                            <p className={styles.error_description} style={{marginTop:'30px'}}>{props.sendingError}</p>
                            :null
                        }
                        <div className={expired?styles.button:styles.button_disabled} style={{marginTop:props.sendingError?'10px':'40px'}} onClick={() => {
                                handleSendEmail()
                            }}>
                            <span className={styles.button_text} style={{color:"#161F28"}}>{expired?'Enviar e-mail de verificação':<Timer deadline={deadline} setExp={() => setExpired(true)}/>}</span>
                        </div>
                    </div>
                    :
                    props.next===2?
                    <div className={styles.main_inner}>
                        {
                            newCodeSent?
                            <p className={styles.phone_input_title}>Novo e-mail de verificação enviado!</p>
                            :
                            <p className={styles.phone_input_title}>E-mail de verificação enviado!</p>
                        }
                        <p className={styles.phone_description}>Verifica a tua caixa de correio associada ao e-mail <strong>{props.email}</strong></p>
                        <Lottie
                            loop={props.emailCodeStatus!==true?true:false}
                            autoplay={true}
                            animationData={props.emailCodeStatus===true?success:JSON.parse(JSON.stringify(planeEmail))}
                            rendererSettings= {
                                {preserveAspectRatio: 'xMidYMid slice'}
                            }
                            style={{
                                width:'150px',
                                height:'150px',
                                justifySelf:'center',
                                alignSelf:'center',
                                marginTop:'30px'
                            }}
                        />
                        {
                            props.emailCodeStatus===true?
                            <p className={styles.wrong_code_text} style={{marginTop:'30px', marginBottom:'-10px', color:"#0358e5"}}>
                                E-mail verificado com sucesso.
                            </p>
                            :null
                        }
                        {
                            props.emailCodeStatus===false?
                            <p className={styles.wrong_code_text} style={{marginTop:'30px', marginBottom:'-10px'}}>
                                O e-mail ainda não se encontra verificado.
                            </p>
                            :null
                        }
                        {
                            props.emailCodeStatus!==true?
                            <div className={styles.button}
                                style={{backgroundColor:'#0358e5'}}
                                onClick={() => props.completeEmailVerification()}>
                                <span className={styles.button_text} style={{color:'white'}}>Já verifiquei</span>

                            </div>
                            :
                            <div className={styles.button}
                                style={{backgroundColor:'#0358e5'}}
                                onClick={() => props.cancel()}>
                                <span className={styles.button_text} style={{color:'white'}}>Fechar</span>

                            </div>
                        }
                        {
                            props.emailCodeStatus!==true?
                            <div className={expired?styles.resend:styles.resend_disabled} 
                                onClick={() => {
                                    setNewCodeSent(true)
                                    handleSendEmail()
                                }}>
                                {
                                    !expired?
                                    <div className={styles.resend_text}>
                                        <span className={styles.resend_seconds}><Timer deadline={deadline} setExp={() => setExpired(true)}/></span>
                                        <div className={styles.resend_seconds_separator}></div>
                                        <span className={styles.resend_text_value}>Re-enviar e-mail</span>
                                    </div>
                                    :
                                    <div className={styles.resend_text}>
                                        <span className={styles.resend_text_value}>Re-enviar e-mail</span>
                                    </div>
                                }
                            </div>
                            :null
                        }
                    </div>
                    :
                    null
                }
                {
                    props.emailCodeStatus===true?
                    null
                    :
                    <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                }
                
            </div>

        </div>
    )
}

export default VerificationBannerEmail