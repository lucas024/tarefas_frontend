import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import portugal from '../assets/portugal.png'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import validator from 'validator'
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';


const AuthCarousel = props => {

    const [showLetters, setShowLetters] = useState(false)

    return (
        <Carousel 
            swipeable={false}
            showArrows={false} 
            showStatus={false} 
            showIndicators={false} 
            showThumbs={false}
            selectedItem={props.registarTab}>
            <div className={styles.login}>
                <p className={styles.register_title}>E-mail</p>
                <input
                    autoFocus={true}
                    onKeyDown={e => props.handleKeyDownRegister('email', e)}
                    tabindex={props.registarTab===0?'1':'-1'}
                    autoComplete="new-password"
                    maxLength={80} 
                    onChange={e => props.setEmailHandler(e.target.value)} 
                    className={styles.login_input} 
                    placeholder="email@email.com" 
                    value={props.email}
                    style={{borderBottomColor:props.emailWrong?"red":validator.isEmail(props.email)&&props.email?.length>0?props.type==='worker'?"#FF785A":"#0358e5":""}}></input>
                    {
                        props.emailWrong?
                        <span className={styles.field_error}>{props.emailWrong}</span>
                        :null
                    }
            </div>

            <div className={styles.login}>
                <span className={styles.area_bot_intro_wrapper} style={{marginBottom:'20px'}}>
                    <EmailIcon className={styles.area_bot_intro_icon} style={{color:props.type==='worker'?"#FF785A":"#0358e5"}}/>
                    <span className={styles.area_bot_intro_strong_two}>{props.email}</span>
                </span>
                
                <p className={styles.register_title}>Nome e Apelido</p>
                <input
                    tabindex={props.registarTab===1?'1':'-1'}
                    autoComplete="new-password"
                    maxLength={30}
                    onChange={e => props.setNameHandler(e.target.value)} 
                    className={styles.login_input} 
                    placeholder="Nome e Apelido"
                    value={props.name}
                    style={{borderBottomColor:props.nameWrong?"red":props.name?.split(' ')[0]?.length>1&&props.name?.split(' ')[1]?.length>0?props.type==='worker'?"#FF785A":"#0358e5":""}}></input>
                {
                    props.nameWrong?
                    <span className={styles.field_error}>Por favor, escreve o teu nome e apelido.</span>
                    :null
                }

                <p className={styles.register_title} style={{marginTop:'10px'}}>Telemóvel</p>
                <div className={styles.input_wrapper} 
                    style={{borderColor:props.phoneWrong?"red":!props.phoneWrong&&props.phone?.length===9?props.type==='worker'?"#FF785A":"#0358e5":""}}>
                    <img src={portugal} className={styles.flag}/>
                    <span className={styles.input_wrapper_divider}>.</span>
                    <input
                    onKeyDown={e => props.handleKeyDownRegister('name', e)}
                    tabindex={props.registarTab===1?'1':'-1'}
                    autoComplete="new-password"
                    maxLength={11} 
                    onChange={e => props.setPhoneHandler(e.target.value)} 
                    value={props.phoneVisual} 
                    className={styles.login_input_new} 
                    placeholder="912345678">
                    </input>
                </div>
                {
                        props.phoneWrong?
                        <span className={styles.field_error}>O número de telemóvel não é valido.</span>
                        :null
                    }
                
            </div>
            

            <div className={styles.login}>
                <span className={styles.area_bot_intro_wrapper}>
                    <EmailIcon className={styles.area_bot_intro_icon} style={{color:props.type==='worker'?"#FF785A":"#0358e5"}}/>
                    <span className={styles.area_bot_intro_strong_two}>{props.email}</span>
                </span>

                <span className={styles.area_bot_intro_wrapper}>
                    <PersonIcon className={styles.area_bot_intro_icon} style={{color:props.type==='worker'?"#FF785A":"#0358e5"}}/>
                    <span className={styles.area_bot_intro_strong_two}>{props.name}</span>
                </span>
                <span className={styles.area_bot_intro_wrapper} style={{marginBottom:'20px'}}>
                    <PhoneIcon className={styles.area_bot_intro_icon} style={{color:props.type==='worker'?"#FF785A":"#0358e5"}}/>
                    <span className={styles.area_bot_intro_strong_two}>{props.phoneVisual}</span>
                </span>
                
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <p className={styles.register_title}>Palavra-passe</p>
                    <div className={styles.area_show_letters} onClick={() => setShowLetters(!showLetters)}>
                        <span className={styles.checkbox_text} style={{fontSize:'0.8rem', marginRight:'5px'}}>Ver caracteres</span>
                            <div style={{cursor:"pointer", marginTop:'0'}} className={styles.container_2}>
                                
                                <input tabindex={'-1'} type="checkbox" readOnly checked={showLetters}/>
                                <span className={styles.checkmark} style={{borderRadius:'20px', height:'20px', width:'20px'}}></span>

                            </div>
                    </div>
                </div>
                
                <span className={styles.area_bot_intro}>Estás a criar uma palavra-passe para o email <span className={styles.area_bot_intro_strong}>{props.email}</span>.</span>
                <div className={styles.area_password}>

                    <div className={styles.area_password_min_wrapper}>
                        <span className={styles.area_password_min}>mín. 8 caracteres</span>
                        <CheckIcon className={styles.area_password_min_icon} style={{color:props.password?.length>7?props.type==='worker'?"#FF785A":"#0358e5":""}}/>
                    </div>
                    <input 
                        tabindex={props.registarTab===2?'1':'-1'}
                        autoComplete="new-password"
                        maxLength={40} 
                        type={showLetters?"none":"password"}
                        onChange={e => props.setPassword(e.target.value)} 
                        className={styles.login_input} 
                        placeholder="Palavra-passe" 
                        value={props.password}
                        style={{borderBottomColor:props.passwordWrong?"red":!props.passwordWrong&&props.password?.length>7?props.type==='worker'?"#FF785A":"#0358e5":""}}></input>
                </div>
                    {
                        props.passwordWrong?
                        <span className={styles.field_error}>Por favor, escreve pelo menos 8 caracteres.</span>
                        :null
                    }
                <input 
                    tabindex={props.registarTab===2?'1':'-1'}
                    onKeyDown={e => props.handleKeyDownRegister('password', e)}
                    autoComplete="new-password"
                    maxLength={40} 
                    type={showLetters?"none":"password"}
                    onChange={e => props.setPasswordRepeat(e.target.value)} 
                    className={styles.login_input} 
                    placeholder="Repetir palavra-passe" 
                    value={props.passwordRepeat}
                    style={{borderBottomColor:props.passwordRepeatWrong?"red":!props.passwordRepeatWrong&&props.passwordRepeat?.length>7?props.type==='worker'?"#FF785A":"#0358e5":"", marginTop:'10px'}}></input>
                    {
                        props.passwordRepeatWrong?
                        <span className={styles.field_error}>As passwords escritas não são identicas.</span>
                        :null
                    }
                
                
                <div style={{cursor:"pointer"}} className={styles.container} onClick={() => props.setTosAccepted(!props.tosAccepted)}>
                    <input tabindex={'-1'} type="checkbox" readOnly checked={props.tosAccepted}/>
                    <span className={styles.checkmark}></span>
                    <span className={styles.checkbox_text}>Li e aceito os <span onClick={e => {
                        props.setTosBanner()
                        e.stopPropagation()
                    }} style={{color:"#0358e5", cursor:'pointer'}}>Termos e Condições.</span></span>
                </div>
            </div>
        </Carousel>
    )
}

export default AuthCarousel