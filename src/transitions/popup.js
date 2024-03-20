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
    
Para que a tua tarefa possa ser aprovada, altere os seguintes campos:`)

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
                admin_name: user?.name,
                admin_id: user?._id,
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
    
Para que a tua tarefa possa ser aprovada, altere os seguintes campos:`)
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
            props.type === "cancel_subscription"?
                <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="publicar"
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
                    classNames="publicar"
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
