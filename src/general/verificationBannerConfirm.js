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
                <p className={styles.title}>PUBLICAR</p>
                <span className={styles.title_separator}/>
                {
                    next===0?
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Ao confirmar a sua publicação de trabalho será analisada, 
                        podendo seguir o processo da publicação na sua àrea pessoal.</p>
                        
                        <div className={styles.button} style={{backgroundColor:"#0358e5"}} onClick={() => {props.confirm()&&setNext(1)}}>
                            <span className={styles.button_text}>CONFIRMAR</span>
                        </div>
                        <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                    </div>
                    :
                    next===1?
                    <div className={styles.main_inner}>
                        {
                            props.loadingConfirm?
                            <div style={{marginTop:"0px"}}>
                                <p className={styles.phone_input_title} style={{marginBottom:'20px'}}>A publicar o seu trabalho</p>
                                <Lottie
                                    loop={true}
                                    autoplay={true}
                                    animationData={postLoad}
                                    rendererSettings= {
                                        {preserveAspectRatio: 'xMidYMid slice'}
                                    }
                                    height={80}
                                    width={80}
                                    // isStopped={this.state.isStopped}
                                    // isPaused={this.state.isPaused}
                                />
                            </div>
                            :
                            <div style={{marginTop:"20px"}}>
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
                                <p className={styles.phone_description}>Trabalho publicado com sucesso. Será rápidamente analisado pela equipa da Serviços.</p>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    <div 
                                        className={styles.button}
                                        style={{backgroundColor:"#0358e5"}}
                                        onClick={() => navigate('/user?t=publications', {replace:true})}>
                                        <span className={styles.button_text}>VER AS MINHAS PUBLICAÇÕES</span>
                                    </div>
                                </div>
                               
                            </div>

                        }
                        
                        
                    </div>
                    :null
                }                
            </div>

        </div>
    )
}

export default VerificationBannerConfirm