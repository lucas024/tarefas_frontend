import React, {useEffect, useRef, useState} from 'react'
import styles from './suporte.module.css'
import axios from 'axios';
import {io} from "socket.io-client"



const Suporte = (props) => {

    const socket = useRef()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        socket.current = io("ws://localhost:5500")
        socket.current.on("getMessage", data => {
            console.log(data.text)
        })
    }, [])

    useEffect(() => {
        props.user&&socket.current.emit("add_user", props.user._id)
        socket.current.on("getUsers", users => {
            console.log(users);
        })
        
    }, [props.user])

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

            <div>

            </div>
        </div>
    )
}

export default Suporte