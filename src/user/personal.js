import React, {useEffect, useState} from 'react'
import styles from './personal.module.css'
import FaceIcon from '@mui/icons-material/Face';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import {regioes, profissoes} from '../general/util'

import EmailVerified from '@mui/icons-material/MarkEmailRead';
import EmailUnverified from '@mui/icons-material/Unsubscribe';
import PhoneVerified from '@mui/icons-material/MobileFriendly';
import PhoneUnverified from '@mui/icons-material/PhonelinkErase';
import VerificationBannerPhone from '../general/verificationBannerPhone';
import SelectWorker from '../selects/selectWorker';
import { useTimer } from 'react-timer-hook';
import { useSelector } from 'react-redux'


const Personal = (props) => {

    const user_profile_complete = useSelector(state => {return state.user_profile_complete})
    const user = useSelector(state => {return state.user})
    
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
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
    const [shake, setShake] = useState(false);
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

    const [verifyPhone, setVerifyPhone] = useState(0)
    const [expired, setExpired] = useState(true)
    
    
    useEffect(() => {
        if(user){
            if(user.photoUrl===""||user.phone===""||user.trabalhos?.length===0||user.trabalhos?.length===0){
                setDisplayTop(true)
            }
            setPhoto(user.photoUrl)
            setName(user.name)
            setPhone(user.phone)
            setEmail(user.email)
            setDescription(user.description)
            setSurname(user.surname)
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

    const {
        seconds,
        restart,
    } = useTimer({ onExpire: () => setExpired(true) })

    const handlerVerifyPressed = () => {
        if(expired)
        {   
            setExpired(false)
            const time = new Date()
            time.setSeconds(time.getSeconds() + 59)
            restart(time)
            setVerifyPhone(1)
        }
    }

    const getCheckedProf = trab => {
        if(selectedProf?.includes(trab)) return true
        return false
    }
    
    const setCheckedProf = trab => {
        if(editBottom){
            let arr = [...selectedProf]
            if(selectedProf.includes(trab)){
                arr.splice(arr.indexOf(trab), 1) 
            }
            else{
                arr.push(trab)
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

    const mapTrabalhos = () => {
        return profissoes.map((trab, i) => {
            return (
                <div key={i} style={{cursor:editBottom?"pointer":"default"}} className={styles.container} onClick={() => setCheckedProf(trab.value)}>
                    <input type="checkbox" readOnly checked={getCheckedProf(trab.value)}/>
                    <span className={editBottom?styles.checkmark:styles.checkmark_disabled}></span>
                    <span className={editBottom?styles.checkbox_text:styles.checkbox_text_disabled}>{trab.label}</span>
                </div>
            )
        })
    }

    const mapRegioes = () => {
        return regioes.map((trab, i) => {
            return (
                <div key={i} style={{cursor:editBottom?"pointer":"default"}} className={styles.container} onClick={() => setCheckedReg(trab.value)}>
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
                    axios.post(`${props.api_url}/user/update_phone`, {
                        user_id : user._id,
                        phone: phone
                    }).then(() => {
                        props.updateUser(phone, "phone")
                        setLoadingRight(false)
                        setRightPop(true)
                        setTimeout(() => setRightPop(false), 4000)
                    })
                }
                else {
                    axios.post(`${props.api_url}/worker/update_phone_and_description`, {
                        user_id : user._id,
                        phone: phone,
                        description: description
                    }).then(() => {
                        props.updateUser(phone, "phone")
                        props.updateUser(description, "description")
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
            if((radioSelected===1 && entityName.length>2)||radioSelected===0){
                setEditBottom(false)
                setLoadingBottom(true)
                axios.post(`${props.api_url}/worker/update_selected`, {
                    user_id : user._id,
                    trabalhos : selectedProf,
                    regioes: selectedReg,
                    entity: radioSelected,
                    entity_name: entityName
                }).then(res => {
                    props.updateUser(selectedProf, "trabalhos")
                    props.updateUser(selectedReg, "regioes")
                    props.updateUser(radioSelected, "entity")
                    props.updateUser(entityName, "entity_name")
                    setLoadingBottom(false)
                    setBottomPop(true)
                    setTimeout(() => setBottomPop(false), 4000)
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
                    axios.post(`${props.api_url}/user/update_photo`, {
                        user_id : user._id,
                        photoUrl: url
                    }).then(res => {
                        setPhoto(url)
                        props.updateUser(url, "photoUrl")
                        setPhotoPop(true)
                        setTimeout(() => setPhotoPop(false), 4000)
                    })
                }
                else{
                    axios.post(`${props.api_url}/worker/update_photo`, {
                        user_id : user._id,
                        photoUrl: url
                    }).then(res => {
                        setPhoto(url)
                        props.updateUser(url, "photoUrl")
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
        if(user?.phone_verified&&!edit) val += 1
        if(user?.email_verified&&!editBottom) val += 1
        if(photo!=="") val += 1
        if(selectedProf?.length>0&&!editBottom) val += 1
        if(selectedReg?.length>0&&!editBottom) val += 1
        if(radioSelected!==null&&!editBottom) val += 1
        return Math.ceil((val/6)*100)
    }

    return (
        <div className={styles.personal}>
            <Loader loading={false}/>
            {/* !props.loaded em vez de false */}
            {
                verifyPhone?
                <VerificationBannerPhone 
                    cancel={() => setVerifyPhone(0)}
                    setNext={val => setVerifyPhone(val)}
                    next={verifyPhone} 
                    phone={phone}
                    />
                :null
            }
            {
                props.loaded?
                <div>
                    <div className={styles.personal_title}>
                    {
                        user?.type===1?
                        <span className={styles.top_title}>Perfil Trabalhador</span>
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
                        <Sessao text={"Número de telefone e descrição atualizados com sucesso!"}/>
                        :
                        <Sessao text={"Número de telefone atualizado com sucesso!"}/>
                    }
                </CSSTransition>
                <CSSTransition 
                    in={bottomPop}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <Sessao text={"Detalhes trabalhador atualizados com sucesso!"}/>
                </CSSTransition>
                {
                    user?.type===1?
                    <div className={styles.status_div} style={{backgroundColor:user_profile_complete&&user?.verified?"#0358e5":!user_profile_complete?"#fdd835":"#fdd835"}}>
                        <span className={styles.status_div_title}>Estado do Perfil</span>
                        <div className={styles.status_div_flex}>
                            <span className={styles.status_div_flex_title}>
                                {
                                    user_profile_complete?
                                    "COMPLETO"
                                    :"INCOMPLETO"
                                }
                            </span>
                        </div>
                    </div>
                    :null
                }
                <div className={styles.mid}>
                    {
                        user?.type===1?
                        <div className={styles.top}>
                            <div className={styles.top_info}  onClick={() => setDisplayTop(!displayTop)}>
                                {/* {
                                    displayTop?
                                    <span className={styles.top_desc}>Assim que tiveres o perfil <span style={{color:"#0358e5", fontWeight:"600"}}>100% completo</span>, este será verificado pela pela equipa do Arranja.</span>
                                    :null
                                } */}
                                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                    <span className={styles.top_complete}>O teu perfil está <span style={{color:getPercentagem()<100?"#fdd835":"#0358e5", fontWeight:"600"}}>{getPercentagem()}%</span> completo:</span>
                                    <ArrowForwardIosIcon className={!displayTop?styles.top_complete_arrow:styles.top_complete_arrow_show}/>
                                </div>
                                {
                                    displayTop?
                                    <div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <FaceIcon className={styles.line_icon}/>
                                            {
                                                photo!==""?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>Fotografia</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>Fotografia</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <EmailVerified className={styles.line_icon}/>
                                            {
                                                user?.email_verified?
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
                                            <PhoneVerified className={styles.line_icon}/>
                                            {
                                                user?.phone_verified?
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
                                            <CorporateFareIcon className={styles.line_icon}/>
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
                                            <HandymanIcon className={styles.line_icon}/>
                                            {
                                                selectedProf?.length>0&&!editBottom?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>Trabalhos que exerço</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>Trabalhos que exerço</span>
                                                    <ClearIcon className={styles.line_val}></ClearIcon>
                                                </div>

                                            }
                                        </div>
                                        <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                            <LocationOnIcon className={styles.line_icon}/>
                                            {
                                                selectedReg?.length>0&&!editBottom?
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text_complete}>Regiões onde trabalho</span>
                                                    <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                                </div>
                                                
                                                :
                                                <div style={{display:"flex", alignItems:"center"}}>
                                                    <span className={styles.line_text}>Regiões onde trabalho</span>
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
                                    :<FaceIcon style={{color:user.type===1?"#fdd83590":""}} className={styles.image_tbd}/>
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
                                    <div className={styles.input_div_top}>
                                        <div className={styles.input_div}>
                                            <span className={styles.input_title}>Nome</span>
                                            <div className={styles.input_div_wrapper}>
                                                {/* <FaceIcon className={styles.input_icon}/> */}
                                                <span className={styles.input_email}>{name} {surname}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.top_edit_area}>
                                        <div className={styles.input_div}>
                                            {
                                                !user?.email_verified?
                                                <div className={styles.input_div_button} onClick={() => setVerifyPhone(1)}>
                                                    <span className={styles.input_div_button_text} style={{textTransform:expired&&'uppercase'||'none'}}>{expired&&"Verificar"||`${seconds}s`}</span>
                                                </div>
                                                :null
                                            }
                                            <div className={styles.input_div_wrapper_editable} style={{borderColor:edit?'#FF785A':!user?.email_verified?'#fdd835':'#ffffff',}}>
                                                <div className={styles.input_icon_div}>
                                                    {
                                                        user?.email_verified?
                                                        <EmailVerified className={styles.input_icon} style={{color:edit?'#71848d':'#0358e5'}}/>
                                                        :
                                                        <EmailUnverified className={styles.input_icon} style={{color:edit?'#71848d':'#fdd835'}}/>
                                                    }
                                                </div>
                                                <span className={styles.input_icon_seperator} style={{backgroundColor:edit?'#71848d':!user?.email_verified?'#fdd835':'#0358e5'}}>.</span>
                                                <span className={styles.input_email}>{email}</span>
                                            </div>
                                        </div>
                                        {/* novo phone input */}
                                        <div className={styles.input_div} style={{marginTop:'10px'}}>
                                            {
                                                !user?.phone_verified?
                                                <div className={styles.input_div_button} onClick={() => handlerVerifyPressed()}>
                                                    <span className={styles.input_div_button_text} style={{textTransform:expired&&'uppercase'||'none'}}>{expired&&"Verificar"||`${seconds}s`}</span>
                                                </div>
                                                :null
                                            }
                                            
                                            <div className={styles.input_div_wrapper_editable} style={{borderColor:edit?'#FF785A':!user?.phone_verified?'#fdd835':'#ffffff', borderTopRightRadius:!user?.phone_verified?'0px':'3px'}}>
                                                <div className={styles.input_icon_div}>
                                                    {
                                                        user?.phone_verified?
                                                        <PhoneVerified className={styles.input_icon} style={{color:edit?'#71848d':'#0358e5'}}/>
                                                        :
                                                        <PhoneUnverified className={styles.input_icon} style={{color:edit?'#71848d':'#fdd835'}}/>
                                                    }
                                                </div>
                                                <span className={styles.input_icon_seperator} style={{backgroundColor:edit?'#71848d':!user?.phone_verified?'#fdd835':'#0358e5'}}>.</span>
                                                <input className={  phoneCorrect&&edit?styles.input_input
                                                                :phoneWrong&&edit?styles.input_input
                                                                :edit?styles.input_input
                                                                :styles.input_input}
                                                        value={phoneVisual}
                                                        maxLength={11} 
                                                        onChange={e => setPhoneHandler(e.target.value)}
                                                        disabled={!edit}>
                                                </input>
                                            </div>
                                        </div>
                                        <div className={styles.edit_area_left}>
                                            {
                                                user?.type===1?
                                                <span className={styles.input_title} style={{marginTop:"10px"}}>Descrição</span>
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
                                                    placeholder="Uma breve descrição sobre si/a sua empresa...">
                                                </textarea>
                                                :null
                                            }
                                            
                                        </div>
                                    </div>
                                    <div className={styles.input_div}>
                                        {
                                            edit&&phone?.length!==9?
                                                <span className={styles.helper}>Introduza o seu número de contacto.</span>
                                            :
                                            edit&&!validator.isMobilePhone(phone, "pt-PT")?
                                                <span className={styles.helper}>Número de contacto inválido.</span>
                                            :null
                                        }
                                        {
                                            edit&&description?.length===0?
                                                <span className={styles.helper}>Introduza uma breve descrição</span>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        user?.type===1?
                        <div>
                            <div className={styles.title_flex}>
                                <div>
                                    <span className={styles.personal_subtitle}>Detalhes Trabalhador</span>
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
                                                style={{borderColor:entityWrong&&entityName.length<=1?'#fdd835':'#0358e5', marginLeft:'10px', borderColor:!editBottom?'#0358e590':entityWrong||entityName.length<=1?'#fdd835':'#0358e5'}}>
                                                <div className={styles.input_icon_div}>
                                                    {
                                                        entityWrong||entityName.length<=1?
                                                        <PhoneUnverified className={styles.input_icon} style={{color:'#0358e5'}}/>
                                                        :
                                                        <PhoneVerified className={styles.input_icon} style={{color:!editBottom?'#0358e590':'#0358e5'}}/>
                                                    }
                                                </div>
                                                <span className={styles.input_icon_seperator} style={{backgroundColor:!editBottom?'#0358e590':entityWrong||entityName.length<=1?'#fdd835':'#0358e5'}}>.</span>
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
                                        entityWrong&&entityName.length<=1?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escreva pelo menos 2 caracteres.</span>
                                        :entityWrong?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor defina a sua situação de trabalho.</span>
                                        :null
                                    }
                                </div>
                                {   
                                    !editBottom?
                                    <span className={styles.edit} onClick={() => setEditBottom(true)}>
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
                                    <span className={styles.flex_title}>Serviços que exerço</span>
                                    <span className={editBottom?styles.divider_active:styles.divider}></span>
                                    {
                                        editBottom&&selectedProf.length===0?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escolhe pelo menos um serviço!</span>
                                        :null
                                    }
                                    <div className={styles.flex_select_div}>
                                            {mapTrabalhos()}
                                    </div>
                                </div>
                                <div className={styles.flex_left}>
                                    <span className={styles.flex_title}>Distritos onde trabalho</span>
                                    <span className={editBottom?styles.divider_active:styles.divider}></span>
                                    {
                                        editBottom&&selectedReg.length===0?
                                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escolhe pelo menos um distrito!</span>
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