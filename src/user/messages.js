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
import ScrollToBottom, { useScrollToBottom, useSticky, useAtBottom, useAtEnd, useAtStart } from 'react-scroll-to-bottom';
import letter_t from '../assets/letter-t.png'
import BackHandIcon from '@mui/icons-material/BackHand';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useSelector, useDispatch } from 'react-redux'
import {user_update_chats} from '../store'


const URL = "http://localhost:5500";

const AdminMessages = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})

    const dispatch = useDispatch()

    const [currentText, setCurrentText] = useState("")
    const [adminOn, setAdminOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [selectedChatId, setSelectedChatId] = useState()
    const [selectedChatTexts, setSelectedChatTexts] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [loadingChats, setLoadingChats] = useState(false)
    const [loadingChatBox, setLoadingChatBox] = useState(false)
    const [chatInformation, setChatInformation] = useState({})
    const [skip, setSkip] = useState(1)
    const limit = 15
    const [loadingNew, setLoadingNew] = useState(false)
    const [displayLoadingNew, setDisplayLoadingNew] = useState(false)
    const [allLoaded, setAllLoaded] = useState(false)


    const [isLoaded, setIsLoaded] = useState(false)

    const scrollToBottom = useScrollToBottom()

    const [s, setS] = useState()

    const chatareaRef = useRef(null)
    const chatMainRef = useRef(null)
    const onLoadBubbleRef = useRef(null)

    const location = useLocation()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        if(paramsAux.id)
        {
            setSelectedChatId(paramsAux.id)
            triggerChatLoad()
        }
        if(chats?.length>0)
        {
            for(let el of chats)
            {
                if(el.chat_id === paramsAux.id)
                {
                    setChatDisplayInformation(el)
                }
            }
        }
        
    }, [searchParams, chats])

    const sortByTimestamp = (a, b) => {
        return a.last_text.timestamp < b.last_text.timestamp ? 1 : -1
    }


    useEffect(() => {
        if(user){
            setLoading(true)
            setLoadingChats(true)
            if(user.type===1){
                axios.get(`${api_url}/worker/get_worker_by_mongo_id`, { params: {_id: user._id} })
                .then(res => {
                    if(res.data!==''){
                        setChats(res.data.chats?.sort(sortByTimestamp))
                        setIsLoaded(true)
                        setLoadingChats(false)
                        setLoading(false)
                    } 
                })
            }
            else{
                axios.get(`${api_url}/user/get_user_by_mongo_id`, { params: {_id: user._id} })
                .then(res => {
                    if(res.data!==''){
                        setChats(res.data?.chats?.sort(sortByTimestamp))
                        setIsLoaded(true)
                        setLoadingChats(false)
                        setLoading(false)
                    } 
                })
            }         

            const newSocket = io(
                'http://localhost:5500',
                { query: {id: user._id} }
            )
            setS(newSocket)
            
            
        }
        
        return () => s&&s.close()
        
    }, [user])

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
            origin_type : user.type,
            timestamp : sent_timestamp,
            text: new_text
        }
        await axios.post(`${api_url}/chats/update_common_chat`, {
            worker_read: user.type===1?true:false,
            user_read: user.type===0?true:false,
            chat_id: selectedChatId,
            text: text,
            updated: sent_timestamp
        })

        s.emit("send-message", {
            recipient: getOtherUserId(),
            text: new_text,
            time: new Date().getTime(),
            chat_id: selectedChatId,
            type: user.type,
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
    
        let arrChats = [...chats]
        const text = {
            origin_type : data.type,
            timestamp : data.time,
            text: data.text
        }
        for(let chat of arrChats){
            if((chat.chat_id===data.chat_id)){
                chat.last_text = text
                if(data.type===0&&selectedChatId!=data.chat_id){
                    chat.user_read = true
                    chat.worker_read = false
                }
                else if(selectedChatId!=data.chat_id){
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
                origin_type : user.type,
                timestamp : new Date().getTime(),
                text: currentText
            }
            let updatedTexts = [...selectedChatTexts, text]
            setSelectedChatTexts(updatedTexts)

            let arr = [...chats]
            for(let chat of arr){
                if(chat.chat_id === selectedChat._id){
                    chat.last_text = text
                    if(user.type===1){
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
                        i===0&&displayLoadingNew?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>
                                <Loader nofrontdrop={true} loading={displayLoadingNew} small={true}/>
                            </span>
                        </div>
                        :
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
                    
                    <div ref={i===limit?onLoadBubbleRef:null} className={msg.origin_type===1?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type===1?styles.send:styles.receive}>
                            {
                                (selectedChatTexts[i+1])&&(selectedChatTexts[i+1].origin_type!==msg.origin_type)
                                ||(!selectedChatTexts[i+1])? 
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type===1?
                                            chatInformation.worker_photo!==""?
                                            <img src={chatInformation.worker_photo} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                        :
                                            chatInformation.user_photo!==""?
                                            <img src={chatInformation.user_photo} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type===1?
                                        chatInformation.worker_photo!==""?
                                        <img src={chatInformation.worker_photo} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    :
                                    chatInformation.user_photo!==""?
                                        <img src={chatInformation.user_photo} className={styles.chatbox_user_img}/>
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
                                            <p className={styles.chatbox_template_title} onClick={() => navigate(`/main/publications/publication?id=${chatInformation.reservation_id}`)}>{chatInformation.reservation_title}</p>
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
                <div key={i} className={styles.chatbox_wrapper}>
                    {
                        i===0&&allLoaded?
                        <div className={styles.inicio_wrapper}>
                            <span className={styles.inicio_text}>Início da Conversa</span>
                        </div>
                        :null
                    }
                    {
                        i===0&&displayLoadingNew?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>
                                <Loader nofrontdrop={true} loading={displayLoadingNew} small={true}/>
                            </span>
                        </div>
                        :
                        i==0?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :i>0&&getDiffDate(selectedChatTexts[i-1].timestamp, msg.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(msg.timestamp)}</span>
                        </div>
                        :null
                    }

                    <div ref={i===limit?onLoadBubbleRef:null} className={msg.origin_type===0?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type===0?styles.send:styles.receive}>
                            {
                                (selectedChatTexts[i+1])&&(selectedChatTexts[i+1].origin_type!==msg.origin_type)
                                ||(!selectedChatTexts[i+1])? 
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type===0?
                                            chatInformation.user_photo!==""?
                                            <img src={chatInformation.user_photo} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img} style={{color:'#0358e5'}}/>
                                        :
                                            chatInformation.worker_photo!==""?
                                            <img src={chatInformation.worker_photo} className={styles.chatbox_user_img}/>
                                            :
                                            <FaceIcon className={styles.chatbox_user_img} style={{color:'#FF785A'}}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type===0?
                                        chatInformation.user_photo!==""?
                                        <img src={chatInformation.user_photo} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img} style={{color:'#0358e5'}}/>
                                    :
                                        chatInformation.worker_photo!==""?
                                        <img src={chatInformation.worker_photo} className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img} style={{color:'#FF785A'}}/>
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
                                            <p className={styles.chatbox_template_title} onClick={() => navigate(`/main/publications/publication?id=${chatInformation.reservation_id}`)}>{chatInformation.reservation_title}</p>
                                        </div>
                                        <p className={styles.chatbot_template}>Mensagem</p>
                                        <span className={styles.chatbox_text_value}>{msg.text}</span>
                                    </span>
                                </div>
                                :
                                <div className={msg.origin_type===0?styles.chatbox_text_send:styles.chatbox_text_receive} style={{backgroundColor:msg.origin_type===0?'#0358e5aa':'#ffffff', color:msg.origin_type===0?'#ffffff':'#161F28'}}>
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
        if(chatInformation&&user?.type===1){
            return chatInformation.user_id
        }
        else if(chatInformation){
            return chatInformation.worker_id
        }
    }
    
    // const removeNotificationHandler = (chat_id, other_user_id, bool) => {
    //     let val = []
    //     if(user.notifications){
    //         val = [...user.notifications]
    //     }
    //     if(val.length>0) val?.splice(val.indexOf(chat_id), 1)

    //     if(user.type===0){
    //         axios.post(`${api_url}/user/set_user_notifications`, {
    //             notification_array: val,
    //             _id: user._id
    //         })
    //     }
    //     else{
    //         axios.post(`${api_url}/worker/set_worker_notifications`, {
    //             notification_array: val,
    //             _id: user._id
    //         })
    //     }
        
    //     axios.post(`${api_url}/chats/update_user_notifications`, {
    //         user_id: user._id,
    //         other_user_id: other_user_id,
    //         chat_id: chat_id
    //     })
    //     if(bool){
    //         let arr = [...chats]
    //         for(let el of arr){
    //             if(el._id === chat_id){
    //                 el[`${user._id}_read`] = true
    //                 break
    //             }
    //         }
    //         setChats(arr)
    //     }
        
    // }

    const updateReadDatabaseAndNavigate = async (chat_id, type) => {
        //type 0 == user
        //type 1 == worker
        await axios.post(`${api_url}/chats/update_text_read`, {
            chat_id: chat_id,
            type: type
        })
        navigate({
            pathname: `/user`,
            search: `?t=messages&id=${chat_id}`
        }, {replace: true})
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

        // var arr = [...user?.chats]
        // let user_type = user?.type
        // for(let i = 0; i < arr.length; i++){
        //     if(arr[i].chat_id === chat_id){
        //         if(user_type===1)
        //             arr[i].worker_read = true
        //         else
        //             arr[i].user_read = true
        //         break
        //     }
        // }
        dispatch(user_update_chats(sorted))
    }

    const setChatDisplayInformation = (chat, type) => {
        setChatInformation(
            {
                user_name: chat.user_name,
                user_photo: chat.user_photoUrl,
                worker_name: chat.worker_name,
                worker_photo: chat.worker_photoUrl,
                reservation_title: chat.reservation_title,
                reservation_id: chat.reservation_id,
                worker_id: chat.worker_id,
                user_id: chat.user_id,
                chat_id: chat.chat_id
            }
        )
    }

    const workerChatsDisplay = () => {
        return chats?.map((item, i) => {
            return (
                <div onClick={() => {
                    if(selectedChatId!==item.chat_id)
                    {
                        updateReadDatabaseAndNavigate(item.chat_id, 1)
                        updateReadLocal(item.chat_id, 1)
                        setChatDisplayInformation(item, 1)
                    }
                    }} key={i} className={selectedChatId===item.chat_id?styles.row_selected:styles.row}>
                    {
                        item.reservation_title?
                        <div className={styles.row_icon_wrapper}>
                            <AssignmentIcon className={styles.row_icon}/>
                        </div>
                        :item.user_photoUrl!==""?
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
                    if(selectedChatId!==item.chat_id)
                    {
                        updateReadDatabaseAndNavigate(item.chat_id, 0)
                        updateReadLocal(item.chat_id, 0)
                        setChatDisplayInformation(item, 0)
                    }
                    //props.updateNotification(item._id)
                    //removeNotificationHandler(item._id, other_user, true)
                    }} key={i} className={
                        selectedChatId===item.chat_id?chatInformation.reservation_title?styles.row_selected:styles.row_selected_just_worker:item.reservation_title?styles.row:styles.row_just_worker}>
                    {   
                        item.reservation_title?
                        <div className={styles.row_icon_wrapper}>
                            <AssignmentIcon className={styles.row_icon}/>
                        </div>
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

    const triggerChatLoad = () => {

        const paramsAux = Object.fromEntries([...searchParams])
        let local_all_loaded = false
        if(!loadingNew)
        {
            setLoadingNew(true)
            setDisplayLoadingNew(true)
            axios.get(`${api_url}/chats/get_chat`, { params: {chat_id: paramsAux.id, skip: selectedChatTexts.length===0?0:skip*limit, limit: limit} })
            .then(res => {
                if(res.data!==''){
                    setSelectedChat(res.data)
                    if(skip === 1)
                    {
                        setSelectedChatTexts(res.data.texts.reverse())
                    }
                    else
                    {
                        let newItems = res.data.texts.reverse().concat([...selectedChatTexts])
                        if(newItems.length===[...selectedChatTexts].length)
                        {
                            setAllLoaded(true)
                            local_all_loaded = true
                        }
                        else
                        {
                            setSelectedChatTexts(newItems)
                        }
                    }
                    if(skip===1)
                    {
                        scrollToBottom()
                        setTimeout(() => {
                            setLoadingNew(false)
                        }, 2000)
                    }
                        
                    else if(!local_all_loaded){
                        onLoadBubbleRef.current.scrollIntoView({behavior: 'instant', block: 'start', inline: 'nearest'})
                        setTimeout(() => {
                            setLoadingNew(false)
                        }, 2000)
                    } 

                    setSkip(skip+1)
                    setDisplayLoadingNew(false)
                }
            })
        }
    }

    const Content = () => {
        const [sticky] = useAtStart()

        useEffect(() => {
            if(sticky)
            {
                selectedChatTexts.length>10&&!allLoaded&&selectedChatId&&triggerChatLoad()
            }
        }, [sticky])
    

        return(
                user?.type===1&&selectedChatTexts?
                workerMessageDisplay()
                :
                selectedChatTexts?
                userMessageDisplay()
                :null
        )
    }

    return (
        <div className={styles.suporte}>
            <Loader loading={loading}/>
            {
                isLoaded?
                    <div className={styles.main}>
                        <div className={styles.users}>
                            <div className={styles.top_title_wrap}>
                                <p className={styles.top_title}>
                                    MENSAGENS
                                </p>
                            </div>
                            <Loader loading={loadingChats}/>
                            {
                                user?.type===1?
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
                                        <div 
                                            className={user?.type===0?styles.top_left_flex_for_user:styles.top_left_flex}
                                            onClick={() => user?.type===0&&navigate(`/main/publications/trabalhador?id=${chatInformation.worker_id}`)}
                                            >
                                            {/* <span className={styles.top_left_indicator} style={{backgroundColor:isUserOnline()?"#6EB241":"white", border:!isUserOnline()?"1px solid #F40009":"1px solid transparent"}}></span> */}
                                            {/* drena do ultima vez online */}
                                            {
                                                user?.type===0?
                                                chatInformation.worker_photo!==""?
                                                <img 
                                                    style={{marginLeft:"5px", border:"2px solid #FF785A"}} 
                                                    className={styles.chatbox_user_img} 
                                                    src={chatInformation.worker_photo}/>
                                                :<FaceIcon style={{marginLeft:"5px", border:"2px solid #FF785A"}} className={styles.chatbox_user_img}/>
                                                :
                                                chatInformation.user_photo!==""?
                                                <img style={{marginLeft:"5px", border:"2px solid #0358e5"}} className={styles.chatbox_user_img} st src={chatInformation.user_photo}/>
                                                :
                                                <FaceIcon style={{marginLeft:"5px", border:"2px solid #0358e5"}} className={styles.chatbox_user_img}/>
                                            }
                                            {
                                                user?.type===0?
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{chatInformation.worker_name}</span>
                                                    <span className={styles.type_indicator}>
                                                            <div className={styles.indicator_div}>
                                                                {/* <BackHandIcon className={styles.indicator_icon}/> */}
                                                                <span className={styles.indicator_name}>TRABALHADOR</span>
                                                            </div>
                                                    </span>
                                                </div>
                                                :
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{chatInformation.user_name}</span>
                                                    <span className={styles.type_indicator}>
                                                        {
                                                            <div className={styles.indicator_div}>
                                                                <span className={styles.indicator_name} style={{color:'#0358e5'}}>CLIENTE</span>
                                                            </div>
                                                        }
                                                    </span>
                                                </div>
                                            }                             
                                        </div>
                                        {
                                            chatInformation.reservation_title?

                                            <div className={styles.post} onClick={() => navigate(`/main/publications/publication?id=${chatInformation.reservation_id}`)}>
                                                <span className={styles.post_title}>{chatInformation.reservation_title}</span>
                                                <span className={styles.post_link} >ver trabalho</span>
                                            </div>
                                            :null
                                            
                                        }
                                    </div>
                                    <div className={user?.type===1?styles.top_separator_user:chatInformation.reservation_title?styles.top_separator_worker_reservation:styles.top_separator_worker}/>
                                    <ScrollToBottom className={styles.chat_area}>
                                        <Loader loading={loadingChatBox}/>
                                            <Content />
                                        <div ref={chatareaRef}></div>
                                    </ScrollToBottom>
                                    <div className={styles.bot}>
                                        <div className={styles.bot_flex}>
                                            <TextareaAutosize 
                                                maxLength={300}
                                                className={styles.bot_input}
                                                placeholder="Escreva a sua mensagem..."
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
                            :(!chats||chats?.length===0)&&user?.type===1?
                            <NoPage object={"mensagens"}/>
                            :(!chats||chats?.length===0)&&user?.type===0?
                            <NoPage object={"mensagens_user"}/>
                            :!selectedChat?<NoPage object={"select_message"}/>
                            :null
                        }
                        
                    </div>
                :
                null
            }
        </div>
    )
}

export default AdminMessages