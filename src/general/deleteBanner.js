import React, {useEffect, useState, useRef} from 'react'
import styles from './banner.module.css'
import { useSelector } from 'react-redux'
import PasswordIcon from '@mui/icons-material/Password';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { auth, provider } from '../firebase/firebase'
import { EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, signInWithPopup } from 'firebase/auth';
import google from '../assets/google.png'

const DeleteBanner = (props) => {

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [state, setState] = useState(0)
    const user = useSelector(state => {return state.user})
    const [showLetters, setShowLetters] = useState(false)

    const handleDelete = () => {
        props.confirmDelete()
    }

    const handleEmailSignIn = async () => {
        try{
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            )
            const result = await reauthenticateWithCredential(
                auth.currentUser, 
                credential
            )

            setState(1)
        }
        catch (err){
            setPasswordError(true)
        }       
    }

    const handlePopupSignIn = async () => {
        try{
            // Sign in using a popup.
            const result = await signInWithPopup(auth, provider);
            // Reauthenticate using a popup.
            await reauthenticateWithPopup(result.user, provider);
            setState(1)
        }
        catch (err){
        }
        
    }

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            <div className={styles.main} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>ELIMINAR CONTA</p>
                <span className={styles.title_separator}/>
                <div className={styles.main_inner}>
                    {
                        !user?.worker?
                        <p className={styles.phone_description} style={{textAlign:"left"}}>Ao eliminares a tua conta, todas as tuas publicações e mensagens serão eliminadas. Esta ação não é reversível.</p>
                        :
                        <div>
                            <p className={styles.phone_description} style={{textAlign:"left"}}>Ao eliminares a tua conta, o teu perfil e mensagens serão eliminadas.</p>
                            <p className={styles.phone_description} style={{marginTop:'5px', textAlign:"left"}}>Qualquer subscrição será cancelada e o valor não será reembolsado.</p>
                            <p className={styles.phone_description} style={{textDecoration:'underline'}}> Esta ação não é reversível.</p>
                        </div>
                    }
                    

                    {/* <p className={styles.phone_description} style={{marginTop:'30px'}}>Insere a palavra "ELIMINAR" na caixa abaixo:</p> */}
                    {
                        state===0?
                        <p className={styles.phone_description} style={{marginTop:'30px', fontWeight:'600', color:"#fdd835"}}>Por razões de segurança, volta a iniciar a tua sessão abaixo para continuares com a eliminação da conta.</p>
                        :
                        <p className={styles.phone_description} style={{marginTop:'30px', fontWeight:'600', color:"#ff3b30"}}>Carrega no botão abaixo para eliminares a tua conta.</p>
                    }
                </div>

                {/* <div className={styles.phone_input_wrapper} style={{borderColor:"#ff3b30", marginTop:'10px'}}>
                    <input className={styles.phone_input_word} value={word} placeholder='ELIMINAR' onChange={e => setWord(e.target.value)} maxLength={8}/>
                </div> */}
                {
                    state===0?
                    <div style={{marginTop:'10px'}}>
                        {
                            user?.registerMethod === 'email'?
                            <div className={styles.email}>
                                <div className={styles.email_flex}>
                                    <div style={{marginBottom:'-5px'}} className={styles.show_flex}>
                                        <p className={styles.email_input_title}>E-mail</p>
                                        <div className={styles.area_show_letters} onClick={() => setShowLetters(!showLetters)}>
                                            <span className={showLetters?styles.area_show_letters_value:styles.area_show_letters_value_no}>{
                                                showLetters?'Esconder palavra-passe':'Mostrar palavra-passe'
                                            }</span>
                                        </div>
                                    </div>
                                    
                                    <input className={styles.email_input} style={{borderColor:"#fdd8357c"}} disabled={true} value={user?.email}></input>
                                </div>
                                <div className={styles.email_flex}>
                                    <p className={styles.email_input_title}>Palavra-passe</p>
                                    <input className={styles.email_input} style={{color:showLetters?"#0358e5":"#000000", fontWeight:showLetters?600:500}} placeholder='Introduzir a palavra-passe...' type={showLetters?"none":"password"} value={password} onChange={e => {setPassword(e.target.value)
                                        setPasswordError(false)}}></input>
                                </div>
                                
                            </div>
                            :
                            <div className={styles.o2_button} style={{marginTop:"0px"}}  onClick={() => handlePopupSignIn()}>
                                <img src={google} className={styles.o2_img}></img>
                                <span className={styles.align_vert}>
                                    <span className={styles.o2_text}>Entrar com Google</span>
                                </span>
                            </div>
                        }
                    </div>
                    :null
                }

                {
                    passwordError?
                    <span className={styles.email_error}>A palavra-passe está incorreta</span>
                    :null
                }
                
                {
                    state===0?
                    <div 
                        className={styles.button}
                        style={{backgroundColor:password.length>0&&passwordError===false?"#fdd835":"#ccc"}}
                        onClick={() => passwordError===false&&password.length>0&&handleEmailSignIn()}>
                        <span className={styles.button_text} style={{color:"#161F28"}}>CONTINUAR</span>
                    </div>
                    :
                    <div 
                        className={styles.button}
                        style={{backgroundColor:"#ff3b30"}}
                        onClick={() => handleDelete()}>
                        <span className={styles.button_text} style={{color:"white"}}>ELIMINAR</span>
                    </div>
                }

                <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
            </div>

        </div>
    )
}

export default DeleteBanner