import React, {useEffect, useState, useRef} from 'react'
import styles from './personal.module.css'
import FaceIcon from '@mui/icons-material/Face';
import EditIcon from '@mui/icons-material/Edit';
import validator from 'validator'
import CheckIcon from '@mui/icons-material/Check';
import { storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import HandymanIcon from '@mui/icons-material/Handyman';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loader from '../general/loader';
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import {regioes, profissoes, profissoesGrouped} from '../general/util'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmailVerified from '@mui/icons-material/MarkEmailRead';
import EmailUnverified from '@mui/icons-material/Unsubscribe';
import PhoneVerified from '@mui/icons-material/MobileFriendly';
import PhoneUnverified from '@mui/icons-material/PhonelinkErase';
import VerificationBannerPhone from '../general/verificationBannerPhone';
import SelectWorker from '../selects/selectWorker';
import { useSelector, useDispatch } from 'react-redux'
import { user_update_field, user_update_phone_verified, user_update_email_verified, worker_update_profile_complete } from '../store';
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, sendEmailVerification, unlink } from 'firebase/auth';
import { auth } from '../firebase/firebase'
import VerificationBannerEmail from '../general/verificationBannerEmail';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const Personal = (props) => {

    const api_url = useSelector(state => {return state.api_url})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})
    const user = useSelector(state => {return state.user})

    const dispatch = useDispatch()
    
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [description, setDescription] = useState("")
    const [descriptionWrong, setDescriptionWrong] = useState(false)
    const [phoneVisual, setPhoneVisual] = useState("")
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [phoneCorrect, setPhoneCorrect] = useState(false)
    const [email, setEmail] = useState("")
    const [edit, setEdit] = useState(false)
    const [editBottom, setEditBottom] = useState(false)
    const [selectedProf, setSelectedProf] = useState([])
    const [selectedReg, setSelectedReg] = useState([])
    const [shake, setShake] = useState(false)
    const [photo, setPhoto] = useState("")
    const [loadingPhoto, setLoadingPhoto] = useState(false)
    const [photoPop, setPhotoPop] = useState(false)
    const [loadingRight, setLoadingRight] = useState(false)
    const [rightPop, setRightPop] = useState(false)
    const [loadingBottom, setLoadingBottom] = useState(false)
    const [bottomPop, setBottomPop] = useState(false)
    const [displayTop, setDisplayTop] = useState(false)
    const [radioSelected, setRadioSelected] = useState(null)
    const [entityName, setEntityName] = useState("")
    const [entityWrong, setEntityWrong] = useState(false)
    const [listValue, setListValue] = useState('')
    const [shakeTarefas, setShakeTarefas] = useState(false)
    const [fullList, setFullList] = useState(false)

    const [verifyPhone, setVerifyPhone] = useState(0)
    const [verifyEmail, setVerifyEmail] = useState(0)

    const recaptchaWrapperRef = useRef(null)
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaObject = useRef(null)

    const [codeStatus, setCodeStatus] = useState(null)
    const [emailCodeStatus, setEmailCodeStatus] = useState(null)

    const [sendingError, setSendingError] = useState(null)
    
    
    useEffect(() => {
        if(user){
            if(!user_email_verified||!user_phone_verified||user.regioes?.length===0||user.trabalhos?.length===0)
                setDisplayTop(true)
            setPhoto(user.photoUrl)
            setName(user.name)
            setPhone(user.phone)
            setEmail(user.email)
            setDescription(user.description)
            setSelectedProf(user.trabalhos)
            setSelectedReg(user.regioes)
            if(user.entity!==undefined) {
                setRadioSelected(user.entity)
                setEntityName(user.entity_name)
            }
            else{
                setEntityWrong(true)
            }
            if(user.regioes?.length===0||user.trabalhos?.length===0){
                setEditBottom(true)
                setListValue('')
            }
            if(user.phone===""){
                setEdit(true)
                setPhoneWrong(true)
            }
        }
    }, [user])

    useEffect(() => {
        if(entityName.length>1){
            setEntityWrong(false)
        }
    }, [entityName])

    useEffect(() => {
        setPhoneCorrect(false)
        if(phone?.length>0)
        {
            if(phone?.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
            else if(phone?.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
            else{
                setPhoneVisual(`${phone.slice(0,3)}`)
            }
            if(validator.isMobilePhone(phone, "pt-PT")){
                setPhoneWrong(false)
                setPhoneCorrect(true)
            }
        }

    }, [phone])


    const getCheckedProf = trab => {
        if(selectedProf?.includes(trab)) return true
        return false
    }
    
    const setCheckedProf = trab => {
        if(editBottom){
            let arr = [...selectedProf]
            if(selectedProf.includes(trab)){
                arr.splice(arr.indexOf(trab), 1) 
                setFullList(false)
            }
            else if(arr.length<=8){
                if(arr.length===8) setFullList(true)
                arr.push(trab)
            }
    
            else if(arr.length===9)
            {
                console.log('yo')
                setShakeTarefas(true)
                setTimeout(() => setShakeTarefas(false), 1000)
            } 
            setSelectedProf(arr)
        }
    }

    const getCheckedReg = reg => {
        if(selectedReg?.includes(reg)) return true
        return false
    }
    
    const setCheckedReg = reg => {
        if(editBottom){
            let arr = [...selectedReg]
            if(selectedReg.includes(reg)){
                arr.splice(arr.indexOf(reg), 1) 
            }
            else{
                arr.push(reg)
            }
            setSelectedReg(arr)
        }
    }

    const checkExistsInSearch = options => {
        for(let el of options)
        {
            if(listValue.length===0||el.value.toLowerCase().includes(listValue.toLowerCase()))
                return true
        }
        return false
    }

    const subMapTrabalhos = options => {
        return options?.map((trab, i) => {
            return (
                listValue.length===0||trab.value.toLowerCase().includes(listValue.toLowerCase())?
                <div key={i} style={{cursor:(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?"pointer":"default"}} className={`${styles.container} ${styles.subcontainer}`} onClick={() => setCheckedProf(trab.value)}>
                    <input type="checkbox" readOnly checked={getCheckedProf(trab.value)}/>
                    <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkmark:styles.checkmark_disabled}></span>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <img src={trab.img} className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkmark_image:styles.checkmark_image_disabled}/>
                        <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkbox_text:styles.checkbox_text_disabled}>{trab.label}</span>
                    </div>
                </div>
                :null
            )
            
        })
    }

    const mapTrabalhos = () => {
        return profissoesGrouped?.map((trab, i) => {
            return (
                trab.label==='no-label'?
                    listValue.length===0||trab.options[0].value.toLowerCase().includes(listValue.toLowerCase())?
                    <div key={i} style={{cursor:(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?"pointer":"default"}} className={styles.container} onClick={() => setCheckedProf(trab.options[0].value)}>
                        <input type="checkbox" readOnly checked={getCheckedProf(trab.options[0].value)}/>
                        <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?styles.checkmark:styles.checkmark_disabled}></span>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <img src={trab.options[0].img} className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?styles.checkmark_image:styles.checkmark_image_disabled}/>
                            <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?styles.checkbox_text:styles.checkbox_text_disabled}>{trab.options[0].label}</span>
                        </div>
                    </div>
                    :null
                :
                <div className={styles.checkbox_submap}>
                    {
                        checkExistsInSearch(trab.options)?
                        <div style={{display:'flex', alignItems:'center', marginBottom:'10px'}}>
                            <img src={trab.img} className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkmark_image:styles.checkmark_image_disabled} style={{marginLeft:0}}/>
                            <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkbox_submap:styles.checkbox_submap_disabled}>{trab.label}</span>
                        </div>
                        :null
                    }
                    
                    <div>
                        {subMapTrabalhos(trab.options)}
                    </div>
                    
                </div>
                
            )
        })
    }

    const mapRegioes = () => {
        return regioes.map((trab, i) => {
            return (
                <div key={i} style={{cursor:editBottom?"pointer":"default", paddingLeft:"35px"}} className={styles.container} onClick={() => setCheckedReg(trab.value)}>
                    <input type="checkbox" readOnly checked={getCheckedReg(trab.value)}/>
                    <span className={editBottom?styles.checkmark:styles.checkmark_disabled}></span>
                    <span className={editBottom?styles.checkbox_text:styles.checkbox_text_disabled}>{trab.label}</span>
                </div>
            )
        })
    }

    const setPhoneHandler = (val) => {
        let phone = val.replace(/\s/g, '')
        setPhone(phone)
    }

    const editDoneHandler = () => {
        if(!validator.isMobilePhone(phone, "pt-PT")){
            setPhoneWrong(true)
        }
        else if(description?.length===0){
            setDescriptionWrong(true)
        }
        else{
            setPhoneWrong(false)
            setDescriptionWrong(false)
            setEdit(false)
            if(phone!==user.phone || description!==user.description){
                setLoadingRight(true)
                if(user?.type===0){
                    axios.post(`${api_url}/user/update_phone`, {
                        user_id : user._id,
                        phone: phone
                    }).then(() => {
                        dispatch(
                            user_update_field(
                                [{field: 'phone', value: phone}]
                            )
                        )
                        dispatch(user_update_phone_verified(false))
                        if(auth.currentUser.phoneNumber!=null)
                            unlink(auth.currentUser, "phone")
                        setLoadingRight(false)
                        setRightPop(true)
                        setTimeout(() => setRightPop(false), 4000)
                    })
                }
                else {
                    axios.post(`${api_url}/worker/update_phone_and_description`, {
                        user_id : user._id,
                        phone: phone,
                        description: description
                    }).then(() => {
                        dispatch(
                            user_update_field(
                                [
                                    {field: 'phone', value: phone},
                                    {field: 'description', value: description}
                                ]
                            )
                        )
                        dispatch(user_update_phone_verified(false))
                        if(auth.currentUser.phoneNumber!=null)
                            unlink(auth.currentUser, "phone")
                        setLoadingRight(false)
                        setRightPop(true)
                        setTimeout(() => setRightPop(false), 4000)
                    })
                }
            }
        }
    }

    const bottomEditDoneHandler = () => {
        if(radioSelected===1 && entityName.length<=1){
            setEntityWrong(true)
        }
        else if(selectedProf.length>0 && selectedReg.length>0){
            if((radioSelected===1 && entityName.length>1)||radioSelected===0){
                setEditBottom(false)
                setListValue('')
                setLoadingBottom(true)
                axios.post(`${api_url}/worker/update_selected`, {
                    user_id : user._id,
                    trabalhos : selectedProf,
                    regioes: selectedReg,
                    entity: radioSelected,
                    entity_name: entityName
                }).then(() => {
                    dispatch(
                        user_update_field(
                            [
                                {field: 'trabalhos', value: selectedProf},
                                {field: 'regioes', value: selectedReg},
                                {field: 'entity', value: radioSelected},
                                {field: 'entity_name', value: entityName}
                            ]
                        )
                    )
                    setLoadingBottom(false)
                    setBottomPop(true)
                    setTimeout(() => setBottomPop(false), 4000)
                    if(user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)
                    {
                        dispatch(worker_update_profile_complete(true))
                        if(user.state!==1 && worker_is_subscribed)
                            axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
                    }
                        
                })
            }
        }
        else{
            setShake(true);
            setTimeout(() => setShake(false), 1000);
        }
    }   

    const userImageHandler = e => {
        let img = e.target.files[0]
        const storageRef = ref(storage, `user_images/${user._id}`);
        setLoadingPhoto(true)

        uploadBytes(storageRef, img).then(() => {
            getDownloadURL(storageRef).then(url => {
                if(user?.type===0){
                    axios.post(`${api_url}/user/update_photo`, {
                        user_id : user._id,
                        photoUrl: url
                    }).then(res => {
                        setPhoto(url)
                        dispatch(
                            user_update_field(
                                [{field: 'photoUrl', value: url}]
                            )
                        )
                        setPhotoPop(true)
                        setTimeout(() => setPhotoPop(false), 4000)
                    })
                }
                else{
                    axios.post(`${api_url}/worker/update_photo`, {
                        user_id : user._id,
                        photoUrl: url
                    }).then(res => {
                        setPhoto(url)
                        dispatch(
                            user_update_field(
                                [{field: 'photoUrl', value: url}]
                            )
                        )
                        setPhotoPop(true)
                        setTimeout(() => setPhotoPop(false), 4000)
                    })
                }
                setLoadingPhoto(false)
            })
        })
        .catch()
    }

    const getPercentagem = () => {
        let val = 0
        if(user_phone_verified&&!edit) val += 1
        if(user_email_verified&&!editBottom) val += 1
        if(selectedProf?.length>0&&!editBottom) val += 1
        if(selectedReg?.length>0&&!editBottom) val += 1
        if(radioSelected!==null&&!editBottom) val += 1
        return Math.ceil((val/5)*100)
    }

    const initiateEmailVerification = () => {
        setSendingError(null)
        var actionCodeSettings = {
            url: 'https://localhost:3000/user',
            handleCodeInApp: false
        }

        sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
                setVerifyEmail(2)
                console.log('sent')
            })
            .catch(e => {
                console.log(e)
                setSendingError('Erro a enviar o e-mail de verificação, por-favor tente mais tarde.')
            })
    }

    const completeEmailVerification = async () => {
        setEmailCodeStatus(null)
        
        await auth.currentUser.reload()
        console.log(auth.currentUser)
        if(auth?.currentUser?.emailVerified === true)
        {
            setEmailCodeStatus(true)
            dispatch(user_update_email_verified(true))
        }
        else
        {
            setEmailCodeStatus(false)
        }
    }

    const initiatePhoneVerification = () => {
        if(recaptchaObject.current?.destroyed===false && recaptchaWrapperRef.current!==null)
        {
            recaptchaObject.current.clear()
            recaptchaWrapperRef.current.innerHTML = `<div id="recaptcha-container"></div>`
        }

        setSendingError(null)
        var recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {'size': 'invisible'});

        recaptcha.render()
        recaptchaObject.current = recaptcha

        recaptcha.verify().then(() => {
            var provider = new PhoneAuthProvider(auth)
            provider.verifyPhoneNumber(`+351${user.phone}`, recaptcha).then(verificationId => {
                    console.log(verificationId)
                    setVerificationId(verificationId)
                    setVerifyPhone(2)
                }).catch(function (error) {
                    alert(error)
                    recaptcha.clear()
                    setVerificationId(null)
                })
        })
        .catch(e => {
            console.log(e)
        })
    }

    const completePhoneVerification = (code) => {
        setSendingError(null)
        var phoneCredential = PhoneAuthProvider.credential(verificationId, code)
        try {
            linkWithCredential(auth.currentUser, phoneCredential)
                .then(() => {
                    dispatch(user_update_phone_verified(true))
            
                    axios.post(`${api_url}/user/phone_verification_status`, {
                        user_id : user._id,
                        value: true
                    }).then(() => {
                        setCodeStatus(true)
                        setVerifyPhone(3)
                    })
                })
                .catch(e => {
                    if(e.code === 'auth/account-exists-with-different-credential')
                        setSendingError('Este número de telemóvel já se encontra associado a outra conta.')
                    else
                        setCodeStatus(false)
                    
                })
            
        }
        catch (error){
            setCodeStatus(false)
        }
    }

    return (
        <div className={styles.personal}>
            <Loader loading={false}/>
            {/* !props.loaded em vez de false */}
            {
                props.loaded?
                <div>
                    <div className={styles.personal_title}>
                    {
                        user?.type===1?
                        <span className={styles.top_title}>Perfil Profissional</span>
                        :
                        <span className={styles.top_title}>Perfil</span>
                    }
                    
                </div>
                <CSSTransition 
                    in={photoPop}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <Sessao text={"Foto carregada com sucesso!"}/>
                </CSSTransition>
                <CSSTransition 
                    in={rightPop}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    {
                        user?.type===1?
                        <Sessao text={"Número de telefone e/ou descrição atualizados com sucesso!"}/>
                        :
                        <Sessao text={"Número de telefone atualizado com sucesso! Por-favor, volta a verificar."}/>
                    }
                </CSSTransition>
                <CSSTransition 
                    in={bottomPop}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <Sessao text={"Detalhes profissional atualizados com sucesso!"}/>
                </CSSTransition>
                {
                    user?.type===1?
                    <div className={styles.status_div}>
                        <span className={styles.status_div_title}>Estado do Perfil</span>
                        <div className={styles.status_div_flex}>
                            <span className={styles.status_div_flex_title} style={{color:(user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)?"#0358e5":"#fdd835"}}>
                                {
                                    (user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)?
                                    "COMPLETO"
                                    :"INCOMPLETO"
                                }
                            </span>
                        </div>
                    </div>
                    :null
                }
                <div className={verifyPhone||verifyEmail?styles.backdrop:null}/>
                <CSSTransition
                    in={verifyEmail?true:false}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <VerificationBannerEmail
                        cancel={() => {
                            setVerifyEmail(0)
                            setEmailCodeStatus(null)
                            setSendingError(null)
                        }}
                        setNext={val => setVerifyEmail(val)}
                        initiateEmailVerification={initiateEmailVerification}
                        completeEmailVerification={completeEmailVerification}
                        next={verifyEmail} 
                        emailCodeStatus={emailCodeStatus}
                        email={user.email}
                        clearCodeStatus={() => setEmailCodeStatus(null)}
                        sendingError={sendingError}
                        />
                </CSSTransition>
                <CSSTransition
                    in={verifyPhone?true:false}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <VerificationBannerPhone 
                        cancel={() => {
                            setVerifyPhone(0)
                            setCodeStatus(null)
                            setSendingError(null)
                        }}
                        setNext={val => {
                            if(val===2)
                                initiatePhoneVerification()
                        }}
                        initiatePhoneVerification={initiatePhoneVerification}
                        completePhoneVerification={completePhoneVerification}
                        next={verifyPhone} 
                        phone={phone}
                        verificationId={verificationId}
                        codeStatus={codeStatus}
                        clearCodeStatus={() => setCodeStatus(null)}
                        sendingError={sendingError}
                        />
                </CSSTransition>
                <div className={styles.mid}>
                    <div ref={recaptchaWrapperRef}>
                        <div id='recaptcha-container' className={styles.recaptcha_container}></div>
                    </div>
                    {
                        user?.type===1?
                        <div className={styles.top}>
                            <div className={styles.top_info}  onClick={() => setDisplayTop(!displayTop)}>
                                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                    <span className={styles.top_complete}>O teu perfil está <span style={{color:getPercentagem()<100?"#fdd835":"#0358e5", fontWeight:"600"}}>{getPercentagem()}%</span> completo:</span>
                                    <ArrowForwardIosIcon className={!displayTop?styles.top_complete_arrow:styles.top_complete_arrow_show}/>
                                </div>
                                {
                                    displayTop?
                                    <div className={getPercentagem()<100?styles.top_wrap_incomplete:styles.top_wrap_complete}>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <EmailVerified className={user_email_verified?styles.line_icon:styles.line_icon_complete}/>
                                            {
                                                user_email_verified?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>E-mail Verificado</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>E-mail Verificado</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <PhoneVerified className={user_phone_verified?styles.line_icon:styles.line_icon_complete}/>
                                            {
                                                user_phone_verified?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>Telemóvel Verificado</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>Telemóvel Verificado</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <CorporateFareIcon className={radioSelected!==""&&!editBottom?styles.line_icon:styles.line_icon_complete}/>
                                            {
                                                radioSelected!==""&&!editBottom?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>particular ou empresa</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>particular ou empresa</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <HandymanIcon className={selectedProf?.length>0&&!editBottom?styles.line_icon:styles.line_icon_complete}/>
                                            {
                                                selectedProf?.length>0&&!editBottom?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>Tarefas que exerço</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>Tarefas que exerço</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <LocationOnIcon className={selectedReg?.length>0&&!editBottom?styles.line_icon:styles.line_icon_complete}/>
                                            {
                                                selectedReg?.length>0&&!editBottom?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>Distritos ou regiões onde trabalho</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>Distritos ou regiões onde trabalho</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                    </div>
                                    :null
                                }
                            </div>
                            <div className={getPercentagem()===0?styles.top_separator:
                                            getPercentagem()<100?styles.top_separator_incomplete:
                                            styles.top_separator_complete}/>
                        </div>
                        :null
                    }
                    <span className={styles.personal_subtitle} style={{marginTop:user?.type===1?"20px":""}}>Fotografia e Dados</span>
                    <div className={styles.flex}>
                        <div>
                            <div className={styles.image_wrapper}>
                            <Loader loading={loadingPhoto}/>
                                {
                                    user&&photo!==""?
                                    <img className={styles.image} src={photo}/>
                                    :<FaceIcon style={{color:user.type===1?"#ffffff":""}} className={styles.image_tbd}/>
                                }
                                <div className={styles.image_input_wrapper}>
                                    <EditIcon className={styles.edit_icon}/>
                                    <input type="file" title=" " value="" onChange={(val) => userImageHandler(val)} accept="image/png, image/jpeg"/>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.top_right_flex}>
                            <div className={styles.top_right}>
                                <div className={edit?styles.input_flex_edit:styles.input_flex}>
                                    <div className={styles.input_div_top}>
                                        <div className={styles.input_div}>
                                            <span className={styles.input_title}>Nome</span>
                                            <div className={styles.input_div_wrapper}>
                                                {/* <FaceIcon className={styles.input_icon}/> */}
                                                <span className={styles.input_email}>{name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.top_edit_area}>
                                        <div className={styles.input_div}>
                                            {
                                                !user_email_verified?
                                                <div className={styles.input_div_button} onClick={() => !edit&&setVerifyEmail(1)}>
                                                    <span className={styles.input_div_button_text} style={{textTransform:'uppercase', backgroundColor:edit?"#71848d":""}}>Verificar</span>
                                                </div>
                                                :null
                                            }
                                            <div className={styles.input_div_wrapper_editable} style={{borderColor:edit?'#71848d':!user_email_verified?'#fdd835':'#0358e5',}}>
                                                <div className={styles.input_icon_div}>
                                                    {
                                                        user_email_verified?
                                                        <EmailVerified className={styles.input_icon} style={{color:edit?'#71848d':'#0358e5'}}/>
                                                        :
                                                        <EmailUnverified className={styles.input_icon} style={{color:edit?'#71848d':'#fdd835'}}/>
                                                    }
                                                </div>
                                                <span className={styles.input_icon_seperator} style={{backgroundColor:edit?'#71848d':!user_email_verified?'#fdd835':'#0358e5'}}>.</span>
                                                <span className={styles.input_email}>{email}</span>
                                            </div>
                                        </div>
                                        {/* novo phone input */}
                                        <div className={styles.input_div} style={{marginTop:'10px'}}> 
                                            {
                                                !user_phone_verified?
                                                <div className={styles.input_div_button} onClick={() => !edit&&setVerifyPhone(1)}>
                                                    <span className={styles.input_div_button_text} style={{textTransform:'uppercase', backgroundColor:edit?"#71848d":""}}>Verificar</span>
                                                </div>
                                                :null
                                            }
                                            
                                            <div className={styles.input_div_wrapper_editable} style={{borderColor:edit?'#FF785A':!user_phone_verified?'#fdd835':'#0358e5', borderTopRightRadius:!user_phone_verified?'0px':'3px'}}>
                                                <div className={styles.input_icon_div}>
                                                    {
                                                        user_phone_verified?
                                                        <PhoneVerified className={styles.input_icon} style={{color:edit?'#FF785A':'#0358e5'}}/>
                                                        :
                                                        <PhoneUnverified className={styles.input_icon} style={{color:edit?'#FF785A':'#fdd835'}}/>
                                                    }
                                                </div>
                                                <span className={styles.input_icon_seperator} style={{backgroundColor:edit?'#FF785A':!user_phone_verified?'#fdd835':'#0358e5'}}>.</span>
                                                <input className={styles.input_input}
                                                        style={{color:edit?"#ffffff":"#71848d"}}
                                                        value={phoneVisual}
                                                        maxLength={11} 
                                                        onChange={e => setPhoneHandler(e.target.value)}
                                                        disabled={!edit}>
                                                </input>
                                            </div>
                                            {
                                                !edit?
                                                    <span className={user?.type===0?styles.edit_top:styles.edit_top_worker}  onClick={() => setEdit(true)}>
                                                        EDITAR
                                                    </span>
                                                    :
                                                    <span className={user?.type===0?styles.save_top:styles.save_top_worker} onClick={() => editDoneHandler()}>
                                                        GUARDAR
                                                    </span>
                                            }
                                        </div>
                                        <div className={styles.edit_area_left}>
                                            {
                                                user?.type===1?
                                                <span className={styles.input_title} style={{marginTop:"10px"}}>Descrição e Experiência</span>
                                                :null
                                            }
                                        </div>
                                        <div className={styles.edit_area_right}>

                                            {
                                                user?.type===1?
                                                <textarea
                                                    style={{marginTop:"5px", resize:"none"}}
                                                    className={descriptionWrong?styles.textarea_wrong
                                                                :edit?styles.textarea_input_edit
                                                                :styles.textarea_input}
                                                    value={description}
                                                    maxLength={150}
                                                    rows={5}
                                                    onChange={e => setDescription(e.target.value)}
                                                    disabled={!edit}
                                                    placeholder="Uma breve descrição sobre ti/a tua empresa e o tipo de trabalhos exercicidos, anos de experiência...">
                                                </textarea>
                                                :null
                                            }
                                            
                                        </div>
                                    </div>
                                    <div className={styles.input_div}>
                                        {
                                            edit&&phone?.length!==9?
                                                <span className={styles.helper}>Introduz o teu número de contacto.</span>
                                            :
                                            edit&&!validator.isMobilePhone(phone, "pt-PT")?
                                                <span className={styles.helper}>Número de contacto inválido.</span>
                                            :null
                                        }
                                        {
                                            edit&&description?.length===0?
                                                <span className={styles.helper}>Introduz uma descrição sobre ti/a tua empresa e a experiência</span>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        user?.type===1?
                        <div className={styles.worker_area}>
                            <div className={styles.title_flex}>
                                <div>
                                    <span className={styles.personal_subtitle}>Detalhes Profissional</span>
                                    <div className={styles.radio_div}>
                                        <SelectWorker 
                                            editBottom={editBottom} 
                                            worker_type={radioSelected} 
                                            changeType={val => {
                                                setRadioSelected(val)
                                                setEntityWrong(false)
                                            }}/>
                                        {
                                            radioSelected===1?
                                            <div 
                                                className={styles.input_div_wrapper_editable} 
                                                style={{borderColor:entityWrong&&entityName.length<=1?'#fdd835':'#FF785A', marginLeft:'10px', borderColor:!editBottom?'#FF785A90':entityWrong||entityName.length<=1?'#fdd835':'#FF785A'}}>
                                                <div className={styles.input_icon_div}>
                                                    {
                                                        entityWrong||entityName.length<=1?
                                                        <AccountBalanceOutlinedIcon className={styles.input_icon} style={{color:'#ffffff'}}/>
                                                        :
                                                        <AccountBalanceIcon className={styles.input_icon} style={{color:!editBottom?'#FF785A90':'#FF785A'}}/>
                                                    }
                                                </div>
                                                <span className={styles.input_icon_seperator} style={{backgroundColor:!editBottom?'#FF785A90':entityWrong||entityName.length<=1?'#fdd835':'#FF785A'}}>.</span>
                                                <input className={styles.input_input}
                                                        style={{color:!editBottom?'#71848d':'#fff'}}
                                                        value={entityName}
                                                        onChange={e => setEntityName(e.target.value)}
                                                        disabled={!editBottom}>
                                                </input>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    {
                                        radioSelected===1&&entityWrong&&entityName.length<=1?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escreve pelo menos 2 caracteres.</span>
                                        :radioSelected===1&&entityWrong?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor define a tua situação de trabalho.</span>
                                        :null
                                    }
                                </div>
                                {   
                                    !editBottom?
                                    <span className={styles.edit} onClick={() => setEditBottom(true)&&setListValue('')}>
                                        EDITAR
                                    </span>
                                    :
                                    <span className={styles.save} onClick={() => bottomEditDoneHandler()}>
                                        GUARDAR
                                    </span>
                                }
                            </div>
                            <Loader loading={loadingBottom}/>
                            <div className={styles.flex_bottom}>
                                
                                <div className={styles.flex_left}>
                                    <span className={styles.flex_title}>Tarefas que exerço <span className={shakeTarefas?`${styles.selected_number} ${styles.shake}`:styles.selected_number}>({selectedProf?.length}/9)</span></span>
                                    <span className={editBottom?styles.divider_active:styles.divider}></span>
                                    {
                                        editBottom&&selectedProf.length===0?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escolhe pelo menos um tipo de tarefa!</span>
                                        :null
                                    }
                                    
                                    <div className={styles.input_wrapper}>
                                        <input onChange={e => setListValue(e.target.value)} placeholder='Pesquisar tarefas...' value={listValue} className={styles.input_list} disabled={!editBottom} maxLength={20}/>
                                    </div>
                                    <div className={styles.flex_select_div}>
                                        {mapTrabalhos()}
                                    </div>
                                    
                                    
                                </div>
                                <div className={`${styles.flex_left} ${styles.flex_left_mobile}`}>
                                    <span className={styles.flex_title}>Distritos ou regiões onde trabalho</span>
                                    <span className={editBottom?styles.divider_active:styles.divider}></span>
                                    {
                                        editBottom&&selectedReg.length===0?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escolhe pelo menos um distrito ou região!</span>
                                        :null
                                    }
                                    <div className={styles.flex_select_div}>
                                        {mapRegioes()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        :null
                    }
                </div>
                </div>
                :null

            }
            
        </div>
    )
}

export default Personal