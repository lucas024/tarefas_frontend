import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import {CSSTransition}  from 'react-transition-group';
import { TextareaAutosize } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios'
import Lottie from 'lottie-react';
import * as success_lottie from '../assets/lotties/success-blue.json'


const SuggestionBanner = (props) => {

    const api_url = useSelector(state => {return state.api_url})

    const [transition, setTransition] = useState(false)
    const [assunto, setAssunto] = useState('')
    const [suggestion, setSuggestion] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])

    
    const setTituloHandler = val => {
        console.log(val)
        if(assunto.length===0)
            setAssunto(val.replace(/\s/g, ''))
        else
            setAssunto(val)
    }

    const send = () => {
        axios.post(`${api_url}/suggestion`, {
            assunto: assunto,
            suggestion: suggestion
        }).then(() => {
            setSuccess(true)
        })
    }


    return (
        <div className={styles.banner} onClick={() => suggestion.length===0&&assunto.length===0&&props.cancel()}>
            <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="banner"
                    unmountOnExit
                    >
            <div className={styles.popup}  onClick={e => e.stopPropagation()}>
                <span className={styles.value_brand}>Em que podemos melhorar?</span>
                <div className={styles.divider}/>
                {
                    success?
                    <div>
                        <Lottie
                            loop={false}
                            autoplay={success}
                            animationData={success_lottie}
                            rendererSettings= {
                                {preserveAspectRatio: 'xMidYMid slice'}
                            }
                            style={{
                                width:'150px',
                                height:'150px',
                                justifySelf:'center',
                                alignSelf:'center',
                                margin:'auto',
                                marginTop:'20px',
                                marginBottom:'20px'
                            }}
                        />
                        <p className={styles.suggestion_sent}>Sugestão enviada com sucesso! Obrigado.</p>
                    </div>
                    :
                    <div className={styles.popup_inner}>                
                        <p className={styles.input_title}>Assunto</p>
                        <input placeholder='Assunto...' className={styles.top_input_short} maxLength={40} value={assunto} onChange={val => setTituloHandler(val.target.value)}/>
                        <p className={styles.input_title}>Sugestão</p>
                        <div className={styles.top_desc}>
                            <TextareaAutosize
                                onKeyDown={(e) => { if (e.key === 9) e.preventDefault() }}
                                maxRows={10}
                                minRows={8}
                                maxLength={200}
                                className={styles.top_desc_area} 
                                placeholder="Sugestão..."
                                value={props.description} onChange={e => {
                                setSuggestion(e.target.value)}}>
                            </TextareaAutosize>
                        </div>
                        <p className={styles.info}>Obrigado pela sua sugestão!</p>
                        <span className={suggestion.length>10?styles.send:styles.send_disabled} onClick={() => suggestion.length>10&&send()}>ENVIAR</span>
                    </div>
                }
                
                <span className={styles.cancel} style={{marginTop:'5px'}} onClick={() => props.cancel()}>fechar</span>
            </div>
            </CSSTransition>
        </div>
    )
}

export default SuggestionBanner