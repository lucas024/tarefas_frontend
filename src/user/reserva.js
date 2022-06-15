import React, {useEffect, useState} from 'react'
import styles from './reserva.module.css'
import Popup_detalhes from '../transitions/popup_detalhes';
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FaceIcon from '@mui/icons-material/Face';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
import ImageGallery from 'react-image-gallery';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Reserva = (props) => {

    const [detalhes, setDetalhes] = useState(false)
    const [reservation, setReservation] = useState({})
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [images, setImages] = useState(null)
    const [text, setText] = useState("")
    const [more, setMore] = useState(false)

    const navigate = useNavigate()

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

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

    const getPublicationDate = () => {
        if(reservation.publication_time){
            let date = new Date(reservation.publication_time)
            return <span>{`Publicado a ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`}</span>
        }
        else{
            return <span>_</span>
        }
    }
    const getNumberDisplay = number => {
        return `${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6)}`
    }

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#1EACAA"
        return "#FFFFFF"
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
                        <span className={styles.previous_voltar_text}>VOLTAR ÀS <span className={styles.action}>MINHAS PUBLICAÇÕES</span></span>
                    </div>
                    <div className={styles.reserva} onClick={() => more&&setMore(false)}>
                        <div className={styles.top_top}>
                            <div className={styles.top_left} style={{borderColor:getTypeColor(reservation.type)}}>
                                {/* Indicator + more */}
                                <div className={styles.top_left_indicator_more}>
                                    <div className={styles.item_flex_indicator} style={{backgroundColor:getTypeColor(reservation.type)}}>
                                        <span className={styles.item_indicator}></span>
                                        <span className={styles.item_type}>
                                            {
                                                reservation.type===1?"Activo":
                                                reservation.type===2?"Concluído":
                                                    "Processar"
                                            }
                                        </span>
                                    </div>
                                    <MoreVertIcon className={styles.more} onClick={() => setMore(!more)}/>
                                    
                                    <div className={styles.dropdown} hidden={!more}>
                                        <div className={styles.dropdown_top}>
                                            <span className={styles.dropdown_top_text}>Publicação</span>
                                        </div>
                                        <div onClick={() => {}} className={styles.drop_div_main} style={{borderTop:"1px solid #ccc", borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                                            <div className={styles.drop_div}>
                                                <DeleteOutlineIcon className={styles.drop_div_symbol}/>
                                                <span className={styles.drop_div_text}>Eliminar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
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
                        <div className={styles.message}>
                            <div className={styles.message_top_flex}>
                                <div className={styles.message_left}>
                                    {
                                        reservation.user_photo!==""?
                                        <img src={reservation.user_photo} className={styles.top_right_img}></img>
                                        :<FaceIcon className={styles.top_right_img}/>
                                    }
                                    <span className={styles.message_left_user_name}>{reservation.user_name}</span>
                                </div>
                                <span style={{display:"flex", alignItems:"center", marginTop:"5px"}}>
                                    <PhoneOutlinedIcon className={styles.user_info_number_symbol}/>
                                    <span className={styles.user_info_number}>{getNumberDisplay(reservation.user_phone)}</span>   
                                </span>
                            </div>
                            <textarea 
                                className={styles.message_textarea}
                                placeholder="Escrever mensagem..."
                                value={text}
                                onChange={e => setText(e.target.value)}
                            />
                            <div className={styles.message_enviar_div}>
                                <span className={text!==""?styles.message_enviar:styles.message_enviar_disabled}>
                                    Enviar
                                </span>
                            </div>
                            


                        </div>
                    </div>
                </div>
                :<div className={styles.blank}>
                    <div className={styles.blank_flex}>
                        <span className={styles.blank_text}>Esta publicação não existe</span>
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