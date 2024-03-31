import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import {CSSTransition}  from 'react-transition-group';
import logo_full_orange from '../assets/logo_full_orange.png'

const WorkerBanner = (props) => {

    const [transition, setTransition] = useState(false)

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])


    return (
        <div className={styles.banner} onClick={() => props.cancel()}>
            <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="banner"
                    unmountOnExit
                    >
            <div className={styles.popup}  onClick={e => e.stopPropagation()}>
                <div className={styles.value_brand_wrapper}>
                    <span className={styles.value_brand}>Profissional no</span>
                    <img className={styles.value_brand_img} src={logo_full_orange}/>
                </div>
                
                <div className={styles.divider}/>
                <div className={styles.line}>
                    <TitleIcon className={styles.line_circle}/>
                    <span className={styles.helper_text}>Tarefas:</span>
                    <span className={styles.line_text}>Acesso desbloqueado aos detalhes de <span className={styles.action}>contacto</span> e <span className={styles.action}>localização</span> de <span className={styles.bold}>todas as tarefas publicadas</span>.</span>
                </div>
                <div className={styles.line}>
                    <MessageIcon className={styles.line_circle}/>
                    <span className={styles.helper_text}>Mensagens:</span>
                    <span className={styles.line_text}>Acesso à <span className={styles.action}>plataforma de mensagens</span>, onde pode contactar os seus clientes de forma <span className={styles.bold}>fácil</span> e <span className={styles.bold}>direta</span>.</span>
                </div>
                <div className={styles.line}>
                    <PersonIcon className={styles.line_circle}/>
                    <span className={styles.helper_text}>Perfil:</span>
                    <span className={styles.line_text}>Criação do teu <span className={styles.action}>perfil de profissional</span>, que será acessível a todos utilizadores do Tarefas. <span className={styles.bold}>Maior exposição</span> ao teu negócio!</span>
                </div>
                <span className={styles.confirm_button} onClick={() => props.confirm()}>
                    {
                        props.authPage?
                        'CONTINUAR PARA CRIAÇÃO DE CONTA'
                        :
                        'REGISTAR-ME COMO PROFISSIONAL'
                    }
                    
                </span>
                {
                    !props.authPage?
                    <span className={styles.cancel} onClick={() => props.cancel()}>cancelar</span>
                    :null
                }
            </div>
            </CSSTransition>
        </div>
    )
}

export default WorkerBanner