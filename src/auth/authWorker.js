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

    const navigate = useNavigate()

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

    const registerHandler = async () => {
        props.loadingHandler(true)
        if(validator.isMobilePhone(phone, "pt-PT")
            && name.length>1
            && surname.length>1
            && validator.isEmail(email)
            && validator.isStrongPassword(password, {minLength:8, minNumbers:0, minSymbols:0, minLowercase:0, minUppercase:0})){
                
                registerWithEmailAndPassword(email, password)
                    .then(async res => {
                        console.log(res)
                        const obj = await axios.post(`${props.api_url}/create-customer`, {
                            name: name,
                            phone: phone,
                            email: email,
                        })
                        axios.post(`${props.api_url}/auth/register/worker`, 
                        {
                            name: name,
                            surname: surname,
                            phone: phone,
                            email: email,
                            google_uid: res.user.uid,
                            address: "",
                            photoUrl: "",
                            regioes: [],
                            trabalhos: [],
                            type: 1,
                            state: 0,
                            stripe_id: obj.data.customer.id,
                            entity: 0,
                            entity_name: "",
                        })
                        .then(res => {
                            console.log(res.data)
                            props.setUser(res.data.ops[0])
                            props.loadingHandler(false)
                            navigate('/')
                            
                        })
                        .catch(() => {
                            props.loadingHandler(false)
                        })
                    })
                    .catch(err => {
                        if(err.code == "auth/email-already-in-use"){
                            props.loadingHandler(false)
                            setEmailWrong("Este e-mail já se encontra associado. Não pode utilizar uma conta normal para se registar como trabalhador!")
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

            axios.get(`${props.api_url}/auth/get_user`, { params: {google_uid: user.uid} }).then(async res => {
                if(res.data == null){
                    const obj = await axios.post(`${props.api_url}/create-customer`, {
                        name: name,
                        phone: phone,
                        email: email,
                    })
                    axios.post(`${props.api_url}/auth/register/worker`, 
                        {
                            name: user.displayName,
                            phone: "",
                            email: user.email,
                            google_uid: user.uid,
                            address: "",
                            photoUrl: user.photoURL,
                            regioes: [],
                            trabalhos: [],
                            type: 1,
                            state: 0,
                            stripe_id: obj.data.customer.id,
                            entity: 0,
                            entity_name: "",
                        }).then(result => {
                            console.log(result);
                            props.setUser(result.data.ops[0])
                            props.setLoading(false)
                            navigate('/')
                        })
                }
            })
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
                  axios.post(`${props.api_url}/auth/register/worker`, 
                      {
                          name: user.displayName,
                          phone: "",
                          email: user.email,
                          google_uid: user.uid,
                          address: "",
                          photoUrl: user.photoURL,
                          type: 1
                      }).then(result => {
                            console.log(result);
                            props.setUser(result.data.ops[0])
                            props.setLoading(false)
                            navigate('/')
                      })
                }
            })
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


    return (
        <div className={styles.auth}>
            <div className={styles.auth_top}>
                <span className={styles.auth_top_text}>TRABALHADOR</span>
            </div>
            <div className={styles.auth_main} style={{backgroundColor:"#FF785A"}}>
                <div className={styles.area}>
                    <div className={styles.area_top} style={{borderBottom:"2px solid #FF785A"}}>
                        <span className={styles.li_text_active} style={{color:"#FF785A"}}>Registar como Trabalhador</span>
                    </div>
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
                        <div className={!props.loading?styles.login_button:styles.login_button_disabled} style={{marginTop:"20px"}} onClick={() => {
                                if(!props.loading) registerHandler()}}>
                            <p className={styles.login_text}>Registar como <span style={{textDecoration:"underline"}}>Trabalhador</span></p>
                        </div>
                        <div className={styles.bottom_switch}>
                            <span className={styles.bottom_switch_text}>Já tens conta? </span>
                            <span className={styles.bottom_switch_button} onClick={() => navigate('/authentication')}>Login</span>
                        </div>
                    </div>
                </div>
                <div className={styles.button_area}>
                    <span className={styles.user_button} onClick={() => navigate('/authentication')}>Registar-me como Utilizador</span>
                </div>
            </div>
        </div>
    )
}

export default AuthWorker