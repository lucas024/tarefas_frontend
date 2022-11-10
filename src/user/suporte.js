import React, {useEffect, useRef, useState} from 'react'
import styles from '../admin/messages.module.css'
import axios from 'axios';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClipLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FaceIcon from '@mui/icons-material/Face';
import { useNavigate } from 'react-router-dom';
import {io} from "socket.io-client"
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';

const Suporte = (props) => {

    const [messages, setMessages] = useState()
    const [currentText, setCurrentText] = useState("")
    const [loading, setLoading] = useState(true)
    const [chat, setChat] = useState(null)

    const scrollToBottom = useScrollToBottom()

    const textareaRef = useRef(null);
    const chatareaRef = useRef(null);

    const [s, setS] = useState()

    const navigate = useNavigate()

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const ObjectID = require("bson-objectid");

    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    position: absolute;
    z-index: 11;
    left: calc(50% - 75px);
    top: calc(50% - 75px);
    `;

    useEffect(async () => {      
        setLoading(true)
        if(props.user && props.user.admin_chat){
            let chat = await axios.get(`${props.api_url}/admin_chats/get_chat`, { params: {chat_id: props.user.admin_chat} })
            if(chat.data != null){
                setChat(chat.data)
                setMessages(chat.data.texts)
                scrollToBottom()
            }
            setLoading(false)
        }
        else{
            setLoading(false)
        }

        if(props.user){
            const newSocket = io(
                'http://localhost:5500',
                { query: {id: props.user._id} }
            )
            setS(newSocket)
        }
        return () => s&&s.close()

    }, [props.user])

    useEffect(() => {
        if(!s) return

        s.on('receive-message', data => {
            handleReceiveSocketMessageUpdate(data)
        })

        return () => s.off('receive-message')
    }, [s])

    useEffect(() => {
        textareaRef.current.style.height = "0px";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
    }, [currentText])

    const handleReceiveSocketMessageUpdate = (data) => {
        //updates user/admin messages
        //all local

        let text_object = {
            origin_type : data.type,
            timestamp : data.time,
            text: data.text
        }
        console.log(messages);
        setMessages(prevMessages => [...prevMessages, text_object])

        var chat_aux = chat
        chat_aux.last_text = text_object
        chat_aux.admin_read = true
        chat_aux.user_read = false

        setChat(chat_aux)

        scrollToBottom()
    }

    const messageHandler = async () => {
        if(currentText !== ""){
            let time = new Date().getTime()
            let text_object = {
                origin_type : props.user.type,
                timestamp : time,
                text: currentText
            }

            setMessages([...messages, text_object])

            setCurrentText("")

            let chatId = ObjectID()
            await axios.post(`${props.api_url}/admin_chats/create_or_update_chat`, {
                admin_name: chat?.admin_name,
                admin_id: chat?.admin_id,
                user_id: props.user._id,
                user_type: props.user.type,
                user_name: props.user.name,
                text: text_object,
                updated: time,
                chat_id: props.user.admin_chat || chatId
            })

            scrollToBottom()

            s.emit("send-message", {
                recipient: chat?.admin_id,
                text: currentText,
                time: time,
                chat_id: props.user.admin_chat || chatId,
                type: props.user.type
            }) 
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
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                        :
                                            <SupportAgentIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===messages.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type!==4?
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    :
                                        <SupportAgentIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===messages.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>

                            }
                            {
                                msg.refusal_start?
                                <div className={styles.chatbox_text_starter} style={{borderBottomLeftRadius:0}}>
                                    <span className={styles.chatbot_template_wrapper}>
                                        <span className={styles.chatbot_template}>Problema na publicação</span>
                                    </span>
                                    
                                    <div className={styles.chatbox_template_title_wrapper} onClick={() => navigate(`/main/publications/publication?id=${msg.reservation_id}`)}>
                                        <p className={styles.chatbox_template_title}>{msg.reservation_title}</p>
                                    </div>
                                    <span className={styles.chatbox_text_value}>{msg.text}</span>
                                    <p className={styles.chatbot_template} style={{fontSize:"0.8rem", marginTop:"5px"}}>Carregue na publicação para editar.</p>
                                </div>
                                :
                                <div className={msg.origin_type===0?styles.chatbox_text_send:styles.chatbox_text_receive}>
                                    <span className={styles.chatbox_text_value}>{msg.text}</span>
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

            <div className={styles.suporte_title}>
                <span className={styles.top_title}>Suporte</span>
            </div>
            <div className={styles.chat}>
                <ClipLoader color={"#FF785A"} css={override} loading={loading} size={150} />
                    {
                    loading?
                    <div className="frontdrop"></div>
                    :null
                }
                <div className={styles.chat_wrapper}>
                    <div className={styles.top}>
                        <div className={styles.top_left_flex}>
                            {/* <span className={styles.top_left_indicator} style={{backgroundColor:adminOn?"#6EB241":"#F40009"}}></span> */}
                            <SupportAgentIcon className={styles.top_left_name}/>
                            <span className={styles.top_left_name} style={{margin:"0px 5px 0 10px"}}>Cristina</span>
                            <span className={styles.top_left_name_indicator}>(Suporte)</span>

                        </div>
                    </div>
                    <ScrollToBottom className={styles.chat_area}>
                        {
                            messageDisplay()
                        }
                        <div ref={chatareaRef}></div>
                    </ScrollToBottom>
                    <div className={styles.bot}>
                        <div className={styles.bot_flex}>
                            <textarea 
                                onKeyDown={handleKeyDown}
                                ref={textareaRef}
                                style={{}} 
                                value={currentText} 
                                onChange={e => setCurrentText(e.target.value)} 
                                className={styles.bot_input} 
                                placeholder="Escreva a sua mensagem..."></textarea>
                            <div className={styles.bot_right_flex}>
                                <SendOutlinedIcon className={styles.send_icon} onClick={() => messageHandler()}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Suporte