import React, {useEffect, useState} from 'react'
import styles from './reserva.module.css'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Popup_detalhes from '../transitions/popup_detalhes';
import anonymous from '../assets/anonymous.png'
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Reserva = (props) => {

    const [type, setType] = useState(0)
    const [typeColor, setTypeColor] = useState("#fdd835")
    const [detalhes, setDetalhes] = useState(false)
    const [reservation, setReservation] = useState({})

    const navigate = useNavigate()

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        if(type===0) {setTypeColor("#C3CEDA")}
        if(type===1) {setTypeColor("#fdd835")}
        if(type===2) {setTypeColor("#30A883")}
        if(type===3) {setTypeColor("#1EACAA")}
    }, [type])

    useEffect(() => {
        if(props.nextReservation)
            setReservation(props.nextReservation)
    }, [props.nextReservation])

    const funcAux = () => {
        let aux = type
        aux++
        if(aux>3){
            setType(0)
        } else {
            
            setType(aux)
        } 
    }

    const reservationToDate = () => {
        if(reservation.date){
            let date = new Date(reservation.date)
            return <span>{`${date.getDate()} de ${monthNames[date.getMonth()]}`}<span className={styles.year_small}>({date.getFullYear()})</span></span>
        }
        else return <span>-- -- -----</span>
    }

    const getHours = (date1) => {
        if(date1){
            let date = new Date(date1)
            let hours = date.getHours()
            let minutes = date.getMinutes()
            if(date.getHours()<10){ 
                hours="0"+hours
            }
            if(date.getMinutes()===0){ 
                minutes="00"
            }
            return (hours+":"+minutes)
        }
        else {
            return "--:--"
        }
        

    }

    const reservationToHours = () => {
        return (
            reservation.requestStartTime?
            <div className={styles.hours_flex}>
                <div className={styles.middle_aux_text_wrapper}>
                    <span className={styles.middle_aux_text}>horário</span>
                    <span className={styles.middle_aux_text}>proposto</span>
                </div>
                
                <span className={styles.hours_start}>{getHours(reservation.startTime)}</span>
                <span className={styles.hours_divide}>-</span>
                <span className={styles.hours_end}>{getHours(reservation.endTime)}</span>
            </div>
            :
            <div className={styles.hours_flex}>
                <span className={styles.middle_aux_text}>horário</span>
                <span className={styles.hours_start}>hh:mm</span>
                <span className={styles.hours_divide}>-</span>
                <span className={styles.hours_end}>hh:mm</span>
        </div>
        )
    }
    
    const getPrice = () => {
        if(reservation.price){
            return `${reservation.price}`+"€"
        }
        else return '0.00€'
    }

    const getRequestedDate = () => {
        let val = reservation.reservationMadeTime
        if(val){
            let time = new Date(val)
            return <span>pedido feito a <span style={{textDecoration:"underline"}}>{time.toISOString().split("T")[0]}</span></span>
        }
    }

    return (
        <div>
            {
                reservation.user_id?
                <div>
                    {
                        detalhes?
                        <Popup_detalhes 
                            cancelHandler={() => setDetalhes(false)}/>
                        :null
                    }
                    {
                        props.previous?
                        <div style={{width:"90%", margin:"auto"}}>
                            <div className={styles.previous_voltar} onClick={() => props.back_handler()}>
                                <ArrowBackIcon className={styles.previous_symbol}/>
                                <span className={styles.previous_voltar_text}>VOLTAR ÀS RESERVAS</span>
                            </div>
                        </div>
                        
                        :null
                    }
                    <div className={props.previous?styles.reserva_previous:styles.reserva}>
                        <div className={styles.button_cancel_area}>
                            <span className={styles.button_cancel}>Cancelar Reserva</span>
                        </div>
                        <p className={styles.top_title} onClick={() => funcAux()}>{
                            props.previous?
                            <div className={styles.previous_wrapper}>
                                <span className={styles.previous_text}>Reserva Passada <span className={styles.previous_date}>({props.previous_date})</span></span>
                            </div>
                            
                            :"Próxima Reserva"
                        }</p>
                        <div className={styles.reserva_top}>
                            <div className={styles.top_img_wrapper}>
                                <img className={styles.top_img} src={reservation.worker?reservation.worker.photo:anonymous}></img>

                            </div>
                            <div className={styles.top_text}>
                                {
                                    reservation.worker?
                                        <span className={styles.text_name}>António Silva</span>
                                    :<span className={styles.text_name_tbd}>Profissional a Determinar</span>
                                }
                                {
                                    reservation.worker?
                                        <span className={styles.text_desc}>
                                            {reservation.worker.description}
                                        </span>:
                                        <span className={styles.text_desc_tbd}>
                                            Após análise e confirmação, será atribuído um profissonal à sua reserva!
                                        </span>

                                }   
                                
                            </div>
                        </div>

                        <div className={styles.middle}>
                            <div className={styles.middle_button_div}>
                                <p className={styles.middle_title}></p>
                                <div className={styles.button_area}>
                                    <div className={styles.button_proceed} style={{borderColor:typeColor, backgroundColor:typeColor+"50"}}>
                                        <span className={styles.button_proceed_text}>
                                            {
                                                type===1?"Por Confirmar":
                                                type===2?"Confirmada":
                                                type===3?"Por Pagar":
                                                type===4?"Concluído":
                                                    "A PROCESSAR"
                                                }
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className={styles.middle_main} style={{borderColor:typeColor}}>
                                <div className={styles.middle_date_info}>{getRequestedDate()}</div>
                                {
                                    type===0?
                                    <div className={styles.middle_pendent_frontdrop}>
                                        <span className={styles.middle_front_text}>A PROCESSAR</span>
                                    </div>
                                    :null
                                }
                                <div className={styles.middle_top}>
                                    {
                                        type===3?
                                        <CheckIcon className={styles.middle_check}/>
                                        :null
                                    }
                                    <div className={styles.middle_flex} style={{opacity:type===3||type===0?"0.3":"1"}}>
                                        <div className={styles.middle_day}>
                                            <div className={styles.middle_aux_text_wrapper}>
                                                <span className={styles.middle_aux_text}>dia</span>
                                                <span className={styles.middle_aux_text}>proposto</span>
                                            </div>
                                            <span className={styles.middle_day_text}>{reservationToDate()}</span>
                                        </div>
                                        {reservationToHours()}
                                        
                                    </div>
                                    <div className={styles.divider} style={{opacity:type===3||type===0?"0.3":"1"}}></div>
                                    <div className={styles.middle_info} style={{opacity:type===3||type===0||type===1?"0.3":"1"}}>
                                        <span className={styles.middle_aux_text} style={{color:"white", fontSize:"0.9rem", textDecoration:"underline"}}>Detalhes da reserva</span>
                                        <div className={styles.middle_info_zone}>
                                            <div className={styles.middle_info_flex} style={{paddingTop:"15px"}}>
                                                <span className={styles.middle_aux_text_minor}>Descrição</span>
                                                <span className={styles.middle_info_text}>{reservation.desc}</span>
                                            </div>
                                            <div className={styles.middle_info_flex} style={{paddingTop:"15px"}}>
                                                <span className={styles.middle_aux_text_minor}>Localização</span>
                                                <span className={styles.middle_info_text}>{`${reservation.localizacao}`} - {`${reservation.porta}`} {reservation.andar!==""?`- ${reservation.andar}`:null}</span>
                                            </div> 
                                            {
                                                type>1?
                                                    <div className={styles.middle_info_flex} style={{paddingTop:"15px"}}>
                                                        <span className={styles.middle_aux_text_minor}>Profissional</span>
                                                        <span className={styles.middle_info_text}>worker.name</span>
                                                    </div>
                                                :null
                                            }
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <div className={styles.middle_info} style={{marginTop:"30px", marginBottom:"15px", opacity:type===3?"1":"0.3"}}>
                                    <span className={styles.middle_aux_text} style={{color:"white", fontSize:type===3?"1.1rem":"0.9rem", textDecoration:"underline"}}>Valor a Pagar</span>
                                    <div className={styles.middle_info_zone} style={{border:"none"}}>
                                        <div className={styles.middle_info_flex_hor} style={{paddingTop:"5px"}}>
                                            <EuroSymbolIcon className={type===3?styles.middle_info_money:styles.middle_info_money_disabled}/>
                                            <span>
                                                <span className={styles.middle_info_text_worker} style={{color:type===3?"white":"#ffffff70", fontSize:type===3?"1.4rem":"1.2rem"}}>{getPrice()}</span>
                                                {
                                                    type<3?
                                                    <span className={styles.middle_info_text_worker_simple} style={{color:type===3?"#ffffff70":"white"}}>(Valor a determinar)</span>
                                                    :null
                                                }    
                                            </span>
                                                {
                                                        type>=3?
                                                        <span className={styles.info_flex} onClick={() => setDetalhes(true)}>
                                                            <span className={styles.info_icon_text}>detalhes</span>
                                                            <InfoIcon className={styles.info_icon}/>
                                                        </span>
                                                        :null
                                                }
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={styles.bottom}>
    
                                <div>
                                    {   
                                        type===1?
                                        <span className={styles.bottom_por_confirmar_text}>
                                            Feliz com o dia e horário proposto? Confirme a reserva!
                                        </span>
                                        :type===2?
                                        <div>
                                            <span className={styles.bottom_por_confirmar_text}>
                                                Reserva CONFIRMADA! Vai-se encontrar com 
                                            </span> <span className={styles.confirmar_text_highlight}>worker.name</span>
                                        </div>
                                        :type===3?
                                        <span className={styles.bottom_por_confirmar_text}>
                                            Trabalho bem feito? Proceda com o pagamento!
                                        </span>
                                        :type===0?
                                        <span className={styles.bottom_por_confirmar_text}>
                                            Pedido de reserva a ser <span className={styles.underline}>processado</span>
                                        </span>
                                        :null
                                    }
                                    
                                </div>
                                <div className={type===0||type===2?styles.bottom_button_disabled:styles.bottom_button} style={{backgroundColor:typeColor}}>
                                    <span className={styles.button_text}>
                                    {
                                        type===1?"Confirmar":
                                        type===2?"Reserva Confirmada":
                                        type===3?"Pagar":
                                        type===4?"Concluído":
                                            "A PROCESSAR"
                                    }</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                :<div className={styles.blank}>
                    <div className={styles.blank_flex}>
                        <span className={styles.blank_text}>Não tem nenhuma reserva marcada</span>
                        <Sad className={styles.blank_face}/>
                        <span className={styles.blank_request}>
                            Fazer um pedido de <span className={styles.blank_request_click} onClick={() => navigate('/reserva')}>reserva</span>
                        </span>
                    </div>
                    
                </div>
            }
            
        </div>
        
    )
}

export default Reserva