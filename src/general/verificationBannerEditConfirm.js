import React, {useState} from 'react'
import styles from './banner.module.css'
import Lottie from 'lottie-react';
import * as postLoad from '../assets/lotties/post-load.json'
import * as success from '../assets/lotties/success-blue.json'
import { useNavigate } from 'react-router-dom';

const VerificationBannerEditConfirm = (props) => {

    const [next, setNext] = useState(0)
    const navigate = useNavigate()

    return (
        <div className={styles.verification}>
            <div className={styles.main} style={{borderColor:"#FF785A"}} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>EDITAR TAREFA</p>
                <span className={styles.title_separator}/>
                {
                    next===0?
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description} style={{textAlign:"center"}}>
                            Ao confirmares a edição, a publicação será novamente analisada.
                            <br/>Poderás seguir o processo de publicação na tua área pessoal.</p>
                        
                        <div className={styles.button} style={{backgroundColor:"#FF785A"}} onClick={() => {props.confirm()&&setNext(1)}}>
                            <span className={styles.button_text}>CONFIRMAR EDIÇÃO</span>
                        </div>
                        <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                    </div>
                    :
                    next===1?
                    <div className={styles.main_inner}>
                        {
                            props.loadingConfirm?
                            <div style={{marginTop:"0px"}}>
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
                                        margin:'20px auto 20px auto'
                                    }}
                                    // isStopped={this.state.isStopped}
                                    // isPaused={this.state.isPaused}
                                />
                                <p className={styles.phone_input_title} style={{marginBottom:'0px', textTransform:'uppercase'}}>A tua tarefa está a ser editada</p>
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
                                    style={{
                                        width:'80px',
                                        height:'80px',
                                        justifySelf:'center',
                                        alignSelf:'center',
                                        margin:'0 auto 20px auto'
                                    }}
                                />
                                <p className={styles.phone_description}>A edição da publicação foi enviada para análise pela equipa do TAREFAS. Poderás seguir o processo de publicação na tua area pessoal.</p>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    <div 
                                        className={styles.button}
                                        style={{backgroundColor:"#FF785A"}}
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

export default VerificationBannerEditConfirm