import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {
    registerWithEmailAndPassword, 
    loginWithEmailAndPassword,
    fetchSignInMethodsForEmailHandler
    } from '../firebase/firebase'
import { useSearchParams } from 'react-router-dom';
import Loader from '../general/loader'
import { useSelector } from 'react-redux'
import AuthCarousel from './authCarousel'
import AuthCarouselVerification from './authCarouselVerification'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AuthCarouselWorker from './authCarouselWorker';


const AuthWorker = (props) => {
    const api_url = useSelector(state => {return state.api_url})

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

    const [registarTab, setRegistarTab] = useState(3)
    const [loading, setLoading] = useState(false)

    const [searchParams] = useSearchParams()


    const navigate = useNavigate()

    // useEffect(() => {
    //     const paramsAux = Object.fromEntries([...searchParams])
    //     if(paramsAux)
    //     {
    //         setSelectedAuth(parseInt(paramsAux.type))
    //     }
    // }, [searchParams])

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
            setRegistarTab(3)
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

    const handleKeyDownRegister = (from, event) => {
        console.log(from, event)
        if (event.key === 'Enter') {
            event.preventDefault()
            if(from === 'email'){
                validateEmailHandler()&&checkEmail()
            }
            else if(from === 'password'){
                validatePasswordHandler()&&clearWarnings()
            }
            else if(from === 'name'){
                validateNameHandler()&&validatePhoneHandler()&&registerHandler()
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

    const verifySelectedType = () => {
        if(selectedType===0||(selectedType===1&&entityName.length>1)){
            setSelectedTypeWrong(false)
            setRegistarTab(4)
        }
        else
        {
            setSelectedTypeWrong(true)
        }
    }

    const verifySelectedProfessions = () => {
        if(selectedProf.length>0){
            setSelectedProfWrong(false)
            setRegistarTab(5)
        }
        else
        {
            setSelectedProfWrong(true)
        }
    }

    const verifySelectedRegions = () => {
        if(selectedReg.length>0){
            setSelectedRegWrong(false)
            setRegistarTab(6)
        }
        else
        {
            setSelectedRegWrong(true)
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
                    setLoading(false)
                    setEmail(null)
                    setPassword(null)
                    setPasswordRepeat(null)
                    setName(null)
                    setPhone(null)
                    setPhoneVisual(null)
                    setSelectedAuth(2)
                }
                catch (err) {
                    if(err.code == "auth/email-already-in-use"){
                        axios.get(`${api_url}/auth/get_user_by_email`, { params: {email: email.toLocaleLowerCase()} }).then(res => {
                            setLoading(false)
                            if(res.data != null){
                                setEmailWrong('Este e-mail já se encontra registado a uma conta de utilizador.')
                            }
                            else{
                                setEmailWrong('Este e-mail já se encontra registado a uma conta de trabalhador.')
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
                        setLoginError("Problema no servidor. Por-favor tente mais tarde.")
                        setLoading(false)
                    }
                }
            }
        else{
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
                                <p className={styles.login_text}>LOGIN TRABALHADOR</p>
                            </div>
                            <div className={styles.bottom_switch}>
                                <span className={styles.bottom_switch_text}>Não tens conta de trabalhador? </span>
                                <span className={styles.bottom_switch_button} onClick={() => setSelectedAuth(0)}>Registar</span>
                            </div>
                        </div>
                        :
                        <div className={styles.area_bot}>
                            <Loader radius={true} loading={loading}/>
                            <div className={styles.area_bot_wrapper} style={{backgroundColor:"#FF785A30"}}>
                                {
                                    registarTab<=2?
                                    <p className={styles.area_bot_title} style={{backgroundColor:"#FF785A"}}>Criar conta de trabalhador</p>
                                    :
                                    <p className={styles.area_bot_title} style={{backgroundColor:"#FF785A"}}>Finalizar detalhes</p>
                                }
                                {
                                    registarTab<=2?
                                    <p className={styles.area_bot_title_helper} style={{color:"#FF785A"}}>({registarTab+1}/3)</p>
                                    :
                                    <p className={styles.area_bot_title_helper} style={{color:"#FF785A"}}>({registarTab-2}/3)</p>
                                }
                                
                                <p className={styles.area_bot_title_helper_mini}>{['E-mail', 'Palavra-passe', 'Detalhes do utilizador', 'Particular ou Empresa', 'Serviços que excerço', 'Distritos onde trabalho', 'Concluir'][registarTab]}</p>
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
                                        />
                                    </div>
                                    :
                                    <div className={styles.login_div}>
                                        <AuthCarouselWorker
                                            registarTab={registarTab}
                                            email={email}
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
                                            updateEntityName={val => setEntityName(val)}
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
                                            onClick={() => {validatePasswordHandler()&&clearWarnings()}}>
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
                                        <div className={!nameWrong?styles.login_button_worker:styles.login_button_disabled}
                                            style={{marginLeft:'10px', marginTop:0}}
                                            onClick={() => {validateNameHandler()&&validatePhoneHandler()&&clearWarnings()}}>
                                            <p className={styles.login_text}>Continuar</p>
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
                                    :null
                                    
                                }  
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