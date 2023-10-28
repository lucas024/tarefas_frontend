import React, {useEffect, useRef, useState} from 'react'
import styles from './messages.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import FaceIcon from '@mui/icons-material/Face';
import NoPage from '../general/noPage';
import Loader from '../general/loader';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import Face3Icon from '@mui/icons-material/Face';
import { useSelector } from 'react-redux';


const Messages = (props) => {
    const user = useSelector(state => {return state.user})
    
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

    const [s, setS] = useState()

    const chatareaRef = useRef(null)
    const ObjectID = require("bson-objectid");

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    useEffect(async () => {
        setLoadingChatBox(true)
        const paramsAux = Object.fromEntries([...searchParams])
        var chat = await axios.get(`${props.api_url}/admin_chats/get_chat`, { params: {chat_id: paramsAux.id} })
        if(chat.data!==''){
            setSelectedChat(chat.data)
            setSelectedChatTexts(chat.data.texts)
            scrollToBottom()
        }
        setLoadingChatBox(false)
        setSelectedChatId(paramsAux.id)

    }, [searchParams])

    useEffect(async () => {
        var chats = await axios.get(`${props.api_url}/admin_chats/chats`)
        console.log(chats);
        setChats(chats.data)
        setIsLoaded(true)
    }, [])

    const sortByTimestamp = (a, b) => {
        console.log(a.last_text.timestamp)
        return a.last_text.timestamp < b.last_text.timestamp ? 1 : -1
    }

    useEffect(() => {
        if(user){
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
        let time = new Date().getTime()
        let text_object = {
            origin_type : 4,
            timestamp : time,
            text: new_text
        }

        var userWithAdminChat = await axios.get(`${props.api_url}/user/get_user_by_mongo_id`, { params: {_id: selectedChat.user_id} })

        let chatId = ObjectID()
        await axios.post(`${props.api_url}/admin_chats/create_or_update_chat`, {
            admin_name: user.name,
            admin_id: user._id,
            user_id: selectedChat.user_id,
            user_type: selectedChat.user_type,
            user_name: selectedChat.user_name,
            text: text_object,
            updated: time,
            chat_id: userWithAdminChat?.data?.admin_chat || chatId
            })

        console.log(selectedChat);
        s.emit("send-message", {
            recipient: selectedChat.user_id,
            text: new_text,
            time: time,
            chat_id: selectedChatId,
            type: 4
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
                chat.admin_read = false
                chat.user_read = true
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

    const getTypeColor = type => {
        if(type===0) return "#FDD835"
        if(type===1) return "#30A883"
        if(type===2) return "#ff3b30"
        if(type===3) return "#1EACAA"
        return "#FFFFFF"
    }

    const messageHandler = () => {
        if(currentText !== ""){
            let text = {
                origin_type : 4,
                timestamp : new Date().getTime(),
                text: currentText
            }
            let updatedTexts = [...selectedChatTexts, text]
            setSelectedChatTexts(updatedTexts)

            let arr = [...chats]
            for(let chat of arr){
                if(chat.chat_id === selectedChat._id){
                    chat.last_text = text
                    chat.admin_read = true
                    chat.user_read = false
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

    const messageDisplay = () => {
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
                    
                    <div key={i} className={msg.origin_type===4?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type===4?styles.send:styles.receive}>
                            {
                                (selectedChatTexts[i+1])&&(selectedChatTexts[i+1].origin_type!==msg.origin_type)
                                ||(!selectedChatTexts[i+1])? 
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type===4?
                                            <Face3Icon className={styles.chatbox_user_img}/>
                                        :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type===4?
                                        <Face3Icon className={styles.chatbox_user_img}/>
                                    :
                                        <FaceIcon className={styles.chatbox_user_img}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>

                            }
                            {
                                msg.refusal_start?
                                <div className={styles.chatbox_text_starter} style={{borderBottomLeftRadius:0}}>
                                    <div className={styles.chatbot_template_wrapper}>
                                        <p className={styles.chatbot_template}>Problema na publicação</p>
                                    </div>
                                    
                                    <div className={styles.chatbox_template_title_wrapper} onClick={() => navigate(`/main/publications/publication?id=${msg.reservation_id}`)}>
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
                                    <p onClick={() => navigate(`/main/publications/publication?id=${msg.reservation_id}`)} className={styles.chatbot_template_hover} style={{fontSize:"0.8rem", marginTop:"5px", cursor:"pointer"}}>Carregue aqui para editar publicação.</p>
                                </div>
                                :
                                <div className={msg.origin_type===4?styles.chatbox_text_send:styles.chatbox_text_receive}>
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
        if(selectedChat&&user?.type===1){
            return selectedChat.user_id
        }
        else if(selectedChat){
            return selectedChat.worker_id
        }
    }

    const updateReadDatabaseAndNavigate = async (chat_id, type) => {
        await axios.post(`${props.api_url}/chats/update_text_read`, {
            chat_id: chat_id,
            type: type
        })
        navigate({
            pathname: `/admin`,
            search: `?t=messages&id=${chat_id}&user_id`
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
        // props.updateChatReadLocal(chat_id)
    }

    const selectedChatHandler = (chat_id, user_id, user_type) => {
        // await axios.post(`${props.api_url}/chats/update_text_read`, {
        //     chat_id: chat_id,
        //     type: type
        // })
        navigate({
            pathname: `/admin`,
            search: `?t=messages&id=${chat_id}&user_id=${user_id}&user_type=${user_type}`
        })
    }

    const chatsDisplay = () => {
        return chats?.map((item, i) => {
            return (
                <div onClick={() => {
                    // updateReadDatabaseAndNavigate(item.chat_id, 0)
                    // updateReadLocal(item.chat_id, 0)
                    //props.updateNotification(item._id)
                    //removeNotificationHandler(item._id, other_user, true)
                    selectedChatHandler(item.chat_id, item.user_id, item.user_type)
                    }} key={i} className={selectedChatId===item.chat_id?styles.row_selected:styles.row}>
                    {   
                        <FaceIcon className={styles.chatbox_user_img}/>
                    }
                    <div className={styles.row_main}>
                        <div className={styles.main_top}>
                            <span className={styles.top_name} style={{textTransform:item.reservation_title?"uppercase":""}}>{item.user_name}</span>
                            <span className={styles.top_hour} style={{color:selectedChat?._id===item._id?"black":"#ccc"}}>{getDisplayTime(item.last_text.timestamp)}</span>
                        </div>
                        <div className={styles.main_bottom}>
                            <span className={styles.bot_text} style={{fontWeight:600, color:"#333"}}>{item.last_text.text}</span>
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
                                chatsDisplay()
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
                                                user?.type===0?
                                                    <FaceIcon style={{marginLeft:"5px"}} className={styles.chatbox_user_img}/>
                                                :
                                                <FaceIcon style={{marginLeft:"5px"}} className={styles.chatbox_user_img}/>

                                            }
                                            {
                                                user?.type===0?
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{selectedChat.user_name} <span style={{fontSize:"0.8rem", color:"#ccc", fontWeight:"500"}}>({selectedChat.user_id})</span></span>
                                                    <span className={styles.type_indicator}>CLIENTE</span>
                                                </div>
                                                :
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{selectedChat.worker_name}</span>
                                                    <span className={styles.type_indicator}>TRABALHADOR</span>
                                                </div>
                                                
                                            }
                                            {/* {
                                                user?.type===1?
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
                                            messageDisplay()
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
                            :(!chats||chats?.length===0)&&user?.type===1?
                            <NoPage object={"mensagens"}/>
                            :(!chats||chats?.length===0)&&user?.type===0?
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