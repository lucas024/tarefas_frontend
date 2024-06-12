import React, { useState } from 'react'
import styles from './welcome.module.css'
import logo_text from '../assets/logo_text_mix_4.png'
import {CSSTransition}  from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import image1 from '../assets/1.png'
import image2 from '../assets/2.png'
import image3 from '../assets/3.png'
import image4 from '../assets/4.png'
import image5 from '../assets/5.png'
import image6 from '../assets/6.png'
import image7 from '../assets/7.png'
import image8 from '../assets/8.png'
import image9 from '../assets/9.png'
import image10 from '../assets/10.png'
import image11 from '../assets/11.png'

const Welcome = (props) => {

    const navigate = useNavigate()

    const [finalTrigger, setFinalTrigger] = useState(false)
    const [finalTrigger2, setFinalTrigger2] = useState(false)

    return (
        <div className={styles.welcome_wrapper}>

            <div className={styles.welcome}>
                <div className={styles.main}>
                    <div className={styles.main_top}>
                        <div className={styles.image_main}>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(-30deg)', right:'-800px', top:'0px'}} src={image1}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(30deg)', right:'-700px', top:'-400px'}} src={image2}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(40deg)', right:'-900px', top:'300px'}} src={image6}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(-50deg)', right:'-1100px', top:'-400px'}} src={image3}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(60deg)', right:'-400px', top:'-300px'}} src={image5}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(10deg)', right:'0px', top:'-50px'}} src={image4}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(-50deg)', right:'100px', top:'200px'}} src={image7}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(20deg)', right:'-750px', top:'250px'}} src={image8}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(20deg)', right:'-1450px', top:'-50px'}} src={image9}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(-30deg)', right:'200px', top:'-300px'}} src={image10}/>
                            <img className={styles.image} style={{transform:'scale(0.3) rotate(-30deg)', right:'-200px', top:'300px'}} src={image11}/>
                        </div>
                        <div className={styles.image_main_small}>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(-30deg)', right:'-800px', top:'-150px'}} src={image1}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(30deg)', right:'-600px', top:'-400px'}} src={image2}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(40deg)', right:'-900px', top:'300px'}} src={image6}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(-50deg)', right:'-800px', top:'-300px'}} src={image3}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(60deg)', right:'-500px', top:'-300px'}} src={image5}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(10deg)', right:'-300px', top:'-150px'}} src={image4}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(-50deg)', right:'-400px', top:'0px'}} src={image7}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(20deg)', right:'-750px', top:'0px'}} src={image8}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(20deg)', right:'-900px', top:'50px'}} src={image9}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(-30deg)', right:'-200px', top:'-300px'}} src={image10}/>
                            <img className={styles.image} style={{transform:'scale(0.15) rotate(-20deg)', right:'-500px', top:'10px'}} src={image11}/>
                        </div>
                        
                        <div className={styles.main_top_wrapper}>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <img className={styles.text_brand} src={logo_text}/>
                            </div>
                                
                                <div className={styles.main_top_wrapper_2}>
                                    <CSSTransition 
                                        in={props.showWelcomeTrigger1000}
                                        onEntered={() => setTimeout(() => {
                                            setFinalTrigger(true)
                                            // setFinalTrigger2(true)
                                        }, 1000)}
                                        timeout={1000}
                                        classNames="fade"
                                        unmountOnExit
                                        >
                                        <div style={{height:'30px'}}>
                                            <p className={styles.sub_title}>Plataforma que junta <span style={{color:"#0358e5", fontWeight:600}}>clientes</span> e <span style={{color:"#FF785A", fontWeight:600}}>profissionais</span></p>
                                        </div>
                                    </CSSTransition>
                                </div>
                                <div style={{height:'50px'}}>
                                    <CSSTransition 
                                            in={finalTrigger}
                                            timeout={500}
                                            classNames="fade"
                                            unmountOnExit
                                            >
                                            
                                        <div>
                                            <div className={styles.button_wrapper}>
                                                <div className={styles.button} onClick={() => props.closeWelcome()}>
                                                    <span className={styles.button_text}>CONTINUAR</span>
                                                </div>
                                            </div>
                                        </div>

                                        
                                    </CSSTransition>
                                </div>
                                
                        </div>
                        
                    </div>
                    {/* <div className={styles.button_separator}/> */}
                    {/* <div className={styles.main_bot}>
                        <div className={styles.main_bot_absolute}>
                            <CSSTransition 
                                        in={props.showWelcomeTrigger2000}
                                        onEntered={() => setTimeout(() => {
                                            setFinalTrigger2(true)
                                        }, 1000)}
                                        timeout={1000}
                                        classNames="fade"
                                        unmountOnExit
                                        >
                                <div>
                                    <p className={styles.sub_title} style={{textDecorationColor:"#FF785A"}}>És um trabalhador independente ou tens o teu próprio negócio?</p>
                                </div>
                                
                                
                            </CSSTransition>
                            <div className={styles.main_bot_wrapper}>
                                <CSSTransition 
                                        in={finalTrigger2}
                                        timeout={1000}
                                        classNames="fade"
                                        unmountOnExit
                                        >
                                    <div>
                                        <div className={styles.button_worker} onClick={() => navigate('/authentication/worker?type=0&landing=1')&&props.closeWelcome()}>
                                            <span className={styles.button_text}>Começar a encontrar tarefas hoje</span>
                                        </div>
                                    </div>
                                    
                                </CSSTransition>
                            </div>
                        </div>
                        
                        

                    </div> */}
                    
                    
                                        
                </div>
            </div>
        </div>
        
    )
}

export default Welcome