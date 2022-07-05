import React, {useState, useEffect} from 'react'
import styles from './subscription.module.css'
import FaceIcon  from '@mui/icons-material/Face';
import Check from '@mui/icons-material/Check';
import visa from '../assets/visa.png'
import chip from '../assets/chip.png'
import validator from 'validator'

const Subscription = props => {

    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardNumberValid, setCardNumberValid] = useState(false)
    const [cardNumberDisplay, setCardNumberDisplay] = useState("")
    const [cardDate, setCardDate] = useState("")
    const [cardDateDisplay, setCardDateDisplay] = useState("")
    const [cardCVV, setCardCVV] = useState("")

    useEffect(() => {
        if(cardNumber.length>=13) setCardNumberDisplay(`${cardNumber.slice(0,4)} ${cardNumber.slice(4,8)} ${cardNumber.slice(8,12)} ${cardNumber.slice(12)}`)
        else if(cardNumber.length>=9) setCardNumberDisplay(`${cardNumber.slice(0,4)} ${cardNumber.slice(4,8)} ${cardNumber.slice(8)}`)
        else if(cardNumber.length>=5) setCardNumberDisplay(`${cardNumber.slice(0,4)} ${cardNumber.slice(4)}`)
        else{
            setCardNumberDisplay(`${cardNumber.slice(0,4)}`)
        }

        if(validator.isCreditCard(cardNumber)){
            setCardNumberValid(true)
        }
        else{
            setCardNumberValid(false)
        }
    }, [cardNumber])

    useEffect(() => {
        if(cardDate.length>=3) setCardDateDisplay(`${cardDate.slice(0,2)}/${cardDate.slice(2)}`)
        else if(cardDate.length===2) setCardDateDisplay(`${cardDate.slice(0,2)}/`)
        else{
            console.log(cardDate)
            setCardDateDisplay(`${cardDate.slice(0)}`)
        }
    }, [cardDate])

    const setNumberHandler = e => {
        console.log(e.key);
        var key = e.key
        var regex = /[0-9]|\./
        if(e.key === "Tab" || e.key === "Backspace") {}
        else if( !regex.test(key) ) {
            e.preventDefault();
        }
    }

    const setNumberHandlerTwo = val => {
        let number = val.replace(/\s/g, '')
        setCardNumber(number)
    }

    const setDateHandler = e => {
        var key = e.key
        var regex = /[0-9]|\./
        if(e.key === "Tab") {}
        else if(e.key === "Backspace") {
            let number = cardDate.slice(0, -1)
            setCardDate(number)
        }
        else if(!regex.test(key)) {
            e.preventDefault();
        }
        else if(cardDate.length<=3) {
            let date = cardDate + `${e.key}`
            setCardDate(date)
        }
    }

    const setCVVHandler = e => {
        var key = e.key
        var regex = /[0-9]|\./
        if(e.key === "Tab" || e.key === "Backspace") {}
        else if(!regex.test(key)) {
            e.preventDefault();
        }
    }

    const setCVVHandlerTwo = val => {
        setCardCVV(val)
    }

    return (
        <div className={styles.subscription}>
            <div className={styles.subscription_title}>
                <span className={styles.top_title}>Subscrição</span>
            </div>
            <div className={styles.mid}>
                <div className={styles.mid_content}>
                    <div className={styles.display}>
                        <div className={styles.display_top}>
                            <div className={styles.display_user}>
                            {/* {
                                props.user&&props.user.photoUrl?
                                <img className={styles.user_img} src={props.user.photoUrl}/>
                                :<FaceIcon className={styles.sidebar_img_icon}/>
                            } */}
                                <div className={styles.user_top_flex}>
                                    <span className={styles.user_name}>{props.user.name} {props.user.surname}</span>
                                    <span className={styles.user_desc}>Trabalhador</span>
                                </div>
                            </div>
                            <div className={styles.display_right}>
                                <Check className={styles.display_right_icon}/>
                                <span className={styles.display_right_text} style={{color:"#6EB241"}}>Conta Ativa</span>
                            </div>
                        </div>

                    </div>
                    <div className={styles.details}>
                        <div className={styles.details_area}>
                            <div className={styles.card}>
                                <div className={styles.card_top}>
                                    <img src={visa} className={styles.brand}/>
                                </div>
                                <div className={styles.card_mid}>
                                    <img src={chip} className={styles.chip}/>
                                </div>
                                <div className={styles.card_number}>
                                    <span className={styles.card_number_value}>{cardNumberDisplay}</span>
                                </div>
                                <div className={styles.card_name_date}>
                                    <div className={styles.card_name}>
                                        <span className={styles.name_helper}>Nome</span>
                                        <span className={styles.name_val}>{cardName}</span>
                                    </div>
                                    <div className={styles.card_name}>
                                        <span className={styles.name_helper}>Data</span>
                                        <span className={styles.name_val}>{cardDateDisplay}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.details_right}>
                                <span className={styles.details_title}>Detalhes de Pagamento</span>
                                <div className={styles.right_sections_div}>
                                    <div className={styles.right_section}>
                                        <span className={styles.right_helper}>Nome no Cartão</span>
                                        <input className={styles.right_input} maxLength={35} value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Nome Apelido"/>
                                    </div>
                                    <div className={styles.right_section}>
                                        <span className={styles.right_helper}>Número do Cartão</span>
                                        <input className={styles.right_input} 
                                                        onChange={e => setNumberHandlerTwo(e.target.value)} 
                                                        style={{borderColor:cardNumber.length===16&&cardNumberValid?"#6EB241":cardNumber.length===16&&!cardNumberValid?"#ff3b30":""}} 
                                                        maxLength={19} 
                                                        value={cardNumberDisplay} 
                                                        onKeyDown={e => setNumberHandler(e)} 
                                                        placeholder="Ex. 1234 5678 9012 3456"/>
                                    </div>
                                    <div className={styles.right_section_short_div}>
                                        <div className={styles.right_section_short}>
                                            <span className={styles.right_helper}>Válido até</span>
                                            <input className={styles.right_input_short} maxLength={5} value={cardDateDisplay} onKeyDown={e => setDateHandler(e)} placeholder="MM/AA"/>
                                        </div>
                                        <div className={styles.right_section_short}>
                                            <span className={styles.right_helper}>CVV</span>
                                            <input className={styles.right_input_short} onChange={e => setCVVHandlerTwo(e.target.value)} maxLength={3} value={cardCVV} onKeyDown={e => setCVVHandler(e)} placeholder="999"/>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.display_sub} style={{marginTop:"15px"}}>
                            <span className={styles.details_title}>Plano</span>
                            <span className={styles.plano_text}><span className={styles.sub_val_date}>Plano Mensal</span><span className={styles.plano_text_helper}> (30 Dias)</span> | Valor a cobrar: <span className={styles.plano_text_val}>12.99€</span></span>
                        </div>
                        <div className={styles.buttons}>
                            <span className={styles.button_add}>ADICIONAR CARTÃO E PAGAR</span>
                            <span className={styles.button_cancel}>CANCELAR</span>
                        </div>

                        {/* <div className={styles.display_sub}>
                            <span className={styles.sub_pre}>Data da próxima cobrança:</span>
                            <span className={styles.sub_val_date}>27/07/2022</span>
                        </div> */}
                    </div>
                </div>
                
            </div>

            
        </div>
    )
}

export default Subscription