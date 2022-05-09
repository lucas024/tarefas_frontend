import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './userReservationPage.module.css'
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import TopSelect from '../styling/selectStyling';
import dayjs from 'dayjs';
import Calendar from 'react-calendar'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')

const UserReservationPage = () => {

    const [selectedWorker, setSelectedWorker] = useState('eletricista')
    const [dateObj, setDateObj] = useState(null)
    const [dateExtense, setDateExtense] = useState(null)
    const [showCalendar, setShowCalendar] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    const [nome, setNome] = useState('')
    const [nomeWrong, setNomeWrong] = useState(false)
    const [nomeFocused, setNomeFocused] = useState(false)
    const [phone, setPhone] = useState('')
    const [phoneVisual, setPhoneVisual] = useState('')
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [phoneFocused, setPhoneFocused] = useState(false)
    const [email, setEmail] = useState('')
    const [emailWrong, setEmailWrong] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [address, setAddress] = useState('')
    const [badAddress, setBadAddress] = useState(false)
    const [wrongAddress, setWrongAddress] = useState(false)
    const [addressFocused, setAddressFocused] = useState(false)
    const [porta, setPorta] = useState('')
    const [portaFocused, setPortaFocused] = useState(false)
    const [portaWrong, setPortaWrong] = useState(false)
    const [andar, setAndar] = useState('')
    const [complete, setComplete] = useState(false)
 
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSelectedWorker(Object.fromEntries([...searchParams]).w)
    }, [searchParams])

    useEffect(() => {
        if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
        else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
        else{
            setPhoneVisual(`${phone.slice(0,3)}`)
        }
    }, [phone])

    useEffect(() => {
        if(nome.length>0 && validator.isMobilePhone(phone, "pt-PT") && validator.isEmail(email) && address.length>0 && dateObj && porta.length>0)
            setComplete(true)
        else{
            setComplete(false)
        }
        if(!validator.isMobilePhone(phone, "pt-PT") && phoneFocused){
            if(!phoneWrong) setPhoneWrong(true)
        }
        else{
            setPhoneWrong(false)
        }
        if(!validator.isEmail(email) && emailFocused){
            if(!emailWrong) setEmailWrong(true)
        }
        else{
            setEmailWrong(false)
        }
        if(nome.length>0) setNomeWrong(false)
        else if(nomeFocused) setNomeWrong(true)
        if(porta.length>0) setPortaWrong(false)
        else if(portaFocused) setPortaWrong(true)
        if(address.length===0 && addressFocused) setWrongAddress(true)
    }, [nome, phone, email, address, phoneFocused, emailFocused, dateObj, porta, portaFocused, addressFocused])


    const nameFocused = () => {
        if(nome.length===0) setNomeWrong(true)
        setNomeFocused(true)
    }

    const getMinDate = () => {
        let minDate = new Date()
        let tomorrow = new Date(minDate.getTime() + (1000 * 60 * 60 * 24))
        return tomorrow
    }
    const getMaxDate = () => {
        let val = new Date()
        val.setMonth(new Date().getMonth() + 6)
        return val
    }
    const dateSelectHandler = (val) => {
        setDateObj(new Date(val))
        setShowCalendar(false)
        let aux = new Date(val)
        let day = aux.getDate()
        let month = aux.getMonth()
        setDateExtense(`${day} de ${monthNames[month]}`)
    }

    const getRoundedDate = (minutes, d=new Date()) => {
        let ms = 1000 * 60 * minutes;
        let roundedDate = new Date(Math.round(d.getTime() / ms) * ms);
        return roundedDate
    }
    const formatTime = (type, val) => {
        if(type === "min"){
            if(parseInt(val)===0)
                return '00'
        }
        else
            if(parseInt(val)<10)
                return `0${val}`

        return val
    }

    const getStartTimeList = () => {
        let aux = new Date()
        let init = new Date(aux.setHours(7))
        aux.setHours(18)
        let end = new Date(aux.setMinutes(0))
        let array = []
        let val = null
        while(init.getTime() < end.getTime()){
            val = getRoundedDate(30, new Date(init.setMinutes(init.getMinutes() + 30)))
            array.push({value: `${formatTime('hours', val.getHours())}:${formatTime('min', val.getMinutes())}`,
                        label: `${formatTime('hours', val.getHours())}:${formatTime('min', val.getMinutes())}`})
        }
        return array
    }
    const getEndTimeList = () => {
        let aux = new Date()
        let init = new Date(aux.setHours(7))
        if(startTime)
        {
            init = new Date(new Date(aux.setHours(startTime.slice(0,2))).setMinutes(startTime.slice(3,5))) 
        }
        aux.setHours(18)
        let end = new Date(aux.setMinutes(0))
        let array = []
        let val = null
        while(init.getTime() < end.getTime()){
            val = getRoundedDate(30, new Date(init.setMinutes(init.getMinutes() + 30)))
            array.push({value: `${formatTime('hours', val.getHours())}:${formatTime('min', val.getMinutes())}`,
                        label: `${formatTime('hours', val.getHours())}:${formatTime('min', val.getMinutes())}`})
        }
        return array
    }

    const selectedInitTimeHandler = (init) => {
        setStartTime(init)
        setShowStart(false)
        setEndTime(null)
    }
    const selectedEndTimeHandler = (init) => {
        setEndTime(init)
        setShowEnd(false)
    }


    const displayStartHours = () => {
        return getStartTimeList().map((val, i) => {
            return(
                <span key={i} className={styles.hour_option} onClick={() => selectedInitTimeHandler(val.label)}>
                    <span className={styles.hour_option_val}>
                        {val.label}
                    </span>
                </span>
            )
        })
    }
    const displayEndHours = () => {
        return getEndTimeList().map((val, i) => {
            return(
                <span key={i} className={styles.hour_option} onClick={() => selectedEndTimeHandler(val.label)}>
                    <span className={styles.hour_option_val}>
                        {val.label}
                    </span>
                </span>
            )
        })
    }

    const setPhoneHandler = (val) => {
        let phone = val.replace(/\s/g, '')
        setPhone(phone)
    }
    const setAddressHandler = (val) => {
        Geocode.fromAddress(val.label).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log(lat, lng);
              if(38.84>=lat && lat>=38.68 && -9.06>lng && lng>-9.34){
                  setBadAddress(false)
                  setWrongAddress(false)
                  setAddress(val.label)
              }
              else{
                  setBadAddress(true)
                  setAddress('')
              }
            },
            (error) => {
              console.error(error);
            })
    }

    return (
        <div className={styles.reservation}>
            {
            showCalendar?
                <div className={styles.calendar}>
                    <div className={styles.calendar_area}>
                        <span className={styles.calendar_x} onClick={() => setShowCalendar(false)}></span>
                        <p className={styles.calendar_title}>Escolher dia</p>
                        <div className={styles.calendar_div}>
                            <Calendar className={styles.calendar_object}
                                locale="pt-PT"
                                minDate={getMinDate()}
                                next2Label=""
                                prev2Label=""
                                view="month"
                                minDetail="month"
                                maxDate={getMaxDate()}
                                onChange={val => dateSelectHandler(val)}
                                value={dateObj}
                                formatShortWeekday={(locale, date) => dayjs(date).format('dd')}
                                />
                        </div>
                    </div>
                </div>
            :
            showStart?
                <div className={styles.calendar}>
                    <div className={styles.calendar_area}>
                        <span className={styles.calendar_x} onClick={() => setShowStart(false)}></span>
                        <p className={styles.calendar_title}>Hora inicial</p>
                        <div className={styles.hour_div}>
                            {displayStartHours()}
                        </div>
                    </div>
                </div>
            :
            showEnd?
                <div className={styles.calendar}>
                    <div className={styles.calendar_area}>
                        <span className={styles.calendar_x} onClick={() => setShowEnd(false)}></span>
                        <p className={styles.calendar_title}>Hora inicial</p>
                        <div className={styles.hour_div}>
                            {displayEndHours()}
                        </div>
                    </div>
                </div>
            :null
            }
            <div className={styles.flex}>
                <div className={styles.left}>
                    <div className={styles.left_title_area}>
                        <span className={styles.left_title}>Reserva</span>
                    </div>
                    <div className={styles.left_description_area}>
                        <span className={styles.left_description}>
                            <p>
                            Nesta página pode fazer um <span className={styles.action}>pedido de reserva</span> para o serviço 
                            de que precisa.<br/>
                            <br></br>
                            </p>
                            
                            <p>
                                Após fazer o pedido, receberá uma <span className={styles.action}>notificação </span>
                                e um <span className={styles.action}>e-mail</span> (+/- 30 minutos) para confirmar o dia 
                                e horário por nós proposto que se melhor enquadre na sua preferência.
                            </p>
                        </span>
                    </div>
                    
                    <div className={styles.left_list}>
                        <span className={styles.list_element_div}>
                            <span className={styles.element_symbol}></span>
                            <span className={styles.element_title}>
                                
                            </span>
                            <span className={styles.element_desc}>

                            </span>
                            
                        </span>
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.reservar}>
                        <span className={styles.bot_title}>Data e Hora</span>
                        <div className={styles.top}>
                            <div className={styles.top_left}>
                                <img src={selectedWorker==="eletricista"?elec:
                                            selectedWorker==="canalizador"?cana
                                            :carp} className={styles.left_img}></img>
                                <div className={styles.left_select}>
                                    <TopSelect
                                        id={selectedWorker}
                                        changeWorker={val => {
                                            navigate(`/reserva?w=${val}`)
                                            setSelectedWorker(val)}}
                                    />
                                </div>
                            </div>
                            <div className={styles.top_right}>
                                <div className={styles.top_right_flex}>
                                    <span className={styles.right_top_date} onClick={() => setShowCalendar(true)}>
                                            <span className={styles.area_label} style={{right:0, bottom:0}}>Dia<span className={styles.asterisc}>*</span></span>
                                        <span className={dateObj?styles.right_top_date_val:styles.right_top_date_val_unselected}>
                                            {   
                                                dateObj?dateExtense:'DATA'
                                            }</span>
                                    </span>
                                    <span className={styles.right_top_empty}></span>
                                </div>
                                <div className={styles.top_right_flex}>
                                    <CallMissedOutgoingIcon className={styles.arrow} sx={{fontSize:"25px"}}/>
                                    <span className={styles.right_bot_hour_start}  onClick={() => setShowStart(true)}
                                            style={{borderRight:startTime&&endTime?"1px solid #FF785A":startTime?"1px dashed #FF785A":"1px dashed #FFF"}}>
                                        <span className={styles.area_label} style={{right:0, bottom:0}}>De</span>
                                        <span className={startTime?styles.right_top_date_val:styles.right_top_date_val_unselected}>
                                            {
                                                startTime?startTime:"HORA INICIAL"
                                            }
                                        </span>
                                    </span>
                                    <span className={styles.right_bot_hour_finish} onClick={() => setShowEnd(true)}>
                                        <span className={styles.area_label} style={{right:0, bottom:0}}>Até</span>
                                        <span className={endTime?styles.right_top_date_val:styles.right_top_date_val_unselected}>
                                            {
                                                endTime?endTime:"HORA FINAL"
                                            }
                                        </span>
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.top_desc}>
                            <span className={styles.area_label} style={{right:"-8px", bottom:"4px"}}>Descrição</span>
                            <textarea className={styles.top_desc_area} placeholder="Descrição do problema...">
                                
                            </textarea>
                        </div>
                        <div className={styles.bottom}>
                            <span className={styles.bot_title}>Detalhes de contacto</span>
                            <div className={styles.contact_area}>
                                <div className={styles.bot_input_div} style={{marginTop:"0"}}>
                                    <span className={nomeWrong?styles.area_label_wrong:styles.area_label_inverse}>Nome<span className={styles.asterisc}>*</span></span>
                                    <input onFocus={() => {nameFocused()}} maxLength={26} onChange={e => setNome(e.target.value)} value={nome} className={styles.bot_input_short} ></input>
                                </div>
                                <div className={styles.bot_input_div}>
                                    <span className={phoneWrong?styles.area_label_wrong:styles.area_label_inverse}>Telefone<span className={styles.asterisc}>*</span></span>
                                    <input onFocus={() => {setPhoneFocused(true)}} maxLength={11} onChange={e => setPhoneHandler(e.target.value)} value={phoneVisual} className={styles.bot_input_short}></input>
                                </div>
                                <div className={styles.bot_input_div}>
                                    <span className={emailWrong?styles.area_label_wrong:styles.area_label_inverse}>E-mail<span className={styles.asterisc}>*</span></span>
                                    <input onFocus={() => {setEmailFocused(true)}} maxLength={80} onChange={e => setEmail(e.target.value)} value={email} className={styles.bot_input_long}></input>
                                </div>
                                <div className={styles.bot_address_flex}>
                                    <div className={styles.bot_input_div_search} onClick={() => setAddressFocused(true)}>
                                        <span className={badAddress||wrongAddress?styles.area_label_wrong:styles.area_label_inverse}>Morada<span className={styles.asterisc}>*</span></span>
                                        <GooglePlacesAutocomplete
                                        apiKey="AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk"
                                        autocompletionRequest={{
                                            bounds: [
                                            { lat: 38.74, lng: -9.27 },
                                            { lat: 38.83, lng: -9.17 },
                                            { lat: 38.79, lng: -9.09 },
                                            { lat: 38.69, lng: -9.21 },
                                            ],
                                            componentRestrictions: {
                                            country: ['pt'],
                                            }
                                        }}
                                        selectProps={{
                                            address,
                                            onChange: setAddressHandler,
                                            styles: {
                                            input: (provided) => ({
                                                ...provided,
                                                color: '#161F28',
                                                fontWeight: 600
                                            }),
                                            option: (provided) => ({
                                                ...provided,
                                                color: '#161F28',
                                                fontWeight: 600
                                            }),
                                            singleValue: (provided) => ({
                                                ...provided,
                                                color: '#161F28',
                                                fontWeight: 600
                                            }),
                                            control: (provided, state) => ({
                                                ...provided,
                                                width: "100%",
                                                borderRadius: "10px",
                                                borderTopLeftRadius: "0px",
                                                borderBottomRightRadius: "0px",
                                                height: "40px",
                                                fontSize:"0.8rem",
                                                border: state.isFocused?"2px solid #FF785A":"2px solid #161F28",
                                                "&:hover": {
                                                    border: "2px solid #FF785A",
                                                    cursor: "text"
                                                },
                                                boxShadow: state.isFocused?"none":"none"
                                            }),
                                            container: (provided, state) => ({
                                                ...provided,
                                                border: state.isFocused?"none":"none",
                                            }),
                                            dropdownIndicator: () => ({
                                                color:"#fff"
                                            }),
                                            indicatorSeparator: () => null
                                            },
                                            IndicatorsContainer:()=>(<></>),
                                            placeholder: () => "",
                                            noOptionsMessage: () => "Pesquisar morada",
                                            loadingMessage: () => "A pesquisar...",
                                        }}
                                        />
                                    </div>
                                    {
                                        badAddress?
                                        <div className={styles.column_fix}>
                                            <span className={styles.address_not_allowed}>
                                                <span className={styles.address_not_allowed_text}>
                                                    <span style={{fontWeight:600}}>AINDA</span> não operamos nesta zona :(
                                                </span>
                                            </span>
                                        </div>
                                        :null
                                    }
                                </div>
                                <div className={styles.address_flex}>
                                    <div className={styles.bot_input_div}>
                                        <span className={portaWrong?styles.area_label_wrong:styles.area_label_inverse}>Porta<span className={styles.asterisc}>*</span></span>
                                        <input style={{width:"100px"}} onFocus={() => {setPortaFocused(true)}} maxLength={5} onChange={e => setPorta(e.target.value)} value={porta} className={styles.bot_input_short}></input>
                                    </div>
                                    <div className={styles.bot_input_div}>
                                        <span className={styles.area_label_inverse}>Andar</span>
                                        <input style={{width:"100px", marginLeft:"10px"}} maxLength={11} onChange={e => setAndar(e.target.value)} value={andar} className={styles.bot_input_short}></input>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.right_detailed_info}>
                                <span className={styles.searchInfo}>Pedir<span className={styles.back_cor}>{selectedWorker}</span>
                                    <span>para dia<span className={styles.back_cor}>{dateObj?`${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]}`:"__"}</span></span>
                                    {startTime!==null&&endTime!==null?
                                        <span>entre as<span className={styles.back_cor}><span className={styles.cor}>{startTime} </span>
                                                - <span className={styles.cor}>{endTime}</span></span>.</span>
                                    :startTime!==null?
                                        <span>a partir das<span className={styles.back_cor}>{startTime}</span>.</span>
                                    :endTime!==null?
                                        <span>até às<span className={styles.back_cor}>{endTime}</span>.</span>
                                    :
                                    <span>a<span className={styles.back_cor}>qualquer hora</span>.</span>
                                    }
                                </span>
                            </div>
                            <div data-tip={complete?"":"Preenche todos os campos assinalados com *"} className={complete?styles.bot_button:styles.bot_button_disabled}>
                                <span className={complete?styles.bot_button_text:styles.bot_button_text_disabled}>Criar conta e Confirmar</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.right}></div>
            </div>
            <ReactTooltip effect='solid'/>
        </div>
    )
}

export default UserReservationPage