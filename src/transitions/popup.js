import React, {useState, useEffect} from 'react'
import styles from './popup.module.css'
import CircleOutlinedIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import {CSSTransition}  from 'react-transition-group';

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const Popup = (props) => {

    const [transition, setTransition] = useState(false)

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
                        <span className={styles.value}>Reserva</span>
                        <div className={styles.divider}></div>
                        <div className={styles.line}>
                            <CircleOutlinedIcon className={styles.line_circle}/>
                            <span className={styles.line_text} style={{textTransform:"capitalize"}}>{props.worker}</span>
                            <img src={props.worker==="eletricista"?elec
                                    :props.worker==="canalizador"?cana:carp} className={styles.worker}></img>
                        </div>

                        <div className={styles.line}>
                            <EventIcon className={styles.line_circle}/>
                            <span className={styles.line_text}><span className={styles.back_cor}>{props.dateDay}</span> de <span className={styles.back_cor}>{monthNames[props.dateMonth]}</span></span>
                        </div>
                        
                        <div className={styles.line}>
                            <AccessTimeIcon className={styles.line_circle}/>
                            <span className={styles.line_text}>
                                {props.startTime!==null&&props.endTime!==null?
                                        <span>Entre as <span className={styles.back_cor}><span className={styles.cor}>{props.startTime} </span>
                                                - <span className={styles.cor}>{props.endTime}</span></span></span>
                                    :props.startTime!==null?
                                        <span>A partir das <span className={styles.back_cor}>{props.startTime}</span></span>
                                    :props.endTime!==null?
                                        <span>Até às <span className={styles.back_cor}>{props.endTime}</span></span>
                                    :
                                    <span>A <span className={styles.back_cor}>qualquer hora</span></span>
                                    }
                            </span>
                        </div>
                        <div className={styles.help_text}>
                                <p className={styles.help_text_val}>
                                    Após confirmar o pedido, receberá uma <span className={styles.action}>notificação </span>
                                    e um <span className={styles.action}>e-mail</span> a confirmar o dia 
                                    e horário por nós proposto!
                                </p>
                        </div>
                        <span className={styles.confirm_button} onClick={() => props.confirmHandler()}>
                            CONFIRMAR
                        </span>
                        <span className={styles.cancel_text} onClick={() => props.cancelHandler()}>cancelar</span>
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
                                    Ir para <span 
                                        className={styles.action_touchable} 
                                        onClick={() => {
                                            props.cancelHandler()
                                        }}>reservas</span>.
                                </p>
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
