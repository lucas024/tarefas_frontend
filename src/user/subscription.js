import React, {useState, useEffect} from 'react'
import styles from './subscription.module.css'
import Check from '@mui/icons-material/Check';
import visa from '../assets/visa.png'
import chip from '../assets/chip.png'
import validator from 'validator'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';

const Subscription = props => {

    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardNumberValid, setCardNumberValid] = useState(false)
    const [cardNumberDisplay, setCardNumberDisplay] = useState("")
    const [cardDate, setCardDate] = useState("")
    const [cardDateDisplay, setCardDateDisplay] = useState("")
    const [cardCVV, setCardCVV] = useState("")
    const [selectedMenu, setSelectedMenu] = useState(1)
    const [selectedPlan, setSelectedPlan] = useState(null)

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
                <span className={styles.top_title} onClick={() => setSelectedMenu(!selectedMenu)}>Subscrição</span>
            </div>
            <div className={styles.mid}>
                <div className={styles.mid_content}>
                    <div className={styles.display}>
                        <div className={styles.display_top}>
                            <div className={styles.display_user}>
                                <div className={styles.user_top_flex}>
                                    <span className={styles.user_name}>{props.user.name} {props.user.surname}</span>
                                    <span className={styles.user_desc}>Conta Ativa</span>
                                </div>
                            </div>
                            {/* <div className={styles.display_right}>
                                <Check className={styles.display_right_icon}/>
                                <span className={styles.display_right_text} style={{color:"#6EB241"}}>Conta Ativa</span>
                            </div> */}
                            <div className={styles.display_right}>
                                <span className={styles.sub_pre}>Data da próxima cobrança:</span>
                                <span className={styles.sub_val_date} style={{marginLeft:"5px"}}>27/07/2022</span>
                            </div>
                        </div>
                    </div>

                    <span className={styles.subtitle}>A minha Subcrição</span>
                    <div className={styles.divider} />
                    {
                        !selectedMenu?
                        <div className={styles.plans}>
                            <span className={styles.subtitle_sub}>A Selecionar <span style={{fontWeight:"500"}}>Plano</span> e <span style={{fontWeight:"500"}}>Cartão</span></span>
                            <div className={styles.plans_area}>
                                <p className={styles.plans_title}>Escolher o plano</p>
                                <div className={styles.plans_sections}>
                                    <div className={styles.section}>
                                        <img src={basic} className={styles.section_img}/>
                                        <span className={styles.section_type}>Mensal</span>
                                        <span className={styles.section_type_desc}>Pagamentos de 30 em 30 dias</span>
                                        <div className={styles.section_valor_div}>
                                            <div className={styles.section_valor_top}>
                                                <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                <span className={styles.section_valor_top_number}>12</span>
                                                <span className={styles.section_valor_top_number_decimal}>.99</span>
                                            </div>
                                            <span className={styles.section_desc_of_pay}>12.99€/mês</span>
                                        </div>
                                        <span className={styles.section_button}>Selecionar</span>
                                    </div>
                                    <div className={styles.section}>

                                    </div>
                                    <div className={styles.section}>

                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        :
                        <div className={styles.details}>
                            <span className={styles.subtitle_sub}>A Selecionar <span style={{fontWeight:"500"}}>Plano</span> e <span style={{fontWeight:"500"}}>Cartão</span></span>
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
                                <span className={styles.details_title}>Plano <span className={styles.ver_planos}>(VER PLANOS)</span></span>
                                <span className={styles.plano_text}><span className={styles.sub_val_date}>Plano Mensal</span> | Valor a cobrar: <span className={styles.plano_text_val}>12.99€</span></span>
                            </div>
                            <div className={styles.buttons}>
                                <span className={styles.button_add}>ADICIONAR CARTÃO E PAGAR</span>
                                <span className={styles.button_cancel}>CANCELAR</span>
                            </div>
                        </div>
                    }
                        <div className={styles.indicator_div}>
                            <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(0)} style={{opacity:selectedMenu?0.5:1}}>
                                {
                                    selectedPlan?
                                    <Check className={styles.indicator_check}/>
                                    :null
                                }
                                
                                <span className={styles.indicator} style={{backgroundColor:!selectedMenu||selectedPlan?"#FF785A":""}}></span>
                                <p className={styles.indicator_text} style={{color:!selectedMenu||selectedPlan?"#FF785A":""}}>ESCOLHER PLANO</p>
                            </div>
                            <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(1)}>
                                <span className={styles.indicator} style={{backgroundColor:selectedMenu?"#FF785A":""}}></span>
                                <p className={styles.indicator_text} style={{color:selectedMenu?"#FF785A":""}}>PAGAMENTO</p>
                            </div>
                        </div>
                    
                </div>
                
            </div>

            
        </div>
    )
}

export default Subscription