import React, {useEffect, useState, useRef} from 'react'
import styles from './trabalhador.module.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FaceIcon from '@mui/icons-material/Face';
import axios from 'axios'
import Loader from '../general/loader';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {regioesOptions, profissoesOptions} from '../general/util'

const Trabalhador = props => {
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

    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        setPage(paramsAux.page)
        paramsAux.region&&setLocationActive(paramsAux.region)
        paramsAux.work&&setWorkerActive(paramsAux.work)
        props.user?._id===paramsAux.id&&setOwnPost(true)
        axios.get(`${props.api_url}/worker/get_worker_by_mongo_id`, { params: {_id: paramsAux.id} }).then(res => {
            res.data!=""&&setWorker(res.data)
            setLoading(false)
        })
    }, [searchParams, props])

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

    const sendMessageHandler = () => {
        
    }

    const mapTrabalhosList = list => {
        return list?.map((val, i) => {
            return (
                <div key={i} className={styles.list_el_wrapper}>
                    <span className={workerActive===val?styles.list_el_active:styles.list_el}>{profissoesOptions[val]}</span>
                </div>
            )
        })
    }

    const mapRegioesList = list => {
        return list?.map((val, i) => {
            return (
                <div key={i} className={styles.list_el_wrapper}>
                    <span className={locationActive===val?styles.list_el_active:styles.list_el}>{regioesOptions[val]}</span>
                </div>
            )
        })
    }

    const getNumberDisplay = number => {
        return number&&`${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6)}`
    }

    const getSearchParams = () => {
        if(workerActive&&locationActive){
            return `?page=${page}&work=${workerActive}&region=${locationActive}`
        }
        else if(workerActive){
            return `?page=${page}&work=${workerActive}`
        }
        else if(locationActive){
            return `?page=${page}&region=${locationActive}`
        }
        else{
            return `?page=${page}`
        }
    }

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])

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
                    <span className={styles.normal_back_right_dir} onClick={() => navigate({
                    pathname: '/main/publications/trabalhadores',
                    state: {from_page: true}
                    })}>Trabalhadores</span>
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
                        <div className={styles.left_div}>
                            <span className={styles.left_name}>{worker.name}</span>
                            <span className={styles.left_type}>{worker.entity?"Empresa":"Particular"}</span>
                            {
                                worker.entity?
                                    <span className={styles.left_type_company}>({worker.entity_name})</span>
                                :null
                            }
                        </div>
                    </div>
                    <div className={styles.description_wrapper}>
                        <span className={styles.description_title}>Sobre</span>
                        <span className={styles.description}>{worker.description}</span>
                    </div>
                    {
                        !ownPost&&loaded?
                        <span className={styles.top_message} onClick={() => {
                            messageAreaRef.current.focus()
                            messageRef.current.scrollIntoView()
                            }}>Enviar Mensagem</span>
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
                            <span className={styles.bottom_right_title}>Trabalhos</span>
                            <div className={styles.list}>
                                {mapTrabalhosList(worker.trabalhos)}
                            </div>
                        </div>
                        <span className={styles.bottom_right_divider}></span>
                        <div className={styles.bottom_right_wrapper}>
                            <span className={styles.bottom_right_title}>Regiões</span>
                            <div className={styles.list}>
                                {mapRegioesList(worker.regioes)}
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
                            !props.user?
                            <div className={styles.textarea_wrapper}>
                                <textarea   
                                        ref={messageAreaRef}
                                        className={styles.message_textarea_disabled}
                                        placeholder="Escrever mensagem..."
                                        />
                                <div className={styles.frontdrop}>
                                    <span className={styles.frontdrop_text}>Para enviar mensagem a <span style={{color:"#FF785A", textTransform:"capitalize"}}>{worker?.name?.split(" ")[0]}</span>,</span>
                                    <span className={styles.frontdrop_text}>registe-se ou entre numa conta!</span>
                                    <span className={styles.frontdrop_text_action} onClick={() => navigate('/authentication')}>Ir para autenticação</span>
                                </div>
                            </div>
                            :
                            <textarea 
                                ref={messageAreaRef}
                                className={styles.message_textarea}
                                placeholder="Escrever mensagem..."
                                value={text}
                                onChange={e => setText(e.target.value)}
                            />
                        }
                        <div>
                            
                            <div className={styles.message_enviar_div} ref={messageRef} onClick={() => sendMessageHandler()}>
                                <span className={text!==""?styles.message_enviar:styles.message_enviar_disabled}>
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