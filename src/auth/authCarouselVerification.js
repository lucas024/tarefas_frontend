import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Lottie from 'react-lottie';
import * as sendEmail from '../assets/lotties/plane-email.json'
import * as sendPhone from '../assets/lotties/send-phone.json'
import * as wrongCode from '../assets/lotties/error-email.json'
import * as successLottie from '../assets/lotties/success-blue.json'
import { useNavigate } from 'react-router-dom';

const AuthCarouselVerification = props => {

    const navigate = useNavigate()

    return (
        <Carousel 
            showArrows={false} 
            showStatus={false} 
            showIndicators={false} 
            showThumbs={false}
            selectedItem={props.verificationTab}>
            <div className={styles.verification_zone}>
                <div className={styles.verification_zone_wrapper}>
                    {
                        props.worker?
                        null
                        :
                        <p className={styles.verification_title_helper}>Conta registada com sucesso.</p>
                    }
                    <p className={styles.verification_title} style={{marginBottom:'20px'}}>Verifique o seu e-mail</p>
                    <Lottie options={{
                        loop:false,
                        autoplay:true,
                        animationData:JSON.parse(JSON.stringify(sendEmail)),
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                        }}
                        height={120}
                        width={120}
                        // isStopped={this.state.isStopped}
                        // isPaused={this.state.isPaused}
                    />
                    <p className={styles.verification_desc}>
                        Envíamos um e-mail de verificação para o <span className={styles.verification_desc_strong}>{props.email}</span>, por-favor açeda ao seu e-mail e proceda com a verificação.
                    </p>
                    <p className={styles.verification_button} onClick={() => props.handleNext(false)}>
                        Já verifiquei o meu e-mail
                    </p>
                    <p className={styles.verification_button_helper_or}>
                        OU
                    </p>
                    <p className={styles.verification_button_helper} onClick={() => props.handleNext(true)}>
                        Verificar depois
                    </p>
                </div>
            </div>
            <div className={styles.verification_zone}>
                <div className={styles.verification_zone_wrapper}>
                    <p className={styles.verification_title_helper}>Conta registada com sucesso.</p>
                    <p className={styles.verification_title} style={{marginBottom:'20px'}}>Verifique o seu telemóvel</p>
                    <Lottie options={{
                        loop:false,
                        autoplay:props.verificationTab===1,
                        animationData:props.wrongCodeInserted?JSON.parse(JSON.stringify(wrongCode)):props.success?successLottie:sendPhone,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                        }}
                        height={120}
                        width={120}
                        // isStopped={this.state.isStopped}
                        // isPaused={this.state.isPaused}
                    />
                    {
                        props.success?
                            <p className={styles.verification_desc}>
                                Telemóvel verificado com sucesso.
                            </p>
                        :
                        <div>
                            <p className={styles.verification_desc}>
                                Envíamos uma mensagem com o código de verificação para o <span className={styles.verification_desc_strong}>{props.phone}</span>, por-favor insira o código enviádo a baixo.
                            </p>
                            <div className={styles.phone_input_wrapper} style={{borderColor:props.wrongCodeInserted?"#fdd835":"#0358e5"}}>
                                <div className={styles.main_code_placeholder}>
                                    {props.mapPlaceholder()}
                                </div>
                                <input className={styles.phone_input} value={props.code} type="number" onChange={e => props.setCodeHandler(e.target.value)} maxLength={6}/>
                            </div>
                        </div>

                    }
                    
                    
                    {
                        props.wrongCodeInserted?
                        <p className={styles.main_code_error}>
                            O código inserido está inválido.
                        </p>
                        :
                        null
                    }

                    {
                        props.success?
                        <p className={styles.verification_button} onClick={() => navigate('/', {
                                state: {
                                    carry: 'register',
                                    skippedVerification: props.skippedVerification
                                }
                            })} style={{marginTop:'40px'}}>
                            Continuar
                        </p>
                        :
                        <div>
                            <p className={props.code.length===6&&!props.wrongCodeInserted?styles.verification_button:styles.verification_button_disabled} onClick={() => props.code.length===6&&props.verifyCodeHandler()} style={{marginTop:'40px'}}>
                                Validar código
                            </p>
                            <div className={props.expired?styles.resend_button:styles.resend_button_disabled} 
                            onClick={() => {
                                props.expired&&props.setNewCodeSent(true)
                                props.expired&&props.handleSendCode()
                            }}>
                                <div className={styles.resend_text}>
                                    {
                                        !props.expired?
                                        <span className={styles.resend_seconds}>{props.seconds}s</span>
                                        :null
                                    }
                                    {
                                        !props.expired?
                                        <span className={styles.resend_seconds}> | </span>
                                        :null
                                    }
                                    <span className={styles.resend_text_value}>Re-enviar código</span>
                                </div>
                            </div>
                            <p className={styles.verification_button_helper_or}>
                                OU
                            </p>
                            <p className={styles.verification_button_helper} onClick={() => {
                                props.clearEmailAndPhone()
                                navigate('/', {
                                    state: {
                                        carry: 'register',
                                        skippedVerification: true
                                    }
                                })}
                            }> 
                                Verificar depois
                            </p>
                        </div>
                    }
                </div>
            </div>
        </Carousel>  
    )
}

export default AuthCarouselVerification