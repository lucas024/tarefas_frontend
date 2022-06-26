import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import CircleOutlinedIcon from '@mui/icons-material/Circle';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import {CSSTransition}  from 'react-transition-group';

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
            <div className={styles.popup}>
                <span className={styles.value}>Trabalhador ARRANJA</span>
                <div className={styles.divider}/>
                <div className={styles.line}>
                    <ManageSearchIcon className={styles.line_circle}/>
                    <span className={styles.helper_text}>Trabalhos:</span>
                    <span className={styles.line_text}>Acesso desbloqueado aos detalhes de <span className={styles.action}>contacto</span> e <span className={styles.action}>localização</span> de <span className={styles.bold}>todos os trabalhos publicados</span>.</span>
                </div>
                <div className={styles.line}>
                    <MessageIcon className={styles.line_circle}/>
                    <span className={styles.helper_text}>Mensagens:</span>
                    <span className={styles.line_text}>Acesso à <span className={styles.action}>plataforma de mensagens</span>, onde pode contactar os seus clientes de forma <span className={styles.bold}>fácil</span> e <span className={styles.bold}>direta</span>.</span>
                </div>
                <div className={styles.line}>
                    <PersonIcon className={styles.line_circle}/>
                    <span className={styles.helper_text}>Perfil:</span>
                    <span className={styles.line_text}>Criação do seu <span className={styles.action}>perfil de trabalhador</span>, que será acessível a todos utilizadores do Arranja. <span className={styles.bold}>Maior exposição</span> ao seu negócio!</span>
                </div>
                <span className={styles.confirm_button} onClick={() => props.confirm()}>
                    REGISTAR-ME COMO TRABALHADOR
                </span>
                <span className={styles.cancel}>cancelar</span>
            </div>
            </CSSTransition>
        </div>
    )
}

export default WorkerBanner