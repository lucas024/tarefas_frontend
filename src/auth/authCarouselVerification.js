import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Lottie from "lottie-react";
import * as sendEmail from '../assets/lotties/plane-email.json'
import * as sendPhone from '../assets/lotties/send-phone.json'
import * as wrongCode from '../assets/lotties/error-email.json'
import * as successLottie from '../assets/lotties/success-blue.json'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'
import { useDispatch } from 'react-redux';
import { user_update_phone_verified, user_update_email_verified } from '../store';
import Timer from '../general/timer';

const AuthCarouselVerification = props => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [newCodeSent, setNewCodeSent] = useState(false)
    const [expired, setExpired] = useState(true)
    const [deadline, setDeadline] = useState(null)

    const updateVerification = async () => {
        await auth.currentUser?.reload()
        //phone
        if(auth?.currentUser?.phoneNumber != null) dispatch(user_update_phone_verified(true))
        // else dispatch(user_update_phone_verified(false))
        //email
        if(auth?.currentUser?.emailVerified === true)
        {
            dispatch(user_update_email_verified(true))
        }
        else{
            dispatch(user_update_email_verified(false))
        }
        props.clearEmailAndPhone()
    }

    const handleSendEmail = () => {
        if(expired)
        {
            props.initiateEmailVerification()
            const time = new Date()
            time.setSeconds(time.getSeconds() + 59)
            setDeadline(time)
            setExpired(false)
        }
    }

    return (
        <Carousel 
            showArrows={false} 
            showStatus={false} 
            showIndicators={false} 
            showThumbs={false}
            selectedItem={props.verificationTab}>
            {/* <div className={styles.verification_zone}>
                <div className={styles.verification_zone_wrapper}>
                    <p className={styles.verification_title_helper}>Conta registada com sucesso.</p>
                    <p className={styles.verification_title} style={{marginBottom:'20px'}}>Verificar o telemóvel</p>
                    {
                        newCodeSent&&props.codeSent?
                        <p className={styles.verification_desc}>Novo código enviado!</p>
                        :null
                    }
                    <Lottie
                        loop={true}
                        autoplay={true}
                        animationData={props.success===false?JSON.parse(JSON.stringify(wrongCode)):props.success===true?successLottie:sendPhone}
                        rendererSettings= {
                            {preserveAspectRatio: 'xMidYMid slice'}
                        }
                        style={{
                            width:'150px',
                            height:'150px',
                            margin:'auto',
                            marginTop:'30px'
                        }}
                    />
                    {
                        props.success?
                            <p className={styles.verification_desc}>
                                Telemóvel verificado com sucesso.
                            </p>
                        :
                        <div>
                            {
                                props.codeSent===true?
                                <div>
                                    <p className={styles.verification_desc}>
                                        Envíamos uma mensagem com o código de verificação para o <span className={styles.verification_desc_strong}>{props.phone}</span>, por favor insira o código enviado abaixo.
                                    </p>
                                    <div className={styles.phone_input_wrapper} style={{borderColor:props.wrongCodeInserted?"#fdd835":"#0358e5"}}>
                                        <div className={styles.main_code_placeholder}>
                                            {props.mapPlaceholder()}
                                        </div>
                                        <input className={styles.phone_input} value={props.code} type="number" onChange={e => props.setCodeHandler(e.target.value)} maxLength={6}/>
                                    </div>
                                </div>
                                :props.codeSent===null?
                                <p className={styles.verification_desc}>
                                    Enviaremos uma mensagem com o código de verificação para o <span className={styles.verification_desc_strong}>{props.phone}</span>.
                                </p>
                                :null
                            }
                        </div>

                    }
                    
                    
                    {
                        props.sendingError!==null?
                        <div className={styles.wrong_code_div}>
                            <span className={styles.wrong_code_text}>{props.sendingError}</span>
                        </div>
                        :null
                    }
                    {
                        props.codeStatus===false?
                        <div className={styles.wrong_code_div}>
                            <span className={styles.wrong_code_text}>Código errado! Tente de Novo</span>
                        </div>
                        :null
                    }

                    {
                        props.success?
                        <p className={styles.verification_button} 
                            style={{marginTop:'40px'}}
                            onClick={async () => {
                                await updateVerification()
                                props.handleNext(true)}}
                            >
                            Continuar
                        </p>
                        :
                        <div>
                            {
                                props.codeSent===true?
                                <p className={props.code.length===6?styles.verification_button:styles.verification_button_disabled} onClick={() => props.code.length===6&&props.completePhoneVerification(props.code)} style={{marginTop:'40px'}}>
                                    Verificar
                                </p>
                                :
                                props.codeSent===false?
                                <p className={styles.verification_button} 
                                    style={{marginTop:'40px'}}
                                    onClick={async () => {
                                        await updateVerification()
                                        props.handleNext(false)
                                        setNewCodeSent(false)}}>
                                    Verificar depois
                                </p>
                                :
                                <p className={styles.verification_button} onClick={() => props.initiatePhoneVerification()} style={{marginTop:'40px'}}>
                                    Enviar código
                                </p>
                            }
                            
                            {
                                props.codeSent===true?
                                <div className={props.expired?styles.resend_button:styles.resend_button_disabled} 
                                    onClick={() => {
                                        if(props.expired)
                                        {
                                            setNewCodeSent(true)
                                            props.initiatePhoneVerification()
                                        }
                                    }}>
                                    <div className={styles.resend_text}>
                                        {
                                            !props.expired?
                                            <span className={styles.resend_seconds}>{props.seconds}</span>
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
                                :null
                            }
                            {
                                props.codeSent!==false?
                                <div>
                                    <p className={styles.verification_button_helper_or}>
                                        OU
                                    </p>
                                    <p className={styles.verification_button_helper} onClick={async () => {
                                        await updateVerification()
                                        props.handleNext(false)
                                        setNewCodeSent(false)}
                                    }> 
                                        Verificar depois
                                    </p>
                                </div>
                                :
                                null
                                
                            }
                            
                        </div>
                    }
                </div>
            </div> */}
            {/* end phone verification */}
            <div className={styles.verification_zone}>
                <div className={styles.verification_zone_wrapper}>
                    {
                        props.worker?
                        null
                        :
                        <p className={styles.verification_title_helper}>Conta registada com sucesso.</p>
                    }
                    <p className={styles.verification_title} style={{marginBottom:'20px'}}>Verificar o e-mail</p>
                    
                    <Lottie 
                        animationData={props.emailCodeStatus===true?successLottie:props.emailCodeStatus===false?wrongCode:JSON.parse(JSON.stringify(sendEmail))}
                        loop={false}
                        autoplay={true}
                        rendererSettings={{preserveAspectRatio: 'xMidYMid slice'}}
                        style={{
                            width:'150px',
                            height:'150px',
                            margin:'auto',
                            marginTop:'30px'
                        }}
                    />
                    {
                        props.emailSent===false?
                        <p className={styles.wrong_code_text} style={{marginTop:'40px', marginBottom:'-40px'}}>
                            Erro a enviar o e-mail de verificação. Por favor, tenta mais tarde.
                        </p>
                        :
                        <p className={styles.verification_desc}>
                            Enviámos um e-mail de verificação para o <span className={styles.verification_desc_strong}>{props.email}</span>, por favor acede ao teu e-mail e procede com a verificação.
                        </p>
                    }
                    {
                        props.emailCodeStatus===true?
                        <p className={styles.wrong_code_text} style={{marginTop:'40px', marginBottom:'-40px', color:"#0358e5"}}>
                            E-mail verificado com sucesso.
                        </p>
                        :null
                    }
                    {
                        props.emailCodeStatus===false?
                        <p className={styles.wrong_code_text} style={{marginTop:'40px', marginBottom:'-40px'}}>
                            O e-mail ainda não se encontra verificado.
                        </p>
                        :null
                    }
                    {
                        props.emailSent===false?
                        <p className={styles.verification_button} 
                            onClick={async () => {
                                await updateVerification()
                                navigate('/user?t=conta', {
                                    state: {
                                        carry: 'register',
                                        skippedVerification: true
                                    }
                                })}}
                            >
                            Verificar Depois
                        </p>
                        :
                        <div>
                            <p className={styles.verification_button} 
                                onClick={async () => {
                                    props.completeEmailVerification()}
                                }>
                                Já verifiquei
                            </p>
                            {
                                expired?
                                <span className={styles.resend_button} 
                                    onClick={async () => {
                                        handleSendEmail()}
                                    }>
                                    <span className={styles.resend_text_value}>Re-enviar e-mail</span>
                                </span>
                                :
                                <span className={styles.resend_button_disabled}>
                                    <span className={styles.resend_seconds}><Timer deadline={deadline} setExp={() => setExpired(true)}/></span>
                                    <div className={styles.resend_seconds_separator}></div>
                                    <span className={styles.resend_text_value}>Re-enviar e-mail</span>
                                </span>
                            }
                        </div>
                    }

                    {
                        props.emailSent!==false?
                        <div>
                            <p className={styles.verification_button_helper_or}>
                                OU
                            </p>
                            <p className={styles.verification_button_helper} 
                                onClick={async () => {
                                    await updateVerification()
                                    navigate('/user?t=conta', {
                                        state: {
                                            carry: 'register',
                                            skippedVerification: true
                                        }
                                    })}}>
                                Verificar depois
                            </p>
                        </div>
                        :null
                    }
                    
                    
                </div>
            </div>
        </Carousel>  
    )
}

export default AuthCarouselVerification