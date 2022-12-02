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
    sendSignInLinkToEmailHandler
    } from '../firebase/firebase'
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    } from "firebase/auth"

const Auth = (props) => {

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
    const [nameFocused, setNameFocused] = useState(false)
    const [phone, setPhone] = useState("")
    const [phoneVisual, setPhoneVisual] = useState('')
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [phoneFocused, setPhoneFocused] = useState(false)

    const navigate = useNavigate()

    const location = useLocation()


    useEffect(() => {
        if(location.state && location.state.carry){
            setSelectedAuth(0)
            setName(location.state.nameCarry)
            setPhone(location.state.phoneCarry)
            setEmail(location.state.emailCarry)
        }
    }, [location])

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

    const navigateHandler = () => {
        navigate(`/publicar?w=${location.state.worker}`,
            {
                state: {
                    carry: true,
                    desc: location.state.desc,
                    nameCarry: name,
                    apelidoCarry: surname,
                    phoneCarry: phone,
                    emailCarry: email,
                    title: location.state.title,
                    images: location.state.images,
                    imageFiles: location.state.imageFiles
                }
            })
    }
    

    const loginHandler = () => {
        props.loadingHandler(true)
        setEmailLoginWrong(false)
        console.log(emailLogin);
        if(validator.isEmail(emailLogin)){
            fetchSignInMethodsForEmailHandler(emailLogin)
                .then(res => {
                    console.log(res);
                    if(res.length>0){
                        if(res[0] === "google.com"){
                            setLoginError('Este e-mail encontra-se registado através da Google. Por favor inicia a sessão com "Entrar com Google"')
                            props.loadingHandler(false)
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
                                props.loadingHandler(false)
                            })
                            .catch(err => {
                                console.log(err);
                                props.loadingHandler(false)
                                setLoginError('O e-mail ou a Password estão incorretos.')
                            })
                        }
                    }
                    else{
                        props.loadingHandler(false)
                        setLoginError('O e-mail ou a Password estão incorretos.')
                    }                  
                })
            
        } else {
            props.loadingHandler(false)
            setLoginError('Este e-mail não é válido.')
            setEmailLoginWrong(true)
        }
    }

    const registerHandler = () => {
        props.loadingHandler(true)
        if(validator.isMobilePhone(phone, "pt-PT")
            && name.length>1
            && surname.length>1
            && validator.isEmail(email)
            && validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                
                registerWithEmailAndPassword(email, password)
                    .then(res => {
                        axios.post(`${props.api_url}/auth/register`, 
                        {
                            name: name,
                            surname: surname,
                            phone: phone,
                            email: email,
                            google_uid: res.user.uid,
                            address: "",
                            photoUrl: "",
                            type: 0,
                            email_verified: false
                        })
                        .then(res => {
                            props.setUser(res.data.ops[0])
                            props.loadingHandler(false)
                            sendSignInLinkToEmailHandler(email)
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
                            
                        })
                        .catch(() => {
                            props.loadingHandler(false)
                        })
                    })
                    .catch(err => {
                        if(err.code == "auth/email-already-in-use"){
                            props.loadingHandler(false)
                            setEmailWrong("Este e-mail já se encontra associado. Entraste através do Google ou Facebook?")
                        }
                        else{
                            setLoginError("Problema no servidor.")
                        }
                        
                    })
            }
        else{
            props.loadingHandler(false)
            if(!validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                setPasswordWrong(true)
            }
        }
    }

    const setPhoneHandler = (val) => {
        let phone = val.replace(/\s/g, '')
        setPhone(phone)
    }

    const validateNameHandler = () => {
        setNameFocused(false)
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

    const signInWithPopupHandler = () => {
        props.loadingHandler(true)
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;

            axios.get(`${props.api_url}/auth/get_user`, { params: {google_uid: user.uid} }).then(res => {
                if(res.data == null){
                  axios.post(`${props.api_url}/auth/register`, 
                      {
                          name: user.displayName,
                          phone: "",
                          email: user.email,
                          google_uid: user.uid,
                          address: "",
                          photoUrl: user.photoURL,
                          type: 0,
                          email_verified: true
                      }).then(result => {
                            console.log(result);
                            props.setUser(result.data.ops[0])
                            props.setLoading(false)
                      })
                }
            })
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
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            props.loadingHandler(false)
        });
    }

    const signInWithPopupFacebookHandler = () => {
        props.loadingHandler(true)
        signInWithPopup(auth, providerFacebook)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            axios.get(`${props.api_url}/auth/get_user`, { params: {google_uid: user.uid} }).then(res => {
                if(res.data == null){
                  axios.post(`${props.api_url}/auth/register`, 
                      {
                          name: user.displayName,
                          phone: "",
                          email: user.email,
                          google_uid: user.uid,
                          address: "",
                          photoUrl: user.photoURL,
                          type: 0,
                          email_verified: true
                      }).then(result => {
                            console.log(result);
                            props.setUser(result.data.ops[0])
                            props.setLoading(false)
                      })
                }
            })

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
        })
        .catch((error) => {
            console.log(error);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);

            // ...
            props.loadingHandler(false)
        });
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            loginHandler()
        }
    }


    return (
        <div className={styles.auth}>
            <div className={styles.auth_main}>
                <div className={styles.area}>
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
                        <div>
                            <div className={styles.area_bot}>
                                <div className={styles.area_o2}>
                                    <div className={styles.o2_button} onClick={() => signInWithPopupFacebookHandler()}>
                                        <img src={facebook} className={styles.o2_img}></img>
                                        <span className={styles.align_vert}>
                                            <span className={styles.o2_text}>Entrar com Facebook</span>
                                        </span>
                                    </div>
                                    <div className={styles.o2_button} style={{marginTop:"5px"}}  onClick={() => signInWithPopupHandler()}>
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
                                <div className={!props.loading?styles.login_button:styles.login_button_disabled} onClick={() => {
                                    if(!props.loading) loginHandler()}}>
                                    <p className={styles.login_text}>Efectue o seu login</p>
                                </div>
                                <div className={styles.bottom_switch}>
                                    <span className={styles.bottom_switch_text}>Não tens conta? </span>
                                    <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(0)}>Registar</span>
                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles.area_bot}>
                            <div className={styles.area_o2}>
                                <div className={styles.o2_button} onClick={() => signInWithPopupFacebookHandler()}>
                                    <img src={facebook} className={styles.o2_img}></img>
                                    <span className={styles.align_vert}>
                                        <span className={styles.o2_text}>Entrar com Facebook</span>
                                    </span>
                                </div>
                                <div className={styles.o2_button} style={{marginTop:"5px"}} onClick={() => signInWithPopupHandler()}>
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
                                    <p className={styles.login_title}>Nome</p>
                                    <input 
                                        maxLength={12}
                                        onChange={e => setName(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="Nome" 
                                        value={name}
                                        onBlur={() => validateNameHandler()}
                                        onFocus={() => setNameFocused(true)}
                                        style={{borderBottom:nameWrong?"3px solid red":!nameWrong&&name.length>1?"3px solid #6EB241":""}}></input>
                                    {
                                        nameWrong?
                                        <span className={styles.field_error}>Por favor, escreva pelo menos 2 caracteres.</span>
                                        :null
                                    }
                                    
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Apelido</p>
                                    <input 
                                        maxLength={12}
                                        onChange={e => setSurname(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="Apelido" 
                                        value={surname}
                                        onBlur={() => validateSurnameHandler()}
                                        style={{borderBottom:surnameWrong?"3px solid red":!surnameWrong&&surname.length>1?"3px solid #6EB241":""}}></input>
                                    {
                                        surnameWrong?
                                        <span className={styles.field_error}>Por favor, escreva pelo menos 2 caracteres.</span>
                                        :null
                                    }
                                    
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Telefone</p>
                                    <input 
                                        maxLength={11} 
                                        onChange={e => setPhoneHandler(e.target.value)} 
                                        value={phoneVisual} className={styles.login_input} 
                                        placeholder="Telefone"
                                        onBlur={() => validatePhoneHandler()}
                                        style={{borderBottom:phoneWrong?"3px solid red":validator.isMobilePhone(phone, "pt-PT")&&phone.length===9?"3px solid #6EB241":""}}
                                        onFocus={() => setPhoneFocused(true)}></input>
                                        {
                                            phoneWrong?
                                            <span className={styles.field_error}>O número de telefone não é valido.</span>
                                            :null
                                        }
                                    
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>E-mail</p>
                                    <input 
                                        maxLength={80} 
                                        onChange={e => setEmail(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="E-mail" 
                                        value={email}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => validateEmailHandler()}
                                        style={{borderBottom:emailWrong?"3px solid red":validator.isEmail(email)&&email.length>0?"3px solid #6EB241":""}}></input>
                                        {
                                            emailWrong?
                                            <span className={styles.field_error}>{emailWrong}</span>
                                            :null
                                        }
                                </div>
                                <div className={styles.login} style={{marginTop:"10px"}}>
                                    <p className={styles.login_title}>Password</p>
                                    <input 
                                        maxLength={40} 
                                        type="password"
                                        onChange={e => setPassword(e.target.value)} 
                                        className={styles.login_input} 
                                        placeholder="Password" 
                                        value={password}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => validatePasswordHandler()}
                                        style={{borderBottom:passwordWrong?"3px solid red":!passwordWrong&&password.length>7?"3px solid #6EB241":""}}></input>
                                        {
                                            passwordWrong?
                                            <span className={styles.field_error}>Por favor, escreva pelo menos 8 caracteres.</span>
                                            :null
                                        }
                                </div>
                            </div>
                            <div className={!props.loading?styles.login_button:styles.login_button_disabled} style={{marginTop:"20px"}} onClick={() => {
                                    if(!props.loading) registerHandler()}}>
                                <p className={styles.login_text}>Registar no Arranja</p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Já tens conta? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(1)}>Login</span>
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.button_area}>
                    <span className={styles.worker_button} onClick={() => navigate('/authentication/worker')}>Registar como Trabalhador</span>
                </div>
            </div>
        </div>
    )
}

export default Auth