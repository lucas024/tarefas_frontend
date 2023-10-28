import React, {useState, useEffect} from 'react'
import styles from './popup.module.css'
import CircleOutlinedIcon from '@mui/icons-material/Circle';
import {CSSTransition}  from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import SelectAdmin from '../selects/selectAdmin';
import { useSelector } from 'react-redux';


const Popup = (props) => {
    const user = useSelector(state => {return state.user})
    const api_url = useSelector(state => {return state.api_url})

    const [refuseMessage, setRefuseMessage] = useState(`Olá ${props.reservation?.user_name}, 
    
Para que a sua publicação possa ser aprovada, altere os seguintes campos:`)

    const [refusals, setRefusals] = useState([
        {
            type: "titulo",
            text: ""
        },
    ])

    const [transition, setTransition] = useState(false)
    const navigate = useNavigate()

    const ObjectID = require("bson-objectid");

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])

    const sendRefuseMessage = async () => {
        if(refuseMessage!==""){
            let time = new Date().getTime()
            let text_object = {
                origin_type : 4,
                timestamp : time,
                text: refuseMessage,
                refusal_object: refusals,
                refusal_start: true,
                reservation_id: props.reservation._id,
                reservation_title: props.reservation.title
            }

            var userWithAdminChat = await axios.get(`${api_url}/user/get_user_by_mongo_id`, { params: {_id: props.user_id} })

            let chatId = ObjectID()
            await axios.post(`${api_url}/admin_chats/create_or_update_chat`, {
                admin_name: user.name,
                admin_id: user._id,
                user_id: props.user_id,
                user_type: 0,
                user_name: props.reservation.user_name,
                text: text_object,
                refusal_object: refusals,
                updated: time,
                chat_id: userWithAdminChat?.data?.admin_chat || chatId,
                update_reservation_type: 2,
                reservation_id: props.reservation._id
            })
            setRefuseMessage(`Olá ${props.reservation.user_name}, 
    
Para que a sua publicação possa ser aprovada, altere os seguintes campos:`)
            props.confirmHandler()
            }
    }

    const handleChangeText = (text, index) => {
        let refusals_aux = [...refusals]
        refusals_aux[index].text = text

        console.log(refusals_aux);
        setRefusals(refusals_aux)
    }

    const handleChangeType = (type, index) => {
        let refusals_aux = [...refusals]
        refusals_aux[index].type = type
        

        setRefusals(refusals_aux)
    }

    const displayRefusals = () => {
        return refusals.map((ref, i) => {
            return(
                <div className={styles.refusal_div} key={i}>
                    <span className={styles.remove} onClick={() => removeRefusal(i)}>-</span>
                    <div>
                        <SelectAdmin 
                        refusal_type={ref.type}
                        changeType={type => handleChangeType(type, i)}/>
                    </div>
                    <textarea onChange={e => handleChangeText(e.target.value, i)} className={styles.input}></textarea>
                </div>
            )
        })
    }

    const addRefusal = () => {
        setRefusals([...refusals, {
                                    type: "titulo",
                                    text: ""
                                },])
    }

    const removeRefusal = idx => {
        let refusals_aux = [...refusals]
        refusals_aux.splice(idx, 1)
        setRefusals(refusals_aux)
    }

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
                <div className={props.type==='confirm'?styles.popup_confirm:styles.popup}>
                        <span className={styles.value}>Publicar</span>
                        <div className={styles.divider}></div>
                        <div className={styles.line}>
                            <CircleOutlinedIcon className={styles.line_circle}/>
                            <span className={styles.helper_text}>Serviço:</span>
                            <span className={styles.line_text} style={{textTransform:"capitalize"}}>{props.worker}</span>
                        </div>

                        <div className={styles.help_text}>
                                <p className={styles.help_text_val}>
                                    Após carregar em confirmar, a sua publicação será analisada, podendo seguir o processo na sua  
                                    <span className={styles.action}> Àrea Pessoal</span>.<br/><br/>
                                    <p style={{fontSize:"0.7rem", textAlign:"left", fontStyle:"italic"}}>
                                        Receberá também um <span className={styles.action}>e-mail</span> a confirmar a publicação
                                        do seu trabalho!
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
            props.type === 'confirm_edit'?
            <CSSTransition 
                in={transition}
                timeout={1200}
                classNames="transition"
                unmountOnExit
                >
            <div className={props.type==='confirm_edit'?styles.popup_confirm:styles.popup}>
                    <span className={styles.value}>Editar Publicação</span>
                    <div className={styles.divider}></div>
                    <div className={styles.line}>
                        <CircleOutlinedIcon className={styles.line_circle}/>
                        <span className={styles.line_text}>Está a editar a sua publicação.</span>
                    </div>

                    <div className={styles.help_text}>
                            <p className={styles.help_text_val}>
                                Após carregar em confirmar, a sua publicação será <span className={styles.action}>novamente</span> analisada, podendo seguir o processo na sua  
                                <span className={styles.action}> Àrea Pessoal</span>.<br/><br/>
                                <p style={{fontSize:"0.7rem", textAlign:"left", fontStyle:"italic"}}>
                                    Receberá também um <span className={styles.action}>e-mail</span> a confirmar a publicação
                                    do seu trabalho!
                                </p>
                                
                            </p>
                    </div>
                    <span className={styles.confirm_button} onClick={() => props.confirmHandler()}>
                        CONFIRMAR
                    </span>
                    <span className={styles.cancel_text} onClick={() => props.cancelHandler()}>Cancelar</span>
                </div>
            </CSSTransition>
            :  props.type === 'error_to_many'?
                <CSSTransition 
                in={transition}
                timeout={1200}
                classNames="transition"
                unmountOnExit
                >
                <div className={styles.popup}>
                        <span className={styles.value}>5 ou mais publicações!</span>
                        <div className={styles.divider}></div>
                        <div className={styles.help_text}>
                                <p className={styles.help_text_val}>
                                    Já tem 5 publicações activas/pendentes. Conclua uma ou mais publicações anteriores para publicar um novo trabalho.
                                </p>
                                <p 
                                        className={styles.action_touchable} 
                                        onClick={() => {
                                            navigate('/user')
                                        }}>As minhas publicações</p>
                        </div>
                        <span className={styles.confirm_button} onClick={() => props.cancelHandler()}>
                            OK
                        </span>
                    </div>
                </CSSTransition>
            :props.type === "cancel_subscription"?
                <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="transition"
                    unmountOnExit
                    >
                    <div className={styles.popup}>
                            <span className={styles.value}>Cancelar Subscrição</span>
                            <div className={styles.divider}></div>
                            <div className={styles.help_text}>
                                    <p className={styles.help_text_val}>
                                        O cancelamento da subscrição terá efeito imediato, mas manterá os privilégios de conta ativa até <span style={{color:"#FF785A"}}>{props.date}</span>.
                                    </p>
                            </div>
                            <span className={styles.confirm_button} onClick={() => props.confirm()}>
                                CONFIRMAR
                            </span>
                    </div>
                </CSSTransition>
            :props.type === "refuse_publication"?
                <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="transition"
                    unmountOnExit
                    >
                    <div className={styles.popup_admin_refuse}>
                            <span className={styles.value}>Recusar Publication</span>
                            <div className={styles.divider}></div>
                            <div className={styles.help_text}>
                                    <p className={styles.help_text_val}>
                                        Mensagem
                                    </p>
                            </div>
                            <textarea className={styles.top_desc_area} value={refuseMessage} onChange={e => setRefuseMessage(e.target.value)}>
                            </textarea>
                            <div>
                                {displayRefusals()}
                                <span className={styles.add} onClick={() => addRefusal()}>+</span>
                            </div>
                            <span className={styles.confirm_button} onClick={() => sendRefuseMessage()}>
                                ENVIAR
                            </span>

                            <span className={styles.cancel} onClick={() => props.cancelHandler()}>
                                CANCELAR
                            </span>
                    </div>
                </CSSTransition>
            :null
            }
            
        </div>
    )
}

export default Popup
