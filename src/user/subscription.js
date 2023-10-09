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
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';
import Popup from './../transitions/popup';

import { 
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import Loader from '../general/loader';
import ClearIcon from '@mui/icons-material/Clear';
import NoPage from '../general/noPage';

const Subscription = props => {

    const [cardName, setCardName] = useState("")
    const [cardNumberDisplay, setCardNumberDisplay] = useState("")
    const [display, setDisplay] = useState(null)
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [cardIssuer, setCardIssuer] = useState(null)
    const [alterarPlano, setAlterarPlano] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cancelSubscriptionPopin, setCancelSubscriptionPopin] = useState(false)
    const [cancelSubscriptionPopinFail, setCancelSubscriptionPopinFail] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)
    const [failPopin, setFailPopin] = useState(false)
    const [successPlanPopin, setSuccessPlanPopin] = useState(false)
    const [failPlanPopin, setFailPlanPopin] = useState(false)
    const [cancelPlanPopin, setCancelPlanPopin] = useState(false)
    const [cancelSubscription, setCancelSubscription] = useState(false)
    const [endDate, setEndDate] = useState(null)
    const [currentDate, setCurrentDate] = useState(null)

    const [validCard, setValidCard] = useState(false)
    const [validDate, setValidDate] = useState(false)
    const [validCvc, setValidCvc] = useState(false)

    const [isCanceled, setIsCanceled] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false)

    const [subscriptionStatus, setSubscriptionStatus] = useState(null)
    const [schedule, setSchedule] = useState(null)

    const stripe = useStripe();
    const elements = useElements();

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        setLoading(true)
        if(props.user.subscription){
            setSelectedPlan(null)
            axios.post(`${props.api_url}/retrieve-subscription-and-schedule`, {
                subscription_id: props.user.subscription.id,
                schedule_id: props.user.subscription.sub_schedule
            })
            .then(res => {
                console.log(res);
                if(res.data.schedule.end_behavior === "cancel"){
                    console.log("canceled");
                    setDisplay(3)
                    setIsCanceled(true)
                }
                else{
                    setDisplay(0)
                    setIsCanceled(false)
                }
                setSubscriptionStatus(res.data.subscription.status)
                setSchedule(res.data.schedule)
                setIsLoaded(true)
                setLoading(false)
                setEndDate(res.data.schedule.current_phase?.end_date*1000)
                setCurrentDate(new Date().getTime())
            })
        }
        else{
            setDisplay(3)
            setIsLoaded(true)
            setLoading(false)
        }
        
    }, [props.user])

    const getDateToString = date => {
        let val = new Date(date*1000).toISOString()
        let string = val.split("T")[0]
        return `${string.slice(-2)}/${string.slice(5,7)}/${string.slice(0,4)}`
    }

    const handlePayment = async () => {
        setLoading(true)
        if (!stripe || !elements) {
            setLoading(false)
            return;
        }

        let sub_obj = await axios.post(`${props.api_url}/create-subscription`, {
            stripe_id: props.user.stripe_id,
            amount: selectedPlan&&selectedPlan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":selectedPlan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj"
        })

        const paymentConfirmation = await stripe.confirmCardPayment(
                sub_obj.data.clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: cardName
                        }
                    }
                }
            )

        switch (paymentConfirmation.paymentIntent.status) {
            case "succeeded":
                await axios.post(`${props.api_url}/confirm-subscription`, {
                    pm_id: paymentConfirmation.paymentIntent.payment_method,
                    plan: selectedPlan,
                    _id: props.user._id,
                    name: cardName,
                    sub_id: sub_obj.data.subscriptionId
                })
                props.refreshWorker()
                setSuccessPopin()
                setLoading(false)
                setDisplay(0)
                setSuccessPopin(true)
                setTimeout(() => setSuccessPopin(false), 4000)
                break;
  
            // case 'processing':
            //   setMessage("Payment processing. We'll update you when payment is received.");
            //   break;
  
            case 'requires_payment_method':
                setLoading(false)
                setFailPopin(true)
                setTimeout(() => setFailPopin(false), 4000)
                break;
  
            default:
                setLoading(false)
                break;
          }
    }

    const getPlanFromPriceId = priceId => {
        if(priceId === "price_1LKQUyKC1aov6F9pTpM3gn0l") return 2
        else if(priceId === "price_1LKQVEKC1aov6F9p4RgyXAqj") return 3
        else return 1
    }

    const updateCard = async () => {
        setLoading(true)
        let val = await axios.post(`${props.api_url}/create-setup-intent`, {
            stripe_id: props.user.stripe_id,
        })
        
        let final = await stripe.confirmCardSetup(val.data.clientSecret, {
            payment_method: {
                type: 'card',
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name: cardName,
                }
            }
        })

        console.log(final);

        switch (final.setupIntent.status) {
            case "succeeded":
                axios.post(`${props.api_url}/update-subscription-plan`, {
                    subscription: props.user.subscription,
                    current_amount: props.user.subscription.plan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":props.user.subscription.plan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj",
                    new_amount: selectedPlan&&selectedPlan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":selectedPlan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj",
                    plan: props.user.subscription.plan,
                    new_plan: selectedPlan,
                    payment_method: final.setupIntent.payment_method,
                    _id: props.user._id,
                    from_canceled: schedule.phases[0].metadata.from_canceled
                }).then(() => {
                    props.refreshWorker()
                    setLoading(false)
                    setSuccessPopin(true)
                    setTimeout(() => setSuccessPopin(false), 4000)})
        }
    }

    const updatePlan = async () => {
        setLoading(true)
        if (!stripe || !elements) {
            return;
        }

        let val = await axios.post(`${props.api_url}/update-subscription-plan`, {
            subscription: props.user.subscription,
            current_amount: props.user.subscription.plan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":props.user.subscription.plan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj",
            new_amount: selectedPlan&&selectedPlan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":selectedPlan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj",
            plan: props.user.subscription.plan,
            new_plan: selectedPlan,
            payment_method: props.user.subscription.payment_method_id,
            _id: props.user._id,
            from_canceled: schedule.phases[0].metadata.from_canceled
        })

        switch (val.status) {
            case 200:
                props.refreshWorker()
                setDisplay(0)
                setSelectedMenu(0)
                setLoading(false)
                setSuccessPlanPopin(true)
                setTimeout(() => setSuccessPlanPopin(false), 4000)
                break;
  
        //     // case 'processing':
        //     //   setMessage("Payment processing. We'll update you when payment is received.");
        //     //   break;
  
            case 'requires_payment_method':
                setLoading(false)
                setFailPlanPopin(true)
                setTimeout(() => setFailPlanPopin(false), 4000)
                break;
  
            default:
                setLoading(false)
                break;
        }
    }

    const cancelPlanChange = async () => {
        setLoading(true)
        if (!stripe || !elements) {
            return;
        }

        let val = await axios.post(`${props.api_url}/cancel-subscription-plan-update`, {
            subscription: props.user.subscription,
            current_amount: props.user.subscription.plan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":props.user.subscription.plan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj",
        })

        switch (val.status) {
            case 200:
                props.refreshWorker()
                setDisplay(0)
                setSelectedMenu(0)
                setLoading(false)
                setCancelPlanPopin(true)
                setTimeout(() => setCancelPlanPopin(false), 4000)
                break;
  
        //     // case 'processing':
        //     //   setMessage("Payment processing. We'll update you when payment is received.");
        //     //   break;
  
            default:
                props.refreshWorker()
                setDisplay(3)
                setLoading(false)
                setCancelPlanPopin(true)
                setTimeout(() => setCancelPlanPopin(false), 4000)
                break;
        }
    }

    const extenseDate = date => {
        let iso_date = new Date(date*1000)
        let day = iso_date.toISOString().split("T")[0].slice(-2)
        let month = monthNames[parseInt(iso_date.toISOString().split("T")[0].slice(5,7))]
        let year = iso_date?.toISOString().split("T")[0].slice(0,4)
        return `${day} de ${month}, ${year}`
    }

    const cancelSubscriptionHandler = () => {
        setCancelSubscription(true)
    }

    const cancelSubscriptionFinal = async () => {
        setCancelSubscription(false)
        setLoading(true)
        if (!stripe || !elements) {
            return;
        }

        let val = await axios.post(`${props.api_url}/cancel-subscription`, {
            subscription: props.user.subscription,
            current_amount: props.user.subscription.plan===1?"price_1LKQUSKC1aov6F9p9gL1euLW":props.user.subscription.plan===2?"price_1LKQUyKC1aov6F9pTpM3gn0l":"price_1LKQVEKC1aov6F9p4RgyXAqj",
        })

        console.log(val);

        switch (val.status) {
            case 200:
                props.refreshWorker()
                setLoading(false)
                setCancelSubscriptionPopin(true)
                setTimeout(() => setCancelSubscriptionPopin(false), 4000)
                break;
  
        //     // case 'processing':
        //     //   setMessage("Payment processing. We'll update you when payment is received.");
        //     //   break;
  
            default:
                setLoading(false)
                break;
        }
    }

    const cardValidHanlder = val => {
        setCardIssuer(val?.brand)
        if(val.complete === true){
            setValidCard(true)
            setCardNumberDisplay("**** **** **** ****")
        }
        else{
            setValidCard(false)
            setCardNumberDisplay("")
        }
    }

    const dateValidHanlder = val => {
        if(val.complete === true){
            setValidDate(true)
        }
        else{
            setValidDate(false)
        }
    }

    const cvcValidHanlder = val => {
        if(val.complete === true){
            setValidCvc(true)
        }
        else{
            setValidCvc(false)
        }
    }


    

    return (
        <div className={styles.subscription}>
            <Loader loading={loading}/>
            {
                isLoaded?
                <div style={{position:"relative", height:'100%'}}>
                    {
                        cancelSubscription?
                            <Popup
                                type = 'cancel_subscription'
                                cancelHandler={() => setCancelSubscription(false)}
                                date = {schedule.current_phase?.end_date&&extenseDate(schedule.current_phase?.end_date)}
                                confirm = {() => cancelSubscriptionFinal()}
                                />
                            :null
                    }
                    <div className={styles.subscription_title}>
                        <span className={styles.top_title}>Subscrição</span>
                    </div>
                    <div className={styles.mid}>
                    
                    <CSSTransition 
                        in={successPopin||failPopin||successPlanPopin||failPlanPopin||cancelPlanPopin||cancelSubscriptionPopin}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <Sessao text={successPopin?"Subscricação ativada com sucesso!"
                                        :failPopin?"Cartão inválido. Experimente outro!"
                                        :successPlanPopin?"Alteração de Plano marcado com sucesso!"
                                        :failPlanPopin?"Erro ao alterar plano."
                                        :cancelPlanPopin?"Alteração de Plano cancelado com sucesso."
                                        :cancelSubscriptionPopin?"Subscrição eliminada com sucesso."
                                        :
                                        ""}/>
                    </CSSTransition>

                    
                        <div className={styles.mid_content}>
                            <div className={styles.display} style={{backgroundColor:endDate>currentDate?"#0358e5":"#fdd835"}}>
                                <div className={styles.display_top}>
                                    <div className={styles.display_user}>
                                        <div className={styles.user_top_flex} onClick={() => updateCard()}>
                                            <span className={styles.user_desc_top}>Estado da Subscrição</span>
                                            {
                                                endDate>currentDate?
                                                <span className={styles.user_desc}>ATIVADA</span>
                                                :<span className={styles.user_desc_dark}>DESATIVADA</span>
                                            }
                                            
                                            {
                                                isCanceled?
                                                <div className={styles.future_end}>
                                                    (Termina <span style={{textDecoration:"underline"}}>{schedule.current_phase?.end_date&&extenseDate(schedule.current_phase?.end_date)}</span>)
                                                </div>
                                                :null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                display===0&&schedule&&!isCanceled?
                                <div className={display===0?styles.display_zero:`${styles.display_zero} ${styles.display_zero_hide}`}>
                                    <span className={styles.subtitle}>Plano</span>
                                    <div className={styles.divider}/>
                                    <div>
                                        <div style={{display:"flex", margin:"10px 0", alignItems:"center"}}>
                                            <span className={styles.subtitle_sub} style={{margin:"0"}}><span style={{fontWeight:"500"}}>Plano Ativo - </span></span>
                                            <span className={styles.ya}>{
                                                schedule.phases.length===2&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?"PLANO MENSAL"
                                                :!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===1?"PLANO MENSAL"
                                                :
                                                schedule.phases.length===2&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===2?"PLANO SEMESTRAL"
                                                :!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===2?"PLANO SEMESTRAL"
                                                :
                                                schedule.phases.length===2&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===3?"PLANO ANUAL"
                                                :!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===3?"PLANO ANUAL"
                                                :null
                                                }
                                            </span>
                                            <span>
                                                {
                                                    schedule.phases.length===2&&schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.helper_two}>(Início a {getDateToString(schedule.current_phase?.end_date)} - fim da subscrição previamente cancelada)</span>
                                                    :null
                                                }
                                            </span>
                                        </div>
                                        
                                        <div className={styles.selected_plan_info}>
                                                {
                                                    schedule&&schedule.phases.length>1&&!schedule.phases[0].metadata.from_canceled?
                                                    <div className={styles.plan_meio}>
                                                        <span className={styles.prox_cobr}>Data da próxima cobrança e <span style={{fontWeight:600}}>alteração de plano</span></span>
                                                        <span className={styles.prox_cobr_val} style={{color:"white"}}> {schedule.current_phase?.end_date&&extenseDate(schedule.current_phase?.end_date)}</span>
                                                    </div>
                                                    :
                                                    <div className={styles.plan_meio}>
                                                        <span className={styles.prox_cobr}>Data da próxima cobrança </span>
                                                        <span className={styles.prox_cobr_val} style={{color:"white"}}>{schedule.current_phase?.end_date&&extenseDate(schedule.current_phase?.end_date)}</span>
                                                    </div>

                                                }
                                            {
                                                schedule&&schedule.phases.length>1&&!schedule.phases[0].metadata.from_canceled?
                                                <div className={styles.changing_plan} style={{marginTop:"15px"}}>
                                                    <span className={styles.prox_cobr} style={{color:"#ccc", fontSize:"0.8rem", textTransform:"uppercase"}}>Alteração Pendente</span>
                                                    <div style={{display:"flex", alignItems:"center", marginTop:"5px", justifyContent:"center"}}>
                                                        <div>
                                                            <span className={styles.prox_cobr_val} style={{fontWeight:"400"}}>{getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===1?"PLANO MENSAL":getPlanFromPriceId(schedule.phases[0]?.plans[0].price)===2?"PLANO SEMESTRAL":"PLANO ANUAL"}</span>
                                                            <div>
                                                                <div className={styles.info_div}>
                                                                    <CircleIcon className={styles.info_icon}/>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text}>{getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===1?<span>€12.99 <span style={{fontSize:"0.7rem", color:"#ccc"}}>(€12.99/mês)</span></span>:getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===2?<span>€68.89 <span style={{fontSize:"0.7rem", color:"#ccc"}}>(€10.49/mês)</span></span>:getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===3?<span>€119.89 <span style={{fontSize:"0.7rem", color:"#ccc"}}>(€9.99/mês)</span></span>:""}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <CircleIcon className={styles.info_icon}/>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text}>
                                                                            {getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===1?
                                                                                "Cobranças mensais"
                                                                            :getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===2?
                                                                                "Cobranças semestrais"
                                                                            :getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===3?
                                                                                "Cobranças anuais"
                                                                            :""}
                                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ArrowRightAltIcon style={{width:"20px !important", height:"20px !important", margin:"0 5px"}}/>
                                                        <div>
                                                            <span className={styles.prox_cobr_val} style={{fontWeight:"400"}}>{getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?"PLANO MENSAL":getPlanFromPriceId(schedule.phases[1].plans[0].price)===2?"PLANO SEMESTRAL":"PLANO ANUAL"}</span>
                                                            <div>
                                                                <div className={styles.info_div}>
                                                                    <CircleIcon className={styles.info_icon}/>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text}>{getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?<span>€12.99 <span style={{fontSize:"0.7rem", color:"#ccc"}}>(€12.99/mês)</span></span>:getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===2?<span>€68.89 <span style={{fontSize:"0.7rem", color:"#ccc"}}>(€10.49/mês)</span></span>:getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===3?<span>€119.89 <span style={{fontSize:"0.7rem", color:"#ccc"}}>(€9.99/mês)</span></span>:""}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <CircleIcon className={styles.info_icon}/>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text}>
                                                                            {getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?
                                                                                "Cobranças mensais"
                                                                            :getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===2?
                                                                                "Cobranças semestrais"
                                                                            :getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===3?
                                                                                "Cobranças anuais"
                                                                            :""}
                                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :null
                                            }
                                            <span className={styles.cancel} style={{marginTop:"15px", color:"#ccc"}}>O cancelamento da subscrição pode ser feito a <span style={{fontWeight:"500"}}>qualquer altura.</span></span>
                                        </div>
                                    </div>
                                    <span className={styles.subtitle}>Método de Pagamento</span>
                                    <div className={styles.divider}/>
                                    <span className={styles.subtitle_sub}><span style={{fontWeight:"500"}}>Cartão</span> <span style={{marginLeft:"5px"}}>-</span> <span style={{color:subscriptionStatus==="active"?"#0358e5":"#fdd835", marginLeft:"5px"}}>{subscriptionStatus==="active"?<span style={{display:"flex", alignItems:"center"}}>ATIVO <Check style={{width:"15px !important", height:"15px !important", marginLeft:"3px"}}/></span>:<span style={{display:"flex", alignItems:"center"}}>ERRO <ClearIcon style={{width:"15px !important", height:"15px !important", marginLeft:"3px"}}/></span>}</span></span>
                                    <div className={styles.initial}>

                                        <div className={styles.card} style={{marginTop:"10px", border:subscriptionStatus==="delay"?"6px solid #fdd835":""}}>
                                            <div className={styles.card_top}>
                                                {
                                                    props.user.subscription.payment_method.card.brand==="visa"?
                                                    <img src={visa} className={styles.brand}/>
                                                    :
                                                    props.user.subscription.payment_method.card.brand==="mastercard"?
                                                    <img src={mastercard} className={styles.brand_master}/>
                                                    :
                                                    props.user.subscription.payment_method.card.brand==="american"?
                                                    <img src={american} className={styles.brand_american}/>
                                                    :null
                                                }
                                            </div>
                                            <div className={styles.card_mid}>
                                                <img src={chip} className={styles.chip}/>
                                            </div>
                                            <div className={styles.card_number}>
                                                <span className={styles.card_number_value}>**** **** **** {props.user.subscription.payment_method.card.last4}</span>
                                            </div>
                                            <div className={styles.card_name_date}>
                                                <div className={styles.card_name}>
                                                    <span className={styles.name_helper}>Nome</span>
                                                    <span className={styles.name_val}>{props.user.subscription.payment_method.billing_details.name}</span>
                                                </div>
                                                <div className={styles.card_name}>
                                                    <span className={styles.name_helper}>Data</span>
                                                    <span className={styles.name_val}>{props.user.subscription.payment_method.card.exp_month}/{props.user.subscription.payment_method.card.exp_year}</span>
                                                </div>
                                            </div>
                                        </div>                                
                                    </div>
                                    
                                    <div className={styles.card_right}>
                                        {
                                            schedule&&schedule.phases[1]&&!schedule.phases[0].metadata.from_canceled?
                                            <div className={styles.card_right_button_remove_plan} onClick={() => cancelPlanChange()}>
                                                <span>Cancelar <span style={{fontWeight:600}}>Alteração de plano</span></span>
                                            </div>
                                            :
                                            <div className={styles.card_right_button} onClick={() => {
                                                setDisplay(2)
                                                setAlterarPlano(true)}}>
                                                <span>Ver <span style={{fontWeight:600}}>Planos</span></span>
                                            </div>
                                        }
                                        {/* <div className={styles.card_right_button} onClick={() => {
                                            setDisplay(1)
                                            setSelectedMenu(1)
                                            setAlterarPagamento(true)}}>
                                            <span>Alterar <span style={{fontWeight:600}}>Método de Pagamento</span></span>
                                        </div> */}
                                        <div className={styles.card_right_button_remove} onClick={() => cancelSubscriptionHandler()}>
                                            <span>Cancelar Subscrição</span>
                                        </div>
                                        <div className={styles.card_right_bottom}>
                                            
                                        </div>
                                    </div>
                                </div>
                                :display===1?
                                <div className={styles.display_one}>
                                    <span className={styles.subtitle_sub} style={{marginTop:"0px"}}>
                                        <span style={{fontWeight:"500"}}>Ativar Subscrição</span>
                                    </span>
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
                                                            <Check className={styles.section_button_selected_icon}/>
                                                        </div>
                                                        
                                                        :<span className={styles.section_button}>Selecionar</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.selected_plan}>
                                            <span className={styles.selected_plan_title}>
                                                PLANO
                                            </span>
                                            {
                                                selectedPlan===1?
                                                <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                                :selectedPlan===2?
                                                <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                                :selectedPlan===3?
                                                <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                                :<span className={styles.selected_plan_no_value}>Sem Plano Selecionado</span>
                                            }
                                            
                                        </div>
                                        <div className={styles.buttons}>
                                            <span className={selectedPlan?styles.button_add:styles.button_add_disabled} onClick={() => {
                                                selectedPlan&&setSelectedMenu(1)
                                                }}>Continuar</span>
                                            <span className={styles.button_cancel} onClick={() => {
                                                !isCanceled?setDisplay(0):setDisplay(3)
                                                setSelectedMenu(0)
                                                setSelectedPlan(2)
                                                }}>CANCELAR</span>
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
                                                        {
                                                            validDate?
                                                            <div className={styles.name_val}>
                                                                <Check style={{width:"20px !important", height:"20px !important", color:"white"}}/>
                                                            </div>
                                                            :null
                                                        }
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
                                                        <CardNumberElement onChange={e => cardValidHanlder(e)} className={styles.right_input} style={{borderColor:validCard?"#0358e5":!validCard?"#ff3b30":""}}/>
                                                        {/* {
                                                            !validCard?
                                                            <span className={styles.card_wrong}>Este número de cartão é inválido</span>
                                                            :null
                                                        } */}
                                                    </div>
                                                    <div className={styles.right_section_short_div}>
                                                        <div className={styles.right_section_short}>
                                                            <span className={styles.right_helper}>Válido até</span>
                                                            <CardExpiryElement onChange={e => dateValidHanlder(e)} className={styles.right_input_short} />
                                                        </div>
                                                        <div className={styles.right_section_short}>
                                                            <span className={styles.right_helper}>CVV</span>
                                                            <CardCvcElement onChange={e => cvcValidHanlder(e)} className={styles.right_input_short}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className={styles.selected_plan} style={{height:"90px"}}>      
                                            <span className={styles.selected_plan_title}>Plano</span>
                                            {
                                                selectedPlan===1?
                                                <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                                :selectedPlan===2?
                                                <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                                :
                                                <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                            }
                                            {
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
                                                </div>
                                                :
                                                selectedPlan===2?
                                                <div className={styles.selected_plan_info}>
                                                    <div className={styles.info_div}>
                                                        <CircleIcon className={styles.info_icon}/>
                                                        <div className={styles.info_subdiv}>
                                                            <span className={styles.info_text_helper}>A cobrar:</span>
                                                            <span className={styles.info_text}>€68.89</span><span style={{marginLeft:"5px", fontSize:"0.7rem"}}> (€11.49/mês)</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.info_div}>
                                                        <CircleIcon className={styles.info_icon}/>
                                                        <div className={styles.info_subdiv}>
                                                            <span className={styles.info_text_helper}>Modelo:</span>
                                                            <span className={styles.info_text}>Cobranças semestrais (180 a 180 dias)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className={styles.selected_plan_info}>
                                                    <div className={styles.info_div}>
                                                        <CircleIcon className={styles.info_icon}/>
                                                        <div className={styles.info_subdiv}>
                                                            <span className={styles.info_text_helper}>A cobrar:</span>
                                                            <span className={styles.info_text}>€119.89</span><span style={{marginLeft:"5px", fontSize:"0.7rem"}}> (€9.99/mês)</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.info_div}>
                                                        <CircleIcon className={styles.info_icon}/>
                                                        <div className={styles.info_subdiv}>
                                                            <span className={styles.info_text_helper}>Modelo:</span>
                                                            <span className={styles.info_text}>Cobranças mensais (360 a 360 dias)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                isCanceled&&endDate>currentDate?
                                                <span className={styles.resub}>Esta nova subscrição apenas será cobrada no fim da sua subscrição atual (<span style={{color:"#FF785A", fontWeight:"400"}}>{getDateToString(endDate/1000)}</span>)</span>
                                                :
                                                <span className={styles.cancel}>O cancelamento da subscrição pode ser feito a <span style={{textDecoration:"underline", fontWeight:"500"}}>qualquer altura!</span></span>
                                            }
                                            
                                        </div>
                                        <div className={styles.buttons}>
                                            {
                                                isCanceled&&endDate>currentDate?
                                                <span className={cardName.length>2&&validCard&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&validCvc&&updateCard()}>ADICIONAR CARTÃO E FINALIZAR</span>
                                                :
                                                <span className={cardName.length>2&&validCard&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&validCvc&&handlePayment()}>ADICIONAR CARTÃO E PAGAR</span>

                                            }
                                            <span className={styles.button_cancel} onClick={() => {
                                                !isCanceled?setDisplay(0):setDisplay(3)
                                                setSelectedMenu(0)
                                                setSelectedPlan(2)
                                                }}>CANCELAR</span>
                                        </div>
                                    </div>
                                    <div className={styles.indicator_div}>
                                        <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(0)} style={{opacity:selectedMenu?0.5:1, transform:selectedMenu?"scale(1)":"scale(1.3)", transition:"ease-in-out all"}}>
                                            {
                                                selectedPlan?
                                                <Check className={styles.indicator_check}/>
                                                :null
                                            }
                                            <span className={styles.indicator} style={{backgroundColor:!selectedMenu||selectedPlan?"#FF785A":""}}></span>
                                            <p className={styles.indicator_text} style={{color:!selectedMenu||selectedPlan?"#FF785A":""}}>ESCOLHER PLANO</p>
                                        </div>
                                        <div className={styles.indicator_subdiv} style={{transform:!selectedMenu?"scale(1)":"scale(1.3)", transition:"ease-in-out all"}} onClick={() => selectedPlan&&setSelectedMenu(1)}>
                                            <span className={styles.indicator} style={{backgroundColor:selectedMenu?"#FF785A":""}}></span>
                                            <p className={styles.indicator_text} style={{color:selectedMenu?"#FF785A":""}}>
                                                PAGAMENTO
                                            </p>
                                        </div>
                                    </div>

                                </div>
                                // alterar plano area
                                :display===2?
                                <div style={{marginTop:"20px"}}>
                                    <span className={styles.subtitle_sub} style={{marginTop:"-10px"}}>
                                        <span style={{fontWeight:"500"}}>Planos</span>
                                    </span>
                                    <div className={styles.plans}>

                                        <div className={styles.plans_area} style={{marginTop:"40px"}}>
                                            <p className={styles.plans_title}>Escolher o plano</p>
                                            <div className={styles.plans_sections}>
                                                <div className={selectedPlan===1?styles.section_selected:styles.section} style={{borderColor:schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?"#0358e5":props.user.subscription?.plan===1&&!schedule.phases[0].metadata.from_canceled?"#0358e5":""}} onClick={() => setSelectedPlan(1)}>
                                                {
                                                        schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :props.user.subscription?.plan===1&&!schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :null
                                                    }
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
                                                            <Check className={styles.section_button_selected_icon}/>
                                                        </div>
                                                        :props.user.subscription.plan===1?
                                                        <span className={styles.section_button_active}>Ativo</span>
                                                        :null
                                                    }
                                                    
                                                </div>
                                                <div className={selectedPlan===2?styles.section_selected:styles.section} style={{borderColor:schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===2?"#0358e5":props.user.subscription?.plan===2&&!schedule.phases[0].metadata.from_canceled?"#0358e5":""}} onClick={() => setSelectedPlan(2)}>
                                                    <span className={styles.popular}>POPULAR</span>
                                                    {
                                                        schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===2?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :props.user.subscription?.plan===2&&!schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :null
                                                    }
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
                                                            <Check className={styles.section_button_selected_icon}/>
                                                        </div>
                                                        
                                                        :null
                                                    }
                                                </div>
                                                <div className={selectedPlan===3?styles.section_selected:styles.section} style={{borderColor:schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===3?"#0358e5":props.user.subscription?.plan===3&&!schedule.phases[0].metadata.from_canceled?"#0358e5":""}} onClick={() => setSelectedPlan(3)}>
                                                    {
                                                        schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===3?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :props.user.subscription?.plan===3&&!schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :null
                                                    }
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
                                                            <Check className={styles.section_button_selected_icon}/>
                                                        </div>
                                                        
                                                        :null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.selected_plan} style={{marginTop:"20px"}}>
                                            <span className={styles.selected_plan_title}>
                                                ALTERAR PLANO
                                            </span>
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                {
                                                    schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===1?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                                    :props.user.subscription?.plan===1&&!schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                                    :
                                                    schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===2?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>
                                                    :props.user.subscription?.plan===2&&!schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>
                                                    :
                                                    schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)===3?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                                    :props.user.subscription?.plan===3&&!schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                                    :null
                                                }
                                                <ArrowRightAltIcon className={styles.arrow}/>
                                                {
                                                    selectedPlan===1&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)!==1?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                                    :selectedPlan===1&&props.user.subscription?.plan!==1&&!schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Mensal</span> - 30 DIAS</span>
                                                    :
                                                    selectedPlan===2&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)!==2?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                                    :selectedPlan===2&&props.user.subscription?.plan!==2&&!schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Semestral</span> - 180 DIAS</span>   
                                                    :
                                                    selectedPlan===3&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)!==3?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                                    :selectedPlan===3&&props.user.subscription?.plan!==3&&!schedule.phases[0].metadata.from_canceled?
                                                    <span className={styles.selected_plan_value}><span className={styles.sub_val_date}>Plano Anual</span> - 360 DIAS</span>
                                                    :<span className={styles.selected_plan_no_value}>Selecione um plano diferente</span>
                                                }
                                            </div>
                                            
                                        </div>
                                        <div style={{marginTop:"20px"}}>
                                            <span className={styles.alterar_plano}>A alteração do plano terá efeito imediato, mas <span style={{fontWeight:"600"}}>apenas será cobrado na data da próxima cobrança. </span></span>
                                            <p className={styles.alterar_plano} style={{fontSize:"0.7rem"}}>(Próx. cobrança - <span style={{color:"#FF785A"}}>{schedule.current_phase?.end_date&&extenseDate(schedule.current_phase?.end_date)}</span>)</p>
                                        </div>
                                        <div className={styles.buttons}>
                                            <span className={
                                                selectedPlan&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)!==selectedPlan?
                                                styles.button_add
                                                :
                                                selectedPlan&&!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)!==selectedPlan?
                                                styles.button_add
                                                :
                                                styles.button_add_disabled} 
                                                
                                                onClick={() => {
                                                selectedPlan&&schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)!==selectedPlan&&updatePlan()
                                                selectedPlan&&!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)!==selectedPlan&&updatePlan()
                                                }}>Alterar</span>
                                            <span className={styles.button_cancel} onClick={() => {
                                                setDisplay(0)
                                                setSelectedMenu(0)
                                                setSelectedPlan(null)
                                                setAlterarPlano(false)
                                                }}>FECHAR</span>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                                :display===3&&isLoaded&&isCanceled?
                                <div style={{marginTop:"30px"}}>
                                    <NoPage object="re_subscritption" activateSub={() => setDisplay(1)}/>
                                </div>
                                :display===3&&isLoaded&&!isCanceled?
                                <div style={{marginTop:"30px"}}>
                                    <NoPage object="no_subscritption" activateSub={() => setDisplay(1)}/>
                                </div>
                                :null
                            }
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
        
    )
}

export default Subscription