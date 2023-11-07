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
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import portugal from '../assets/portugal.png'

const Auth = (props) => {
    const api_url = useSelector(state => {return state.api_url})

    const [selectedAuth, setSelectedAuth] = useState(1)

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

    useEffect(() => {
        if(validator.isEmail(email)){
            setEmailWrong(false)
        }
    }, [email])

    useEffect(() => {
        setPasswordRepeatWrong(false)
    }, [passwordRepeat, password])

    useEffect(() => {
        console.log(location);
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
        }
    }, [searchParams])

    useEffect(() => {
        if(name.length>1){
            setNameWrong(false)
        }
    }, [name])

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
        let phone = val.replace(/\s/g, '')
        setPhone(phone)
    }

    const validateNameHandler = () => {
        if(name.length<2){
            setNameWrong(true)
        }
        else{
            setNameWrong(false)
        }
    }

    const validatePhoneHandler = () => {
        if(validator.isMobilePhone(phone, "pt-PT")){
            setPhoneWrong(false)
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
                setRegistarTab(2)
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
                                            carry: true
                                        }
                                    })
                                }
                                setLoading(false)
                            })
                            .catch(err => {
                                setLoginError('O e-mail ou a Password estão incorretos.')
                                setLoading(false)
                            })
                        }
                    }
                    else{
                        setLoginError('O e-mail ou a Password estão incorretos.')
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
                registerMethod: from_signup?from_signup.register_type:"email"
            })

        if(location.state && location.state.carry)
        {
            navigateHandler()
        } 
        else{
            navigate('/', {
                state: {
                    carry: true,
                    refreshUser: true
                }
            })
        }
    }

    const registerHandler = async () => {
        if(validator.isMobilePhone(phone, "pt-PT")
            && name.length>1
            && validator.isEmail(email)
            && validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
            }
        else{
            setLoading(false)
            if(name.length<2){
                setNameWrong(true)
            }
            else if(!validator.isMobilePhone(phone, "pt-PT")){
                setPhoneWrong(true)
            }
            else if(!validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                setPasswordWrong(true)
            }
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

    const clearWarnings = () => {
        setNameWrong(false)
        setEmailWrong(false)
        setPhoneWrong(false)
        setPasswordWrong(false)
    }

    const checkEmail = async () => {
        setLoading(true)
        let res = await axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} })

        console.log(res)

        if(res.data){
            if(res.data.registerMethod!=='email')
                setEmailWrong('Este e-mail encontra-se registado através da Google. Por-favor inicie a sessão através da Google, na página anterior.')
            else
                setEmailWrong('Este e-mail já se encontra associado a uma conta.')
            setLoading(false)
        }
        else
        {
            setLoading(false)
            setEmailWrong(false)
            setRegistarTab(1)
            clearWarnings()
        }
        
        // if(validator.isEmail(email)){
        //     setLoading(true)
        //     try{
        //         let res = await registerWithEmailAndPassword(email.toLocaleLowerCase(), password)
        //         await registerHelper(res.user.uid, false)
        //         setLoading(false)
        //         setEmailWrong(false)
        //         setRegistarTab(1)
        //         clearWarnings()
        //     }
        //     catch (err) {
        //         if(err.code == "auth/email-already-in-use"){
        //             axios.get(`${api_url}/auth/get_worker_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
        //                 setLoading(false)
        //                 if(res.data != null){
        //                     setEmailWrong("Este e-mail já se encontra associado a uma conta de TRABALHADOR. Por-favor, utilize outro email.")
        //                 }
        //                 else{
        //                     axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
        //                         if(res.data.registerMethod != "email"){
        //                             setEmailWrong('Este e-mail encontra-se registado através da Google.')
        //                         }
        //                     })
        //                     setEmailWrong("Este e-mail já se encontra registado. Esqueceu-se da palavra passe?")
        //                 }
        //             })
        //         }
        //         else{
        //             setEmailWrong("Problema no servidor.")
        //             setLoading(false)
        //         }
        //     }
        // }
        // else{
        //     setEmailWrong("Este e-mail é inválido.")
        // }
    }

    return (
        <div className={styles.auth}>
            <div className={styles.auth_main}>
                <div className={styles.area}>
                    <Loader radius={true} loading={loading}/>
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
                    {
                        selectedAuth===1?
                        <div className={styles.area_bot}>
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
                                        style={{borderBottom:emailLoginWrong?"2PX solid red":""}}
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
                                        placeholder="Password"
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
                                <span className={styles.recup_password}>Recuperar password</span>
                            </div>
                            <div className={!loading?styles.login_button:styles.login_button_disabled} onClick={() => {
                                if(!loading) loginHandler()}}>
                                <p className={styles.login_text}>Efectue o seu login</p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Não tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(0)}>Registar</span>
                            </div>
                        </div>
                        :
                        <div className={styles.area_bot}>
                            <Loader radius={true} loading={loading}/>
                            <div className={styles.area_bot_wrapper}>
                                <p className={styles.area_bot_title}>Criar conta de utilizador</p>
                                <p className={styles.area_bot_title_helper}>({registarTab+1}/3)</p>
                                <p className={styles.area_bot_title_helper_mini}>{['E-mail', 'Palavra-passe', 'Detalhes do utilizador'][registarTab]}</p>
                                <div className={styles.login_div}>
                                <Carousel 
                                    showArrows={false} 
                                    showStatus={false} 
                                    showIndicators={false} 
                                    showThumbs={false}
                                    selectedItem={registarTab}>
                                    <div className={styles.login}>
                                        <p className={styles.register_title}>E-mail</p>
                                        <input 
                                            autoComplete="new-password"
                                            maxLength={80} 
                                            onChange={e => setEmail(e.target.value)} 
                                            className={styles.login_input} 
                                            placeholder="email@email.com" 
                                            value={email}
                                            style={{borderBottom:emailWrong?"2px solid red":validator.isEmail(email)&&email.length>0?"2px solid #0358e5":""}}></input>
                                            {
                                                emailWrong?
                                                <span className={styles.field_error}>{emailWrong}</span>
                                                :null
                                            }
                                    </div>
                                    <div className={styles.login}>
                                        <p className={styles.register_title}>Palavra-passe</p>
                                        <span className={styles.area_bot_intro}>Estás a criar uma palavra-passe para o email <span className={styles.area_bot_intro_strong}>{email}</span>.</span>
                                        <div className={styles.area_password}>
                                            <div className={styles.area_password_min_wrapper}>
                                                <span className={styles.area_password_min}>mín. 8 caracteres</span>
                                                <CheckIcon className={styles.area_password_min_icon} style={{color:password.length>7?"#0358e5":""}}/>
                                            </div>
                                            <input 
                                                autoComplete="new-password"
                                                maxLength={40} 
                                                type="password"
                                                onChange={e => setPassword(e.target.value)} 
                                                className={styles.login_input} 
                                                placeholder="Palavra-passe" 
                                                value={password}
                                                style={{borderBottom:passwordWrong?"2PX solid red":!passwordWrong&&password.length>7?"2PX solid #0358e5":""}}></input>
                                        </div>

                                            {
                                                passwordWrong?
                                                <span className={styles.field_error}>Por favor, escreva pelo menos 8 caracteres.</span>
                                                :null
                                            }
                                        <input 
                                            autoComplete="new-password"
                                            maxLength={40} 
                                            type="password"
                                            onChange={e => setPasswordRepeat(e.target.value)} 
                                            className={styles.login_input} 
                                            placeholder="Repetir palavra-passe" 
                                            value={passwordRepeat}
                                            style={{borderBottom:passwordRepeatWrong?"2PX solid red":!passwordRepeatWrong&&passwordRepeat.length>7?"2PX solid #0358e5":"", marginTop:'10px'}}></input>
                                            {
                                                passwordRepeatWrong?
                                                <span className={styles.field_error}>As passwords escritas não são identicas.</span>
                                                :null
                                            }
                                    </div>
                                    <div className={styles.login}>
                                        <span className={styles.area_bot_intro_wrapper}>
                                            <EmailIcon className={styles.area_bot_intro_icon}/>
                                            <span className={styles.area_bot_intro_strong_two}>{email}</span>
                                        </span>
                                        
                                        <span className={styles.area_bot_intro_wrapper} style={{marginBottom:'20px'}}>
                                            <LockIcon className={styles.area_bot_intro_icon}/>
                                            <span className={styles.area_bot_intro_strong_two}>************</span>
                                        </span>

                                        <p className={styles.register_title}>Nome</p>
                                        <input 
                                            autoComplete="new-password"
                                            maxLength={12}
                                            onChange={e => setName(e.target.value)} 
                                            className={styles.login_input} 
                                            placeholder="Nome" 
                                            value={name}
                                            onBlur={() => validateNameHandler()}
                                            style={{borderBottom:nameWrong?"2PX solid red":!nameWrong&&name.length>1?"2PX solid #0358e5":""}}></input>
                                        {
                                            nameWrong?
                                            <span className={styles.field_error}>Por favor, escreva pelo menos 2 caracteres.</span>
                                            :null
                                        }

                                        <p className={styles.register_title} style={{marginTop:'10px'}}>Telemóvel</p>
                                        <div className={styles.input_wrapper} 
                                            style={{border:phoneWrong?"2px solid red":validator.isMobilePhone(phone, "pt-PT")&&phone.length===9?"2px solid #0358e5":""}}>
                                            <img src={portugal} className={styles.flag}/>
                                            <span className={styles.input_wrapper_divider}>.</span>
                                            <input 
                                            autoComplete="new-password"
                                            maxLength={11} 
                                            onChange={e => setPhoneHandler(e.target.value)} 
                                            value={phoneVisual} 
                                            className={styles.login_input_new} 
                                            placeholder="912345678">
                                                
                                            </input>
                                        </div>
                                        {
                                                phoneWrong?
                                                <span className={styles.field_error}>O número de telemóvel não é valido.</span>
                                                :null
                                            }
                                        
                                    </div>
                                </Carousel>
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                {
                                    registarTab===3?
                                    <div className={!loading?styles.login_button:styles.login_button_disabled} 
                                        onClick={() => {!loading&&registerHandler()&&clearWarnings()}}>
                                        <p className={styles.login_text}>Registar no Arranja</p>
                                    </div>
                                    :registarTab===0?
                                    <div className={!emailWrong?styles.login_button:styles.login_button_disabled} 
                                        onClick={() => {validateEmailHandler()&&checkEmail()}}>
                                        <p className={styles.login_text}>Continuar</p>
                                    </div>
                                    :
                                    <div className={styles.buttons_flex}>
                                        <div className={styles.login_button_voltar}
                                            onClick={() => {setRegistarTab(registarTab-1)&&clearWarnings()}}>
                                        <KeyboardArrowLeftIcon className={styles.login_button_voltar_icon}/>
                                        </div>
                                        <div className={!nameWrong?styles.login_button:styles.login_button_disabled}
                                            style={{marginLeft:'10px'}}
                                            onClick={() => {validatePasswordHandler()&&clearWarnings()}}>
                                            <p className={styles.login_text}>Continuar</p>
                                        </div>
                                    </div>
                                    
                                }  
                            </div>
                                      
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Já tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(1)}>Login</span>
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.button_area}>
                    <span className={styles.worker_button} onClick={() => navigate('/authentication/worker?type=1')}>Àrea Trabalhador</span>
                </div>
            </div>
        </div>
    )
}

export default Auth