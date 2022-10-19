import React, {useEffect, useRef, useState} from 'react'
import styles from './messages.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { css } from "@emotion/react";
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import FaceIcon from '@mui/icons-material/Face';
import NoPage from '../general/noPage';
import Loader from './../general/loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import letter_t from '../assets/letter-t.png'


const URL = "http://localhost:5500";

const Messages = (props) => {
    
    
    const [currentText, setCurrentText] = useState("")
    const [adminOn, setAdminOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [selectedChatId, setSelectedChatId] = useState()
    const [selectedChatTexts, setSelectedChatTexts] = useState()
    const [onlineUsers, setOnlineUsers] = useState([])
    const [loadingChats, setLoadingChats] = useState(false)
    const [loadingChatBox, setLoadingChatBox] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false)

    const scrollToBottom = useScrollToBottom()
    const [sticky] = useSticky()

    const [s, setS] = useState()

    const chatareaRef = useRef(null)
    const chatbubbleRef = useRef(null)

    const location = useLocation()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    useEffect(() => {
        setLoadingChatBox(true)
        const paramsAux = Object.fromEntries([...searchParams])

        axios.get(`${props.api_url}/chats/get_chat`, { params: {chat_id: paramsAux.id} })
            .then(res => {
                if(res.data!==''){
                    setSelectedChat(res.data)
                    setSelectedChatTexts(res.data.texts)
                    scrollToBottom()
                } 
                setLoadingChatBox(false)
            })
        setSelectedChatId(paramsAux.id)

    }, [searchParams])

    const sortByTimestamp = (a, b) => {
        console.log(a.last_text.timestamp)
        return a.last_text.timestamp < b.last_text.timestamp ? 1 : -1
    }


    useEffect(() => {
        if(props.user){
            setLoading(true)
            setLoadingChats(true)
            if(props.user.type===1){
                axios.get(`${props.api_url}/worker/get_worker_by_mongo_id`, { params: {_id: props.user._id} })
                .then(res => {
                    console.log(res);
                    if(res.data!==''){
                        setChats(res.data.chats?.sort(sortByTimestamp))
                        setIsLoaded(true)
                        setLoadingChats(false)
                        setLoading(false)
                    } 
                })
            }
            else{
                axios.get(`${props.api_url}/user/get_user_by_mongo_id`, { params: {_id: props.user._id} })
                .then(res => {
                    if(res.data!==''){
                        setChats(res.data.chats?.sort(sortByTimestamp))
                        setIsLoaded(true)
                        setLoadingChats(false)
                        setLoading(false)
                    } 
                })
            }         

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
            handleReceiveSocketMessageUpdate(data, selectedChatId, selectedChatTexts, chats)
        })

        return () => s.off('receive-message')
    }, [s, selectedChatId, selectedChatTexts, chats])

    const sendSynchronousAndUpdateDatabaseHandler = async (new_text) => {
        const sent_timestamp = new Date().getTime()
        const text = {
            origin_type : props.user.type,
            timestamp : sent_timestamp,
            text: new_text
        }
        await axios.post(`${props.api_url}/chats/update_common_chat`, {
            worker_read: props.user.type===1?true:false,
            user_read: props.user.type===0?true:false,
            chat_id: selectedChatId,
            text: text,
            updated: sent_timestamp
        })

        s.emit("send-message", {
            recipient: getOtherUserId(),
            text: new_text,
            time: new Date().getTime(),
            chat_id: selectedChatId,
            type: props.user.type
        })        
    }

    const extenseDate = timestamp => {
        let iso_date = new Date(timestamp)
        let day = iso_date.toISOString().split("T")[0].slice(-2)
        let month = monthNames[parseInt(iso_date.toISOString().split("T")[0].slice(5,7))]
        let year = iso_date.toISOString().split("T")[0].slice(0,4)
        return `${day} de ${month}, ${year}`
    }

    const handleReceiveSocketMessageUpdate = (data, selected_chat_id, selected_chat_texts) => {
        //updates user/woker chats
        //updates common chat
        //all local
    
        console.log(data)

        let arrChats = [...chats]
        const text = {
            origin_type : data.type,
            timestamp : data.time,
            text: data.text
        }
        for(let chat of arrChats){
            if(chat.chat_id === data.chat_id){
                chat.last_text = text
                if(data.type===0){
                    chat.user_read = true
                    chat.worker_read = false
                }
                else{
                    chat.user_read = false
                    chat.worker_read = true
                }
                break
            }
        }
        setChats(arrChats)


        //common
        if(selected_chat_id === data.chat_id){
            let updatedTexts = [...selected_chat_texts, text]
            setSelectedChatTexts(updatedTexts)
            scrollToBottom()
        }
    }

    const messageHandler = () => {
        if(currentText !== ""){
            let text = {
                origin_type : props.user.type,
                timestamp : new Date().getTime(),
                text: currentText
            }
            let updatedTexts = [...selectedChatTexts, text]
            setSelectedChatTexts(updatedTexts)

            let arr = [...chats]
            for(let chat of arr){
                if(chat.chat_id === selectedChat._id){
                    chat.last_text = text
                    if(props.user.type===1){
                        chat.user_read = false
                        chat.worker_read = true
                    }
                    else{
                        chat.user_read = true
                        chat.worker_read = false
                    }
                    break
                }
            }
            setChats(arr)

            sendSynchronousAndUpdateDatabaseHandler(currentText)

            scrollToBottom()

            setCurrentText("")   
        }
    }

    const getDiffDate = (prevDate, currDate) => {
        const prev = new Date(prevDate)
        const curr = new Date(currDate)
        return prev.getDate() !== curr.getDate()
    }
    const workerMessageDisplay = () => {
        return selectedChatTexts?.map((msg, i) => {
            return (
                <div key={i}>
                    {
                        i===0?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :i>0&&getDiffDate(selectedChatTexts[i-1].timestamp, msg.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :null
                    }
                    
                    <div className={msg.origin_type===1?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type===1?styles.send:styles.receive}>
                            {
                                (selectedChatTexts[i+1])&&(selectedChatTexts[i+1].origin_type!==msg.origin_type)
                                ||(!selectedChatTexts[i+1])? 
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type===1?
                                            selectedChat.worker_photoUrl!==""?
                                            <img src={selectedChat.worker_photoUrl} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                        :
                                            selectedChat.user_photoUrl!==""?
                                            <img src={selectedChat.user_photoUrl} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type===1?
                                        selectedChat.worker_photoUrl!==""?
                                        <img src={selectedChat.worker_photoUrl} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    :
                                        selectedChat.user_photoUrl!==""?
                                        <img src={selectedChat.user_photoUrl} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>

                            }
                            {
                                msg.starter?
                                <div className={styles.chatbox_text_starter} style={{borderBottomRightRadius:0}}>
                                    <span className={styles.chatbox_starter}>
                                        <span className={styles.chatbot_template}>Interesse no trabalho!</span>
                                        <div className={styles.chatbox_template_title_wrapper}>
                                            <p className={styles.chatbox_template_title}>{selectedChat.reservation_title}</p>
                                        </div>
                                        <p className={styles.chatbot_template}>Mensagem</p>
                                        <span className={styles.chatbox_text_value}>{msg.text}</span>
                                    </span>
                                </div>
                                :
                                <div className={msg.origin_type===1?styles.chatbox_text_send:styles.chatbox_text_receive}>
                                    <span className={styles.chatbox_text_value}>{msg.text}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                
                
            )
        })
    }

    const userMessageDisplay = () => {
        return selectedChatTexts?.map((msg, i) => {
            return (
                <div key={i}>
                    {
                        i===0?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :i>0&&getDiffDate(selectedChatTexts[i-1].timestamp, msg.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :null
                    }

                    <div key={i} className={msg.origin_type===0?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type===0?styles.send:styles.receive}>
                            {
                                (selectedChatTexts[i+1])&&(selectedChatTexts[i+1].origin_type!==msg.origin_type)
                                ||(!selectedChatTexts[i+1])? 
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type===0?
                                            selectedChat.user_photoUrl!==""?
                                            <img src={selectedChat.user_photoUrl} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                        :
                                            selectedChat.worker_photoUrl!==""?
                                            <img src={selectedChat.worker_photoUrl} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type===0?
                                        selectedChat.user_photoUrl!==""?
                                        <img src={selectedChat.user_photoUrl} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    :
                                        selectedChat.worker_photoUrl!==""?
                                        <img src={selectedChat.worker_photoUrl} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>

                            }
                            {
                                msg.starter?
                                <div className={styles.chatbox_text_starter} style={{borderBottomLeftRadius:0}}>
                                    <span className={styles.chatbox_starter}>
                                        <span className={styles.chatbot_template}>Interesse no trabalho!</span>
                                        <div className={styles.chatbox_template_title_wrapper}>
                                            <p className={styles.chatbox_template_title} onClick={() => navigate(`/main/publications/publication?id=${selectedChat.reservation_id}`)}>{selectedChat.reservation_title}</p>
                                        </div>
                                        <p className={styles.chatbot_template}>Mensagem</p>
                                        <span className={styles.chatbox_text_value}>{msg.text}</span>
                                    </span>
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

    const getOtherUserId = () => {
        if(selectedChat&&props.user?.type===1){
            return selectedChat.user_id
        }
        else if(selectedChat){
            return selectedChat.worker_id
        }
    }
    
    // const removeNotificationHandler = (chat_id, other_user_id, bool) => {
    //     let val = []
    //     if(props.user.notifications){
    //         val = [...props.user.notifications]
    //     }
    //     if(val.length>0) val?.splice(val.indexOf(chat_id), 1)

    //     if(props.user.type===0){
    //         axios.post(`${props.api_url}/user/set_user_notifications`, {
    //             notification_array: val,
    //             _id: props.user._id
    //         })
    //     }
    //     else{
    //         axios.post(`${props.api_url}/worker/set_worker_notifications`, {
    //             notification_array: val,
    //             _id: props.user._id
    //         })
    //     }
        
    //     axios.post(`${props.api_url}/chats/update_user_notifications`, {
    //         user_id: props.user._id,
    //         other_user_id: other_user_id,
    //         chat_id: chat_id
    //     })
    //     if(bool){
    //         let arr = [...chats]
    //         for(let el of arr){
    //             if(el._id === chat_id){
    //                 el[`${props.user._id}_read`] = true
    //                 break
    //             }
    //         }
    //         setChats(arr)
    //     }
        
    // }

    const updateReadDatabaseAndNavigate = async (chat_id, type) => {
        await axios.post(`${props.api_url}/chats/update_text_read`, {
            chat_id: chat_id,
            type: type
        })
        navigate({
            pathname: `/user`,
            search: `?t=messages&id=${chat_id}`
        })
    }

    const updateReadLocal = async (chat_id, type) => {
        let arrChats = [...chats]
        for(let chat of arrChats){
            if(chat.chat_id === chat_id){
                if(type===1){
                    chat.worker_read = true
                }
                else{
                    chat.user_read = true
                }
                break
            }
        }
        let sorted = arrChats.sort(sortByTimestamp)
        setChats(sorted)
        props.updateChatReadLocal(chat_id)
    }

    const workerChatsDisplay = () => {
        return chats?.map((item, i) => {
            return (
                <div onClick={() => {
                    updateReadDatabaseAndNavigate(item.chat_id, 1)
                    updateReadLocal(item.chat_id, 1)
                    //props.updateNotification(item._id)
                    //removeNotificationHandler(item._id, other_user, true)
                    }} key={i} className={selectedChatId===item.chat_id?styles.row_selected:styles.row}>
                    {
                        item.reservation_title?
                        <img className={styles.row_img} style={{backgroundColor:"white"}} src={letter_t}/>
                        :item.worker_photoUrl!==""?
                        <img className={styles.row_img} src={item.user_photoUrl}/>
                        :
                        <FaceIcon className={styles.chatbox_user_img}/>
                    }
                    <div className={styles.row_main}>
                        <div className={styles.main_top}>
                            <span className={styles.top_name} style={{textTransform:item.reservation_title?"uppercase":""}}>{item.reservation_title?item.reservation_title:item.user_name}</span>
                            <span className={styles.top_hour} style={{color:selectedChat?._id===item._id?"black":"#ccc"}}>{getDisplayTime(item.last_text.timestamp)}</span>
                        </div>
                        <div className={styles.main_bottom}>
                            <span className={styles.bot_text} style={{fontWeight:item.last_text.origin_type==0&&!item.worker_read?600:400, color:item.last_text.origin_type==0&&!item.worker_read?"#FF785A":"#ccc"}}>{item.last_text.text}</span>
                            {
                                item.last_text.origin_type==0&&!item.worker_read?
                                <div className={styles.bot_not}>
                                    <CircleIcon className={styles.bot_not_icon}/>
                                </div>
                                :
                                item.last_text.origin_type===1&&item.user_read?
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

    const userChatsDisplay = () => {
        return chats?.map((item, i) => {
            return (
                <div onClick={() => {
                    updateReadDatabaseAndNavigate(item.chat_id, 0)
                    updateReadLocal(item.chat_id, 0)
                    //props.updateNotification(item._id)
                    //removeNotificationHandler(item._id, other_user, true)
                    }} key={i} className={selectedChatId===item.chat_id?styles.row_selected:styles.row}>
                    {   
                        item.reservation_title?
                        <img className={styles.row_img} style={{backgroundColor:"white"}} src={letter_t}/>
                        :item.worker_photoUrl!==""?
                        <img className={styles.row_img} src={item.worker_photoUrl}/>
                        :
                        <FaceIcon className={styles.chatbox_user_img}/>
                    }
                    <div className={styles.row_main}>
                        <div className={styles.main_top}>
                            <span className={styles.top_name} style={{textTransform:item.reservation_title?"uppercase":""}}>{item.reservation_title?item.reservation_title:item.worker_name}</span>
                            <span className={styles.top_hour} style={{color:selectedChat?._id===item._id?"black":"#ccc"}}>{getDisplayTime(item.last_text.timestamp)}</span>
                        </div>
                        <div className={styles.main_bottom}>
                            <span className={styles.bot_text} style={{fontWeight:item.last_text.origin_type===1&&!item.user_read?600:400, color:item.last_text.origin_type===1&&!item.user_read?"#FF785A":"#ccc"}}>{item.last_text.text}</span>
                            {
                                item.last_text.origin_type===1&&!item.user_read?
                                <div className={styles.bot_not}>
                                    <CircleIcon className={styles.bot_not_icon}/>
                                </div>
                                :
                                item.last_text.origin_type==0&&item.worker_read?
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
            <Loader loading={loading}/>
            {
                isLoaded?
                <div style={{height:"100%"}}>
                    <div className={styles.suporte_title}>
                        <span className={styles.top_title}>Mensagens</span>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.users}>
                            <Loader loading={loadingChats}/>
                            {
                                props.user?.type===1?
                                workerChatsDisplay()
                                :
                                userChatsDisplay()
                            }
                        </div>
                        {
                            selectedChat?
                            <div className={styles.chat}>
                                <Loader loading={loading}/>
                                <div className={styles.chat_wrapper}>
                                    <div className={styles.top}>
                                        <div className={styles.top_left_flex}>
                                            {/* <span className={styles.top_left_indicator} style={{backgroundColor:isUserOnline()?"#6EB241":"white", border:!isUserOnline()?"1px solid #F40009":"1px solid transparent"}}></span> */}
                                            {/* drena do ultima vez online */}
                                            {
                                                props.user?.type===1?
                                                    selectedChat.user_photoUrl!==""?
                                                    <img style={{marginLeft:"5px"}} className={styles.chatbox_user_img} src={selectedChat.user_photoUrl}/>
                                                    :
                                                    <FaceIcon style={{marginLeft:"5px"}} className={styles.chatbox_user_img}/>
                                                :
                                                selectedChat.worker_photoUrl!==""?
                                                <img style={{marginLeft:"5px"}} className={styles.chatbox_user_img} src={selectedChat.worker_photoUrl}/>
                                                :
                                                <FaceIcon style={{marginLeft:"5px"}} className={styles.chatbox_user_img}/>

                                            }
                                            {
                                                props.user?.type===1?
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{selectedChat.user_name}</span>
                                                    <span className={styles.type_indicator}>CLIENTE</span>
                                                </div>
                                                :
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{selectedChat.worker_name}</span>
                                                    <span className={styles.type_indicator}>TRABALHADOR</span>
                                                </div>
                                                
                                            }
                                            {/* {
                                                props.user?.type===1?
                                                <span className={styles.type_indicator}>CLIENTE</span>
                                                :
                                                <span className={styles.type_indicator}>TRABALHADOR</span>
                                            } */}                                            
                                        </div>
                                        {
                                            selectedChat.reservation_title?

                                            <div className={styles.post} onClick={() => navigate(`/main/publications/publication?id=${selectedChat.reservation_id}`)}>
                                                <span className={styles.post_title}>{selectedChat.reservation_title}</span>
                                                <span className={styles.post_link} >ver trabalho</span>
                                            </div>
                                            :null
                                            
                                        }
                                    </div>
                                    <ScrollToBottom className={styles.chat_area}>
                                        <Loader loading={loadingChatBox}/>
                                        {
                                            props.user?.type===1?
                                            workerMessageDisplay()
                                            :userMessageDisplay()
                                        }
                                        <div ref={chatareaRef}></div>
                                    </ScrollToBottom>
                                    <div className={styles.bot}>
                                        <div className={styles.bot_flex}>
                                            <TextareaAutosize 
                                                className={styles.bot_input}
                                                placeholder="Escreva a sua mensagem..."
                                                onKeyDown={handleKeyDown}
                                                value={currentText} 
                                                onChange={e => setCurrentText(e.target.value)} 
                                                />
                                            <div className={styles.bot_right_flex}>
                                                <SendOutlinedIcon className={styles.send_icon} onClick={() => messageHandler()}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :(!chats||chats?.length===0)&&props.user?.type===1?
                            <NoPage object={"mensagens"}/>
                            :(!chats||chats?.length===0)&&props.user?.type===0?
                            <NoPage object={"mensagens_user"}/>
                            :null
                        }
                        
                    </div>
                </div>
                :
                null
            }
        </div>
    )
}

export default Messages