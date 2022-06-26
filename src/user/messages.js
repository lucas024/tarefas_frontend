import React, {useEffect, useRef, useState} from 'react'
import styles from './messages.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClipLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import FaceIcon from '@mui/icons-material/Face';
import NoPage from '../general/noPage';

const Messages = (props) => {

    const socket = useRef()
    const [messages, setMessages] = useState([])
    const [currentText, setCurrentText] = useState("")
    const [adminOn, setAdminOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

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
        // document.body.style.overflow = 'hidden';
        // socket.current = io("ws://localhost:5500")
        // socket.current.on("getMessage", data => {recordRoutes.route('/chats/get_users_chats').get(async function (_req, res) {
        //     console.log(data.text)
        // })
        // socket.current.on("getUsers", data => {
        //     console.log(data)
        // })
        // socket.current.on("adminOn", bool => {
        //     console.log(bool);
        //     setAdminOn(bool)
        // })       
        // return () => {
        //     document.body.style.overflow = 'auto';
        // }
    }, [])

    useEffect(() => {
        setLoading(true)
        if(props.user){
            setLoading(true)
            axios.get(`${props.api_url}/chats/get_user_chats`, { params: {user_id: props.user._id} }).then(res => {
                if(res.data !== null && res.data !== ""){
                    console.log(res.data);
                    setChats(res.data)
                }
                setLoading(false)
              }).catch(err => {
                setLoading(false)
              })
        }
    }, [props.user])



    useEffect(() => {
        // props.user&&socket.current.emit("add_user", props.user._id)
    }, [props.user])

    useEffect(() => {
        if(textareaRef&&selectedChat!==null){
            textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
        }
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
                timestamp : new Date().getTime(),
                text: currentText
            }
            val.push(text)
            setMessages(val)
            setCurrentText("")
            console.log(props.user);
            axios.post(`${props.api_url}/chats/update_user_chat`, {
                user_name: props.user.name,
                user_photoUrl: props.user.photoUrl,
                user_phone: props.user.phone,
                user_id: props.user._id,
                text: text,
                updated: new Date().getTime(),
                chat_id: selectedChat._id
            })
        }
    }
    const messageDisplay = () => {
        return messages?.map((msg, i) => {
            return (
                <div key={i} className={msg.origin_id===props.user?._id?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                    <div className={msg.origin_id===props.user?._id?styles.send:styles.receive}>
                        {
                            (messages[i+1])&&(messages[i+1].origin_id!==msg.origin_id)
                            ||(!messages[i+1])? 
                            <div className={styles.chatbox_user}>
                                {
                                    selectedChat[`${msg.origin_id}_user_photoUrl`]!==""?
                                    <img src={selectedChat[`${msg.origin_id}_user_photoUrl`]} className={styles.chatbox_user_img}/>
                                    :
                                    <FaceIcon className={styles.chatbox_user_img}/>
                                }
                                <span className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                            </div>
                            :<div className={styles.chatbox_user_opacity}>
                                {
                                    selectedChat[`${msg.origin_id}_user_photoUrl`]!==""?
                                    <img src={selectedChat[`${msg.origin_id}_user_photoUrl`]} className={styles.chatbox_user_img}/>
                                    :
                                    <FaceIcon className={styles.chatbox_user_img}/>
                                }
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
        let val = new Date(time).toLocaleTimeString()
        return val.slice(0,5)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            messageHandler()
        }
    }

    const getOtherUserId = () => {
        if(selectedChat.user_one===props.user._id){
            return selectedChat.user_two
        }
        else{
            return selectedChat.user_one
        }
    }

    const chatsDisplay = () => {
        return chats?.map((item, i) => {
            let other_user = null
            let user = null
            if(item.user_one===props.user._id){
                user = item.user_one
                other_user = item.user_two
            }
            else{
                user = item.user_two
                other_user = item.user_one
            }
            return (
                <div onClick={() => {
                    setMessages(item.texts)
                    setSelectedChat(item)
                    }} key={i} className={selectedChat?._id===item._id?styles.row_selected:styles.row}>
                    <img className={styles.row_img} src={item[`${other_user}_user_photoUrl`]}/>
                    <div className={styles.row_main}>
                        <div className={styles.main_top}>
                            <span className={styles.top_name}>{item[`${other_user}_user_name`]}</span>
                            <span className={styles.top_hour} style={{color:selectedChat?._id===item._id?"black":"#ccc"}}>{getDisplayTime(item?.updated)}</span>
                        </div>
                        <div className={styles.main_bottom}>
                            <span className={styles.bot_text} style={{fontWeight:!item.readByUser?600:400}}>{item.texts?.at(-1).text}</span>
                            {
                                item[`${other_user}_read`]?
                                <div className={styles.bot_not}>
                                    <CheckIcon className={styles.bot_not_icon}/>
                                </div>
                                :
                                !item[`${user}_read`]?
                                <div className={styles.bot_not}>
                                    <CircleIcon className={styles.bot_not_icon}/>
                                </div>
                                :null
                                
                            }
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={styles.suporte}>
            <div className={styles.suporte_title}>
                <span className={styles.top_title} onClick={() => sendHandler()}>Mensagens</span>
            </div>
            <div className={styles.main}>
                <div className={styles.users}>
                    {chatsDisplay()}
                </div>
                {
                    selectedChat?
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
                                    <img className={styles.top_left_photo} src={selectedChat[`${getOtherUserId()}_user_photoUrl`]}/>
                                    <span className={styles.top_left_name}>{selectedChat[`${getOtherUserId()}_user_name`]}</span>
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
                    :chats.length===0?
                    <NoPage object={"mensagens"}/>
                    :null
                }
                
            </div>
            
        </div>
    )
}

export default Messages