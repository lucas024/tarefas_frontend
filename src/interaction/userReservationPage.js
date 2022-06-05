import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
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
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao';
import Popup from '../transitions/popup';
import axios from 'axios'
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EngineeringIcon from '@mui/icons-material/Engineering';
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';

Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')

const UserReservationPage = (props) => {

    const [selectedWorker, setSelectedWorker] = useState('eletricista')
    const [dateObj, setDateObj] = useState(null)
    const [dateExtense, setDateExtense] = useState(null)
    const [showCalendar, setShowCalendar] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    const [description, setDescription] = useState('')
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
    const [inProp, setInProp] = useState(false)
    const [confirmationPopup, setConfirmationPopup] = useState(false)
    const [tooManyReservations, setTooManyReservations] = useState(false)
 
    const divRef = useRef(null)
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const navigate = useNavigate()
    const location = useLocation()

    const [searchParams] = useSearchParams()

    useEffect(() => {
        if(location.state && location.state.carry){
            setDateObj(new Date(location.state.date))
            setStartTime(location.state.init)
            setEndTime(location.state.end)
            setDescription(location.state.desc)
            setInProp(true)
            setTimeout(() => setInProp(false), 4000)
        }
    }, [location])



    useEffect(() => {
        if(props.user){
            setNome(props.user.name)
            setEmail(props.user.email)
            if(props.user.phone){
                setPhone(props.user.phone)
                setPhoneVisual(props.user.phone)
            }
            
        }
    }, [props.user])

    useEffect(() => {
        props.loadingHandler(true)
        if(Object.fromEntries([...searchParams]).w){
            setSelectedWorker(Object.fromEntries([...searchParams]).w)
        }
        else {
            setSelectedWorker('eletricista')
        }
        props.loadingHandler(false)
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

    useEffect(() => {
        if(dateObj)
        {
            let day = dateObj.getDate()
            let month = dateObj.getMonth()
            setDateExtense(`${day} de ${monthNames[month]}`)
        }
    }, [dateObj])
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
            })
    }

    const confirmarPopupHandler = () => {
        props.loadingHandler(true)
        var valInit = new Date(dateObj)
        var valEnd = new Date(dateObj)
        if(startTime)
            valInit.setHours(startTime.slice(0,2), startTime.slice(3,5))
        if(endTime)
            valEnd.setHours(endTime.slice(0,2), endTime.slice(3,5))
        
        let reserva = {
            user_id: props.user._id,
            user_name: props.user.name,
            user_phone: phone,
            user_email: props.user.email,
            requestStartTime: startTime?valInit:new Date(valInit.setHours(8)),
            requestedEndTime: endTime?valEnd:new Date(valEnd.setHours(18)),
            requestedDate: dateObj,
            reservationMadeTime: new Date(),
            desc: description,
            localizacao: address,
            porta: porta,
            andar: andar,
            type:0,
            startTime: null,
            endTime: null,
            date: null,
            worker: null,
            workerType: selectedWorker
        }
        axios.post(`${props.api_url}/reservations/add`, reserva).then(res => {
            setConfirmationPopup(false)
            props.loadingHandler(false)
            if(props.user.phone === "" || props.user.phone !== phone){
                axios.post(`${props.api_url}/user/update_phone`, {
                    user_id : props.user._id,
                    phone: phone
                }).then(res => {
                    console.log(res);
                })
            }
            navigate('/user')
        })
    }

    const confirmarHandler = () => {
        if(!props.user){
            navigate('/authentication',
                {
                    state: {
                        carry: true,
                        date: dateObj.toString(),
                        init: startTime,
                        end: endTime,
                        desc: description,
                        nameCarry: nome,
                        phoneCarry: phone,
                        emailCarry: email,
                        worker: selectedWorker
                    }
                })
        }
        else{
            props.loadingHandler(true)
            checkPendingReservations()
        }
    }

    const checkPendingReservations = () => {
        axios.get(`${props.api_url}/reservations/get_by_id`, { params: {user_id: props.user._id} }).then(res => {
            console.log(res.data)
            let bool = false
            for(let val of res.data){
                if(val.type === 0){
                    bool = true
                }
            }
            if(!bool){
                props.loadingHandler(false)
                setConfirmationPopup(true)
            }
            else{
                props.loadingHandler(false)
                setTooManyReservations(true)
            }
        })
    }

    const clearTimeHandler = () => {
        setStartTime(null)
        setEndTime(null)
    }

    return (
        <div className={styles.reservation}>
            <div className={showCalendar?styles.calendar:styles.calendar_disabled}>
                <CSSTransition 
                in={showCalendar}
                timeout={600}
                classNames="reservation"
                unmountOnExit
                >  
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
                </CSSTransition>
            </div>

            <div className={showStart?styles.calendar:styles.calendar_disabled} onClick={() => setShowStart(false)}>
                <CSSTransition 
                    in={showStart}
                    timeout={600}
                    classNames="reservation_less"
                    unmountOnExit
                    >  
                    <div className={styles.calendar_area}>
                        <span className={styles.calendar_x} onClick={() => setShowStart(false)}></span>
                        <p className={styles.calendar_title}>Hora Inicial</p>
                        <div className={styles.hour_div}>
                            {displayStartHours()}
                        </div>
                    </div>
                </CSSTransition>
            </div>
            <div className={showEnd?styles.calendar:styles.calendar_disabled} onClick={() => setShowEnd(false)}>
                <CSSTransition 
                        in={showEnd}
                        timeout={600}
                        classNames="reservation_less"
                        unmountOnExit
                        >  
                    <div className={styles.calendar_area}>
                        <span className={styles.calendar_x} onClick={() => setShowEnd(false)}></span>
                        {
                            startTime?
                            <div className={styles.time_indicator}>
                                <p className={styles.time_indicator_text}>Hora inicial escolhida:</p>
                                <p className={styles.time_indicator_value}>12:00</p>
                            </div>
                            :null
                        }
                        
                        
                        <p className={styles.calendar_title}>Hora Final</p>
                        <div className={styles.hour_div}>
                            {displayEndHours()}
                        </div>
                    </div>
                </CSSTransition>
            </div>
            {
                tooManyReservations?
                    <Popup
                        type = 'error_to_many'
                        cancelHandler={() => setTooManyReservations(false)}
                        />
                    :null
            }
            {
                confirmationPopup?
                    <Popup
                        type = 'confirm'
                        confirmRes = {true}
                        worker={selectedWorker}
                        dateDay={dateObj?dateObj.getDate():null}
                        dateMonth={dateObj?dateObj.getMonth():null}
                        startTime={startTime}
                        endTime={endTime}
                        confirmHandler={() => confirmarPopupHandler()}
                        cancelHandler={() => setConfirmationPopup(false)}
                        />
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
                    <CSSTransition 
                    in={inProp}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                        <Sessao text={"Sessão iniciada com Sucesso!"}/>
                    </CSSTransition>
                    <div className={styles.reservar}>
                        <div className={styles.bot_title_wrapper}>
                            <span className={styles.bot_title_indicator}>1</span>
                            <span className={styles.bot_title}>Disponibilidade de <span className={styles.action}>Dia</span> e <span className={styles.action}>Hora</span></span>
                        </div>
                        
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
                                                dateObj?dateExtense:
                                                    <div className={styles.date_icon_wrapper}>
                                                        <EventIcon className={styles.date_icon}/>
                                                        <span className={styles.info_text_dia_top}>Escolher Dia</span>
                                                    </div>
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
                                                startTime?startTime:
                                                <div className={styles.date_icon_wrapper}>
                                                    <AccessTimeIcon className={styles.date_icon}/>
                                                    <span className={styles.info_text_dia_top}>Escolher Hora inicial</span>
                                                </div>
                                            }
                                        </span>
                                    </span>
                                    <span className={styles.right_bot_hour_finish} onClick={() => setShowEnd(true)}>
                                        <span className={styles.area_label} style={{right:0, bottom:0}}>Até</span>
                                        <span className={endTime?styles.right_top_date_val:styles.right_top_date_val_unselected}>
                                            {
                                                endTime?endTime:
                                                    <div className={styles.date_icon_wrapper}>
                                                        <AccessTimeIcon className={styles.date_icon}/>
                                                        <span className={styles.info_text_dia_top}>Escolher Hora final</span>
                                                    </div>
                                            }
                                        </span>
                                    </span>
                                    <span className={styles.clear_time} onClick={() => clearTimeHandler()}>
                                        Limpar
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.top_desc}>
                            <span className={styles.area_label} style={{right:"-8px", bottom:"4px"}}>Descrição</span>
                            <textarea className={styles.top_desc_area} placeholder="Descrição do problema..." value={description} onChange={e => setDescription(e.target.value)}>
                                
                            </textarea>
                        </div>
                        <div className={styles.devider}></div>
                        <div className={styles.bottom}>
                            <div className={styles.bot_title_wrapper}>
                                <span className={styles.bot_title_indicator}>2</span>
                                <span className={styles.bot_title}>Detalhes de contacto</span>
                            </div>
                            <div className={styles.contact_area} onClick={() => divRef.current.scrollIntoView({ behavior: 'smooth' })}>
                                <div className={styles.bot_input_div} style={{marginTop:"0"}}>
                                    <span className={nomeWrong?styles.area_label_wrong:styles.area_label_inverse}>Nome<span className={styles.asterisc}>*</span></span>
                                    <input disabled={props.user} onFocus={() => {nameFocused()}} maxLength={26} onChange={e => setNome(e.target.value)} value={nome} className={styles.bot_input_short} ></input>
                                </div>
                                <div className={styles.bot_input_div}>
                                    <span className={phoneWrong?styles.area_label_wrong:styles.area_label_inverse}>Telefone<span className={styles.asterisc}>*</span></span>
                                    <input onFocus={() => {setPhoneFocused(true)}} maxLength={11} onChange={e => setPhoneHandler(e.target.value)} value={phoneVisual} className={styles.bot_input_short}></input>
                                </div>
                                <div className={styles.bot_input_div}>
                                    <span className={emailWrong?styles.area_label_wrong:styles.area_label_inverse}>E-mail<span className={styles.asterisc}>*</span></span>
                                    <input disabled={props.user} onFocus={() => {setEmailFocused(true)}} maxLength={80} onChange={e => setEmail(e.target.value)} value={email} className={styles.bot_input_long}></input>
                                </div>
                                
                            </div>
                            <div className={styles.bot_title_wrapper}>
                                <span className={styles.bot_title_indicator}>3</span>
                                <span className={styles.bot_title}>Localização</span>
                            </div>
                            <div className={styles.contact_area} onClick={() => divRef.current.scrollIntoView({ behavior: 'smooth' })}>
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
                                                fontWeight: 600,
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
                                                boxShadow: state.isFocused?"none":"none",
                                                zIndex: 1
                                            }),
                                            container: (provided, state) => ({
                                                ...provided,
                                                border: state.isFocused?"none":"none",
                                                zIndex: 1
                                            }),
                                            dropdownIndicator: () => ({
                                                color:"#fff",
                                                zIndex: 4
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
                                                        <span style={{fontWeight:600}}>AINDA</span> não operamos nesta zona <Sad className={styles.sad_face}/>
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
                            
                            <div className={styles.info}>
                                <span className={styles.info_title}>Pedido de Reserva</span>
                                <div className={styles.info_flex_wrapper}>
                                    <div className={styles.info_flex}>
                                        <EngineeringIcon className={styles.info_icon}/>
                                        <span className={styles.info_text}>{selectedWorker}</span>
                                    </div>
                                    <div className={styles.info_divider}></div>
                                    <div className={styles.info_flex}>
                                        <EventIcon className={styles.info_icon}/>
                                        <span>{dateObj?<span className={styles.info_text}>{dateObj.getDate()} de {monthNames[dateObj.getMonth()]}</span>:<span className={styles.info_text_dia}>Escolher Dia</span>}</span>
                                    </div>
                                    <div className={styles.info_divider}></div>
                                    <div className={styles.info_flex}>
                                        <AccessTimeIcon className={styles.info_icon}/>
                                        {startTime!==null&&endTime!==null?
                                            <span>Entre as<span className={styles.back_cor}><span className={styles.cor}>{startTime} </span>
                                                    - <span className={styles.cor}>{endTime}</span></span></span>
                                        :startTime!==null?
                                            <span>A partir das<span className={styles.back_cor}>{startTime}</span></span>
                                        :endTime!==null?
                                            <span>Até às<span className={styles.back_cor}>{endTime}</span></span>
                                        :
                                        <span><span className={styles.back_cor}>qualquer hora</span></span>
                                        }
                                    </div>          
                                </div>
                                
                            </div>
                            <div ref={divRef} data-tip={complete?"":"Preenche todos os campos assinalados com *"} className={complete?styles.bot_button:styles.bot_button_disabled} onClick={() => {
                                    if(complete) confirmarHandler()}}>
                                <span className={complete?styles.bot_button_text:styles.bot_button_text_disabled} >{props.user?"Confirmar":"Criar conta e Confirmar" }</span>
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