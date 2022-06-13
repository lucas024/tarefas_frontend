import React, {useEffect, useState} from 'react'
import styles from './reserva.module.css'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Popup_detalhes from '../transitions/popup_detalhes';
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FaceIcon from '@mui/icons-material/Face';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
import ImageGallery from 'react-image-gallery';

const Reserva = (props) => {

    const [type, setType] = useState(0)
    const [typeColor, setTypeColor] = useState("#fdd835")
    const [detalhes, setDetalhes] = useState(false)
    const [reservation, setReservation] = useState({})
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [address, setAddress] = useState(null)
    const [images, setImages] = useState(null)

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
        if(props.nextReservation){
            setReservation(props.nextReservation)
            setAddressHandler(props.nextReservation.localizacao)
            let arr = []
            for(let img of props.nextReservation.photos){
                arr.push({
                    original: img,
                    thumbnail: img,
                    originalHeight: "300px",
                    originalWidth: "700px",
                    thumbnailHeight: "50px",
                    thumbnailWidth: "100px",
                })
            }
            setImages(arr)
        }
            
    }, [props.nextReservation])

    const setAddressHandler = (val) => {
        Geocode.fromAddress(val).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log(lat);
              console.log(lng);
              setLat(lat)
              setLng(lng)
            })
    }

    const reservationToDate = () => {
        if(reservation.date){
            let date = new Date(reservation.date)
            return <span>{`${date.getDate()} de ${monthNames[date.getMonth()]}`}<span className={styles.year_small}>({date.getFullYear()})</span></span>
        }
        else return <span>-- -- -----</span>
    }

    const getPublicationDate = () => {
        if(reservation.publication_time){
            let date = new Date(reservation.publication_time)
            return <span>{`Publicado a ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`}</span>
        }
        else{
            return <span>sdsidjsidj</span>
        }
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
        let val = reservation.publication_time
        if(val){
            let time = new Date(val)
            return <span>pedido feito a <span style={{textDecoration:"underline"}}>{time.toISOString().split("T")[0]}</span></span>
        }
    }

    const getNumberDisplay = number => {
        return `${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6)}`
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

                    <div className={styles.previous_voltar} onClick={() => props.back_handler()}>
                        <ArrowBackIcon className={styles.previous_symbol}/>
                        <span className={styles.previous_voltar_text}>VOLTAR ÀS <span className={styles.action}>PUBLICAÇÕES</span></span>
                    </div>

                    <div className={styles.reserva}>
                        {/* <div className={styles.button_cancel_area}>
                            <span className={styles.button_cancel}>Cancelar Reserva</span>
                        </div> */}
                        <div className={styles.top_top}>
                            <div className={styles.top_left}>
                                <div className={styles.top_left_top}>
                                    <span className={styles.top_date}>{getPublicationDate()}</span>
                                    <div className={styles.top_title}>
                                        {
                                        <div className={styles.previous_wrapper}>
                                            <span className={styles.previous_text}>{reservation.title}</span>
                                        </div>
                                        }
                                    </div>
                                    <span className={styles.top_desc_text}>DESCRIÇÃO</span>
                                    <span className={styles.top_desc}>
                                            OSsapdoi oasidoiwqeiusaidu saduiqwui said uiuqwiueiasudeiusa diasuidwquiesaidji
                                    </span>
                                </div>
                                
                                <div>
                                    <div className={styles.divider}></div>
                                    <div className={styles.details}>
                                        <span className={styles.details_id}>ID: {reservation._id}</span>
                                        <span className={styles.details_id}>Visualizações: {reservation.clicks}</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className={styles.top_right}>
                                <span className={styles.top_right_user}>Utilizador</span>
                                <div className={styles.top_right_div}>
                                    {
                                        reservation.user_photo!==""?
                                        <img src={reservation.user_photo} className={styles.top_right_img}></img>
                                        :<FaceIcon className={styles.top_right_img}/>
                                    }
                                    <div className={styles.user_info}>
                                        <span className={styles.user_info_name}>{reservation.user_name}</span>
                                        <span style={{display:"flex", alignItems:"center", marginTop:"5px"}}>
                                            <PhoneOutlinedIcon className={styles.user_info_number_symbol}/>
                                            <span className={styles.user_info_number}>{getNumberDisplay(reservation.user_phone)}</span>   
                                        </span>
                                    </div>                                    
                                </div>
                                <span className={styles.top_right_user} style={{marginTop:"40px", marginBottom:"10px"}}>Localização</span>
                                <div className={styles.map_div}>
                                        <GoogleMapReact 
                                            bootstrapURLKeys={{ key:"AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk"}}
                                            defaultZoom={14}
                                            center={{ lat: lat, lng: lng}}    
                                            >
                                           <div
                                                lat={lat}
                                                lng={lng}
                                                className={styles.map_pointer}
                                           />
                                        </GoogleMapReact>
                                    </div>
                            </div>
                        </div>
                        <div className={styles.photos}>
                            <span className={styles.top_right_user}>Fotografias</span>
                            <ImageGallery 
                                items={images} 
                                infinite={false} 
                                showPlayButton={false}/>
                        </div>
                        


                        <div className={styles.middle}>
                            <div className={styles.middle_button_div}>
                                <p className={styles.middle_title}></p>
                                <div className={styles.button_area}>
                                    <div className={styles.button_proceed} style={{borderColor:typeColor, backgroundColor:typeColor+"50"}}>
                                        <span className={styles.button_proceed_text}>
                                            {
                                                type===1?"Publicado":
                                                type===2?"Concluído":
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
                                        type===1?"Publicado":
                                        type===2?"Concluído":
                                            "A PROCESSAR"
                                    }</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                :<div className={styles.blank}>
                    <div className={styles.blank_flex}>
                        <span className={styles.blank_text}>Esta publicaçaõ não existe</span>
                        <Sad className={styles.blank_face}/>
                        <span className={styles.blank_request}>
                            Fazer uma <span className={styles.blank_request_click} onClick={() => navigate('/reserva')}>publicação</span>
                        </span>
                    </div>
                    
                </div>
            }
            
        </div>
        
    )
}

export default Reserva