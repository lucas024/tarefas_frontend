import React, {useEffect, useState, useRef} from 'react'
import styles from './personal.module.css'
import FaceIcon from '@mui/icons-material/Face';
import EditIcon from '@mui/icons-material/Edit';
import validator from 'validator'

import { storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../general/loader';
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';

import EmailVerified from '@mui/icons-material/MarkEmailRead';
import EmailUnverified from '@mui/icons-material/Unsubscribe';
import PhoneVerified from '@mui/icons-material/MobileFriendly';
import PhoneUnverified from '@mui/icons-material/PhonelinkErase';
import VerificationBannerPhone from '../general/verificationBannerPhone';
import { useSelector, useDispatch } from 'react-redux'
import { user_update_field, user_update_phone_verified, user_update_email_verified, worker_update_profile_complete, user_reset } from '../store';
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, sendEmailVerification, unlink, getAuth, deleteUser } from 'firebase/auth';
import { auth } from '../firebase/firebase'
import VerificationBannerEmail from '../general/verificationBannerEmail';
import 'simplebar-react/dist/simplebar.min.css';
import DeleteBanner from '../general/deleteBanner';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';


const Personal = (props) => {

    const navigate = useNavigate()

    const api_url = useSelector(state => {return state.api_url})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
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
    const [photo, setPhoto] = useState("")
    const [loadingPhoto, setLoadingPhoto] = useState(false)
    const [photoPop, setPhotoPop] = useState(false)
    const [loadingRight, setLoadingRight] = useState(false)
    const [rightPop, setRightPop] = useState(false)
    const [deleteBanner, setDeleteBanner] = useState(false)
    const [loading, setLoading] = useState(false)

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
            setPhoto(user.photoUrl)
            setName(user.name)
            setPhone(user.phone)
            setEmail(user.email)
            if(user.phone===""){
                setEdit(true)
                setPhoneWrong(true)
            }
        }
    }, [user])

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
        else{
            setPhoneVisual('')
        }

    }, [phone])

    const setPhoneHandler = (val) => {
        let phone = val
        if(val.length>0)
            phone = val.replace(/\s/g, '')

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
                // if(user?.type===0){
                //     axios.post(`${api_url}/user/update_phone`, {
                //         user_id : user._id,
                //         phone: phone
                //     }).then(() => {
                //         dispatch(
                //             user_update_field(
                //                 [{field: 'phone', value: phone}]
                //             )
                //         )
                //         // dispatch(user_update_phone_verified(false))
                //         // if(auth.currentUser.phoneNumber!=null)
                //         //     unlink(auth.currentUser, "phone")
                //         setLoadingRight(false)
                //         setRightPop(true)
                //         setTimeout(() => setRightPop(false), 4000)
                //     })
                // }
                // else {
                axios.post(`${api_url}/user/update_phone_and_description`, {
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
                    // dispatch(user_update_phone_verified(false))
                    // if(auth.currentUser.phoneNumber!=null)
                    //     unlink(auth.currentUser, "phone")
                    setLoadingRight(false)
                    setRightPop(true)
                    setTimeout(() => setRightPop(false), 4000)
                })
                // }
            }
        }
    }   

    const userImageHandler = e => {
        let img = e.target.files[0]
        const storageRef = ref(storage, `user_images/${user._id}`);
        setLoadingPhoto(true)

        uploadBytes(storageRef, img).then(() => {
            getDownloadURL(storageRef).then(url => {
                // if(user?.type===0){
                //     axios.post(`${api_url}/user/update_photo`, {
                //         user_id : user._id,
                //         photoUrl: url
                //     }).then(res => {
                //         setPhoto(url)
                //         dispatch(
                //             user_update_field(
                //                 [{field: 'photoUrl', value: url}]
                //             )
                //         )
                //         setPhotoPop(true)
                //         setTimeout(() => setPhotoPop(false), 4000)
                //     })
                // }
                // else{
                axios.post(`${api_url}/user/update_photo`, {
                    user_id : user._id,
                    photoUrl: url
                }).then(() => {
                    setPhoto(url)
                    dispatch(
                        user_update_field(
                            [{field: 'photoUrl', value: url}]
                        )
                    )
                    setPhotoPop(true)
                    setTimeout(() => setPhotoPop(false), 4000)
                })
                // }
                setLoadingPhoto(false)
            })
        })
        .catch()
    }

    const initiateEmailVerification = () => {
        setSendingError(null)
        var actionCodeSettings = {
            url: 'https://pt-tarefas.pt/confirm-email',
            handleCodeInApp: false
        }

        sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
                setVerifyEmail(2)
            })
            .catch(e => {
                setSendingError('Erro a enviar o e-mail de verificação, por favor tente mais tarde.')
            })
    }

    const completeEmailVerification = async () => {
        setEmailCodeStatus(null)
        
        await auth.currentUser.reload()
        if(auth?.currentUser?.emailVerified === true)
        {
            setEmailCodeStatus(true)
            dispatch(user_update_email_verified(true))
            axios.post(`${api_url}/user/verify_email`, {user_id: user._id})
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
                    setVerificationId(verificationId)
                    setVerifyPhone(2)
                }).catch(function (error) {
                    alert(error)
                    recaptcha.clear()
                    setVerificationId(null)
                })
        })
        .catch(e => {
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

    const getAmountPay = subscription => {
        if(subscription.new_price_id !== null && subscription.new_price_id !== undefined)
        {
            if(new Date(subscription.new_price_date*1000) < new Date())
            {
                return subscription.new_price_id
            }
            else
            {
                return subscription.price_id
            }
        }
        else
        {
            return subscription.price_id
        }
    }

    return (
        <div className={styles.personal}>
            {
                loading?
                <div className={styles.backdrop}/>
                :null
            }
            
            <Loader loading={loading}/>
            {
                props.loaded?
                <div>
                <div className={styles.personal_title}>
                    <span className={styles.top_title}>Conta</span>
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
                        user?.worker?
                        <Sessao text={"Número de telefone e/ou descrição atualizados com sucesso!"}/>
                        :
                        <Sessao text={"Número de telefone atualizado com sucesso! Por favor, volta a verificar."}/>
                    }
                </CSSTransition>
                {/* {
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
                } */}
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

                <CSSTransition
                    in={deleteBanner?true:false}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <DeleteBanner 
                        type={user?.type}
                        cancel={() => {
                            setDeleteBanner(false)
                        }}
                        confirmDelete={() => {
                            setLoading(true)
                            if(user?.type===1&&user?.subscription?.plan!==null&&user?.subscription?.plan!==undefined)
                            {
                                axios.post(`${api_url}/cancel-subscription`, {
                                    subscription: user.subscription,
                                    current_amount: getAmountPay(user.subscription),
                                })
                                .then(suc => {
                                    console.log(suc)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                            }
                            axios.post(`${api_url}/general/delete_user`, {
                                user_id : user._id,
                                type: user.type
                            }).then(() => {
                                deleteUser(auth.currentUser)
                                .then(() => {
                                    let type = user.type
                                    dispatch(user_reset())
                                    window.localStorage.setItem('loggedIn', 0)
                                    setLoading(false)
                                    navigate(`/authentication?type=${1}`)
                                })
                                .catch(err => console.log(err))
                            })
                            setDeleteBanner(false)
                        }}
                        />
                </CSSTransition>
                <div className={styles.mid}>
                    <div ref={recaptchaWrapperRef}>
                        <div id='recaptcha-container' className={styles.recaptcha_container}></div>
                    </div>
                    {
                        edit&&!user_email_verified?
                        <div className={styles.verificar_top_no_animation}>
                            <span className={styles.input_div_button_text_no_animation} style={{textTransform:'uppercase', backgroundColor:"transparent"}}>Verificar E-mail</span>
                        </div>
                        
                        :
                        !user_email_verified?
                        <div className={styles.verificar_top} onClick={() => !edit&&setVerifyEmail(1)}>
                            <span className={styles.input_div_button_text_no_animation} style={{textTransform:'uppercase', backgroundColor:"transparent"}}>Verificar E-mail</span>
                        </div>
                        :null
                    }
                    
                    <span className={styles.personal_subtitle}>Fotografia e Dados</span>
                    <div className={styles.flex}>
                        <div>
                            <div className={styles.image_wrapper}>
                            <Loader loading={loadingPhoto}/>
                                {
                                    user&&photo!==""?
                                    <img className={styles.image} src={photo} alt='photo_google'/>
                                    :
                                    !user?.worker?
                                    <FaceIcon className={styles.image_tbd} style={{color: "#161F28"}}/>
                                    :<EmojiPeopleIcon style={{color: "#161F28", transform: 'scaleX(-1)'}} className={styles.image_tbd}/>
                                }
                                <div className={styles.image_input_wrapper}>
                                    <EditIcon className={styles.edit_icon}/>
                                    <input className={styles.edit_icon_value} type="file" title=" " value="" onChange={(val) => userImageHandler(val)} accept="image/png, image/jpeg"/>
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
                                                <span className={styles.input_email}>{name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.top_edit_area}>
                                        <div className={styles.input_div}>
                                            {
                                                edit&&!user_email_verified?
                                                <div className={styles.input_div_button} onClick={() => !edit&&setVerifyEmail(1)}>
                                                    <span className={styles.input_div_button_text_no_animation} style={{textTransform:'uppercase', backgroundColor:edit?"#71848d":""}}>Verificar E-mail</span>
                                                </div>
                                                :
                                                !user_email_verified?
                                                <div className={styles.input_div_button} onClick={() => !edit&&setVerifyEmail(1)}>
                                                    <span className={styles.input_div_button_text} style={{textTransform:'uppercase', backgroundColor:edit?"#71848d":""}}>Verificar E-mail</span>
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
                                            {/* {
                                                !user_phone_verified&&!edit?
                                                <div className={styles.input_div_button} onClick={() => !edit&&setVerifyPhone(1)}>
                                                    <span className={styles.input_div_button_text} style={{textTransform:'uppercase', backgroundColor:edit?"#71848d":""}}>Verificar</span>
                                                </div>
                                                :null
                                            } */}
                                            
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
                                                user?.worker?
                                                <span className={styles.input_title} style={{marginTop:"10px"}}>Descrição e Experiência</span>
                                                :null
                                            }
                                        </div>
                                        <div className={styles.edit_area_right}>

                                            {
                                                user?.worker?
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

                    <div className={styles.delete_account_divider}/>
                    
                    <div className={styles.delete_account_wrapper} onClick={() => setDeleteBanner(true)}>
                        <span className={styles.delete_account_button}>Eliminar Conta</span>
                    </div>
                </div>
                </div>
                :null

            }
        </div>
    )
}

export default Personal