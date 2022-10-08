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
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import {regioes, profissoes} from '../general/util'

const Personal = (props) => {
    
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [phone, setPhone] = useState("")
    const [description, setDescription] = useState("")
    const [descriptionWrong, setDescriptionWrong] = useState(false)
    const [phoneVisual, setPhoneVisual] = useState("")
    const [phoneWrong, setPhoneWrong] = useState(false)
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
    
    useEffect(() => {
        if(props.user){
            if(props.user.photoUrl===""||props.user.phone===""||props.user.trabalhos.length===0||props.user.trabalhos.length===0){
                setDisplayTop(true)
            }
            setPhoto(props.user.photoUrl)
            setName(props.user.name)
            setPhone(props.user.phone)
            setEmail(props.user.email)
            setDescription(props.user.description)
            setSurname(props.user.surname)
            setSelectedProf(props.user.trabalhos)
            setSelectedReg(props.user.regioes)
            if(props.user.entity!==undefined) {
                setRadioSelected(props.user.entity)
                setEntityName(props.user.entity_name)
            }
            else{
                setEntityWrong(true)
            }
            if(props.user.regioes?.length===0||props.user.trabalhos?.length===0){
                setEditBottom(true)
            }
        }
    }, [props.user])

    useEffect(() => {
        if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
        else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
        else{
            setPhoneVisual(`${phone.slice(0,3)}`)
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
            if(phone!==props.user.phone || description!==props.user.description){
                setLoadingRight(true)
                if(props.user?.type===0){
                    axios.post(`${props.api_url}/user/update_phone`, {
                        user_id : props.user._id,
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
                        user_id : props.user._id,
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
        if(selectedProf.length>0 && selectedReg.length>0){
            if(radioSelected===1||radioSelected===0){
                setEditBottom(false)
                setLoadingBottom(true)
                axios.post(`${props.api_url}/worker/update_selected`, {
                    user_id : props.user._id,
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
            else{
                setEntityWrong(true)
            }
        }
        else{
            setShake(true);
            setTimeout(() => setShake(false), 1000);
        }
    }   

    const userImageHandler = e => {
        let img = e.target.files[0]
        const storageRef = ref(storage, `user_images/${props.user._id}`);
        setLoadingPhoto(true)

        uploadBytes(storageRef, img).then(() => {
            getDownloadURL(storageRef).then(url => {
                if(props.user?.type===0){
                    axios.post(`${props.api_url}/user/update_photo`, {
                        user_id : props.user._id,
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
                        user_id : props.user._id,
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
        if(phone!==""&&!edit) val += 1
        if(photo!=="") val += 1
        if(selectedProf?.length>0&&!editBottom) val += 1
        if(selectedReg?.length>0&&!editBottom) val += 1
        if(radioSelected!==null&&!editBottom) val += 1
        return Math.ceil((val/5)*100)
    }

    return (
        <div className={styles.personal}>
            <div className={styles.personal_title}>
                {
                    props.user?.type===1?
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
                    props.user?.type===1?
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
            <div className={styles.mid}>
                {
                    props.user?.type===1?
                    <div className={styles.top}>
                        <div className={styles.top_info}  onClick={() => setDisplayTop(!displayTop)}>
                            {
                                displayTop?
                                <span className={styles.top_desc}>Assim que tiveres o perfil <span className={styles.action}>100% completo</span>, este será verificado pela pela equipa do Arranja.</span>
                                :null
                            }
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                <span className={styles.top_complete}>O teu perfil está <span className={styles.action}>{getPercentagem()}%</span> completo:</span>
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
                                        <PhoneIcon className={styles.line_icon}/>
                                        {
                                            phone!==""?
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                <span className={styles.line_text_complete}>telefone</span>
                                                <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                            </div>
                                            
                                            :
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                <span className={styles.line_text}>telefone</span>
                                                <ClearIcon className={styles.line_val}></ClearIcon>
                                            </div>

                                        }
                                    </div>
                                    <div className={styles.top_complete_line} style={{marginTop:"5px"}}>
                                        <CorporateFareIcon className={styles.line_icon}/>
                                        {
                                            radioSelected!==""?
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
                                            selectedProf?.length>0?
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
                                            selectedReg?.length>0?
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
                    </div>
                    :null
                }
                <span className={styles.personal_subtitle} style={{marginTop:props.user?.type===1?"20px":""}}>Fotografia e Dados</span>
                <div className={styles.flex}>
                    <div>
                        <div className={styles.image_wrapper}>
                        <Loader loading={loadingPhoto}/>
                            {
                                props.user&&photo!==""?
                                <img className={styles.image} src={photo}/>
                                :<FaceIcon className={styles.image_tbd}/>
                            }
                            <div className={styles.image_input_wrapper}>
                                <EditIcon className={styles.edit_icon}/>
                                <input type="file" title=" " value="" onChange={(val) => userImageHandler(val)} accept="image/png, image/jpeg"/>
                            </div>
                            
                        </div>
                    </div>
                    <div className={styles.top_right_flex}>
                        {
                            props.user?.type===1?
                            <div className={styles.status_div} style={{backgroundColor:!props.incompleteUser&&props.user?.verified?"#6EB241":props.incompleteUser===false?"#6EB241bb":"#fdd835bb"}}>
                                <span className={styles.status_div_title}>Estado do Perfil</span>
                                <div className={styles.status_div_flex}>
                                    <span className={styles.status_div_flex_title}>
                                        {
                                            !props.incompleteUser&&props.user?.state===1?
                                            "VERIFICADO"
                                            :!props.incompleteUser?
                                            "A VERIFICAR"
                                            :"INCOMPLETO"
                                        }
                                    </span>
                                    {
                                        !props.incompleteUser&&props.user?.state===1?
                                        <CheckBoxIcon className={styles.status_icon}/>
                                        :props.incompleteUser===false?
                                        <RotateRightIcon className={styles.status_icon_rotate}/>
                                        :<CheckBoxOutlineBlankIcon className={styles.status_icon}/>
                                    }
                                </div>
                            </div>
                            :null
                        }
                        <div className={styles.top_right}>
                            <div className={edit?styles.input_flex_edit:styles.input_flex}>
                                {
                                    !edit?
                                        <span className={styles.edit_top}  onClick={() => setEdit(true)}>
                                            EDITAR
                                        </span>
                                        :
                                        <span className={styles.save_top} onClick={() => editDoneHandler()}>
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
                                    <div className={styles.input_div}>
                                        <span className={styles.input_title}>E-mail</span>
                                        <div className={styles.input_div_wrapper}>
                                            {/* <AlternateEmailIcon className={styles.input_icon}/> */}
                                            <span className={styles.input_email}>{email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.top_edit_area}>
                                    <div className={styles.edit_area_left}>
                                        <span className={styles.input_title} style={{marginTop:"3px"}}>Telefone</span>
                                        {
                                            props.user?.type===1?
                                            <span className={styles.input_title} style={{marginTop:"10px"}}>Descrição</span>
                                            :null
                                        }
                                    </div>
                                    <div className={styles.edit_area_right}>
                                        <input className={phoneWrong?styles.input_wrong
                                                            :edit?styles.input_input_edit
                                                            :styles.input_input}
                                                value={phoneVisual}
                                                maxLength={11} 
                                                onChange={e => setPhoneHandler(e.target.value)}
                                                disabled={!edit}>
                                        </input>
                                        {
                                            props.user?.type===1?
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
                                            <span className={styles.helper}>Introduza o seu número de contacto!</span>
                                        :
                                        edit&&description?.length===0?
                                            <span className={styles.helper}>Introduza uma breve descrição!</span>
                                        :null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    props.user?.type===1?
                    <div>
                        <div className={styles.divider_max} style={{margin:"40px 0"}}></div>
                        <div className={styles.title_flex}>
                            <span className={styles.personal_subtitle}>Detalhes Trabalhador</span>
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
                        <div className={styles.radio_div}>
                            <div style={{cursor:!editBottom?"default":"pointer"}} className={styles.radio_area} onClick={() =>{ 
                                editBottom&&setRadioSelected(0)
                                setEntityWrong(false)}}>
                                <input readOnly type="radio" value="particular" name="tipo" checked={radioSelected===0}/>
                                <span className={editBottom?styles.fake_radio_button:styles.fake_radio_button_disabled}/>
                                <span className={editBottom?styles.radio_text:styles.radio_text_disabled}>Particular</span>
                            </div>
                            <div style={{display:"flex", alignItems:"center"}}>
                                <div style={{cursor:!editBottom?"default":"pointer"}} className={styles.radio_area} onClick={() => {
                                    editBottom&&setRadioSelected(1)
                                    setEntityWrong(false)}
                                    }>
                                    <input readOnly type="radio" value="empresa" name="tipo" checked={radioSelected===1}/>
                                    <span className={editBottom?styles.fake_radio_button:styles.fake_radio_button_disabled}/>
                                    <span className={editBottom?styles.radio_text:styles.radio_text_disabled}>Empresa</span>
                                </div>
                                {
                                    radioSelected===1?
                                    <input maxLength={30} disabled={!editBottom} value={entityName} onChange={e => setEntityName(e.target.value)} placeholder='Nome da empresa...' className={styles.radio_button_input} />
                                    :
                                    null
                                }
                            </div>
                            {
                                entityWrong?
                                <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor defina a sua situação de trabalho!</span>
                                :null
                            }
                        </div>  
                        
                        <div className={styles.flex_bottom}>
                            <div className={styles.flex_left}>
                                <span className={styles.flex_title}>Trabalhos que exerço</span>
                                <span className={editBottom?styles.divider_active:styles.divider}></span>
                                {
                                    editBottom&&selectedProf.length===0?
                                    <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escolhe pelo menos um trabalho!</span>
                                    :null
                                }
                                <div className={styles.flex_select_div}>
                                    <div>
                                        {mapTrabalhos()}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.flex_left}>
                                <span className={styles.flex_title}>Regiões onde trabalho</span>
                                <span className={editBottom?styles.divider_active:styles.divider}></span>
                                {
                                    editBottom&&selectedReg.length===0?
                                    <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escolhe pelo menos uma região!</span>
                                    :null
                                }
                                <div className={styles.flex_select_div}>
                                    <div>
                                        {mapRegioes()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :null
                }
            </div>
        </div>
    )
}

export default Personal