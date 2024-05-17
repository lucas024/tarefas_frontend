import React, { useEffect, useState, useRef } from 'react'
import styles from './auth.module.css'
import facebook from '../assets/facebook.png'
import google from '../assets/google.png'
import validator from 'validator'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import {
    registerWithEmailAndPassword, 
    loginWithEmailAndPassword,
    fetchSignInMethodsForEmailHandler,
    auth,
    provider,
    providerFacebook,
    } from '../firebase/firebase'
import {
    FacebookAuthProvider,
    signInWithPopup,
    linkWithPopup,
    } from "firebase/auth"
import { useSearchParams } from 'react-router-dom';
import Loader from '../general/loader'
import { useSelector } from 'react-redux'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useTimer } from 'react-timer-hook';
import { useDispatch } from 'react-redux'
import { 
    user_load,
    user_update_phone_verified,
  } from '../store';
import AuthCarousel from './authCarousel'
import AuthCarouselVerification from './authCarouselVerification'
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao'
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import TosBanner from '../general/tosBanner'
import logo_text from '../assets/logo_png_white_background.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Lottie from "lottie-react";
import * as sendEmail from '../assets/lotties/plane-email.json'

const Auth = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})

    const dispatch = useDispatch()

    const [selectedAuth, setSelectedAuth] = useState(0)

    const [emailLogin, setEmailLogin] = useState("")
    const [emailLoginWrong, setEmailLoginWrong] = useState(false)
    const [passwordLogin, setPasswordLogin] = useState("")
    const [loginError, setLoginError] = useState(null)

    const [emailRecover, setEmailRecover] = useState("")
    const [emailRecoverWrong, setEmailRecoverWrong] = useState(false)
    const [recoverEmailError, setRecoverEmailError] = useState(0)
    const [emailRecoverSent, setEmailRecoverSent] = useState(false)

    // email
    const [email, setEmail] = useState("")
    const [emailWrong, setEmailWrong] = useState(false)

    // password
    const [password, setPassword] = useState("")
    const [passwordWrong, setPasswordWrong] = useState(false)
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [passwordRepeatWrong, setPasswordRepeatWrong] = useState(false)

    const [name, setName] = useState("")
    const [nameWrong, setNameWrong] = useState(false)
    
    const [phone, setPhone] = useState("")
    const [phoneVisual, setPhoneVisual] = useState('')
    const [phoneWrong, setPhoneWrong] = useState(null)

    const [loginTab, setLoginTab] = useState(0)
    const [registarTab, setRegistarTab] = useState(0)

    const [loading, setLoading] = useState(false)

    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const location = useLocation()


    const codePlaceholder = [0,0,0,0,0,0]

    const [code, setCode] = useState('')
    const [expiryTimestamp, setExpiryTimestamp] = useState(null)
    const [expired, setExpired] = useState(false)
    const [success, setSuccess] = useState(null)
    const [skippedVerification, setSkippedVerification] = useState(false)
    const [tosAccepted, setTosAccepted] = useState(false)
    const [tosBanner, setTosBanner] = useState(false)

    const [verificationTab, setVerificationTab] = useState(0)

    const [registerPopup, setRegisterPopup] = useState(false)

    const recaptchaWrapperRef = useRef(null)
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaObject = useRef(null)

    const [codeSent, setCodeSent] = useState(null)
    const [codeStatus, setCodeStatus] = useState(null)

    const [emailSent, setEmailSent] = useState(null)
    const [emailCodeStatus, setEmailCodeStatus] = useState(null)

    const [sendingError, setSendingError] = useState(null)

    useEffect(() => {
        if(location.state && location.state.nameCarry){
            setSelectedAuth(0)
            setName(location.state.nameCarry)
            setPhone(location.state.phoneCarry)
            setEmail(location.state.emailCarry)
        }
    }, [location])

    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        if(paramsAux)
        {
            setSelectedAuth(parseInt(paramsAux.type))
            // setSelectedAuth(parseInt(2))
        }
    }, [searchParams])
    

    useEffect(() => {
        if(phone!==null)
        {
            if(phone?.length>=7) setPhoneVisual(`${phone?.slice(0,3)} ${phone?.slice(3,6)} ${phone?.slice(6)}`)
            else if(phone?.length>=4) setPhoneVisual(`${phone?.slice(0,3)} ${phone?.slice(3)}`)
            else{
                setPhoneVisual(`${phone?.slice(0,3)}`)
            }
            if(phone&&validator.isMobilePhone(phone, "pt-PT")){
                setPhoneWrong(false)
            }
        }
    }, [phone])

    useEffect(() => {
        setPasswordRepeatWrong(false)
    }, [passwordRepeat, password])

    useEffect(() => {
        if(password)
        {
            if(validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                setPasswordWrong(false)
            }
        }
        
    }, [password])

    const navigateHandler = () => {
        navigate(`/publicar?w=${location.state.worker}`,
            {
                state: {
                    carry: true,
                    desc: location.state.desc,
                    nameCarry: name,
                    phoneCarry: phone,
                    emailCarry: email,
                    title: location.state.title,
                    images: location.state.images,
                    imageFiles: location.state.imageFiles
                }
            })
    }

    //helper funcs
    const setPhoneHandler = (val) => {
        setPhoneWrong(false)
        let phone = val.replace(/\D/g, "")
        phone.replace(/\s/g, '')
        setPhone(phone)
    }

    const validateNameHandler = () => {
        if(name.length>0)
        {
            let val = name.split(' ')
            if(val[0].length>1&&val[1]?.length>0){
                setNameWrong(false)
                return true
            }
            else{
                setNameWrong(true)
                return false
            }
        }
        else{
            setNameWrong(true)
        }
    }

    const setEmailHandler = val => {
        setEmailWrong(false)
        if(val[0]===' ') val = val.replace(/ /g, '')
        else setEmail(val)
    }

    const setNameHandler = val => {
        setNameWrong(false)
        if(val[0]===' ') {val = val.replace(/ /g, '')}
        else{
            val = val.replace(/[0-9]/g, '')
            setName(val)
        }
        
    }

    const validatePhoneHandler = () => {
        if(phone!==null)
        {
            if(validator.isMobilePhone(phone, "pt-PT")){
                setPhoneWrong(false)
                setRegistarTab(2)
                return true
            }
            else{
                setPhoneWrong(true)
                return false
            }
        }
        
    }

    const validateEmailHandler = () => {
        if(validator.isEmail(email)){
            setEmailWrong(false)
            return true
        }
        else{
            setEmailWrong('Este e-mail não é válido')
            return false
        }
    }

    const validatePasswordHandler = () => {
        if(validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
            setPasswordWrong(false)
            if(passwordRepeat===password)
                registerHandler()
            else
                setPasswordRepeatWrong(true)
        }
        else
        {
            setPasswordWrong(true)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            loginHandler()
        }
    }

    const handleKeyDownRecover = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            
        }
    }

    const handleKeyDownRegister = (from, event) => {
        console.log(from, event)
        if (event.key === 'Enter') {
            event.target.blur()
            event.preventDefault()
            if(from === 'email'){
                validateEmailHandler()&&checkEmail()
            }
            else if(from === 'password'){
                validatePasswordHandler()
            }
            else if(from === 'name'){
                validateNameHandler()&&validatePhoneHandler()
            }
        }
    }

    const checkEmail = async () => {
        setLoading(true)
        let res = await axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} })
        console.log(res)

        if(res.data){
            setEmailWrong('Este e-mail já se encontra registado a uma conta de utilizador.')
            setLoading(false)
        }
        else
        {
            res = await axios.get(`${api_url}/auth/get_worker_by_email`, { params: {email: email.toLocaleLowerCase()} })
            console.log(res)
            if(res.data){
                setEmailWrong('Este e-mail já se encontra registado a uma conta de profissional.')
                setLoading(false)
            }
            else{
                setLoading(false)
                setEmailWrong(false)
                setRegistarTab(1)
                clearWarnings()
            }
        }
    }

    const clearWarnings = () => {
        setNameWrong(false)
        setEmailWrong(false)
        setPhoneWrong(false)
        setPasswordWrong(false)
        setPasswordRepeatWrong(false)
    }

    const loginHandler = async () => {
        setEmailLoginWrong(false)
        setLoading(true)

        let res = await axios.get(`${api_url}/auth/get_worker_by_email`, { params: {email: emailLogin} })
        if(res.data != null){
            setLoginError("Este e-mail já se encontra associado a uma conta de PROFISSIONAL. Inicia a Sessão na Área Profissional.")
            setLoading(false)
        }
        else if(validator.isEmail(emailLogin)){
            fetchSignInMethodsForEmailHandler(emailLogin)
                .then(res => {
                    console.log(res);
                    if(res.length>0){
                        if(res[0] === "google.com"){
                            setLoginError('Este e-mail encontra-se registado através da Google. Por favor inicia a sessão com "Entrar com Google"')
                            setLoading(false)
                        }
                        else if(res[0] === "password"){
                            loginWithEmailAndPassword(emailLogin, passwordLogin)
                            .then(() => {
                                if(location.state && location.state.carry)
                                {
                                    navigateHandler()
                                } 
                                else{
                                    navigate('/', {
                                        state: {
                                            carry: 'login'
                                        }
                                    })
                                }
                                setLoading(false)
                            })
                            .catch(err => {
                                setLoginError('O e-mail ou a palavra-passe estão incorretos.')
                                setLoading(false)
                            })
                        }
                    }
                    else{
                        setLoginError('O e-mail ou a palavra-passe estão incorretos.')
                        setLoading(false)
                    }                  
                })
            
        } else {
            if(emailLogin.length===0){
                setLoginError('Por favor, insira o e-mail.')
            }
            else{
                setLoginError('Este e-mail não é válido.')
            }
            setEmailLoginWrong(true)
            setLoading(false)
        }
    }

    const registerHelper = async (user_uid, from_signup) => {
        await axios.post(`${api_url}/auth/register`, 
            {
                name: from_signup?from_signup.name:name,
                phone: phone,
                email: from_signup?from_signup.email:email.toLocaleLowerCase(),
                google_uid: user_uid,
                address: "",
                photoUrl: from_signup?from_signup.photoURL:"",
                type: 0,
                email_verified: false,
                phone_verified: false,
                registerMethod: from_signup?from_signup.register_type:"email"
            })
        let res = await axios.get(`${api_url}/auth/get_user`, { params: {google_uid: user_uid} })
        if(res.data !== null){
          dispatch(user_load(res.data))
        }
    }

    const registerHandler = async () => {
        let val = name.split(' ')
        if(validator.isMobilePhone(phone, "pt-PT")
            && val[0].length>1&&val.length===2&&val[1]?.length>0
            && validator.isEmail(email)
            && validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                setLoading(true)
                console.log('oioioi')
                try{
                    let res = await registerWithEmailAndPassword(email.toLocaleLowerCase(), password)
                    await registerHelper(res.user.uid, false)
                    setLoading(false)
                    setRegisterPopup(true)
                    setTimeout(() => setRegisterPopup(false), 4000)
                    setSelectedAuth(2)
                    setRegistarTab(0)
                }
                catch (err) {
                    if(err.code == "auth/email-already-in-use"){
                        axios.get(`${api_url}/auth/get_worker_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
                            setLoading(false)
                            if(res.data != null){
                                setEmailWrong("Este e-mail já se encontra associado a uma conta de PROFISSIONAL. Por favor, utilize outro email.")
                            }
                            else{
                                axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
                                    if(res.data.registerMethod != "email"){
                                        setEmailWrong('Este e-mail encontra-se registado através da Google.')
                                    }
                                })
                                setEmailWrong("Este e-mail já se encontra registado. Esqueceu-se da palavra passe?")
                            }
                            setLoading(false)
                            setPassword(null)
                            setPasswordRepeat(null)
                            setName(null)
                            setPhone(null)
                            setPhoneVisual(null)
                            setRegistarTab(0)
                        })
                    }
                    else{
                        setLoginError("Problema no servidor.")
                        setLoading(false)
                    }
                }
            }

        else{
            console.log('no')
            setLoading(false)
        }
    }

    const signInWithPopupHandler = async type => {
        setLoading(true)
        try{
            let res = await signInWithPopup(auth, type==="google"?provider:providerFacebook)
            let existing_user = await axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: res.user.email.toLocaleLowerCase()} })
            let existing_worker = await axios.get(`${api_url}/auth/get_worker_by_email`, { params: {email: res.user.email.toLocaleLowerCase()} })

            if(existing_user.data == null && existing_worker.data == null){
                //conta nao existe - criar
                let from_signup = {
                    name: res.user.displayName,
                    email: res.user.email,
                    photoURL: res.user.photoURL
                }
                await registerHelper(res.user.uid, from_signup)
                navigate('/', {
                    state: {
                        carry: 'login'
                    }
                })
                setLoading(false)
            }
            else{
                //conta existe
                navigate('/', {
                    state: {
                        carry: 'login'
                    }
                })
                setLoading(false)
            }
        }
        catch (err) {
            setLoading(false)
        }
    }


    const clearFields = () => {
        setPassword(null)
        setPasswordRepeat(null)
        setName(null)
        setEmail(null)
        setPhone(null)
        setPhoneVisual(null)
    }

    ////////////////////////////////// TIMER //////////////////////////////////

    const {
        seconds,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => setExpired(true) })

    const mapPlaceholder = () => {
        return codePlaceholder.map((val, i) => {
            return(
                <span key={i} className={styles.main_code_placeholder_value} style={{opacity:i<code.length?0:1}}>{val}</span>
            )
        })
    }

    const setCodeHandler = value => {
        setCodeStatus(null)
        if(value.length<7)
        {
            setCode(value)
        }
    }

    const handleSendCode = () => {
        const time = new Date()
        time.setSeconds(time.getSeconds() + 59)
        restart(time)
        setExpired(false)
        setCodeStatus(null)
        setSuccess(null)
        setCode('')
    }

    const handleNext = (skipped) => {
        setSendingError(null)
        if(skipped) setSkippedVerification(true)
        setVerificationTab(1)
    }

    const restartTimer = () => {
        const time = new Date()
        time.setSeconds(time.getSeconds() + 59)
        restart(time)
        setExpired(false)
        setCodeStatus(null)
        setCode('')
    }

    const initiateEmailVerification = () => {
        setSendingError(null)
        setEmailSent(null)
        var actionCodeSettings = {
            url: 'https://pt-tarefas.pt/confirm-email',
            handleCodeInApp: false
        }
        console.log(auth.currentUser)
        sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
                setEmailSent(true)
                console.log('sent')
            })
            .catch(e => {
                console.log(e)
                setEmailSent(false)
                setSendingError('Erro a enviar o e-mail de verificação, por favor tente mais tarde.')
            })
    }

    const completeEmailVerification = () => {
        setEmailCodeStatus(null)
        if(auth.currentUser.emailVerified === true)
        {
            setEmailCodeStatus(true)
        }
        else
        {
            setEmailCodeStatus(false)
        }
    }

    const initiatePhoneVerification = () => {
        restartTimer()
        setCodeSent(null)
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
            provider.verifyPhoneNumber(`+351${phone}`, recaptcha).then(verificationId => {
                    setVerificationId(verificationId)
                    setCodeSent(true)
                }).catch(function (error) {
                    recaptcha.clear()
                    setVerificationId(null)
                    setSuccess(false)
                    setSendingError('Erro a enviar o código de verificação. Por favor, tente mais tarde.')
                    setCodeSent(false)
                })
        })
        .catch(e => {
            setSuccess(false)
            setCodeSent(false)
        })
    }

    const completePhoneVerification = (code) => {
        setSendingError(null)
        setSuccess(null)
        var phoneCredential = PhoneAuthProvider.credential(verificationId, code)
        try {
            linkWithCredential(auth.currentUser, phoneCredential)
                .then(() => {
                    dispatch(user_update_phone_verified(true))
                    setSuccess(true)
                    axios.post(`${api_url}/user/phone_verification_status`, {
                        user_id : user._id,
                        value: true
                    }).then(() => {
                        setCodeStatus(true)
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

    const handleRecoverPassword = async () => {
        setEmailRecoverWrong(false)
        setLoading(true)

        if(validator.isEmail(emailRecover)){
            sendPasswordResetEmail(auth, emailRecover)
            .then(res => {
                setEmailRecoverSent(true)
                setLoading(false)
            })
            .catch(err => {

                if(err.code === 'auth/user-not-found')
                    setRecoverEmailError('Este e-mail não se encontra associado a uma conta no Tarefas.')
                setLoading(false)
            })
           
        } else {
            if(emailRecover.length===0){
                setRecoverEmailError('Por favor, insira o e-mail.')
            }
            else{
                setRecoverEmailError('Este e-mail não é válido.')
            }
            setEmailRecoverWrong(true)
            setLoading(false)
        }
    }

    return (
        <div className={styles.auth}>
            <CSSTransition 
                in={registerPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao text={"Conta criada com sucesso!"}/>
            </CSSTransition>
            {
                tosBanner?
                <TosBanner 
                    confirm={() => {
                        setTosBanner(false)
                    }}
                    cancel={() => setTosBanner(false)}/>
                :null
            }
            <div className={styles.auth_main}>
                <div ref={recaptchaWrapperRef}>
                    <div id='recaptcha-container' className={styles.recaptcha_container}></div>
                </div>
                <div className={styles.area} style={{backgroundColor:selectedAuth===2?'#161F28':'#fff'}}>
                    {
                        selectedAuth!==2?
                        <div className={styles.area_top}>
                            <div className={styles.text_brand_wrapper}>
                                <img className={styles.text_brand} src={logo_text}/>
                            </div>
                            {
                                loginTab===0?
                                <ul>
                                    <li onClick={() => setSelectedAuth(1)} className={selectedAuth?styles.li_active:""}>
                                        <span className={selectedAuth?styles.li_text_active:styles.li_text}>Iniciar Sessão</span>
                                    </li>
                                    <li onClick={() => setSelectedAuth(0)} className={!selectedAuth?styles.li_active:""}>
                                        <span className={!selectedAuth?styles.li_text_active:styles.li_text}>Criar Conta</span>
                                    </li>
                                </ul>
                                :null
                            }
                            
                        </div>
                        :null
                    }
                    {
                        selectedAuth===1?
                        loginTab===0?
                        <div className={styles.area_bot}>
                            {
                                loading&&<div className={styles.verification_backdrop}/>
                            }
                            <Loader radius={true} loading={loading}/>
                            <div className={styles.area_o2}>
                                {/* <div className={styles.o2_button} onClick={() => signInWithPopupHandler("facebook")}>
                                    <img src={facebook} className={styles.o2_img}></img>
                                    <span className={styles.align_vert}>
                                        <span className={styles.o2_text}>Entrar com Facebook</span>
                                    </span>
                                </div> */}
                                <div className={styles.o2_button} style={{marginTop:"0px"}}  onClick={() => signInWithPopupHandler("google")}>
                                    <img src={google} className={styles.o2_img}></img>
                                    <span className={styles.align_vert}>
                                        <span className={styles.o2_text}>Entrar com Google</span>
                                    </span>
                                </div>
                                <span className={styles.ou}>
                                    ou
                                </span>
                            </div>
                            <div className={styles.login_div}>
                                <div className={styles.login}>
                                    <p className={styles.login_title}>E-mail</p>
                                    <input
                                        onKeyDown={handleKeyDown}
                                        style={{borderBottom:emailLoginWrong?"2PX solid red":"", backgroundColor:"#00000010"}}
                                        className={styles.login_input} 
                                        placeholder="E-mail"
                                        value={emailLogin}
                                        onChange={e => {
                                            setEmailLogin(e.target.value)
                                            if(validator.isEmail(e.target.value)){
                                                setEmailLoginWrong(false)
                                                setLoginError(false)
                                            }
                                            }}></input>
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Palavra-passe</p>
                                    <input 
                                        onKeyDown={handleKeyDown}
                                        className={styles.login_input}
                                        style={{backgroundColor:"#00000010"}}
                                        placeholder="Palavra-passe"
                                        type="password"
                                        value={passwordLogin}
                                        onChange={e => setPasswordLogin(e.target.value)}></input>
                                </div>
                            </div>
                            {
                                loginError?
                                <div className={styles.login_error}>
                                    <span className={styles.login_error_text}>
                                        {loginError}
                                    </span>
                                </div>
                                :null
                            }
                            <div style={{marginTop:"20px"}}>
                                <span className={styles.recup_password} onClick={() => setLoginTab(1)}>Recuperar palavra-passe</span>
                            </div>
                            <div className={!loading?styles.login_button:styles.login_button_disabled} onClick={() => {
                                if(!loading) loginHandler()}}>
                                <p className={styles.login_text}>INICIAR SESSÃO</p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Não tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(0)}>Criar Conta</span>
                            </div>
                        </div>
                        :
                        <div className={styles.area_bot}>
                            {
                                loading&&<div className={styles.verification_backdrop}/>
                            }
                            <Loader radius={true} loading={loading}/>
                            <div className={styles.back_icon_wrapper} onClick={() => {
                                setRecoverEmailError(null)
                                setEmailRecoverWrong(null)
                                setEmailRecover('')
                                setLoginTab(0)}}>
                                <ArrowBackIcon className={styles.back_icon}/>
                                {/* <span className={styles.back_icon_text}>Voltar ao login</span> */}
                            </div>
                            <div className={styles.recover_flex}>
                                <span className={styles.recover_title}>Recuperar palava-passe</span>
                                {
                                    emailRecoverSent?
                                    <span className={styles.recover_info}>E-mail de recuperação enviado para o <span style={{fontWeight:'700'}}>{emailRecover}</span>. Por favor segue as instruções lá descritas.</span>
                                    :
                                    <span className={styles.recover_info}>Porfavor indica-nos o e-mail associado a tua conta</span>
                                }
                            </div>
                            {
                                emailRecoverSent?
                                <Lottie 
                                    animationData={JSON.parse(JSON.stringify(sendEmail))}
                                    loop={false}
                                    autoplay={emailRecoverSent===true}
                                    rendererSettings={{preserveAspectRatio: 'xMidYMid slice'}}
                                    style={{
                                        width:'150px',
                                        height:'150px',
                                        margin:'auto',
                                        marginTop:'30px',
                                        marginBottom:'30px'
                                    }}
                                />
                                :null
                            }
                            {
                                emailRecoverSent?
                                null:
                                <div className={styles.login_div} style={{marginTop:'30px'}}>
                                    <div className={styles.login}>
                                        {/* <p className={styles.login_title}>E-mail</p> */}
                                        <input
                                            onKeyDown={handleKeyDownRecover}
                                            style={{borderBottom:emailRecoverWrong?"2PX solid red":"", backgroundColor:"#00000010"}}
                                            className={styles.login_input} 
                                            placeholder="E-mail"
                                            value={emailRecover}
                                            onChange={e => {
                                                setEmailRecover(e.target.value)
                                                if(validator.isEmail(e.target.value)){
                                                    setEmailRecoverWrong(false)
                                                    setRecoverEmailError(null)
                                                }
                                                }}></input>
                                    </div>
                                </div>
                            }
                            
                            {
                                recoverEmailError?
                                <span className={styles.recover_wrong}>{recoverEmailError}</span>
                                :
                                null
                            }
                            <div className={styles.recover_flex}>
                                {
                                    emailRecoverSent?
                                    null:
                                    <span className={styles.recover_button} onClick={() => handleRecoverPassword()}>Enviar</span>
                                }
                                <span className={emailRecoverSent?styles.recover_button:styles.recover_button_back} onClick={() => {
                                        setRecoverEmailError(null)
                                        setEmailRecoverWrong(null)
                                        setEmailRecover('')
                                        setLoginTab(0)}}>voltar</span>
                            </div>
                        </div>
                        :selectedAuth===0?
                        <div className={styles.area_bot}>
                            {
                                loading&&<div className={styles.verification_backdrop}/>
                            }
                            <Loader loading={loading}/>
                            <div className={styles.area_bot_wrapper}>
                                <p className={styles.area_bot_title}>Criar conta de utilizador</p>
                                <p className={styles.area_bot_title_helper}>({registarTab+1}/3)</p>
                                <p className={styles.area_bot_title_helper_mini}>{['E-mail', 'Detalhes do utilizador', 'Palavra-passe'][registarTab]}</p>
                                <div className={styles.login_div}>
                                    <AuthCarousel 
                                        registarTab={registarTab}
                                        email={email}
                                        emailWrong={emailWrong}
                                        name={name}
                                        nameWrong={nameWrong}
                                        password={password}
                                        passwordWrong={passwordWrong}
                                        passwordRepeat={passwordRepeat}
                                        passwordRepeatWrong={passwordRepeatWrong}
                                        phone={phone}
                                        phoneVisual={phoneVisual}
                                        phoneWrong={phoneWrong}
                                        setEmailHandler={val => setEmailHandler(val)}
                                        handleKeyDownRegister={(from, e) => handleKeyDownRegister(from, e)}
                                        setPasswordRepeat={val => setPasswordRepeat(val)}
                                        setPassword={val => setPassword(val)}
                                        setNameHandler={val => setNameHandler(val)}
                                        setPhoneHandler={val => setPhoneHandler(val)}
                                        setTosAccepted={val => setTosAccepted(val)}
                                        tosAccepted={tosAccepted}
                                        setTosBanner={() => setTosBanner(true)}
                                    />
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                {
                                    registarTab===0?
                                    <div className={!emailWrong?styles.login_button:styles.login_button_disabled}
                                        style={{marginTop:0}}
                                        onClick={() => {!emailWrong&&validateEmailHandler()&&checkEmail()}}>
                                        <p className={styles.login_text}>Continuar</p>
                                    </div>
                                    :
                                    registarTab===1?
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={!nameWrong?styles.login_button:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {validateNameHandler()&&validatePhoneHandler()&&clearWarnings()}}>
                                            <p className={styles.login_text}>Continuar</p>
                                        </div>
                                    </div>
                                    :registarTab===2?
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={tosAccepted?styles.login_button:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {tosAccepted&&validatePasswordHandler()}}>
                                            <p className={styles.login_text}>Criar Conta</p>
                                        </div>
                                    </div>
                                    :null
                                    
                                }  
                            </div>
                                      
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Já tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(1)}>Iniciar Sessão</span>
                            </div>
                        </div>
                        :null
                    }
                </div>
                {
                    selectedAuth===2?
                        <AuthCarouselVerification 
                            verificationTab={verificationTab}
                            registarTab={registarTab}
                            email={email}
                            name={name}
                            phone={phoneVisual}
                            handleNext={skipped => handleNext(skipped)}
                            success={success}
                            mapPlaceholder={() => mapPlaceholder()}
                            code={code}
                            skippedVerification={skippedVerification}
                            expired={expired}
                            seconds={seconds}
                            handleSendCode={() => handleSendCode()}
                            setCodeHandler={val => setCodeHandler(val)}
                            clearEmailAndPhone={() => clearFields()}
                            initiatePhoneVerification={initiatePhoneVerification}
                            completePhoneVerification={completePhoneVerification}
                            initiateEmailVerification={initiateEmailVerification}
                            completeEmailVerification={completeEmailVerification}
                            codeStatus={codeStatus}
                            codeSent={codeSent}
                            sendingError={sendingError}
                            emailCodeStatus={emailCodeStatus}
                            emailSent={emailSent}
                        />
                    :
                    null
                }

                {
                    selectedAuth===2 || loginTab===1?
                    null
                    :
                    <div className={styles.split_wrapper} style={{backgroundColor:"#161F28"}}>
                        <span className={styles.split}/>
                        <div className={styles.split_text_wrapper} style={{backgroundColor:"#161F28"}}>
                            <span className={styles.split_text}>OU</span>
                        </div>
                    </div>
                }
                {
                    selectedAuth===2 || loginTab===1?
                    null
                    :
                    <div className={styles.button_area}>
                        <span className={styles.worker_button} onClick={() => navigate('/authentication/worker?type=1')}>Área Profissional</span>
                    </div>
                }
            </div>
            <div className={styles.top_right}>
                <span className={styles.top_right_button} 
                    style={{color:"#0358e5", 
                            fontWeight:!(selectedAuth===2 || loginTab===1)?700:500}} onClick={() => navigate('/authentication/user?type=1')}>Área Utilizador</span>
                <span className={styles.top_right_button} 
                    style={{color:"#FF785A", marginLeft:'5px', 
                            fontWeight:(selectedAuth===2 || loginTab===1)?700:500}} onClick={() => navigate('/authentication/worker?type=1')}>Área Profissional</span>
            </div>
        </div>
    )
}

export default Auth