import React, {useEffect, useState, useRef} from 'react'
import styles from './trabalhador.module.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FaceIcon from '@mui/icons-material/Face';
import axios from 'axios'
import Loader from '../general/loader';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {regioesOptions, profissoesMap} from '../general/util'
import ChatIcon from '@mui/icons-material/Chat';
import { useSelector } from 'react-redux'

const ObjectID = require("bson-objectid");

const Trabalhador = props => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})

    const navigate = useNavigate()

    const messageRef = useRef(null)
    const messageAreaRef = useRef(null)

    const [searchParams] = useSearchParams()
    const [page, setPage] = useState()
    const [worker, setWorker] = useState({})
    const [loading, setLoading] = useState(true)
    const [ownPost, setOwnPost] = useState(false)
    const [text, setText] = useState("")
    const [locationActive, setLocationActive] = useState(false)
    const [workerActive, setWorkerActive] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const [localChatSent, setLocalChatSent] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)

    const [noRepeatedChats, setNoRepeatedChats] = useState(false)

    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        setPage(paramsAux.page)
        paramsAux.region&&setLocationActive(paramsAux.region)
        paramsAux.work&&setWorkerActive(paramsAux.work)
        user?._id===paramsAux.id&&setOwnPost(true)
        axios.get(`${api_url}/worker/get_worker_by_mongo_id`, { params: {_id: paramsAux.id} }).then(res => {
            res.data!=""&&setWorker(res.data)
            setLoading(false)
        })
    }, [searchParams, props])

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

    const sendMessageHandler = async () => {
        if(text!==""&&worker.type!==user.type&&worker._id!==user._id){
            setLoadingChat(true)

            let time = new Date().getTime()
            let text_object = {
                origin_type : user.type,
                timestamp : time,
                text: text,
            }

            var repeated = false

            if(user.chats)
            {
                for(let chat of user.chats)
                {
                    if(chat.worker_id === worker._id && chat.reservation_id === null)
                    {
                        console.log("repeated chat")
                        repeated=true
                        await axios.post(`${api_url}/chats/update_common_chat`, {
                            worker_read: user.type===1?true:false,
                            user_read: user.type===0?true:false,
                            chat_id: chat.chat_id,
                            text: text_object,
                            updated: time
                        })
                        setLocalChatSent(chat.chat_id)
                    }
                }
            }
            

            if(!repeated)
            {
                let chatId = ObjectID()

                await axios.post(`${api_url}/chats/create_chat`, {
                    worker_name: worker.name,
                    worker_surname: worker.surname,
                    worker_photoUrl: worker.photoUrl,
                    worker_phone: worker.phone,
                    worker_id: worker._id,
                    user_name: user.name,
                    user_surname: user.surname,
                    user_photoUrl: user.photoUrl,
                    user_phone: user.phone,
                    user_id: user._id,
                    text: text_object,
                    updated: time,
                    chat_id: chatId
                })
                setLocalChatSent(chatId)
            }
            

            setText("")
            setLoadingChat(false)
            setSuccessPopin(true)
            setTimeout(() => setSuccessPopin(false), 4000)
            setNoRepeatedChats(true)
            }
    }

    const mapTrabalhosList = () => {
        if(worker.trabalhos)
        {
            let arrTrabalhos = [...worker?.trabalhos]
            arrTrabalhos.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
            return arrTrabalhos.map((val, i) => {
                return (
                    <div key={i} className={styles.list_el_wrapper}>
                        <span className={workerActive===val?styles.list_el_active:styles.list_el}>{profissoesMap[val]?.label}</span>
                    </div>
                )
            })
        }
        
    }

    const mapRegioesList = () => {
        if(worker.regioes)
        {
            let arrRegioes = [...worker?.regioes]
            arrRegioes.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
            return arrRegioes.map((val, i) => {
                return (
                    <div key={i} className={styles.list_el_wrapper}>
                        <span className={locationActive===val?styles.list_el_active:styles.list_el}>{regioesOptions[val]}</span>
                    </div>
                )
            })
        }
    }

    const getNumberDisplay = number => {
        return number&&`${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6)}`
    }

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

    const displayTrabalhosImages = () => {
        if(worker?.trabalhos){
            let arrTrabalhos = [...worker.trabalhos]
            arrTrabalhos.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
            return arrTrabalhos.map((val, i) => {
                return (
                    <div 
                        key={i} 
                        className={workerActive===val?styles.top_image_div_selected:styles.top_image_div}
                        style={{marginLeft:i===0?'-10px':''}}>
                        <img className={styles.top_image} src={profissoesMap[val]?.img}/>
                    </div>
                    
                )
            })
        }
    }

    return(
        <div className={styles.worker}>
            <p className={styles.reservar_upper_title}>TRABALHADOR</p>
            <div className={styles.normal_back}>
                <Link className={styles.normal_back_left} 
                    to={-1}
                    state={{from_page: true}}>
                    <ArrowBackIosIcon className={styles.normal_back_left_symbol}/>
                    <span className={styles.normal_back_left_text}>VOLTAR</span>
                </Link>
                <div className={styles.normal_back_right}>
                    <span className={styles.normal_back_right_dir} onClick={() => navigate(-1)}>Trabalhadores</span>
                    <div className={styles.normal_back_right_sep_wrapper}>
                        <div className={styles.normal_back_right_sep}>|</div>
                    </div>
                    <span className={styles.normal_back_right_dir} onClick={() => navigate({
                    pathname: '/main/publications/trabalhadores',
                    search: `?page=${page}`,
                    state: {from_page: true}
                    })}>Página {page}</span>
                </div>
            </div>
            <div className={styles.main}>
                <Loader loading={loading}/>
                <div className={styles.main_top}>
                    <div className={styles.main_top_left}>
                        {
                            worker.photoUrl!=""?
                            <img src={worker.photoUrl} className={styles.left_img}></img>
                            :<FaceIcon className={styles.left_img}/>
                        }
                        <div className={styles.left_div_wrapper}>
                            <div className={styles.left_div}>
                                <div style={{display:'flex'}}>
                                    <div className={styles.left_name_wrapper}>
                                        <p className={styles.left_name}>{worker.name}</p>
                                    </div>
                                    <div className={styles.middle_images}>
                                        <div className={styles.middle_images_background}>
                                            {worker&&displayTrabalhosImages()}
                                        </div>
                                    </div>
                                </div>
                                
                                <span className={styles.left_type}>{worker.entity?"Empresa":"Particular"}</span>
                                {
                                    worker.entity?
                                        <span className={styles.left_type_company}>({worker.entity_name})</span>
                                    :null
                                }

                            </div>
                            <div className={styles.description_wrapper}>
                                <span className={styles.description_title}>Descrição</span>
                                <span className={styles.description}>{worker.description}</span>
                            </div>
                        </div>
                        
                    </div>
                    
                    {
                        !ownPost&&loaded?
                        <span 
                            className={styles.top_message} 
                            onClick={() => {
                                messageAreaRef.current.focus()
                                messageRef.current.scrollIntoView()
                            }}>
                                <span className={styles.top_message_text}>Enviar Mensagem</span>
                                <ChatIcon className={styles.top_message_icon}/>
                            </span>                        
                        :ownPost?
                        null
                        :<span className={`${styles.top_message} ${styles.skeleton}`} style={{height:"40px", width:"150px"}}></span>
                    }
                    
                </div>
                <div className={styles.main_bottom}>
                    <div className={styles.bottom_left}>
                        <span className={styles.bottom_title}>Contactos</span>
                        <div className={styles.bottom_contact_wrapper} style={{marginTop:"20px"}}>
                            <PhoneOutlinedIcon className={styles.bottom_icon}/>
                            <span className={styles.bottom_contact}>{getNumberDisplay(worker.phone)}</span>
                        </div>
                        <div className={styles.bottom_contact_wrapper}>
                            <EmailOutlinedIcon className={styles.bottom_icon}/>
                            <span className={styles.bottom_contact}>{worker.email}</span>
                        </div>
                    </div>
                    <div className={styles.bottom_right}>
                        <div className={styles.bottom_right_wrapper}>
                            <span className={styles.bottom_right_title}>Tarefas</span>
                            <div className={styles.list}>
                                {mapTrabalhosList()}
                            </div>
                        </div>
                        <span className={styles.bottom_right_divider}></span>
                        <div className={styles.bottom_right_wrapper}>
                            <span className={styles.bottom_right_title}>Regiões</span>
                            <div className={styles.list}>
                                {mapRegioesList()}
                            </div>
                        </div>
                    </div>
                </div>
                {
                !ownPost&&loaded?
                    <div className={styles.message}>
                        <div className={styles.message_top_flex}>
                            <div className={styles.message_left}>
                                {
                                    worker.photoUrl!==""?
                                    <img src={worker?.photoUrl} className={styles.message_img}></img>
                                    :<FaceIcon className={styles.message_img}/>
                                }
                                <span className={styles.message_left_user_name}>{worker.name}</span>
                            </div>
                            <span className={styles.user_info_number} style={{opacity:"0.6"}}>Mensagem</span> 
                        </div>
                        {
                            !user._id?
                            <div className={styles.textarea_wrapper}>
                                <textarea   
                                        disabled={!user}
                                        ref={messageAreaRef}
                                        className={styles.message_textarea_disabled}
                                        placeholder="Escrever mensagem..."
                                        />
                                <div className={styles.frontdrop}>
                                    <span className={styles.frontdrop_text}>Para enviar mensagem a <span style={{textTransform:"capitalize", fontWeight:700}}>{worker?.name?.split(" ")[0]}</span>,</span>
                                    <span className={styles.frontdrop_text}>registe-se ou entre numa conta!</span>
                                    <span className={styles.frontdrop_text_action} onClick={() => navigate('/authentication?type=1')}>autenticar</span>
                                </div>
                            </div>
                            :
                            localChatSent?
                            <div className={styles.textarea_wrapper}>
                                <textarea   
                                        disabled={!user}
                                        ref={messageAreaRef}
                                        className={styles.message_textarea_disabled}
                                        placeholder="Escrever mensagem..."
                                        />
                                <div className={styles.frontdrop}>
                                    <span className={styles.frontdrop_text}>Mensagem enviada!</span>
                                    <span className={styles.frontdrop_text_action} onClick={() => navigate(`/user?t=messages&id=${localChatSent}`)}>Ver conversa</span>
                                </div>
                            </div>
                            :
                            <div style={{position:"relative"}}>
                                <Loader loading={loadingChat}/>
                                <textarea 
                                ref={messageAreaRef}
                                className={styles.message_textarea}
                                placeholder="Escrever mensagem..."
                                value={text}
                                onChange={e => setText(e.target.value)} />
                            </div>
                        }
                        <div>
                            
                            <div className={styles.message_enviar_div} ref={messageRef} onClick={() => !localChatSent&&sendMessageHandler()}>
                                <span className={(text!==""&&!localChatSent)?styles.message_enviar:styles.message_enviar_disabled}>
                                    Enviar
                                </span>
                            </div>
                        </div>
                    </div>
                    :ownPost?
                    null
                    :
                    <div className={`${styles.message} ${styles.skeleton}`} style={{height:"280px"}}></div>
                }
                
            </div>
        </div>
    )
}

export default Trabalhador