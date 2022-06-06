import React, {useEffect, useRef, useState} from 'react'
import styles from './suporte.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const Suporte = (props) => {

    const socket = useRef()
    const [messages, setMessages] = useState([])
    const [currentText, setCurrentText] = useState("")
    const textareaRef = useRef(null);


    useEffect(() => {
        socket.current = io("ws://localhost:5500")
        socket.current.on("getMessage", data => {
            console.log(data.text)
        })
        socket.current.on("getUsers", users => {
            console.log(users);
        })
    }, [])

    useEffect(() => {
        props.user&&socket.current.emit("add_user", props.user._id)
    }, [props.user])

    useEffect(() => {
        textareaRef.current.style.height = "0px";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
    }, [currentText])

    const sendHandler = () => {
        console.log("enviar");
        socket.current.emit("sendMessage", {
            sender_id: props.user._id,
            receiver_id: props.user._id,
            text: "teste"
        })
    }

    return (
        <div className={styles.suporte}>
            <div className={styles.suporte_title}>
                <span className={styles.top_title} onClick={() => sendHandler()}>Suporte</span>
            </div>
            <div className={styles.chat}>
                <div className={styles.chat_wrapper}>
                    <div className={styles.top}>
                        <div className={styles.top_left_flex}>
                            <span className={styles.top_left_indicator}></span>
                            <span className={styles.top_left_name}></span>
                        </div>
                    </div>
                    <div className={styles.chat_area}>

                    </div>
                    <div className={styles.bot}>
                        <div className={styles.bot_flex}>
                            <textarea 
                                ref={textareaRef}
                                style={{}} 
                                value={currentText} 
                                onChange={e => setCurrentText(e.target.value)} 
                                className={styles.bot_input} 
                                placeholder="Escreva a sua mensagem..."></textarea>
                            <div className={styles.bot_right_flex}>
                                <SendOutlinedIcon className={styles.send_icon}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Suporte