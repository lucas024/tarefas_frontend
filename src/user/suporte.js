import React, {useEffect, useRef, useState} from 'react'
import styles from './suporte.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClipLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Suporte = (props) => {

    const socket = useRef()
    const [messages, setMessages] = useState([])
    const [currentText, setCurrentText] = useState("")
    const [adminOn, setAdminOn] = useState(false)
    const [loading, setLoading] = useState(true)

    const textareaRef = useRef(null);
    const chatareaRef = useRef(null);


    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    position: absolute;
    z-index: 11;
    left: calc(50% - 75px);
    top: calc(50% - 75px);
    `;

    useEffect(() => {
        // socket.current = io("ws://localhost:5500")
        // socket.current.on("getMessage", data => {
        //     console.log(data.text)
        // })
        // socket.current.on("getUsers", data => {
        //     console.log(data)
        // })
        // socket.current.on("adminOn", bool => {
        //     console.log(bool);
        //     setAdminOn(bool)
        // })       
    }, [])

    useEffect(() => {
        if(props.user){
            setLoading(true)
            axios.get(`${props.api_url}/chats/get_chat`, { params: {user_id: props.user._id} }).then(res => {
                if(res.data !== null && res.data !== ""){
                    setMessages(res.data.texts)
                }
                setLoading(false)
              }).catch(err => {
                console.log(err)
                setLoading(false)
              })
        }
    }, [props.user])


    useEffect(() => {
        // props.user&&socket.current.emit("add_user", props.user._id)
    }, [props.user])

    useEffect(() => {
        textareaRef.current.style.height = "0px";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
    }, [currentText])

    const sendHandler = () => {
        socket.current.emit("sendMessage", {
            sender_id: props.user._id,
            receiver_id: props.user._id,
            text: "teste"
        })
    }

    const messageHandler = () => {
        if(currentText !== ""){
            let val = [...messages]
            let text = {
                origin_id : props.user._id,
                timestamp : new Date(),
                text: currentText
            }
            val.push(text)
            setMessages(val)
            setCurrentText("")
            console.log(props.user);
            axios.post(`${props.api_url}/chats/update`, {
                user_name: props.user.name,
                user_photoUrl: props.user.photoUrl,
                user_phone: props.user.phone,
                user_id: props.user._id,
                text: text,
                updated: new Date()
            })
        }
    }
    const messageDisplay = () => {
        return messages.map((msg, i) => {
            return (
                <div key={i} className={msg.origin_id===props.user?._id?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                    <div className={msg.origin_id===props.user?._id?styles.send:styles.receive}>
                        {
                            (messages[i+1])&&(messages[i+1].origin_id!==msg.origin_id)
                            ||(!messages[i+1])? 
                            <div className={styles.chatbox_user}>
                                <img src={props.user?.photoUrl} className={styles.chatbox_user_img}/>
                                <span className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                            </div>
                            :<div className={styles.chatbox_user_opacity}>
                                <img src={props.user?.photoUrl} className={styles.chatbox_user_img}/>
                                <span className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                            </div>

                        }
                        <div className={msg.origin_id===props.user?._id?styles.chatbox_text_send:styles.chatbox_text_receive}>
                            <span className={styles.chatbox_text_value}>{msg.text}</span>
                        </div>
                    </div>
                </div>
                
            )
        })
    }

    const getDisplayTime = time => {
        let val = new Date(time)
        return val.toISOString().split("T")[1].slice(0,5)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            messageHandler()
        }
    }

    return (
        <div className={styles.suporte}>

            <div className={styles.suporte_title}>
                <span className={styles.top_title} onClick={() => sendHandler()}>Suporte</span>
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
                            <span className={styles.top_left_indicator} style={{backgroundColor:adminOn?"#6EB241":"#F40009"}}></span>
                            <span className={styles.top_left_name}>Cristina</span>
                            <SupportAgentIcon className={styles.top_left_name}/>
                            <span className={styles.top_left_name_indicator}>(Suporte da Arranja)</span>

                        </div>
                    </div>
                    <div className={styles.chat_area}>
                        {messageDisplay()}
                        <div ref={chatareaRef}></div>
                    </div>
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