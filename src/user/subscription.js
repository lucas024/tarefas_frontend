import React, {useState, useEffect} from 'react'
import styles from './subscription.module.css'
import Check from '@mui/icons-material/Check';
import chip from '../assets/chip.png'
import validator from 'validator'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import visa from '../assets/visa.png'
import mastercard from '../assets/mastercard_2.jpg'
import american from '../assets/american-express.png'

import { 
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';


const Subscription = props => {

    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardNumberValid, setCardNumberValid] = useState(false)
    const [cardNumberDisplay, setCardNumberDisplay] = useState("")
    const [cardDate, setCardDate] = useState("")
    const [cardDateValid, setCardDateValid] = useState(false)
    const [cardDateDisplay, setCardDateDisplay] = useState("")
    const [cardCVV, setCardCVV] = useState("")
    const [display, setDisplay] = useState(0)
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [cardIssuer, setCardIssuer] = useState(null)
    const [activePaymentMethod, setActivePaymentMethod] = useState({})
    const [alterarPlano, setAlterarPlano] = useState(false)
    const [alterarPagamento, setAlterarPagamento] = useState(false)


    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if(cardNumber.length>=13) setCardNumberDisplay(`${cardNumber.slice(0,4)} ${cardNumber.slice(4,8)} ${cardNumber.slice(8,12)} ${cardNumber.slice(12)}`)
        else if(cardNumber.length>=9) setCardNumberDisplay(`${cardNumber.slice(0,4)} ${cardNumber.slice(4,8)} ${cardNumber.slice(8)}`)
        else if(cardNumber.length>=5) setCardNumberDisplay(`${cardNumber.slice(0,4)} ${cardNumber.slice(4)}`)
        else{
            setCardNumberDisplay(`${cardNumber.slice(0,4)}`)
        }
        if(cardNumber.length>1){
            if(cardNumber.slice(0,1)==="4"){
                setCardIssuer("visa")
            }
            else if(2721>=parseInt(cardNumber.slice(0,4))&&parseInt(cardNumber.slice(0,4))>=2221||55>=parseInt(cardNumber.slice(0,2))&&parseInt(cardNumber.slice(0,2))>=51){
                setCardIssuer("mastercard")
            }
            else if(cardNumber.slice(0,2)==="34"||cardNumber.slice(0,2)==="37"){
                setCardIssuer("american")
            }
        }
        else{
            setCardIssuer(null)
        }
        if(validator.isCreditCard(cardNumber)){
            setCardNumberValid(true)
        }
        else{
            setCardNumberValid(false)
        }
        if(cardNumberValid&&cardDateValid&&cardCVV.length===3&&cardName.length>2){

        }
    }, [cardNumber])

    useEffect(() => {
        if(cardDate.length>=3) setCardDateDisplay(`${cardDate.slice(0,2)}/${cardDate.slice(2)}`)
        else if(cardDate.length===2) setCardDateDisplay(`${cardDate.slice(0,2)}/`)
        else{
            setCardDateDisplay(`${cardDate.slice(0)}`)
        }
        if(cardDate.length===4&&cardDate.slice(0,2)<=12){
            let test = new Date()
            test.setFullYear(`20${cardDate.slice(2)}`, parseInt(cardDate.slice(0,2))-1, 1)
            test.setMonth(test.getMonth()+1)
            test.setDate(test.getDate()-1)
            test.setHours(23)
            test.setMinutes(59)
            test.setSeconds(59)
            if(validator.isAfter(test.toString())) setCardDateValid(true)
        }
        else{
            setCardDateValid(false)
        }
    }, [cardDate])

    useEffect(() => {
        if(props.user.payment_methods.length>0){
            setActivePaymentMethod(props.user.payment_methods[0])
            setSelectedPlan(props.user.plan)
        }
    }, [props.user])

    const handlePayment = async () => {
        if (!stripe || !elements) {
            return;
        }
        const res = await axios.post(`${props.api_url}/create-payment-intent`, {
            stripe_id: props.user.stripe_id,
            amount: selectedPlan&&selectedPlan===1?1299:selectedPlan===2?6889:11989
        })
        const {paymentIntent} = await stripe.confirmCardPayment(
            res.data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement)
                }
            }
        )

        switch (paymentIntent.status) {
            case 'succeeded':
                const obj = await axios.post(`${props.api_url}/get-payment-methods-customer`, {
                    stripe_id: props.user.stripe_id
                })
                console.log(obj);
                if(obj.data.paymentMethods.data.length>0){
                    const final = await axios.post(`${props.api_url}/worker/set_payment_methods`, {
                        _id: props.user._id,
                        paymentMethods: obj.data.paymentMethods.data,
                        plan: selectedPlan,
                    })
                    console.log(final);
                }
                break;
  
            // case 'processing':
            //   setMessage("Payment processing. We'll update you when payment is received.");
            //   break;
  
            // case 'requires_payment_method':
            //   setMessage('Payment failed. Please try another payment method.');
            //   break;
  
            // default:
            //   setMessage('Something went wrong.');
            //   break;
          }

        console.log(paymentIntent);
    }

    return (
        <div className={styles.subscription}>
            <div className={styles.subscription_title}>
                <span className={styles.top_title} onClick={() => setDisplay(display===0?1:display===1?0:1)}>Subscrição</span>
            </div>
            <div className={styles.mid}>
                <div className={styles.mid_content}>
                    <div className={styles.display}>
                        <div className={styles.display_top}>
                            <div className={styles.display_user}>
                                <div className={styles.user_top_flex}>
                                    <span className={styles.user_desc}>Conta Ativa</span>
                                    <span className={styles.user_desc_helper}>(Plano Mensal)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        display===0?
                        <div className={display===0?styles.display_zero:`${styles.display_zero} ${styles.display_zero_hide}`}>
                            <span className={styles.subtitle}>Plano</span>
                            <div className={styles.divider}/>
                            <div>
                                <span className={styles.subtitle_sub}><span style={{fontWeight:"500"}}>Plano Ativo</span></span>
                                <div className={styles.selected_plan_info}>
                                    <div className={styles.info_div}>
                                        <CircleIcon className={styles.info_icon}/>
                                        <div className={styles.info_subdiv}>
                                            <span className={styles.info_text}>€12.99</span>
                                        </div>
                                    </div>
                                    <div className={styles.info_div}>
                                        <CircleIcon className={styles.info_icon}/>
                                        <div className={styles.info_subdiv}>
                                            <span className={styles.info_text}>Cobranças mensais (30 a 30 dias)</span>
                                        </div>
                                    </div>
                                    <div style={{marginTop:"10px"}}>
                                        <span className={styles.prox_cobr}>Data da próxima cobrança: </span><span className={styles.prox_cobr_val}> 27/07/2022</span>
                                    </div>
                                    <span className={styles.cancel} style={{marginTop:"10px", color:"#ccc"}}>O cancelamento da subscrição pode ser feito a <span style={{fontWeight:"500"}}>qualquer altura</span></span>
                                </div>
                            </div>
                            <span className={styles.subtitle}>Método de Pagamento</span>
                            <div className={styles.divider}/>
                            <span className={styles.subtitle_sub}><span style={{fontWeight:"500"}}>Cartão Ativo</span></span>
                            <div className={styles.initial}>
                                <div className={styles.card} style={{marginTop:"10px"}}>
                                    <div className={styles.card_top}>
                                        {
                                            activePaymentMethod.card?.brand==="visa"?
                                            <img src={visa} className={styles.brand}/>
                                            :
                                            activePaymentMethod.card?.brand==="mastercard"?
                                            <img src={mastercard} className={styles.brand_master}/>
                                            :
                                            activePaymentMethod.card?.brand==="american"?
                                            <img src={american} className={styles.brand_american}/>
                                            :null
                                        }
                                    </div>
                                    <div className={styles.card_mid}>
                                        <img src={chip} className={styles.chip}/>
                                    </div>
                                    <div className={styles.card_number}>
                                        <span className={styles.card_number_value}>**** **** **** {activePaymentMethod.card?.last4}</span>
                                    </div>
                                    <div className={styles.card_name_date}>
                                        <div className={styles.card_name}>
                                            <span className={styles.name_helper}>Nome</span>
                                            <span className={styles.name_val}>{cardName}</span>
                                        </div>
                                        <div className={styles.card_name}>
                                            <span className={styles.name_helper}>Data</span>
                                            <span className={styles.name_val}>{activePaymentMethod.card?.exp_month}/{activePaymentMethod.card?.exp_year}</span>
                                        </div>
                                    </div>
                                </div>                                
                            </div>

                            <div className={styles.card_right}>
                                {/* <span className={styles.card_right_title}>Cartão Ativo</span> */}
                                <div className={styles.card_right_button} onClick={() => {
                                    setDisplay(1)
                                    setSelectedMenu(0)
                                    setAlterarPlano(true)}}>
                                    <span>Alterar <span style={{fontWeight:600}}>Plano</span></span>
                                </div>
                                <div className={styles.card_right_button} onClick={() => {
                                    setDisplay(1)
                                    setSelectedMenu(1)
                                    setAlterarPagamento(true)}}>
                                    <span>Alterar <span style={{fontWeight:600}}>Método de Pagamento</span></span>
                                </div>
                                <div className={styles.card_right_button_remove}>
                                    <span>Cancelar Subscrição</span>
                                </div>
                                <div className={styles.card_right_bottom}>
                                    
                                </div>
                            </div>
                        </div>
                        :display===1?
                        <div className={styles.display_one}>
                            <span className={styles.subtitle_sub} style={{marginTop:"-20px"}}><span style={{fontWeight:"500"}}>
                                {
                                    alterarPagamento?
                                    "Alterar Cartão"
                                    :alterarPlano?
                                    "Alterar Plano"
                                    :"A minha subscrição"
                                }
                                </span></span>
                            <div className={!selectedMenu?styles.plans:`${styles.plans} ${styles.plans_hide}`}>

                                <div className={styles.plans_area}>
                                    <p className={styles.plans_title}>Escolher o plano</p>
                                    <div className={styles.plans_sections}>
                                        <div className={selectedPlan===1?styles.section_selected:styles.section} onClick={() => setSelectedPlan(1)}>
                                            <img src={basic} className={styles.section_img}/>
                                            <span className={styles.section_type}>Mensal</span>
                                            <span className={styles.section_type_desc}>Pagamento a cada 30 dias</span>
                                            <div className={styles.section_valor_div}>
                                                <div className={styles.section_valor_top}>
                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                    <span className={styles.section_valor_top_number}>12</span>
                                                    <span className={styles.section_valor_top_number_decimal}>.99</span>
                                                </div>
                                                <span className={styles.section_desc_of_pay}>12.99€/mês</span>
                                            </div>
                                            {
                                                selectedPlan===1?
                                                <div className={styles.section_button_selected}>
                                                    <span className={styles.section_button_selected_text}>Selecionado</span>
                                                    <Check className={styles.section_button_selected_icon}/>
                                                </div>
                                                
                                                :<span className={styles.section_button}>Selecionar</span>
                                            }
                                            
                                        </div>
                                        <div className={selectedPlan===2?styles.section_selected:styles.section} onClick={() => setSelectedPlan(2)}>
                                            <span className={styles.popular}>POPULAR</span>
                                            <img src={medium} className={styles.section_img}/>
                                            <span className={styles.section_type}>Semestral</span>
                                            <span className={styles.section_type_desc}>Pagamento a cada 180 dias</span>
                                            <div className={styles.section_valor_div}>
                                                <div className={styles.section_valor_top}>
                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                    <span className={styles.section_valor_top_number}>68</span>
                                                    <span className={styles.section_valor_top_number_decimal}>.89</span>
                                                </div>
                                                <span className={styles.section_desc_of_pay}>11.49€/mês</span>
                                            </div>
                                            {
                                                selectedPlan===2?
                                                <div className={styles.section_button_selected}>
                                                    <span className={styles.section_button_selected_text}>Selecionado</span>
                                                    <Check className={styles.section_button_selected_icon}/>
                                                </div>
                                                
                                                :<span className={styles.section_button}>Selecionar</span>
                                            }
                                        </div>
                                        <div className={selectedPlan===3?styles.section_selected:styles.section} onClick={() => setSelectedPlan(3)}>
                                            <img src={pro} className={styles.section_img}/>
                                            <span className={styles.section_type}>Anual</span>
                                            <span className={styles.section_type_desc}>Pagamento a cada 360 dias</span>
                                            <div className={styles.section_valor_div}>
                                                <div className={styles.section_valor_top}>
                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                    <span className={styles.section_valor_top_number}>119</span>
                                                    <span className={styles.section_valor_top_number_decimal}>.89</span>
                                                </div>
                                                <span className={styles.section_desc_of_pay}>9.99€/mês</span>
                                            </div>
                                            {
                                                selectedPlan===3?
                                                <div className={styles.section_button_selected}>
                                                    <span className={styles.section_button_selected_text}>Selecionado</span>
                                                    <Check className={styles.section_button_selected_icon}/>
                                                </div>
                                                
                                                :<span className={styles.section_button}>Selecionar</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.selected_plan}>
                                    <span className={styles.selected_plan_title}>
                                        {
                                        alterarPlano?
                                        "ALTERAR PLANO"
                                        :"PLANO"
                                        }
                                    </span>
                                    {
                                        !alterarPlano?
                                        selectedPlan===1?
                                        <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                        :selectedPlan===2?
                                        <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                        :selectedPlan===3?
                                        <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                        :<span className={styles.selected_plan_no_value}>Sem Plano Selecionado</span>
                                        :null
                                    }
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        {
                                            alterarPlano?
                                            props.user.plan===1?
                                            <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                            :props.user.plan===2?
                                            <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                            :<span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                            :null
                                        }
                                        <ArrowRightAltIcon className={styles.arrow}/>
                                        {
                                            alterarPlano?
                                            selectedPlan===1&&props.user.plan!==1?
                                            <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                            :selectedPlan===2&&props.user.plan!==2?
                                            <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                            :selectedPlan===3&&props.user.plan!==3?
                                            <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                            :<span className={styles.selected_plan_no_value}>Selecione um plano diferente</span>
                                            :null
                                        }
                                    </div>
                                    
                                </div>
                                {
                                    alterarPlano?
                                    <span className={styles.alterar_plano}>O alteramento do plano terá efeito imediato, mas <span style={{fontWeight:"600"}}>apenas será cobrado no fim do plano corrente <span style={{color:"#FF785A"}}>(27/07/2022)</span></span>.</span>
                                    :null
                                }
                                <div className={styles.buttons}>
                                    <span className={selectedPlan&&props.user.plan!==selectedPlan?styles.button_add:styles.button_add_disabled} onClick={() => {
                                        if(props.user.plan===-1){
                                            selectedPlan&&setSelectedMenu(1)
                                        }
                                        else if(selectedPlan&&props.user.plan!==selectedPlan){
                                            //handle tings
                                            console.log("osid");
                                        }
                                        }}>{
                                        props.user.plan!==-1?
                                        "Alterar"
                                        :"Continuar"}</span>
                                    <span className={styles.button_cancel} onClick={() => {
                                        setDisplay(0)
                                        setSelectedMenu(0)
                                        setSelectedPlan(props.user.plan)
                                        setAlterarPlano(false)}}>CANCELAR</span>
                                </div>
                            </div>
                            {/* CARTAO */}
                            <div className={selectedMenu?styles.details:`${styles.details} ${styles.details_hide}`}>
                                <div className={styles.details_area}>
                                    <div className={styles.card}>
                                        <div className={styles.card_top}>
                                            {
                                                cardIssuer==="visa"?
                                                <img src={visa} className={styles.brand}/>
                                                :
                                                cardIssuer==="mastercard"?
                                                <img src={mastercard} className={styles.brand_master}/>
                                                :
                                                cardIssuer==="american"?
                                                <img src={american} className={styles.brand_american}/>
                                                :null
                                            }
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
                                                <CardNumberElement className={styles.right_input} style={{borderColor:cardNumber.length===16&&cardNumberValid?"#6EB241":cardNumber.length===16&&!cardNumberValid?"#ff3b30":""}}/>
                                                {/* <input className={styles.right_input} 
                                                                onChange={e => setNumberHandlerTwo(e.target.value)} 
                                                                style={{borderColor:cardNumber.length===16&&cardNumberValid?"#6EB241":cardNumber.length===16&&!cardNumberValid?"#ff3b30":""}} 
                                                                maxLength={19} 
                                                                value={cardNumberDisplay} 
                                                                // onKeyDown={e => setNumberHandler(e)} 
                                                                placeholder="Ex. 1234 5678 9012 3456"/> */}
                                                {
                                                    cardNumber.length===16&&!cardNumberValid?
                                                    <span className={styles.card_wrong}>Este número de cartão é inválido</span>
                                                    :null
                                                }
                                            </div>
                                            <div className={styles.right_section_short_div}>
                                                <div className={styles.right_section_short}>
                                                    <span className={styles.right_helper}>Válido até</span>
                                                    <CardExpiryElement className={styles.right_input_short} 
                                                                style={{borderColor:cardDate.length===4&&cardDateValid?"#6EB241":cardDate.length===4&&!cardDateValid?"#ff3b30":""}}                                   
                                                                />
                                                    {
                                                        cardDate.length===4&&!cardDateValid?
                                                        <span className={styles.card_wrong}>Data inválida</span>
                                                        :null
                                                    }
                                                </div>
                                                <div className={styles.right_section_short}>
                                                    <span className={styles.right_helper}>CVV</span>
                                                    <CardCvcElement className={styles.right_input_short}
                                                        style={{borderColor:cardCVV.length===3?"#6EB241":""}}/>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className={styles.selected_plan} style={{height:alterarPagamento?"30px":"90px"}}>
                                    {
                                        alterarPagamento?
                                        <span className={styles.alterar_plano}>O alteramento do cartão terá efeito imediato, mas <span style={{fontWeight:"600"}}>apenas será cobrado no fim do plano corrente <span style={{color:"#FF785A"}}>(27/07/2022)</span></span>.</span>
                                        :null
                                    }
                                    {
                                        alterarPagamento?
                                        null
                                        :<span className={styles.selected_plan_title}>Plano</span>
                                    }
                                    
                                    {
                                        !alterarPagamento?
                                        selectedPlan===1?
                                        <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                        :selectedPlan===2?
                                        <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                        :
                                        <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                        :null
                                    }
                                    {
                                        !alterarPagamento?
                                        selectedPlan===1?
                                        <div className={styles.selected_plan_info}>
                                            <div className={styles.info_div}>
                                                <CircleIcon className={styles.info_icon}/>
                                                <div className={styles.info_subdiv}>
                                                    <span className={styles.info_text_helper}>A cobrar:</span>
                                                    <span className={styles.info_text}>€12.99</span><span style={{marginLeft:"5px", fontSize:"0.7rem"}}> (€12.99/mês)</span>
                                                </div>
                                            </div>
                                            <div className={styles.info_div}>
                                                <CircleIcon className={styles.info_icon}/>
                                                <div className={styles.info_subdiv}>
                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                    <span className={styles.info_text}>Cobranças mensais (30 a 30 dias)</span>
                                                </div>
                                            </div>
                                            <span className={styles.cancel}>O cancelamento da subscrição pode ser feito a <span style={{textDecoration:"underline", fontWeight:"500"}}>qualquer altura!</span></span>
                                        </div>
                                        :
                                        selectedPlan===2?
                                        <div className={styles.selected_plan_info}>
                                            <div className={styles.info_div}>
                                                <CircleIcon className={styles.info_icon}/>
                                                <div className={styles.info_subdiv}>
                                                    <span className={styles.info_text_helper}>A cobrar:</span>
                                                    <span className={styles.info_text}>€68.89</span><span style={{marginLeft:"5px", fontSize:"0.7rem"}}> (€12.99/mês)</span>
                                                </div>
                                            </div>
                                            <div className={styles.info_div}>
                                                <CircleIcon className={styles.info_icon}/>
                                                <div className={styles.info_subdiv}>
                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                    <span className={styles.info_text}>Cobranças semestrais (180 a 180 dias)</span>
                                                </div>
                                            </div>
                                            <span className={styles.cancel}>O cancelamento da subscrição pode ser feito a <span style={{textDecoration:"underline", fontWeight:"500"}}>qualquer altura!</span></span>
                                        </div>
                                        :
                                        <div className={styles.selected_plan_info}>
                                            <div className={styles.info_div}>
                                                <CircleIcon className={styles.info_icon}/>
                                                <div className={styles.info_subdiv}>
                                                    <span className={styles.info_text_helper}>A cobrar:</span>
                                                    <span className={styles.info_text}>€119.89</span><span style={{marginLeft:"5px", fontSize:"0.7rem"}}> (€12.99/mês)</span>
                                                </div>
                                            </div>
                                            <div className={styles.info_div}>
                                                <CircleIcon className={styles.info_icon}/>
                                                <div className={styles.info_subdiv}>
                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                    <span className={styles.info_text}>Cobranças mensais (360 a 360 dias)</span>
                                                </div>
                                            </div>
                                            <span className={styles.cancel}>O cancelamento da subscrição pode ser feito a <span style={{textDecoration:"underline", fontWeight:"500"}}>qualquer altura!</span></span>
                                        </div>
                                        :null
                                    }
                                    
                                </div>
                                <div className={styles.buttons}>
                                    <span className={styles.button_add} onClick={() => handlePayment()}>{
                                    activePaymentMethod?
                                    "Alterar Cartão"
                                    :"ADICIONAR CARTÃO E PAGAR"}</span>
                                    <span className={styles.button_cancel} onClick={() => {
                                        setDisplay(0)
                                        setSelectedMenu(0)
                                        setSelectedPlan(props.user.plan)
                                        setAlterarPagamento(false)}}>CANCELAR</span>
                                </div>
                            </div>
                            <div className={styles.indicator_div} style={{top:alterarPlano?"450px":alterarPagamento?"360px":""}}>

                                {
                                    alterarPagamento?
                                    null
                                    :
                                    <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(0)} style={{opacity:selectedMenu?0.5:1, transform:selectedMenu?"scale(1)":"scale(1.3)", transition:"ease-in-out all"}}>
                                        {
                                            selectedPlan&&!alterarPlano?
                                            <Check className={styles.indicator_check}/>
                                            :null
                                        }
                                        
                                        <span className={styles.indicator} style={{backgroundColor:!selectedMenu||selectedPlan?"#FF785A":""}}></span>
                                        <p className={styles.indicator_text} style={{color:!selectedMenu||selectedPlan?"#FF785A":""}}>
                                        {
                                            alterarPlano?
                                            "ALTERAR PLANO"
                                            :"ESCOLHER PLANO"
                                        }
                                        </p>
                                    
                                    </div>
                                }
                                
                                {
                                    alterarPlano?
                                    null
                                    :
                                    <div className={styles.indicator_subdiv} style={{transform:!selectedMenu?"scale(1)":"scale(1.3)", transition:"ease-in-out all"}} onClick={() => selectedPlan&&setSelectedMenu(1)}>
                                        <span className={styles.indicator} style={{backgroundColor:selectedMenu?"#FF785A":""}}></span>
                                        <p className={styles.indicator_text} style={{color:selectedMenu?"#FF785A":""}}>
                                            {
                                                alterarPagamento?
                                                "ALTERAR CARTÃO"
                                                :"PAGAMENTO"
                                            }
                                        </p>
                                    </div>
                                }
                                
                            </div>

                        </div>

                        :null
                    }
                </div>
                
            </div>

            
        </div>
    )
}

export default Subscription