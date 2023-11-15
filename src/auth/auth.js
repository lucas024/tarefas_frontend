import React, { useEffect, useState } from 'react'
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
  } from '../store';
import AuthCarousel from './authCarousel'
import AuthCarouselVerification from './authCarouselVerification'
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao'


const Auth = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const dispatch = useDispatch()

    const [selectedAuth, setSelectedAuth] = useState(0)

    const [emailLogin, setEmailLogin] = useState("")
    const [emailLoginWrong, setEmailLoginWrong] = useState(false)
    const [passwordLogin, setPasswordLogin] = useState("")
    const [loginError, setLoginError] = useState(null)

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
    const [phoneWrong, setPhoneWrong] = useState(false)

    const [registarTab, setRegistarTab] = useState(0)

    const [loading, setLoading] = useState(false)

    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const location = useLocation()


    const codePlaceholder = [0,0,0,0,0,0]

    const [code, setCode] = useState('')
    const [expiryTimestamp, setExpiryTimestamp] = useState(null)
    const [expired, setExpired] = useState(false)
    const [newCodeSent, setNewCodeSent] = useState(false)
    const [wrongCodeInserted, setWrongCodeInserted] = useState(false)
    const [success, setSuccess] = useState(false)
    const [skippedVerification, setSkippedVerification] = useState(false)

    const [verificationTab, setVerificationTab] = useState(0)

    const [registerPopup, setRegisterPopup] = useState(false)

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
        if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
        else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
        else{
            setPhoneVisual(`${phone.slice(0,3)}`)
        }
        if(validator.isMobilePhone(phone, "pt-PT")){
            setPhoneWrong(false)
        }
    }, [phone])

    useEffect(() => {
        setPasswordRepeatWrong(false)
    }, [passwordRepeat, password])

    useEffect(() => {
        if(validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
            setPasswordWrong(false)
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
                setEmailWrong('Este e-mail já se encontra registado a uma conta de trabalhador.')
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
            setLoginError("Este e-mail já se encontra associado a uma conta de TRABALHADOR. Faça login na Àrea Trabalhador.")
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
        console.log('hmm')
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
                                setEmailWrong("Este e-mail já se encontra associado a uma conta de TRABALHADOR. Por-favor, utilize outro email.")
                            }
                            else{
                                axios.get(`${props.api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
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
                setLoading(false)
            }
            else{
                //conta existe
                navigate('/')
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
        setWrongCodeInserted(false)
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
        setWrongCodeInserted(false)
        setSuccess(false)
        setCode('')
    }

    const handleNext = (skipped) => {
        if(skipped) setSkippedVerification(true)
        setVerificationTab(1)
        const time = new Date()
        time.setSeconds(time.getSeconds() + 59)
        restart(time)
        setExpired(false)
        setWrongCodeInserted(false)
        setCode('')
    }

    const verifyCodeHandler = () => {
        // setWrongCodeInserted(true)
        setSuccess(true)
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
            <div className={styles.auth_main}>
                <div className={styles.area} style={{backgroundColor:selectedAuth===2?'#161F28':'#fff'}}>
                    {
                        selectedAuth!==2?
                        <div className={styles.area_top}>
                            <ul>
                                <li onClick={() => setSelectedAuth(1)} className={selectedAuth?styles.li_active:""}>
                                    <span className={selectedAuth?styles.li_text_active:styles.li_text}>Login</span>
                                </li>
                                <li onClick={() => setSelectedAuth(0)} className={!selectedAuth?styles.li_active:""}>
                                    <span className={!selectedAuth?styles.li_text_active:styles.li_text}>Registar</span>
                                </li>
                            </ul>
                        </div>
                        :null
                    }
                    {
                        selectedAuth===1?
                        <div className={styles.area_bot}>
                            {
                                loading&&<div className={styles.verification_backdrop}/>
                            }
                            <Loader radius={true} loading={loading}/>
                            <div className={styles.area_o2}>
                                <div className={styles.o2_button} onClick={() => signInWithPopupHandler("facebook")}>
                                    <img src={facebook} className={styles.o2_img}></img>
                                    <span className={styles.align_vert}>
                                        <span className={styles.o2_text}>Entrar com Facebook</span>
                                    </span>
                                </div>
                                <div className={styles.o2_button} style={{marginTop:"5px"}}  onClick={() => signInWithPopupHandler("google")}>
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
                                <span className={styles.recup_password}>Recuperar palavra-passe</span>
                            </div>
                            <div className={!loading?styles.login_button:styles.login_button_disabled} onClick={() => {
                                if(!loading) loginHandler()}}>
                                <p className={styles.login_text}>LOGIN</p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Não tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(0)}>Registar</span>
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
                                    />
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                {
                                    registarTab===0?
                                    <div className={!emailWrong?styles.login_button:styles.login_button_disabled}
                                        style={{marginTop:0}}
                                        onClick={() => {validateEmailHandler()&&checkEmail()}}>
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
                                        <div className={!nameWrong?styles.login_button:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {validatePasswordHandler()}}>
                                            <p className={styles.login_text}>Criar Conta</p>
                                        </div>
                                    </div>
                                    :null
                                    
                                }  
                            </div>
                                      
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Já tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(1)}>Login</span>
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
                            handleNext={val => handleNext(val)}
                            wrongCodeInserted={wrongCodeInserted}
                            success={success}
                            mapPlaceholder={() => mapPlaceholder()}
                            code={code}
                            skippedVerification={skippedVerification}
                            expired={expired}
                            seconds={seconds}
                            handleSendCode={() => handleSendCode()}
                            setCodeHandler={val => setCodeHandler(val)}
                            clearEmailAndPhone={() => clearFields()}
                        />
                    :
                    <div className={styles.button_area}>
                        <span className={styles.worker_button} onClick={() => navigate('/authentication/worker?type=1')}>Àrea Trabalhador</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default Auth