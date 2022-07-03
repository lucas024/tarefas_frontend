import React, {useEffect, useRef, useState} from 'react'
import styles from './messages.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClipLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import FaceIcon from '@mui/icons-material/Face';
import NoPage from '../general/noPage';
import Loader from './../general/loader';

const Messages = (props) => {
    
    //const socket = useRef()
    const [messages, setMessages] = useState([])
    const [currentText, setCurrentText] = useState("")
    const [adminOn, setAdminOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [loadingChats, setLoadingChats] = useState(false)

    const textareaRef = useRef(null)
    const chatareaRef = useRef(null)


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
        if(selectedChat){
            chatareaRef.current?.scrollIntoView({ block: 'nearest', inline: 'start'})
        }
    }, [selectedChat])

    useEffect(() => {
        //socket.current = io("ws://localhost:5500")
        // socket.current.on("getMessage", data => {
        //     handleMessageUpdate(data)
        // })
        // socket.current.on("getUsers", data => {
        //     setOnlineUsers(data)
        // })
    }, [])



    useEffect(() => {
        setLoading(true)
        if(props.user){
            setLoadingChats(true)
            axios.get(`${props.api_url}/chats/get_user_chats`, { params: {user_id: props.user._id} }).then(res => {
                if(res.data !== null && res.data !== "" && res.data.length>0){
                    console.log(res.data);
                    setSelectedChat(res.data[0])
                    setMessages(res.data[0].texts)
                    let arr = res.data
                    arr[0][`${props.user._id}_read`] = true
                    setChats(arr)
                    if(res.data[0].user_one===props.user._id){
                        props.updateNotification(res.data[0]._id)
                        removeNotificationHandler(res.data[0]._id, res.data[0].user_two, false)
                    }
                    else{
                        props.updateNotification(res.data[0]._id)
                        removeNotificationHandler(res.data[0]._id, res.data[0].user_one)
                    }
                    
                    chatareaRef.current.scrollIntoView({block: 'nearest', inline: 'start'})
                }
                setLoadingChats(false)
                setLoading(false)
              }).catch(err => {
                setLoadingChats(false)
                setLoading(false)
              })
        }
        
    }, [props.user])



    useEffect(() => {
        //props.user&&socket.current.emit("add_user", props.user._id)
    }, [props.user])

    useEffect(() => {
        if(textareaRef&&selectedChat!==null){
            textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
        }
    }, [currentText])

    const handleMessageUpdate = data => {
        console.log(data);
        let arrChats = [...chats]
        for(let el of arrChats){
            if(el[`${data.sender_id}_user_id`] === data.sender_id){
                let text = {
                    origin_id : data.sender_id,
                    timestamp : data.timestamp,
                    text: data.text
                }
                el.texts.push(text)
                setChats(arrChats)
                break
            }
        }
        let val = [...messages]
        if(selectedChat&&selectedChat[`${data.sender_id}_user_id`] === data.sender_id){
            let text = {
                origin_id : data.sender_id,
                timestamp : data.timestamp,
                text: data.text
            }
            val.push(text)
            setMessages(val)
        }
    }

    const sendHandler = () => {
        console.log(getOtherUserId());
        // socket.current.emit("sendMessage", {
        //     sender_id: props.user._id,
        //     receiver_id: getOtherUserId(),
        //     text: currentText,
        //     timestamp: new Date().getTime()
        // })
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
            let arr = [...chats]
            for(let el of arr){
                if(el._id === selectedChat._id){
                    el.texts = val
                    break
                }
            }
            setChats(arr)

            // sendHandler()

            setCurrentText("")
            if(selectedChat){
                axios.post(`${props.api_url}/chats/update_user_chat_sender`, {
                    user_name: props.user.name,
                    user_photoUrl: props.user.photoUrl,
                    user_phone: props.user.phone,
                    user_id: props.user._id,
                    user_type : props.user.type,
                    text: text,
                    updated: new Date().getTime(),
                    chat_id: selectedChat._id,
                    other_user_id: getOtherUserId()
                }).then(() => {
                    chatareaRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'})
                })

                if(selectedChat[`${getOtherUserId()}_user_type`]===0){
                    axios.post(`${props.api_url}/user/update_user_notifications`, {
                        notification_id: selectedChat._id,
                        _id: getOtherUserId()
                    })
                }
                else{
                    axios.post(`${props.api_url}/worker/update_user_notifications`, {
                        notification_id: selectedChat._id,
                        _id: getOtherUserId()
                    })
                }
                
            }
            
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
                                <span ref={i+1===messages.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                            </div>
                            :<div className={styles.chatbox_user_opacity}>
                                {
                                    selectedChat[`${msg.origin_id}_user_photoUrl`]!==""?
                                    <img src={selectedChat[`${msg.origin_id}_user_photoUrl`]} className={styles.chatbox_user_img}/>
                                    :
                                    <FaceIcon className={styles.chatbox_user_img}/>
                                }
                                <span ref={i+1===messages.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
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
        if(selectedChat?.user_one===props.user._id){
            return selectedChat.user_two
        }
        else{
            return selectedChat?.user_one
        }
    }
    
    const removeNotificationHandler = (chat_id, other_user_id, bool) => {
        let val = []
        if(props.user.notifications){
            val = [...props.user.notifications]
        }
        if(val.length>0) val?.splice(val.indexOf(chat_id), 1)

        if(props.user.type===0){
            axios.post(`${props.api_url}/user/set_user_notifications`, {
                notification_array: val,
                _id: props.user._id
            })
        }
        else{
            axios.post(`${props.api_url}/worker/set_worker_notifications`, {
                notification_array: val,
                _id: props.user._id
            })
        }
        
        axios.post(`${props.api_url}/chats/update_user_notifications`, {
            user_id: props.user._id,
            other_user_id: other_user_id,
            chat_id: chat_id
        })
        if(bool){
            let arr = [...chats]
            for(let el of arr){
                if(el._id === chat_id){
                    el[`${props.user._id}_read`] = true
                    break
                }
            }
            setChats(arr)
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
                    props.updateNotification(item._id)
                    removeNotificationHandler(item._id, other_user, true)
                    }} key={i} className={selectedChat?._id===item._id?styles.row_selected:styles.row}>
                    {
                        item[`${other_user}_user_photoUrl`]!==""?
                        <img className={styles.row_img} src={item[`${other_user}_user_photoUrl`]}/>
                        :
                        <FaceIcon className={styles.chatbox_user_img}/>
                    }
                    <div className={styles.row_main}>
                        <div className={styles.main_top}>
                            <span className={styles.top_name}>{item[`${other_user}_user_name`]}</span>
                            <span className={styles.top_hour} style={{color:selectedChat?._id===item._id?"black":"#ccc"}}>{getDisplayTime(item?.texts.at(-1).timestamp)}</span>
                        </div>
                        <div className={styles.main_bottom}>
                            <span className={styles.bot_text} style={{fontWeight:item.texts.at(-1).origin_id===other_user&&!item[`${user}_read`]?600:400, color:item.texts.at(-1).origin_id===other_user&&!item[`${user}_read`]?"#FF785A":"#ccc"}}>{item.texts?.at(-1).text}</span>
                            {
                                item.texts.at(-1).origin_id===other_user&&!item[`${user}_read`]?
                                <div className={styles.bot_not}>
                                    <CircleIcon className={styles.bot_not_icon}/>
                                </div>
                                :
                                item.texts.at(-1).origin_id===user&&item[`${other_user}_read`]?
                                <div className={styles.bot_not}>
                                    <CheckIcon className={styles.bot_not_icon}/>
                                </div>
                                :null
                                
                            }
                        </div>
                    </div>
                </div>
            )
        })
    }

    const isUserOnline = () => {
        let other_user_id = getOtherUserId()
        if(other_user_id){
            for(let el of onlineUsers){
                if(el.user_id === other_user_id)
                    return true
            }
        }
        return false
    }

    return (
        <div className={styles.suporte}>
            <div className={styles.suporte_title}>
                <span className={styles.top_title}>Mensagens</span>
            </div>
            <div className={styles.main}>
                <div className={styles.users}>
                    <Loader loading={loadingChats}/>
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
                                    <span className={styles.top_left_indicator} style={{backgroundColor:isUserOnline()?"#6EB241":"white", border:!isUserOnline()?"1px solid #F40009":"1px solid transparent"}}></span>
                                    {
                                        selectedChat[`${getOtherUserId()}_user_photoUrl`]!==""?
                                        <img style={{marginLeft:"5px"}} className={styles.chatbox_user_img} src={selectedChat[`${getOtherUserId()}_user_photoUrl`]}/>
                                        :
                                        <FaceIcon style={{marginLeft:"5px"}} className={styles.chatbox_user_img}/>
                                    }
                                    <span className={styles.top_left_name}>{selectedChat[`${getOtherUserId()}_user_name`]}</span>
                                </div>
                            </div>
                            <div className={styles.chat_area}>
                                {messageDisplay()}
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