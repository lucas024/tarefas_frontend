import React, {useState, useEffect} from 'react'
import styles from './popup.module.css'
import CircleOutlinedIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import {CSSTransition}  from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const Popup = (props) => {

    const [transition, setTransition] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])

    return (
        <div>
            <div className={styles.popup_backdrop} onClick={() => props.cancelHandler()}></div>
            {
                props.type === 'confirm'?
                <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="transition"
                    unmountOnExit
                    >
                <div className={styles.popup}>
                        <span className={styles.value}>Publicar</span>
                        <div className={styles.divider}></div>
                        <div className={styles.line}>
                            <CircleOutlinedIcon className={styles.line_circle}/>
                            <span className={styles.helper_text}>Serviço:</span>
                            <span className={styles.line_text} style={{textTransform:"capitalize"}}>{props.worker}</span>
                        </div>

                        <div className={styles.help_text}>
                                <p className={styles.help_text_val}>
                                    Após carregar em confirmar, a sua publicação será analisada, podendo seguir processo na sua  
                                    <span className={styles.action}> Àrea Pessoal</span>.
                                    <p style={{fontSize:"0.7rem", textAlign:"left", marginTop:"50px", fontStyle:"italic"}}>
                                        Receberá também um <span className={styles.action}>e-mail</span> a confirmar a publicação
                                        do seu pedido!
                                    </p>
                                    
                                </p>
                        </div>
                        <span className={styles.confirm_button} onClick={() => props.confirmHandler()}>
                            CONFIRMAR
                        </span>
                        <span className={styles.cancel_text} onClick={() => props.cancelHandler()}>Cancelar</span>
                    </div>
                </CSSTransition>
            :
                <CSSTransition 
                in={transition}
                timeout={1200}
                classNames="transition"
                unmountOnExit
                >
                <div className={styles.popup}>
                        <span className={styles.value}>Reserva pendente</span>
                        <div className={styles.divider}></div>
                        <div className={styles.help_text}>
                                <p className={styles.help_text_val}>
                                    Tem uma reserva que tem de ser confirmada.
                                </p>
                                <p 
                                        className={styles.action_touchable} 
                                        onClick={() => {
                                            navigate('/user')
                                        }}>As minhas reservas</p>
                        </div>
                        <span className={styles.confirm_button} onClick={() => props.cancelHandler()}>
                            OK
                        </span>
                    </div>
                </CSSTransition>
            }
            
        </div>
    )
}

export default Popup
