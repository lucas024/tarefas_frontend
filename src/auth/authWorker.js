import React, { useEffect, useState, useRef } from 'react'
import styles from './auth.module.css'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {
    registerWithEmailAndPassword, 
    loginWithEmailAndPassword,
    fetchSignInMethodsForEmailHandler,
    auth,
    } from '../firebase/firebase'
import { useSearchParams } from 'react-router-dom';
import Loader from '../general/loader'
import { useSelector } from 'react-redux'
import AuthCarousel from './authCarousel'
import AuthCarouselVerification from './authCarouselVerification'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AuthCarouselWorker from './authCarouselWorker';
import {CSSTransition}  from 'react-transition-group';
import Sessao from '../transitions/sessao'
import { useDispatch } from 'react-redux'
import { 
    user_load,
    user_update_field,
    user_update_phone_verified
  } from '../store';
import { useTimer } from 'react-timer-hook';
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential, sendEmailVerification, unlink } from 'firebase/auth';
import TosBanner from '../general/tosBanner'
import WorkerBanner from '../general/workerBanner';
import logo_text from '../assets/logo_action_png_white_background.png'

const AuthWorker = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const dispatch = useDispatch()

    const [searchParams] = useSearchParams()
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


    // lists
    const [selectedProf, setSelectedProf] = useState([])
    const [selectedReg, setSelectedReg] = useState([])
    const [selectedType, setSelectedType] = useState(0)
    const [entityName, setEntityName] = useState('')
    const [entityNameWrong, setEntityNameWrong] = useState('')

    const [selectedProfWrong, setSelectedProfWrong] = useState(false)
    const [selectedRegWrong, setSelectedRegWrong] = useState(false)
    const [selectedTypeWrong, setSelectedTypeWrong] = useState(false)

    const [registarTab, setRegistarTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [detailsPopup, setDetailsPopup] = useState(false)


    // verification
    const [code, setCode] = useState('')
    const [expiryTimestamp, setExpiryTimestamp] = useState(null)
    const [expired, setExpired] = useState(false)
    const [newCodeSent, setNewCodeSent] = useState(false)
    const [wrongCodeInserted, setWrongCodeInserted] = useState(false)
    const [success, setSuccess] = useState(null)
    const [skippedVerification, setSkippedVerification] = useState(false)
    const [verificationTab, setVerificationTab] = useState(0)
    const [tosAccepted, setTosAccepted] = useState(false)
    const [tosBanner, setTosBanner] = useState(false)
    const [showLanding, setShowLanding] = useState(false)

    const [codeSent, setCodeSent] = useState(null)
    const [codeStatus, setCodeStatus] = useState(null)

    const [emailSent, setEmailSent] = useState(null)
    const [emailCodeStatus, setEmailCodeStatus] = useState(null)

    const [sendingError, setSendingError] = useState(null)

    const recaptchaWrapperRef = useRef(null)
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaObject = useRef(null)

    const codePlaceholder = [0,0,0,0,0,0]


    const [registerPopup, setRegisterPopup] = useState(false)


    const navigate = useNavigate()

    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        if(paramsAux)
        {
            setSelectedAuth(parseInt(paramsAux.type))
            if(parseInt(paramsAux.landing)===1)
                setShowLanding(true)
        }
    }, [searchParams])

    useEffect(() => {
        if(phone!==null)
        {
            if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
            else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
            else{
                setPhoneVisual(`${phone.slice(0,3)}`)
            }
            if(validator.isMobilePhone(phone, "pt-PT")){
                setPhoneWrong(false)
            }
        }
        
    }, [phone])

    useEffect(() => {
        setPasswordRepeatWrong(false)
        setPasswordWrong(false)
    }, [passwordRepeat, password])

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

    const setEntityNameHandler = val => {
        if(entityName.length===0)
            setEntityName(val.replace(/\s/g, ''))
        else
            setEntityName(val)

        let aux = val.replace(/\s/g, '').length
        if(aux>1) setEntityNameWrong(false)
        else setEntityNameWrong(true)
    }

    const setPhoneHandler = (val) => {
        setPhoneWrong(false)
        let phone = val.replace(/\D/g, "")
        phone.replace(/\s/g, '')
        setPhone(phone)
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
        if (event.key === 'Enter') {
            event.preventDefault()
            if(from === 'email'){
                validateEmailHandler()&&checkEmail()
            }
            else if(from === 'password'){
                tosAccepted&&validatePasswordHandler()
            }
            else if(from === 'name'){
                validateNameHandler()&&validatePhoneHandler()&&clearWarnings()
            }
        }
    }

    const checkEmail = async () => {
        setLoading(true)
        let res = await axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} })

        if(res.data){
            setEmailWrong('Este e-mail já se encontra registado a uma conta de cliente.')
            setLoading(false)
        }
        else
        {
            res = await axios.get(`${api_url}/auth/get_worker_by_email`, { params: {email: email.toLocaleLowerCase()} })
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

    const verifySelectedType = () => {
        if(selectedType===0||(selectedType===1&&entityName.length>1)){
            setSelectedTypeWrong(false)
            setRegistarTab(4)
            return true
        }
        else
        {
            setSelectedTypeWrong(true)
            setLoading(false)
            return false
        }
    }

    const verifySelectedProfessions = () => {
        if(selectedProf.length>0){
            setSelectedProfWrong(false)
            setRegistarTab(5)
            return true
        }
        else
        {
            setSelectedProfWrong(true)
            setLoading(false)
            return false
        }
    }

    const verifySelectedRegions = () => {
        if(selectedReg.length>0){
            setSelectedRegWrong(false)
            setRegistarTab(6)
            return true
        }
        else
        {
            setSelectedRegWrong(true)
            setLoading(false)
            return false
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

        let res = await axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: emailLogin} })
        setEmailLoginWrong(false)
        if(res.data != null){
            setLoginError("Este e-mail já se encontra associado a uma conta de cliente. Inicia Sessão na Área Utlizador.")
            setLoading(false)
        }
        else if(validator.isEmail(emailLogin)){
            fetchSignInMethodsForEmailHandler(emailLogin)
                .then(res => {
                    if(res.length>0){
                        if(res[0] === "google.com"){
                            setLoginError('Este e-mail encontra-se registado através da Google. Por favor inicia a sessão com "Entrar com Google".')
                            setLoading(false)
                        }
                        else if(res[0] === "password"){
                            loginWithEmailAndPassword(emailLogin, passwordLogin)
                            .then(() => {
                                navigate('/', {
                                    state: {
                                        carry: true
                                    }
                                })
                                setLoading(false)
                                
                            })
                            .catch(() => {
                                setLoginError('O e-mail ou a palavra-passe estão incorretos.')
                                setLoading(false)
                            })
                        }
                    }
                    else{
                        setLoginError('O e-mail ou a palavra-sse estão incorretos.')
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
        //stripe obj
        const obj = await axios.post(`${api_url}/create-customer`, {
            name: from_signup?from_signup.name:name,
            phone: from_signup?from_signup.phone:phone,
            email: from_signup?from_signup.email.toLocaleLowerCase():email.toLocaleLowerCase(),
        })
        await axios.post(`${api_url}/auth/register/worker`, 
            {
                name: from_signup?from_signup.name:name,
                phone: phone,
                email: from_signup?from_signup.email:email.toLocaleLowerCase(),
                google_uid: user_uid,
                photoUrl: from_signup?from_signup.photoURL:"",
                regioes: [],
                trabalhos: [],
                type: 1,
                state: 0,
                stripe_id: obj.data.customer.id,
                entity: 0,
                entity_name: "",
                registerMethod: from_signup?from_signup.register_type:"email",
                email_verified: false
            })
        let res = await axios.get(`${api_url}/auth/get_worker`, { params: {google_uid: user_uid} })
        if(res.data !== null){
            dispatch(user_load(res.data))
        }
    }

    const registerHandler = async () => {
        let val = name.split(' ')
        if(validator.isMobilePhone(phone, "pt-PT")
            && val[0].length>1&&val.length===2&&val[1]?.length>0
            && validator.isEmail(email)
            && validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0}))
            {
                setLoading(true)
                try{
                    let res = await registerWithEmailAndPassword(email.toLocaleLowerCase(), password)
                    await registerHelper(res.user.uid, false)
                    setLoading(false)
                    setRegisterPopup(true)
                    setTimeout(() => setRegisterPopup(false), 4000)
                    setRegistarTab(3)
                }
                catch (err) {
                    if(err.code == "auth/email-already-in-use"){
                        axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
                            setLoading(false)
                            if(res.data != null){
                                setEmailWrong('Este e-mail já se encontra registado a uma conta de cliente.')
                            }
                            else{
                                setEmailWrong('Este e-mail já se encontra registado a uma conta de profissional.')
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
                        setLoginError("Problema no servidor. Por favor tente mais tarde.")
                        setLoading(false)
                    }
                }
            }
        else{
            setLoading(false)
        }
    }

    const updateWorkerDetails = () => {
        setLoading(true)
        verifySelectedRegions()&&
        verifySelectedProfessions()&&
        verifySelectedType()&&
        axios.post(`${api_url}/worker/update_selected`, {
            user_id : user._id,
            trabalhos : selectedProf,
            regioes: selectedReg,
            entity: selectedType,
            entity_name: entityName
        }).then(() => {
            dispatch(
                user_update_field(
                    [
                        {field: 'trabalhos', value: selectedProf},
                        {field: 'regioes', value: selectedReg},
                        {field: 'entity', value: selectedType},
                        {field: 'entity_name', value: entityName}
                    ]
                )
            )
            setLoading(false)
            setDetailsPopup(true)
            setTimeout(() => setDetailsPopup(false), 4000)
            setSelectedAuth(2)
        })

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
        setSuccess(null)
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

    
    const clearFields = () => {
        setPassword(null)
        setPasswordRepeat(null)
        setName(null)
        setEmail(null)
        setPhone(null)
        setPhoneVisual(null)
        setEntityName(null)
        setSelectedProf(null)
        setSelectedReg(null)
        setSelectedType(0)
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
        sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
                setEmailSent(true)
            })
            .catch(e => {
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
        setCodeStatus(null)
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
            <CSSTransition 
                    in={detailsPopup}
                    timeout={1000}
                    classNames="transition"
                    unmountOnExit
                    >
                    <Sessao text={"Detalhes profissional atualizados com sucesso!"}/>
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
            {
                showLanding?
                <WorkerBanner 
                    authPage={true}
                    confirm={() => {
                        setShowLanding(false)
                    }}
                    cancel={() => setShowLanding(false)}/>
                :null
            }
            <div className={styles.auth_main_worker}>
                <div ref={recaptchaWrapperRef}>
                    <div id='recaptcha-container' className={styles.recaptcha_container}></div>
                </div>
                <div className={styles.auth_main_worker_frontdrop}></div>

                <div className={styles.worker_back_helper}>

                
                <div className={styles.area} style={{backgroundColor:selectedAuth===2?'transparent':'#fff', marginTop:'0px'}}>
                    {
                        selectedAuth!==2?
                        <div className={styles.area_top} style={{borderBottom:"1px solid #FF785A50"}}>
                            <div className={styles.text_brand_wrapper}>
                                <img className={styles.text_brand} src={logo_text}/>
                            </div>
                            <ul>
                                <li onClick={() => setSelectedAuth(1)} style={{color:"#FF785A"}} className={selectedAuth?styles.li_active_worker:""}>
                                    <span className={selectedAuth?styles.li_text_active_worker:styles.li_text}>Iniciar Sessão</span>
                                </li>
                                <li onClick={() => setSelectedAuth(0)} style={{color:"#FF785A"}} className={!selectedAuth?styles.li_active_worker:""}>
                                    <span className={!selectedAuth?styles.li_text_active_worker:styles.li_text}>Criar Conta</span>
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
                            <div className={styles.login_div}>
                                <div className={styles.login}>
                                    <p className={styles.login_title}>E-mail</p>
                                    <input 
                                        onKeyDown={handleKeyDown}
                                        style={{borderBottom:emailLoginWrong?"2px solid red":"", backgroundColor:"#00000010"}}
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
                                    <p className={styles.login_title}>Password</p>
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
                            <div className={!loading?styles.login_button_worker:styles.login_button_disabled} onClick={() => {
                                if(!loading) loginHandler()}}>
                                <p className={styles.login_text}>INICIAR SESSÃO</p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Não tens conta de profissional? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(0)}>Criar Conta</span>
                            </div>
                        </div>
                        :
                        selectedAuth===0?
                        <div className={styles.area_bot}>
                            {
                                loading&&<div className={styles.verification_backdrop}/>
                            }
                            <Loader radius={true} loading={loading}/>
                            <div className={styles.area_bot_wrapper} style={{backgroundColor:"#FF785A30"}}>
                                {
                                    registarTab<=2?
                                    <p className={styles.area_bot_title} style={{backgroundColor:"#FF785A"}}>Criar conta de profissional</p>
                                    :
                                    <div>
                                        <p className={styles.area_bot_title} style={{backgroundColor:"#FF785A"}}>Preencher detalhes</p>
                                    </div>
                                }
                                {
                                    registarTab<=2?
                                    <p className={styles.area_bot_title_helper} style={{color:"#FF785A"}}>({registarTab+1}/3)</p>
                                    :
                                    <p className={styles.area_bot_title_helper} style={{color:"#FF785A"}}>({registarTab-2}/4)</p>
                                }
                                
                                <p className={styles.area_bot_title_helper_mini}>{['E-mail', 'Palavra-passe', 'Detalhes do cliente', 'Particular ou Empresa', 'Tarefas que excerço', 'Distritos ou regiões onde trabalho', 'Concluir'][registarTab]}</p>
                                {
                                    registarTab<=2?
                                    <div className={styles.login_div}>
                                        <AuthCarousel
                                            type={'worker'}
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
                                    :
                                    <div className={styles.login_div}>
                                        <AuthCarouselWorker
                                            registarTab={registarTab}
                                            email={email}
                                            phone={phone}
                                            name={name}
                                            phoneVisual={phoneVisual}
                                            selectedProf={selectedProf}
                                            selectedProfWrong={selectedProfWrong}
                                            selectedReg={selectedReg}
                                            selectedRegWrong={selectedRegWrong}
                                            selectedType={selectedType}
                                            selectedTypeWrong={selectedTypeWrong}
                                            entityName={entityName}
                                            entityNameWrong={entityNameWrong}
                                            updateSelectedProfessions={list => setSelectedProf(list)}
                                            updateSelectedRegions={list => setSelectedReg(list)}
                                            updateSelectedType={val => setSelectedType(val)&&setEntityNameWrong(false)}
                                            updateEntityName={val => setEntityNameHandler(val)}
                                            verifySelectedProfessions={() => verifySelectedProfessions()}
                                            verifySelectedRegions={() => verifySelectedRegions()}
                                            verifySelectedType={() => verifySelectedType()}
                                        />
                                    </div>
                                }
                            </div>
                            <div className={styles.buttons}>
                                {
                                    registarTab===0?
                                    <div className={!emailWrong?styles.login_button_worker:styles.login_button_disabled}
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
                                        <div className={!nameWrong?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {validateNameHandler()&&validatePhoneHandler()}}>
                                            <p className={styles.login_text}>Continuar</p>
                                        </div>
                                    </div>
                                    :
                                    registarTab===2?
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={(!passwordWrong||!passwordRepeatWrong)&&tosAccepted?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {tosAccepted&&validatePasswordHandler()}}>
                                            <p className={styles.login_text}>Criar Conta</p>
                                        </div>
                                    </div>
                                    :
                                    registarTab===3?
                                    <div className={styles.buttons_flex}>
                                        <div className={selectedType===0||(selectedType===1&&entityName.length>1)?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginTop:0}}
                                            onClick={() => {verifySelectedType()&&clearWarnings()}}>
                                            <p className={styles.login_text}>Continuar</p>
                                        </div>
                                    </div>
                                    :
                                    registarTab===4?
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={selectedProf.length>0?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginTop:0, marginLeft:'10px'}}
                                            onClick={() => {verifySelectedProfessions()&&clearWarnings()}}>
                                            <p className={styles.login_text}>Continuar</p>
                                        </div>
                                    </div>
                                    :
                                    registarTab===5?
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={selectedReg.length>0?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {verifySelectedRegions()&&clearWarnings()}}>
                                            <p className={styles.login_text}>Continuar</p>
                                        </div>
                                    </div>
                                    :
                                    registarTab===6?
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={selectedReg.length>0?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {updateWorkerDetails()}}>
                                            <p className={styles.login_text}>Concluir</p>
                                        </div>
                                    </div>
                                    :null
                                    
                                }  
                            </div>
                        </div>
                        :
                        null

                    }
                </div>
                {
                    selectedAuth===2?
                    loading&&<div className={styles.verification_backdrop}/>
                    :null
                }
                {
                    selectedAuth===2?
                        <div className={styles.worker_carousel_verification}>
                        <AuthCarouselVerification
                            worker={true}
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
                        </div>
                        :null
                }
                {
                    selectedAuth===2?
                    null
                    :
                    <div className={styles.split_wrapper}>
                        <span className={styles.split}/>
                        <div className={styles.split_text_wrapper}>
                            <div className={styles.split_text_frontdrop}>
                            <span className={styles.split_text}>OU</span>
                            </div>
                        </div>
                    </div>
                }
                
                {
                    selectedAuth===2?
                    null
                    :
                    <div className={styles.button_area}>
                        <span className={styles.user_button} onClick={() => navigate('/authentication?type=1')}>Área Cliente</span>
                    </div>
                }
            </div>
            </div>
            <div className={styles.top_right}>
                <span className={styles.top_right_button} 
                    style={{color:"#0358e5",
                            fontWeight:(selectedAuth===2)?700:400}} onClick={() => navigate('/authentication/user?type=1')}>Área Cliente</span>
                <span className={styles.top_right_button} 
                    style={{color:"#FF785A", marginLeft:'5px',
                            fontWeight:!(selectedAuth===2)?700:400}} onClick={() => navigate('/authentication/worker?type=1')}>Área Profissional</span>
            </div>
        </div>
    )
}

export default AuthWorker