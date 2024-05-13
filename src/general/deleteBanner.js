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
            console.log(err)
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
            console.log(err)
        }
        
    }

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            <div className={styles.main} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>ELIMINAR CONTA</p>
                <span className={styles.title_separator}/>
                <div className={styles.main_inner}>
                    {
                        props.type===0?
                        <p className={styles.phone_description}>Ao eliminares a tua conta, todas as tuas publicações e mensagens serão eliminadas. Esta ação não é reversível.</p>
                        :
                        <div>
                            <p className={styles.phone_description}>Ao eliminares a tua conta, o teu perfil e mensagens serão eliminadas.</p>
                            <p className={styles.phone_description} style={{marginTop:'0px'}}>Qualquer subscrição será cancelada e o valor não será reembolsado.</p>
                            <p className={styles.phone_description} style={{textDecoration:'underline'}}> Esta ação não é reversível.</p>
                        </div>
                    }
                    

                    {/* <p className={styles.phone_description} style={{marginTop:'30px'}}>Insere a palavra "ELIMINAR" na caixa abaixo:</p> */}
                    {
                        state===0?
                        <p className={styles.phone_description} style={{marginTop:'30px', fontWeight:'600'}}>Por razões de segurança, volte a iniciar a sua sessão para continuar com a eliminação da conta.</p>
                        :
                        <p className={styles.phone_description} style={{marginTop:'30px', fontWeight:'600'}}>Carrega no botão abaixo para eliminares a tua conta.</p>
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
                                    <AlternateEmailIcon className={styles.email_input_icon} style={{marginTop:'10px'}}/>
                                    <input className={styles.email_input} disabled={true} value={user?.email}></input>
                                </div>
                                <div className={styles.email_flex}>
                                    <PasswordIcon className={styles.email_input_icon}/>
                                    <input className={styles.email_input} placeholder='Palavra-passe...' type='password' value={password} onChange={e => {setPassword(e.target.value)
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
                        style={{backgroundColor:password.length>0&&passwordError===false?"#0358e5":"#ccc"}}
                        onClick={() => passwordError===false&&handleEmailSignIn()}>
                        <span className={styles.button_text} style={{color:"white"}}>CONTINUAR</span>
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