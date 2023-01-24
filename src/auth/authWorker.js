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
    providerFacebook
    } from '../firebase/firebase'
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    } from "firebase/auth"
import { useSearchParams } from 'react-router-dom';
import Loader from '../general/loader'

const AuthWorker = (props) => {

    const [selectedAuth, setSelectedAuth] = useState(1)

    const [emailLogin, setEmailLogin] = useState("")
    const [emailLoginWrong, setEmailLoginWrong] = useState(false)
    const [passwordLogin, setPasswordLogin] = useState("")
    const [loginError, setLoginError] = useState(null)

    const [email, setEmail] = useState("")
    const [emailWrong, setEmailWrong] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordWrong, setPasswordWrong] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [name, setName] = useState("")
    const [nameWrong, setNameWrong] = useState(false)
    const [surname, setSurname] = useState("")
    const [surnameWrong, setSurnameWrong] = useState(false)
    const [phone, setPhone] = useState("")
    const [phoneVisual, setPhoneVisual] = useState('')
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [phoneFocused, setPhoneFocused] = useState(false)

    const [loading, setLoading] = useState(false)

    const [searchParams] = useSearchParams()


    const navigate = useNavigate()

    useEffect(async () => {
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
        if(surname.length>1){
            setSurnameWrong(false)
        }
    }, [surname])

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
        if(validator.isEmail(email)){
            setEmailWrong(false)
        }
    }, [email])

    useEffect(() => {
        if(validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
            setPasswordWrong(false)
        }
    }, [password])

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

    const validateSurnameHandler = () => {
        if(surname.length<2){
            setSurnameWrong(true)
        }
        else{
            setSurnameWrong(false)
        }
    }

    const validatePhoneHandler = () => {
        setPhoneFocused(false)
        if(validator.isMobilePhone(phone, "pt-PT")){
            setPhoneWrong(false)
        }
        else{
            if(phoneFocused) setPhoneWrong(true)
        }
    }

    const validateEmailHandler = () => {
        setEmailFocused(false)
        if(validator.isEmail(email)){
            setEmailWrong(false)
        }
        else{
            if(emailFocused) setEmailWrong("O e-mail não é válido.")
        }
    }

    const validatePasswordHandler = () => {
        setPasswordFocused(false)
        if(validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
            setPasswordWrong(false)
        }
        else{
            if(passwordFocused) setPasswordWrong(true)
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

        let res = await axios.get(`${props.api_url}/auth/get_user_by_email`, { params: {email: emailLogin} })
        setEmailLoginWrong(false)
        if(res.data != null){
            setLoginError("Este e-mail já se encontra associado a uma conta de UTILIZADOR. Faça login na Àrea Utlizador.")
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
        //stripe obj
        const obj = await axios.post(`${props.api_url}/create-customer`, {
            name: from_signup?from_signup.name:name,
            phone: from_signup?from_signup.phone:phone,
            email: from_signup?from_signup.email.toLocaleLowerCase():email.toLocaleLowerCase(),
        })
        await axios.post(`${props.api_url}/auth/register/worker`, 
            {
                name: from_signup?from_signup.name:name,
                surname: from_signup?from_signup.name:surname,
                phone: phone,
                email: from_signup?from_signup.email:email.toLocaleLowerCase(),
                google_uid: user_uid,
                address: "",
                photoUrl: from_signup?from_signup.photoURL:"",
                regioes: [],
                trabalhos: [],
                type: 1,
                state: 0,
                stripe_id: obj.data.customer.id,
                entity: 0,
                entity_name: "",
                registerMethod: from_signup?from_signup.register_type:"email"
            })

        navigate('/', {
                state: {
                    refreshWorker: true
                }
            })
    }

    const registerHandler = async () => {
        setLoading(true)
        if(validator.isMobilePhone(phone, "pt-PT")
            && name.length>1
            && surname.length>1
            && validator.isEmail(email)
            && validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
            try{
                let res = await registerWithEmailAndPassword(email.toLocaleLowerCase(), password)
                await registerHelper(res.user.uid, false)
                setLoading(false)
            }
            catch (err) {
                if(err.code == "auth/email-already-in-use"){
                    axios.get(`${props.api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
                        setLoading(false)
                        if(res.data != null){
                            setEmailWrong("Este e-mail já se encontra associado a uma conta de UTILIZADOR. Por-favor, utilize outro email.")
                        }
                        else{
                            setEmailWrong("Já se inscreveu com este email. Esqueceu-se da palavra passe?")
                        }
                        
                    })
                }
                else{
                    setLoginError("Problema no servidor.")
                    setLoading(false)
                }
            }
            }
        else{
            setLoading(false)
            if(name.length<2){
                setNameWrong(true)
            }
            else if(surname.length<2){
                setSurnameWrong(true)
            }
            else if(!validator.isMobilePhone(phone, "pt-PT")){
                setPhoneWrong(true)
            }
            else if(email.length===0){
                setEmailWrong(true)
            }
            else if(!validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                setPasswordWrong(true)
            }
        }
    }

    const signInWithPopupHandler = async (type) => {
        setLoading(true)
        try{
            let res = await signInWithPopup(auth, type==="google"?provider:providerFacebook)
            let existing_user = await axios.get(`${props.api_url}/auth/get_user_by_email`, { params: {email: res.user.email.toLocaleLowerCase()} })
            let existing_worker = await axios.get(`${props.api_url}/auth/get_worker_by_email`, { params: {email: res.user.email.toLocaleLowerCase()} })
            
            console.log(existing_user, existing_worker)
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

    return (
        <div className={styles.auth}>
            <div className={styles.auth_main_worker}>
                <div className={styles.area}>
                    <Loader radius={true} loading={loading}/>
                    <div className={styles.area_top} style={{borderBottom:"1px solid #FF785A50"}}>
                        <ul>
                            <li onClick={() => setSelectedAuth(1)} style={{color:"#FF785A"}} className={selectedAuth?styles.li_active_worker:""}>
                                <span className={selectedAuth?styles.li_text_active_worker:styles.li_text}>Login</span>
                            </li>
                            <li onClick={() => setSelectedAuth(0)} style={{color:"#FF785A"}} className={!selectedAuth?styles.li_active_worker:""}>
                                <span className={!selectedAuth?styles.li_text_active_worker:styles.li_text}>Registar</span>
                            </li>
                        </ul>
                    </div>
                    {
                        selectedAuth===1?
                        <div className={styles.area_bot}>
                            <div className={styles.area_o2} style={{borderBottom:"1px solid #FF785A50"}}>
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
                                        style={{borderBottom:emailLoginWrong?"3px solid red":""}}
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
                            <div className={!loading?styles.login_button_worker:styles.login_button_disabled} onClick={() => {
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
                            <div className={styles.login_div}>
                                <div className={styles.login}>
                                    <p className={styles.login_title}>Nome</p>
                                    <input 
                                        autoComplete="off"
                                        maxLength={12}
                                        onChange={e => setName(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="Nome" 
                                        value={name}
                                        onBlur={() => validateNameHandler()}
                                        style={{borderBottom:nameWrong?"3px solid black":!nameWrong&&name.length>1?"3px solid #6EB241":""}}></input>
                                    {
                                        nameWrong?
                                        <span className={styles.field_error} style={{color:"black"}}>Por favor, escreva pelo menos 2 caracteres.</span>
                                        :null
                                    }
                                    
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Apelido</p>
                                    <input
                                        autoComplete="off"
                                        maxLength={12}
                                        onChange={e => setSurname(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="Apelido" 
                                        value={surname}
                                        onBlur={() => validateSurnameHandler()}
                                        style={{borderBottom:surnameWrong?"3px solid black":!surnameWrong&&surname.length>1?"3px solid #6EB241":""}}></input>
                                    {
                                        surnameWrong?
                                        <span className={styles.field_error} style={{color:"black"}}>Por favor, escreva pelo menos 2 caracteres.</span>
                                        :null
                                    }
                                    
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Telefone</p>
                                    <input
                                        autoComplete="off"
                                        maxLength={11} 
                                        onChange={e => setPhoneHandler(e.target.value)} 
                                        value={phoneVisual} className={styles.login_input} 
                                        placeholder="Telefone"
                                        onBlur={() => validatePhoneHandler()}
                                        style={{borderBottom:phoneWrong?"3px solid black":validator.isMobilePhone(phone, "pt-PT")&&phone.length===9?"3px solid #6EB241":""}}
                                        onFocus={() => setPhoneFocused(true)}></input>
                                        {
                                            phoneWrong?
                                            <span className={styles.field_error} style={{color:"black"}}>O número de telefone não é valido.</span>
                                            :null
                                        }
                                    
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>E-mail</p>
                                    <input 
                                        autoComplete="off"
                                        maxLength={80} 
                                        onChange={e => setEmail(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="E-mail" 
                                        value={email}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => validateEmailHandler()}
                                        style={{borderBottom:emailWrong?"3px solid black":validator.isEmail(email)&&email.length>0?"3px solid #6EB241":""}}></input>
                                        {
                                            emailWrong?
                                            <span className={styles.field_error}>{emailWrong}</span>
                                            :null
                                        }
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Password</p>
                                    <input 
                                        autoComplete="new-password"
                                        maxLength={40} 
                                        type="password"
                                        onChange={e => setPassword(e.target.value)}
                                        className={styles.login_input} 
                                        placeholder="Password" 
                                        value={password}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => validatePasswordHandler()}
                                        style={{borderBottom:passwordWrong?"3px solid black":!passwordWrong&&password.length>7?"3px solid #6EB241":""}}></input>
                                        {
                                            passwordWrong?
                                            <span className={styles.field_error} style={{color:"black"}}>Por favor, escreva pelo menos 8 caracteres.</span>
                                            :null
                                        }
                                </div>
                            </div>
                            <div className={!loading?styles.login_button_worker:styles.login_button_disabled} style={{marginTop:"20px"}} onClick={() => {
                                    if(!loading) registerHandler()}}>
                                <p className={styles.login_text}>Registar como <span style={{textDecoration:"underline"}}>Trabalhador</span></p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Já tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(1)}>Login</span>
                            </div>
                        </div>

                    }
                    
                </div>
                <div className={styles.button_area}>
                    <span className={styles.user_button} onClick={() => navigate('/authentication?type=1')}>Àrea Utilizador</span>
                </div>
            </div>
        </div>
    )
}

export default AuthWorker