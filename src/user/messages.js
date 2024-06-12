import React, {useEffect, useRef, useState} from 'react'
import styles from './messages.module.css'
import axios from 'axios';
import {io} from "socket.io-client"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import FaceIcon from '@mui/icons-material/Face';
import NoPage from '../general/noPage';
import Loader from './../general/loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import ScrollToBottom, { useScrollToBottom, useSticky, useAtBottom, useAtEnd, useAtStart } from 'react-scroll-to-bottom';
import { useSelector, useDispatch } from 'react-redux'
import {user_update_chats} from '../store'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import TitleIcon from '@mui/icons-material/Title';


const AdminMessages = () => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const chatsStore = useSelector(state => {return state.chats})

    const dispatch = useDispatch()

    const [currentText, setCurrentText] = useState("")
    const [adminOn, setAdminOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [selectedChatId, setSelectedChatId] = useState(null)
    const [selectedChatTexts, setSelectedChatTexts] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [loadingChats, setLoadingChats] = useState(false)
    const [loadingChatBox, setLoadingChatBox] = useState(false)
    const [chatInformation, setChatInformation] = useState({})
    const [skip, setSkip] = useState(0)
    const limit = 30
    const [displayLoadingNew, setDisplayLoadingNew] = useState(false)
    const [allLoaded, setAllLoaded] = useState(false)
    const [landingLoad, setLandingLoad] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(0)

    const [stop, setStop] = useState(true)


    const [isLoaded, setIsLoaded] = useState(false)

    const scrollToBottom = useScrollToBottom()

    const [s, setS] = useState()

    const chatareaRef = useRef(null)
    const chatMainRef = useRef(null)
    const onLoadBubbleRef = useRef(null)

    const [time, setTime] = useState(null)

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
            console.log(chatInformation)
            // if(chatInformation===null)
            // {
            //     triggerChatLoad(paramsAux.id, true, true, true, 'landing')
            // }
            // if(landingLoad)
            // {
            //     triggerChatLoad(paramsAux.id, true, true, true, 'landing')
            //     setLandingLoad(false)
            // }
            // else
            // {
            //     setLandingLoad(false)
            // }
        }
       
    }, [searchParams, user])

    
    useEffect(() => {
        const interval = setInterval(() => {
            if(selectedChatId)
            {
                setLoading(true)
                let aux = []
                let date = new Date()
                if(date.getSeconds()===29 || date.getSeconds()===59)
                {
                    axios.get(`${api_url}/chats/get_chat`, { params: {chat_id: selectedChatId, skip: 0, limit: 10} })
                    .then(res => {
                        if(res.data!==''){
                            {
                                for(let el of res.data.texts)
                                {
                                    if(el.timestamp > lastUpdated)                                        
                                        aux.push(el)
                                    else
                                        break
                                }
                                if(aux.length===10)
                                {
                                    triggerChatLoad(selectedChatId, true, false, false, 'loadmore')
                                }
                                else if(aux.length>0)
                                {
                                    let last = aux.slice(0)[0]
                                    console.log(last)
                                    updateReadLocal(selectedChat, last)
                                    updateReadDatabaseAndNavigate(selectedChat)
                                    setLastUpdated(last.timestamp)
                                    let newItems = [...selectedChatTexts].concat(aux.reverse())
                                    setSelectedChatTexts(newItems)
                                }
                            }
                            // scrollToBottom()
                        }
                        setLoading(false)
                    })
                }
                else
                {
                    setLoading(false)
                }
            }
            setStop(false)
            //update chats agora escolhidos e last updated de todos os outros e desse mesmo tambem
        }, 1000);

        return () => clearInterval(interval)
    }, [selectedChatId, lastUpdated])

    const sortByTimestamp = (a, b) => {
        return a.last_text.timestamp < b.last_text.timestamp ? 1 : -1
    }

    useEffect(() => {
        if(user){
            setLoading(true)
            setLoadingChats(true)
            // if(user.type===1){
            //     axios.get(`${api_url}/worker/get_worker_by_mongo_id`, { params: {_id: user._id} })
            //     .then(res => {
            //         if(res.data!==''){
            //             setIsLoaded(true)
            //             setLoadingChats(false)
            //             setLoading(false)
            //             if(res.data?.chats?.length>0)
            //             {
            //                 setChats(JSON.parse(JSON.stringify(([...res.data.chats].sort(sortByTimestamp)))))
            //                 for(let el of res.data.chats)
            //                 {
            //                     if(el.chat_id === selectedChatId)
            //                     {
            //                         setChatDisplayInformation(el)
            //                     }
            //                 }
            //             }
                            
            //         } 
            //     })
            // }
            // else{
            axios.get(`${api_url}/user/get_user_by_mongo_id`, { params: {_id: user._id} })
            .then(res => {
                if(res.data!==''){
                    setIsLoaded(true)
                    setLoadingChats(false)
                    setLoading(false)

                    if(res.data?.chats?.length>0)
                    {
                        setChats(JSON.parse(JSON.stringify(([...res.data.chats].sort(sortByTimestamp)))))
                        for(let el of res.data.chats)
                        {
                            if(el.chat_id === selectedChatId)
                            {
                                setChatDisplayInformation(el)
                            }
                        }
                    }
                    setIsLoaded(true)
                    setLoadingChats(false)
                    setLoading(false)
                } 
            })   

            // const newSocket = io(
            //     'https://socket-dot-vender-344408.ew.r.appspot.com:65080',
            //     { 
            //         query: {id: user._id},
            //         rejectUnauthorized: false,
            //         secure: true,
            //         reconnection: true,
            //         withCredentials:true,
            //         transports: ['websocket']
            //     }
            // )
            // setS(newSocket)
            
            
        }
        
        // return () => s&&s.close()
        
    }, [user, selectedChatId])

    // useEffect(() => {
    //     if(!s) return

    //     s.on('receive-message', data => {
    //         handleReceiveSocketMessageUpdate(data, selectedChatId, selectedChatTexts, chats)
    //     })

    //     s.on("connect_error", (err) => {
    //         // the reason of the error, for example "xhr poll error"
    //         console.log(err.message);
          
    //         // some additional description, for example the status code of the initial HTTP response
    //         console.log(err.description);
          
    //         // some additional context, for example the XMLHttpRequest object
    //         console.log(err.context);
    //       });

    //     return () => s.off('receive-message')
    // }, [s, selectedChatId, selectedChatTexts, chats])

    const sendSynchronousAndUpdateDatabaseHandler = async (new_text) => {
        const sent_timestamp = new Date().getTime()
        const text = {
            origin_type : user._id,
            timestamp : sent_timestamp,
            text: new_text
        }
        await axios.post(`${api_url}/chats/update_common_chat`, {
            approacher_read: user._id===selectedChat.approacher_id,
            approached_read: user._id===selectedChat.approached_id,
            approacher_id: selectedChat.approacher_id,
            approached_id: selectedChat.approached_id,
            chat_id: selectedChatId,
            text: text,
            updated: sent_timestamp
        })

        // s.emit("send-message", {
        //     recipient: getOtherUserId(),
        //     text: new_text,
        //     time: new Date().getTime(),
        //     chat_id: selectedChatId,
        //     type: user.type,
        // })        
    }

    const extenseDate = timestamp => {
        let iso_date = new Date(timestamp)
        let day = iso_date.toISOString().split("T")[0].slice(-2)
        let month = monthNames[parseInt(iso_date.toISOString().split("T")[0].slice(5,7))]
        let year = iso_date.toISOString().split("T")[0].slice(0,4)
        return `${day} de ${month}, ${year}`
    }

    const updateReadLocal = (chat, last_text) => {
        let arr = [...chats]
        for(let el of arr)
        {
          if(el.chat_id===chat.chat_id)
          {
            if(last_text !== null)
            {
                el.approacher_read = user._id===el.approacher_id
                el.approached_read = user._id===el.approached_id
            }
            else
            {
                el.approacher_read = user._id===el.approacher_id?true:el.approacher_read
                el.approached_read = user._id===el.approached_id?true:el.approached_read
            }

            if(last_text !== null)
                el.last_text = last_text
            break
          }
        }
        setChats(arr.sort(sortByTimestamp))
        // dispatch(user_update_chats(arr))

        console.log('called')

        console.log(chatsStore)
        if(chatsStore?.length>0)
        {
            let aux2 = JSON.parse(JSON.stringify(([...chatsStore])))
            for(let el of aux2)
            {
                if(el.chat_id===chat.chat_id)
                {
                el.approacher_read = user._id===el.approacher_id?true:el.approacher_read
                el.approached_read = user._id===el.approached_id?true:el.approached_read
                if(last_text !== null)
                    el.last_text = last_text
                break
                }
            }
            dispatch(user_update_chats(aux2))
        }        
    }

    const messageHandler = () => {
        if(currentText !== ""){
            let text = {
                origin_type : user._id,
                timestamp : new Date().getTime(),
                text: currentText
            }
            let updatedTexts = [...selectedChatTexts, text]
            setSelectedChatTexts(updatedTexts)
            updateReadLocal(selectedChat, text)

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

    const userMessageDisplay = (approached) => {
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

                    <div ref={i===limit?onLoadBubbleRef:null} className={msg.origin_type===user?._id?styles.chatbox_wrapper_send:styles.chatbox_wrapper_receive}>   
                        <div className={msg.origin_type===user?._id?styles.send:styles.receive}>
                            {
                                (selectedChatTexts[i+1])&&(selectedChatTexts[i+1].origin_type!==msg.origin_type)
                                ||(!selectedChatTexts[i+1])?
                                <div className={styles.chatbox_user}>
                                    {
                                        msg.origin_type===user?._id?
                                        user?.photoUrl!==""?
                                        <img src={user?.photoUrl} className={styles.chatbox_user_img} referrerPolicy="no-referrer"/>
                                        :
                                        user?.type==='user'?
                                        <FaceIcon className={styles.chatbox_user_img} style={{color:'#0358e5'}}/>
                                        :
                                        <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)', color:'#FF785A'}}/>

                                        :

                                        
                                        approached?
                                        chatInformation.approacher!==""?
                                        <img src={chatInformation.approacher_photo} className={styles.chatbox_user_img} referrerPolicy="no-referrer"/>
                                        :
                                        chatInformation.approacher_type==='user'?
                                        <FaceIcon className={styles.chatbox_user_img} style={{color:'#0358e5'}}/>
                                        :
                                        <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)', color:'#FF785A'}}/>
                                        :
                                        
                                        chatInformation.approached!==""?
                                        <img src={chatInformation.approached_photo} className={styles.chatbox_user_img} referrerPolicy="no-referrer"/>
                                        :
                                        chatInformation.approached_type==='user'?
                                        <FaceIcon className={styles.chatbox_user_img} style={{color:'#0358e5'}}/>
                                        :
                                        <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)', color:'#FF785A'}}/>

                                        
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp}>{getDisplayTime(msg.timestamp)}</span>
                                </div>
                                :<div className={styles.chatbox_user_opacity}>
                                    {
                                        msg.origin_type===user?._id?
                                        user?.photoUrl!==""?
                                        <img src={user?.photoUrl} className={styles.chatbox_user_img_small} referrerPolicy="no-referrer"/>
                                        :
                                        user?.type==='user'?
                                        <FaceIcon className={styles.chatbox_user_img_small} style={{color:'#0358e5'}}/>
                                        :
                                        <EmojiPeopleIcon className={styles.chatbox_user_img_small} style={{transform: 'scaleX(-1)', color:'#FF785A'}}/>

                                        :

                                        
                                        approached?
                                        chatInformation.approacher!==""?
                                        <img src={chatInformation.approacher_photo} className={styles.chatbox_user_img_small} referrerPolicy="no-referrer"/>
                                        :
                                        chatInformation.approacher_type==='user'?
                                        <FaceIcon className={styles.chatbox_user_img_small} style={{color:'#0358e5'}}/>
                                        :
                                        <EmojiPeopleIcon className={styles.chatbox_user_img_small} style={{transform: 'scaleX(-1)', color:'#FF785A'}}/>
                                        :
                                        
                                        chatInformation.approached!==""?
                                        <img src={chatInformation.approached_photo} className={styles.chatbox_user_img_small} referrerPolicy="no-referrer"/>
                                        :
                                        chatInformation.approached_type==='user'?
                                        <FaceIcon className={styles.chatbox_user_img_small} style={{color:'#0358e5'}}/>
                                        :
                                        <EmojiPeopleIcon className={styles.chatbox_user_img_small} style={{transform: 'scaleX(-1)', color:'#FF785A'}}/>
                                    }
                                    <span ref={i+1===selectedChatTexts.length?chatareaRef:null} className={styles.chatbox_user_timestamp_small}>{getDisplayTime(msg.timestamp)}</span>
                                </div>

                            }
                            {
                                msg.starter?
                                <div className={styles.chatbox_text_starter} style={{borderBottomLeftRadius:msg.origin_type===user?._id?'10px':'0px', borderBottomRightRadius:msg.origin_type===user?._id?0:'10px'}}>
                                    <span className={styles.chatbox_starter}>
                                        <span className={styles.chatbot_template}>Interesse na tarefa!</span>
                                        <div className={styles.chatbox_template_title_wrapper}>
                                            <p className={styles.chatbox_template_title} onClick={() => navigate(`/main/publications/publication?id=${chatInformation.reservation_id}`)}>{chatInformation.reservation_title}</p>
                                        </div>
                                        <p className={styles.chatbot_template}>Mensagem</p>
                                        <span className={styles.chatbox_text_value}>{msg.text}</span>
                                    </span>
                                </div>
                                :
                                <div className={msg.origin_type===user?._id?styles.chatbox_text_send:styles.chatbox_text_receive} style={{backgroundColor:msg.origin_type===user?._id?'#0358e5aa':'#ffffff', color:msg.origin_type===user?._id?'#ffffff':'#161F28'}}>
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


    const updateReadDatabaseAndNavigate = async (chat) => {
        if(user)
        {
            console.log(chat)
            await axios.post(`${api_url}/chats/update_text_read`, {
                chat_id: chat.chat_id,
                approacher_read: chat.approacher_id===user?._id?true:chat.approacher_read,
                approached_read: chat.approached_id===user?._id?true:chat.approached_read,
            })
            // navigate({
            //     pathname: `/user`,
            //     search: `?t=messages&id=${chat.chat_id}`
            // }, {replace: true})
        }
    }

    const setChatDisplayInformation = chat => {
        console.log()
        setChatInformation(
            {
                approacher_id: chat.approacher_id,
                approacher_name: chat.approacher_name,
                approacher_photo: chat.approacher_photoUrl,
                approacher_type: chat.approacher_type,

                approached_id: chat.approached_id,
                approached_name: chat.approached_name,
                approached_photo: chat.approached_photoUrl,
                approached_type: chat.approached_type,

                reservation_title: chat.reservation_title,
                reservation_id: chat.reservation_id,

                chat_id: chat.chat_id,
            }
        )
    }

    const isApproacher = (item) => {
        return user?._id===item.approacher_id
    }

    const chatsDisplay = () => {
        return chats?.map((item, i) => {
            return (
                <div onClick={() => {
                    if(selectedChatId!==item.chat_id)
                    {
                        setSelectedChat(item)
                        setSelectedChatId(item.chat_id)
                        updateReadLocal(item, null)
                        updateReadDatabaseAndNavigate(item)
                        setChatDisplayInformation(item)
                        setAllLoaded(false)
                        triggerChatLoad(item.chat_id, true, false, true, 'chatsDisplay')
                    }
                    }} key={i} className={
                        selectedChatId===item.chat_id?chatInformation.reservation_title?styles.row_selected:styles.row_selected_just_worker:item.reservation_title?styles.row:styles.row_just_worker}>
                    {   
                        item.reservation_title?
                        <div className={styles.row_icon_wrapper}>
                            <TitleIcon className={styles.row_icon}/>
                        </div>
                        :!isApproacher(item)&&
                            item.approacher_photoUrl!==""?
                        <img className={styles.row_img} src={item.approacher_photoUrl} referrerPolicy="no-referrer"/>
                        :
                        isApproacher(item)&&
                            item.approached_photoUrl!==""?
                        <img className={styles.row_img} src={item.approached_photoUrl} referrerPolicy="no-referrer"/>
                        :
                        isApproacher(item)&&
                            item.approached_photoUrl===""?
                            item.approached_type==='worker'?
                            <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)'}}/>
                            :
                            <FaceIcon className={styles.chatbox_user_img}/>
                        :
                        !isApproacher(item)&&
                            item.approacher_photoUrl===""&&item.approached_type==='worker'?
                            <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)'}}/>
                            :
                            <FaceIcon className={styles.chatbox_user_img}/>
                    }
                    <div className={styles.row_main}>
                        <div className={styles.main_top}>
                            <span className={styles.top_name} style={{textTransform:item.reservation_title?"uppercase":""}}>{
                            item.reservation_title?item.reservation_title
                            :
                            item.approached_id===user?._id?
                            item.approacher_name
                            :
                            item.approacher_name}</span>
                            <span className={styles.top_hour} style={{color:selectedChat?._id===item._id?"black":"#ccc"}}>{getDisplayTime(item.last_text.timestamp)}</span>
                        </div>
                        <div className={styles.main_bottom}>
                            <span className={styles.bot_text} 
                                style={{fontWeight:item.last_text.origin_type!==user?._id
                                    &&((isApproacher(item)&&!item.approacher_read) 
                                        || (!isApproacher(item)&&!item.approached_read))?600:400, 
                                        
                                        color:item.last_text.origin_type!==user?._id
                                        &&((isApproacher(item)&&!item.approacher_read) 
                                            || (!isApproacher(item)&&!item.approached_read))?"#FF785A":"#ccc"}}>{item.last_text.text}</span>
                            {
                                item.last_text.origin_type!==user?._id
                                &&((isApproacher(item)&&!item.approacher_read) 
                                    || (!isApproacher(item)&&!item.approached_read))?
                                <div className={styles.bot_not}>
                                    <CircleIcon className={styles.bot_not_icon}/>
                                </div>
                                :
                                item.last_text.origin_type===user?._id&&((isApproacher(item)&&item.approached_read) || !isApproacher(item)&&item.approacher_read)?
                                <div className={styles.bot_not}>
                                    <CheckIcon className={styles.bot_not_icon}/>
                                </div>
                                :
                                item.last_text.origin_type===user?._id?
                                <div className={styles.bot_not}>
                                    <CheckIcon className={styles.bot_not_icon} style={{color:"#71848d"}}/>
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

    const triggerChatLoad = (chat_id, new_load, display_timing, new_trigger, from) => {
        console.log(chat_id, from)
        if((display_timing===true || stop===false || new_trigger) && chat_id)
        {
            console.log(chat_id)
            setDisplayLoadingNew(true)
            axios.get(`${api_url}/chats/get_chat`, { params: {chat_id: chat_id, skip: new_load?0:skip*limit, limit: limit} })
            .then(res => {
                if(res.data!==''){
                    console.log(res.data)
                    if(new_load)
                    {
                        setLastUpdated(parseInt(res.data.texts.slice(0)[0].timestamp))
                        setSelectedChatTexts(res.data.texts.reverse())
                        if(res.data.texts.length<limit)
                        {
                            onLoadBubbleRef.current?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'nearest'})
                            setAllLoaded(true)
                        }
                    }
                    else
                    {
                        let newItems = res.data.texts.reverse().concat([...selectedChatTexts])
                        setSelectedChatTexts(newItems)
                        if(res.data.texts.length<limit)
                        {
                            setAllLoaded(true)
                            
                        }
                        else
                        {
                            onLoadBubbleRef.current?.scrollIntoView({behavior: 'instant', block: 'start', inline: 'nearest'})
                        }

                    }

                    if(stop===true)
                        setTimeout(() => {
                            scrollToBottom()
                            setStop(false)
                            setDisplayLoadingNew(false)
                        }, 3000)
                    else{
                        scrollToBottom()
                        setDisplayLoadingNew(false)
                    }

                    if(new_load) setSkip(0)
                    else setSkip(skip+1)

                    setLoading(false)

                }
            })
            .catch(err => {
                setLoading(false)
            })
        }
    }

    const Content = () => {
        const [sticky] = useAtStart()
        const [atEnd] = useAtEnd()
        
        
        useEffect(() => {
            if(sticky)
            {
                if(selectedChatTexts.length>(limit-1)&&!allLoaded&&selectedChatId&&skip>0&&displayLoadingNew===false&&stop===false)
                {
                    triggerChatLoad(selectedChatId, false, false, false, 'sticky')
                    setStop(true)
                }
                    
            }
            if(atEnd)
            {
                if(skip===0)
                    setSkip(1)
            }
        }, [sticky, atEnd])

        // user is approached
        let approached = true

        if(selectedChat.approached_id !== user?._id)
        {
            // other is approached
            approached = false
        }

        return(
                selectedChatTexts?
                userMessageDisplay(approached)
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
                                <p className={styles.top_title_short}>
                                    M
                                </p>
                            </div>
                            <Loader loading={loadingChats}/>
                            {
                                chatsDisplay()
                            }
                        </div>
                        {
                            selectedChat?
                            <div className={styles.chat}>
                                {/* <Loader loading={loading}/> */}
                                <div className={styles.chat_wrapper}>
                                    <div className={styles.top}>
                                        <div 
                                            className={chatInformation.approacher_id===user?._id?
                                                chatInformation.approached_type==="worker"?styles.top_left_flex_for_user:styles.top_left_flex
                                                :
                                                chatInformation.approacher_type==="worker"?styles.top_left_flex_for_user:styles.top_left_flex
                                                }
                                            onClick={() => 
                                                chatInformation.approacher_id===user?._id?
                                                chatInformation.approached_type==="worker"?navigate(`/main/publications/profissional?id=${chatInformation.approached_id}`):{}
                                                :
                                                chatInformation.approacher_type==="worker"?navigate(`/main/publications/profissional?id=${chatInformation.approacher_id}`):{}

                                                
                                            }
                                            >
                                            {/* <span className={styles.top_left_indicator} style={{backgroundColor:isUserOnline()?"#6EB241":"white", border:!isUserOnline()?"1px solid #F40009":"1px solid transparent"}}></span> */}
                                            {/* drena do ultima vez online */}
                                            {
                                                
                                                chatInformation.approacher_id===user?._id&&
                                                chatInformation.approached_photo!=""?
                                                <img 
                                                    style={{marginLeft:"5px", border:chatInformation.approached_type==='worker'?"2px solid #FF785A":"2px solid #ffffff"}} 
                                                    className={styles.chatbox_user_img} 
                                                    src={chatInformation.approached_photo}
                                                    referrerPolicy="no-referrer"/>
                                                :
                                                chatInformation.approacher_photo!=""?
                                                <img 
                                                    style={{marginLeft:"5px", border:chatInformation.approacher_type==='worker'?"2px solid #FF785A":"2px solid #ffffff"}} 
                                                    className={styles.chatbox_user_img} 
                                                    src={chatInformation.approacher_photo}
                                                    referrerPolicy="no-referrer"/>
                                                :
                                                user?._id===chatInformation.approacher_id?
                                                chatInformation.approached_type==='user'?
                                                <FaceIcon style={{marginLeft:"5px", border:"2px solid #ffffff"}} className={styles.chatbox_user_img}/>
                                                :
                                                <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)', marginLeft:"5px", border:"2px solid #ffffff"}}/>
                                                
                                                :
                                                
                                                chatInformation.approacher_type==='user'?
                                                <FaceIcon style={{marginLeft:"5px", border:"2px solid #ffffff"}} className={styles.chatbox_user_img}/>
                                                :
                                                <EmojiPeopleIcon className={styles.chatbox_user_img} style={{transform: 'scaleX(-1)', marginLeft:"5px", border:"2px solid #ffffff"}}/>
                                                
                                            }
                                            {
                                                
                                                <div className={styles.name_indicator}>
                                                    <span className={styles.top_left_name}>{user?._id===chatInformation.approacher_id?chatInformation.approached_name:chatInformation.approacher_name}</span>
                                                    <span className={styles.type_indicator}>
                                                        {
                                                            <div className={styles.indicator_div}>
                                                                {
                                                                    user?._id===chatInformation.approacher_id?
                                                                    chatInformation.approached_type==='worker'?
                                                                    <span className={styles.indicator_name}>PROFISSIONAL</span>
                                                                    :
                                                                    <span className={styles.indicator_name} style={{color:'#ffffff'}}>CLIENTE</span>
                                                                    :
                                                                    chatInformation.approacher_type==='worker'?
                                                                    <span className={styles.indicator_name}>PROFISSIONAL</span>
                                                                    :
                                                                    <span className={styles.indicator_name} style={{color:'#ffffff'}}>CLIENTE</span>
                                                                }
                                                                
                                                            </div>
                                                        }
                                                    </span>
                                                </div>
                                                // :
                                                // <div className={styles.name_indicator}>
                                                //     <span className={styles.top_left_name}>{chatInformation.worker_name}</span>
                                                //     <span className={styles.type_indicator}>
                                                //             <div className={styles.indicator_div}>
                                                //                 {/* <BackHandIcon className={styles.indicator_icon}/> */}
                                                                
                                                //             </div>
                                                //     </span>
                                                // </div>                                               
                                            }                             
                                        </div>
                                        {
                                            chatInformation.reservation_title?

                                            <div className={styles.post} onClick={() => navigate(`/main/publications/publication?id=${chatInformation.reservation_id}`)}>
                                                <span className={styles.post_title}>{chatInformation.reservation_title}</span>
                                                <span className={styles.post_link} >ver tarefa</span>
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
                            :(!chats||chats?.length===0)&&user?.worker?
                            <div className={styles.chat}>
                                <NoPage object={"mensagens_worker"}/>
                            </div>
                            
                            :(!chats||chats?.length===0)&&!user?.worker?
                            <div className={styles.chat}>
                                <NoPage object={"mensagens_user"}/>
                            </div>
                            :!selectedChat?
                            <div className={styles.chat}>
                                <NoPage object={"select_message"}/>
                            </div>
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