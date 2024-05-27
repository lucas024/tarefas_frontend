import React, {useEffect, useRef, useState} from 'react'
import styles from '../admin/messages.module.css'
import axios from 'axios';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FaceIcon from '@mui/icons-material/Face';
import { useNavigate } from 'react-router-dom';
import {io} from "socket.io-client"
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSelector } from 'react-redux'
import { TextareaAutosize } from '@mui/material';
import Loader from '../general/loader';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

const Suporte = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})

    const [messages, setMessages] = useState([])
    const [currentText, setCurrentText] = useState("")
    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState(null)
    const [firstLoad, setFirstLoad] = useState(true)

    const [reservations, setReservations] = useState([])

    const scrollToBottom = useScrollToBottom()

    const textareaRef = useRef(null);
    const chatareaRef = useRef(null);

    const [s, setS] = useState()

    const navigate = useNavigate()

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const ObjectID = require("bson-objectid");

    useEffect(() => {      
        if(firstLoad)
        {
            setLoading(true)
            getChats(true)
        }
        const interval = setInterval(() => {
            let date = new Date()
            if(date.getSeconds()===29 || date.getSeconds()===59)
            {
                setLoading(true)
                getChats(false)
            }
        }, 1000)

        return () => clearInterval(interval)

    }, [user])

    const getChats = (first) => {
        if(user && user.admin_chat)
        {
            axios.get(`${api_url}/admin_chats/get_chat`, { params: {chat_id: user.admin_chat} })
            .then(chat => {
                if(chat.data.texts?.length > messages?.length || messages === undefined || first)
                {
                    if(chat.data != null){
                        setChat(chat.data)
                        setMessages(chat.data.texts)
                        checkForRefusalsNoRepetitive(chat.data.texts)
                        if(first)
                            scrollToBottom()
                    }
                    let reservs = axios.get(`${api_url}/reservations/get_by_id`, { params: {user_id: user._id} })
                    if(reservs)
                    {
                        setReservations(reservs.data)
                    }
                                
                    setLoading(false)
                }
                else{
                    setLoading(false)
                }
            })
            setFirstLoad(false)
        }

    }

    // useEffect(() => {
    //     if(!s) return

    //     s.on('receive-message', data => {
    //         handleReceiveSocketMessageUpdate(data)
    //     })

    //     return () => s.off('receive-message')
    // }, [s])

    const checkForRefusalsNoRepetitive = messages_aux => {
        const alreadyChecked = []
        if(messages_aux)
        {
            for(let el of messages_aux.reverse())
            {
                if(el.refusal_start && !alreadyChecked.includes(el.reservation_id))
                {
                    alreadyChecked.push(el.reservation_id)
                }
                else
                {
                    el.repetitive_check = true
                }
            }
            messages_aux.reverse()
            setMessages(messages_aux)
        }
        else
        {
            setMessages(messages_aux)
        }
        
    }

    const handleReceiveSocketMessageUpdate = (data) => {
        //updates user/admin messages
        //all local

        let text_object = {
            origin_type : data.type,
            timestamp : data.time,
            text: data.text
        }
        setMessages(prevMessages => [...prevMessages, text_object])

        if(chat)
        {
            var chat_aux = chat
            chat_aux.last_text = text_object
            chat_aux.admin_read = true
            chat_aux.user_read = false
    
            setChat(chat_aux)
        }


        scrollToBottom()
    }

    const getTypeColorBackground = type => {
        if(type===0) return "linear-gradient(180deg, rgba(253,216,53,0.95) 0%, rgba(253,216,53,0.95) 50%, rgba(253,216,53,0.7) 100%)"
        if(type===1) return "linear-gradient(180deg, rgba(110,178,65,0.9) 0%, rgba(110,178,65,0.9) 50%, rgba(110,178,65,0.4) 100%)"
        if(type===2) return "linear-gradient(180deg, rgba(255,59,48,0.9) 0%, rgba(255,59,48,0.9) 50%, rgba(255,59,48,0.4) 100%)"
        if(type===3) return "linear-gradient(180deg, rgba(30,172,170,0.9) 0%, rgba(30,172,170,0.9) 50%, rgba(30,172,170,0.4) 100%)"
        return "#FFFFFF"
    }

    const messageHandler = async () => {
        if(currentText !== ""){
            let time = new Date().getTime()
            let text_object = {
                origin_type : user.type,
                timestamp : time,
                text: currentText
            }
            if(messages?.length>0)
            {
                let val = [...messages]
                val.push(text_object)
                setMessages(val)
            }
            else
            {
                setMessages([text_object])
            }
            
            

            setCurrentText("")

            let chatId = ObjectID()
            await axios.post(`${api_url}/admin_chats/create_or_update_chat`, {
                admin_name: chat?.admin_name,
                admin_id: chat?.admin_id,
                user_id: user._id,
                user_type: user.type,
                user_name: user.name,
                text: text_object,
                updated: time,
                chat_id: user.admin_chat || chatId
            })

            scrollToBottom()

            // s.emit("send-message", {
            //     recipient: chat?.admin_id,
            //     text: currentText,
            //     time: time,
            //     chat_id: user.admin_chat || chatId,
            //     type: user.type
            // }) 
        }
    }

    const extenseDate = timestamp => {
        let iso_date = new Date(timestamp)
        let day = iso_date.toISOString().split("T")[0].slice(-2)
        let month = monthNames[parseInt(iso_date.toISOString().split("T")[0].slice(5,7))]
        let year = iso_date.toISOString().split("T")[0].slice(0,4)
        return `${day} de ${month}, ${year}`
    }

    const getDiffDate = (prevDate, currDate) => {
        const prev = new Date(prevDate)
        const curr = new Date(currDate)
        return prev.getDate() !== curr.getDate()
    }

    const editPublicationHandler = (res_id) => {
        navigate({
            pathname: `/publicar`,
            search: `?editar=true&res_id=${res_id}`
        })
    }

    const seePublicationHandler = (res_id) => {
        navigate({
            pathname: `/main/publications/publication`,
            search: `?id=${res_id}`
        })
    }

    const types = {
        titulo: "Título",
        description: "Descrição",
        photos: "Fotografias",
        location: "Localização"
    }

    const getFieldsToChange = refusal_array => {
        return refusal_array.map((val, i) => {
            return (
                <div key={i} className={styles.chatbox_text_value} style={{margin:"10px 0"}}>
                    <CircleIcon className={styles.refusal_icon}/>
                    <span className={styles.refusal_type}>{types[val.type]}:</span>
                    <span className={styles.refusal_text}>{val.text}.</span>
                </div>
            )
        })
    }

    const findReservation = id => {
        if(reservations)
        {
            for(let el of reservations)
            {
                if(el._id === id)
                    return el
            }
        }
        return null
    }
    
    const messageDisplay = () => {
        return messages?.map((msg, i) => {
            return (
                <div key={i}>
                    {
                        i===0?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :i>0&&getDiffDate(messages[i-1].timestamp, msg.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :null
                    }

                    <div key={i} className={msg.origin_type!==4?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type!==4?styles.send:styles.receive}>
                            {
                                (messages[i+1])&&(messages[i+1].origin_type!==msg.origin_type)
                                ||(!messages[i+1])? 
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type!==4?
                                            msg.origin_type===0?
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)'}}/>
                                        :
                                            <SupportAgentIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===messages.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type!==4?
                                        msg.origin_type===0?
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)'}}/>
                                    :
                                        <SupportAgentIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===messages.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>

                            }
                            {
                                msg.refusal_start?
                                <div className={styles.chatbox_text_starter} style={{borderBottomLeftRadius:0}}>
                                    {
                                        msg.repetitive_check?
                                        <div className={styles.chatbox_text_starter_deleted}
                                            style={{borderBottomLeftRadius:0, background:getTypeColorBackground(2)}}>
                                            <div style={{display:"flex", flexDirection:"column", margin:"auto"}}>
                                                <span className={styles.over_text}>Tarefa Novamente Recusada</span>
                                                <span className={styles.thing}>(NOVA MENSAGEM ABAIXO)</span>
                                                <ArrowDownwardIcon className={styles.over_img}/>
                                            </div>
                                        </div>
                                        :
                                        findReservation(msg.reservation_id)?.refusal_object===null?
                                        <div className={styles.chatbox_text_starter_solved} 
                                                style={{borderBottomLeftRadius:0, background:getTypeColorBackground(findReservation(msg.reservation_id)?.type)}}>
                                            <div style={{display:"flex", flexDirection:"column", margin:"auto"}}>
                                                <span className={styles.over_text}>Tarefa Editada</span>
                                                {
                                                    findReservation(msg.reservation_id)?.type===0?
                                                    <span className={styles.thing}>(A PROCESSAR)</span>
                                                    :findReservation(msg.reservation_id)?.type===1?
                                                    <span className={styles.thing}>(COM SUCESSO)</span>
                                                    :findReservation(msg.reservation_id)?.type===2?
                                                    <span className={styles.thing}>(RECUSADO)</span>
                                                    :<span className={styles.thing}>(PROCESSAR)</span>
                                                }
                                                <CheckIcon className={styles.over_img}/>
                                                <span className={styles.ver_public} onClick={() => seePublicationHandler(msg.reservation_id)}>VER TAREFA</span>

                                            </div>
                                        </div>
                                        :!findReservation(msg.reservation_id)?
                                        <div className={styles.chatbox_text_starter_deleted}>
                                            <div style={{display:"flex", flexDirection:"column", margin:"auto"}}>
                                                <span className={styles.over_text}>Tarefa Removida</span>
                                                <ClearIcon className={styles.over_img}/>
                                            </div>
                                        </div>
                                        :null
                                    }
                                    <div className={styles.chatbot_template_wrapper}>
                                        <p className={styles.chatbot_template}>Problema na tarefa</p>
                                    </div>
                                    
                                    <div className={styles.chatbox_template_title_wrapper} onClick={() => editPublicationHandler(msg.reservation_id)}>
                                        <p className={styles.chatbox_template_title}>{msg.reservation_title}</p>
                                    </div>
                                    <p className={styles.chatbox_text_value}>{msg.text}</p>
                                    {
                                        msg.refusal_object?
                                        <div className={styles.refusal_div}>
                                            {getFieldsToChange(msg.refusal_object)}
                                        </div>
                                       
                                        :null
                                    }
                                    <p onClick={() => editPublicationHandler(msg.reservation_id)} className={styles.chatbot_template_hover} style={{fontSize:"0.8rem", marginTop:"5px", cursor:"pointer"}}>Carregue aqui para editar tarefa.</p>
                                </div>
                                :
                                <div className={msg.origin_type!==4?styles.chatbox_text_send:styles.chatbox_text_receive}
                                    style={{backgroundColor:msg.origin_type===1?"#FF785A":msg.origin_type===0?"#0358e5":"#fdd835"}}>
                                    <p className={styles.chatbox_text_value}>{msg.text}</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )
        })
    }


    const getDisplayTime = time => {
        let val = new Date(time).toLocaleTimeString()
        return val.slice(0,5)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            messageHandler()
        }
    }

    return (
        <div className={styles.suporte}>
            <Loader color={"#FF785A"} loading={loading} size={150} />
            <div className={styles.chat}>
                <div className={styles.chat_wrapper}>
                    <div className={styles.top}>
                        <div className={styles.top_left_flex}>
                            {/* <span className={styles.top_left_indicator} style={{backgroundColor:adminOn?"#6EB241":"#F40009"}}></span> */}
                            <SupportAgentIcon className={styles.top_left_name_icon}/>
                            <span className={styles.top_left_name} style={{margin:"0px 5px 0 10px", color:"#fdd835"}}>Cristina</span>
                            <span className={styles.top_left_name_indicator} style={{color:"#ffffff"}}>(Suporte)</span>

                        </div>
                    </div>
                    <div className={styles.top_separator_worker_reservation}/>
                    <ScrollToBottom className={styles.chat_area}>
                        {
                            messageDisplay()
                        }
                        <div ref={chatareaRef}></div>
                    </ScrollToBottom>
                    <div className={styles.bot}>
                        <div className={styles.bot_flex}>
                            <TextareaAutosize 
                                maxLength={300}
                                className={styles.bot_input}
                                placeholder="Escreve a tua mensagem..."
                                onKeyDown={handleKeyDown}
                                value={currentText} 
                                onChange={e => setCurrentText(e.target.value)} 
                                />
                            <div className={styles.bot_right_flex}>
                                <SendOutlinedIcon className={user?.type===1?styles.send_icon_worker:styles.send_icon_user} onClick={() => messageHandler()}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Suporte