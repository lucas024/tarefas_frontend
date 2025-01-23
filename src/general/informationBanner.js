import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import {CSSTransition}  from 'react-transition-group';
import home_arrow_right from '../assets/home_arrow_right.png'
import home_arrow_left from '../assets/home_arrow_left.png'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';

const InformationBanner = (props) => {

    const [transition, setTransition] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])

    const handleMoveAuth = (type, user) => {
        navigate(`/authentication?type=${type}&mode=${user}`)
    }

    return (
        <div className={styles.banner} onClick={() => props.cancel()}>
            <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="banner"
                    unmountOnExit
                    >
            <div className={styles.popup}  onClick={e => e.stopPropagation()}>
                <span className={styles.value_brand}>O que é o TAREFAS?</span>
                <div className={styles.divider}/>

                <p className={styles.contact_text_top} style={{marginTop:'20px', textAlign:'center'}}>
                É uma plataforma que permite aos utilizadores procurar profissionais ou publicar <span style={{color:"#0358e5", fontWeight:700}}>tarefas</span> e esperar que eles venham até si. <br/>
                Os utilizadores <span style={{color:"#FF785A", fontWeight:700}}>profissionais</span>, por outro lado, podem encontrar tarefas para realizar ao mesmo tempo que expôem o seu negócio através do seu perfil publicamente visível.
                </p>

                <div className={styles.new}>
                    <div className={`${styles.new_side} ${styles.glow_on_hover2}`} style={{marginRight:'5px'}} onClick={() => {
                            handleMoveAuth(0, 'user')
                            window.localStorage.setItem('dismissedBanner', true)
                        }}>
                        <span className={styles.line_title} style={{color:'#0358e5', textDecoration:'none'}}>CRIAR CONTA</span>
                        <div className={styles.line_text_wrapper}>
                            <p className={styles.line_text} style={{color:"#ffffff"}}>Como utlizador, basta criares a tua conta e publicares uma tarefa ou procurares um profissional</p>
                        </div>
                    </div>
                    <div className={`${styles.new_side} ${styles.glow_on_hover}`} style={{marginLeft:'5px', borderColor:"#ffffff"}} onClick={() => {
                            handleMoveAuth(0, 'professional')
                            window.localStorage.setItem('dismissedBanner', true)
                        }}>
                        <span className={styles.line_title} style={{color:'#FF785A', textDecoration:'none'}}>CRIAR CONTA <br/>PROFISSIONAL</span>
                        <div className={styles.line_text_wrapper}>
                            <p className={styles.line_text} style={{color:"#ffffff"}}>Como profissional, cria a tua conta, ativa o modo profissional e começa a realizar tarefas</p>
                        </div>
                        
                    </div>
                </div>
                {/* <div className={`${styles.confirm_button} ${styles.glow_on_hover}`} 
                    style={{width:'100%', marginTop:'30px'}}
                    onClick={() => {
                        handleMoveAuth(0)
                        window.localStorage.setItem('dismissedBanner', true)
                }} >
                    <span className={styles.section_publicar_mini} style={{color:"#ffffff"}}>CONTINUAR PARA CRIAÇÃO DE CONTA</span>
                </div> */}
                
                <div className={styles.cancel_wrapper} style={{marginTop:'10px'}}>
                    <span className={styles.cancel} onClick={() => props.cancel()}>fechar</span>
                </div>
            </div>
            </CSSTransition>
        </div>
    )
}

export default InformationBanner