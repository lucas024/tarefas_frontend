import React, {useState} from 'react'
import styles from './banner.module.css'
import Lottie from 'lottie-react';
import * as postLoad from '../assets/lotties/post-load.json'
import * as success from '../assets/lotties/success-blue.json'
import { useNavigate } from 'react-router-dom';

const VerificationBannerConfirm = (props) => {

    const [next, setNext] = useState(0)
    const navigate = useNavigate()

    return (
        <div className={styles.verification}>
            <div className={styles.main} style={{borderColor:"#0358e5"}} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>PUBLICAR TAREFA</p>
                <span className={styles.title_separator}/>
                {
                    next===0?
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Ao confirmares, a tua publicação será analisada.
                        Poderás seguir o processo de publicação na tua área pessoal.</p>
                        
                        <div className={styles.button} style={{backgroundColor:"#0358e5"}} onClick={() => {props.confirm()&&setNext(1)}}>
                            <span className={styles.button_text} style={{color:"white"}}>CONFIRMAR</span>
                        </div>
                        <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                    </div>
                    :
                    next===1?
                    <div className={styles.main_inner}>
                        {
                            props.loadingConfirm?
                            <div style={{marginTop:"0px"}}>
                                <p className={styles.phone_input_title} style={{marginBottom:'20px'}}>A publicar a tua tarefa</p>
                                <Lottie
                                    loop={true}
                                    autoplay={true}
                                    animationData={postLoad}
                                    rendererSettings= {
                                        {preserveAspectRatio: 'xMidYMid slice'}
                                    }
                                    style={{
                                        width:'80px',
                                        height:'80px',
                                        justifySelf:'center',
                                        alignSelf:'center',
                                        margin: 'auto'
                                    }}
                                    // isStopped={this.state.isStopped}
                                    // isPaused={this.state.isPaused}
                                />
                                <p className={styles.phone_description} style={{marginTop:'30px'}}>Por favor, não saias desta página.</p>
                            </div>
                            :props.publicationSent?
                            <div style={{marginTop:"20px"}}>
                                <Lottie
                                    loop={false}
                                    autoplay={true}
                                    animationData={success}
                                    rendererSettings= {
                                        {preserveAspectRatio: 'xMidYMid slice'}
                                    }
                                    style={{
                                        width:'80px',
                                        height:'80px',
                                        justifySelf:'center',
                                        alignSelf:'center',
                                        margin: 'auto'
                                    }}
                                />
                                <p className={styles.phone_description}>Publicação enviada para análise pela equipa do TAREFAS. Poderás seguir o processo de publicação na tua area pessoal.</p>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    <div 
                                        className={styles.button}
                                        style={{backgroundColor:"#0358e5"}}
                                        onClick={() => navigate('/user?t=publications', {replace:true})}>
                                        <span className={styles.button_text} style={{color:"white"}}>VER AS MINHAS TAREFAS</span>
                                    </div>
                                </div>
                               
                            </div>
                            :null

                        }
                        
                        
                    </div>
                    :null
                }                
            </div>

        </div>
    )
}

export default VerificationBannerConfirm