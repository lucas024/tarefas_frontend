import React, {useEffect, useState, useRef} from 'react'
import styles from './banner.module.css'
import Lottie from 'lottie-react';
import * as sendPhone from '../assets/lotties/send-phone.json'
import * as wrongCode from '../assets/lotties/error-email.json'
import * as success from '../assets/lotties/success-blue.json'
import Timer from './timer'


const VerificationBannerPhone = (props) => {

    const [code, setCode] = useState('')
    const [expired, setExpired] = useState(true)
    const [newCodeSent, setNewCodeSent] = useState(false)
    const [wrongCodeInserted, setWrongCodeInserted] = useState(false)

    const [deadline, setDeadline] = useState(null)

    


    const codePlaceholder = [0,0,0,0,0,0]

    const mapPlaceholder = () => {
        return codePlaceholder.map((val, i) => {
            return(
                <span key={i} className={styles.main_code_placeholder_value} style={{opacity:i<code.length?0:1}}>{val}</span>
            )
        })
    }

    const setCodeHandler = value => {
        if(value.length<7)
        {
            setWrongCodeInserted(false)
            setCode(value)
        }
    }

    const handleSendCode = () => {
        if(expired)
        {
            const time = new Date()
            time.setSeconds(time.getSeconds() + 9)
            setDeadline(time)
            setExpired(false)
            setWrongCodeInserted(false)
            setCode('')
        }
    }

    const cancelHandler = () => {
        props.cancel()
    }



    return (
        <div className={styles.verification} onClick={() => cancelHandler()}>
            <div className={styles.main} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>Verificar Telemóvel</p>
                <span className={styles.title_separator}/>
                {
                    props.next===1?
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>O telemóvel verificado permite o acesso a todas as funcionalidades da Serviços.</p>
                        <div className={styles.phone_wrapper}>
                            <span className={styles.phone_prefix}>+351</span>
                            <span className={styles.phone_value}> {props.phone.slice(0, 3)} {props.phone.slice(3,6)} {props.phone.slice(6)}</span>
                        </div>
                        
                        <div className={expired?styles.button:styles.button_disabled} onClick={() => {handleSendCode()&&props.setNext(2)}}>
                            <span className={styles.button_text}>{expired?'Enviar código de verificação':<Timer deadline={deadline} setExp={() => setExpired(true)}/>}</span>
                        </div>
                    </div>
                    :
                    props.next===2?
                    !props.signInObject?
                    null
                    :
                    <div className={styles.main_inner}>
                        
                        {
                            newCodeSent?
                            <p className={styles.phone_input_title}>Novo código enviado</p>
                            :
                            <p className={styles.phone_input_title}>Código enviado</p>
                        }
                        
                        <div className={styles.phone_input_wrapper}>
                            <div className={styles.main_code_placeholder}>
                                {mapPlaceholder()}
                            </div>
                            <input className={styles.phone_input} value={code} type="number" onChange={e => setCodeHandler(e.target.value)} maxLength={6}/>
                        </div>
                        <Lottie
                            loop={true}
                            autoplay={true}
                            animationData={wrongCodeInserted?wrongCode:sendPhone}
                            rendererSettings= {
                                {preserveAspectRatio: 'xMidYMid slice'}
                            }
                            style={{
                                width:'150px',
                                height:'150px',
                                justifySelf:'center',
                                alignSelf:'center'
                            }}
                        />
                        {
                            wrongCodeInserted?
                            <div className={styles.wrong_code_div}>
                                <span className={styles.wrong_code_text}>Código errado! Tente de Novo</span>
                            </div>
                            :null
                        }
                        <div 
                            className={code.length===6?styles.button:styles.button_disabled}
                            style={{backgroundColor:code.length===6?'#0358e5':'#71848d'}}
                            onClick={() => code.length===6&&props.completePhoneVerification(code)}>
                            <span className={styles.button_text} style={{color:'white'}}>VERIFICAR código</span>
                        </div>
                        <div className={expired?styles.resend:styles.resend_disabled} 
                        onClick={() => {
                            if(expired)
                            {
                                setNewCodeSent(true)
                                props.clearCaptcha()
                                props.initiatePhoneVerification()
                                handleSendCode()
                            }
                        }}>
                            {
                                !expired?
                                <div className={styles.resend_text}>
                                    <span className={styles.resend_seconds}><Timer deadline={deadline} setExp={() => setExpired(true)}/></span>
                                    <div className={styles.resend_seconds_separator}></div>
                                    <span className={styles.resend_text_value}>Re-enviar código</span>
                                </div>
                                :
                                <div className={styles.resend_text}>
                                    <span className={styles.resend_text_value}>Re-enviar código</span>
                                </div>
                            }
                            
                        </div>
                    </div>
                    :
                    props.next===3?
                    <div className={styles.main_inner}>
                        <p className={styles.phone_input_title} style={{marginBottom:'20px'}}>Código verificado com sucesso</p>
                        <Lottie
                            loop={false}
                            autoplay={true}
                            animationData={success}
                            rendererSettings= {
                                {preserveAspectRatio: 'xMidYMid slice'}
                            }
                            height={80}
                            width={80}
                        />
                        <p className={styles.phone_description}>O teu telemóvel está agora verificado.</p>
                        <div 
                            className={styles.button}
                            style={{backgroundColor:"#0358e5"}}
                            onClick={() => props.cancel()}>
                            <span className={styles.button_text}>FECHAR</span>
                        </div>
                    </div>
                    :null
                }
                
                <p className={styles.cancel} onClick={() => cancelHandler()}>cancelar</p>
            </div>

        </div>
    )
}

export default VerificationBannerPhone