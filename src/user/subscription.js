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
import moment from 'moment';
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
    const [daysTillCharge, setDaysTillCharge] = useState(null)

    const [validCard, setValidCard] = useState(false)
    const [validDate, setValidDate] = useState(false)
    const [validCvc, setValidCvc] = useState(false)

    const [isCanceled, setIsCanceled] = useState(false)
    const [isCanceledDate, setIsCanceledDate] = useState(null)

    const [isLoaded, setIsLoaded] = useState(false)

    const [subscriptionStatus, setSubscriptionStatus] = useState(null)
    const [schedule, setSchedule] = useState(null)
    const [subscriptionPlanObj, setSubscriptionPlanObj] = useState({})

    const stripe = useStripe();
    const elements = useElements();

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        setLoading(true)
        if(props.user.subscription){
            axios.post(`${props.api_url}/retrieve-subscription-and-schedule`, {
                subscription_id: props.user.subscription.id,
                schedule_id: props.user.subscription.sub_schedule
            })
            .then(res => {
                console.log(res);
                if(res.data.schedule.end_behavior === "cancel"){
                    setDisplay(3)
                    setIsCanceled(true)
                }
                else{
                    setDisplay(0)
                    setIsCanceled(false)
                }
                console.log(res.data.subscription.current_period_end)
                console.log(new Date().getTime())
                setDaysTillCharge(moment(res.data.subscription.current_period_end*1000).diff(moment(new Date().getTime()), 'days'))
                setEndDate(res.data.subscription.current_period_end*1000)
                setSubscriptionStatus(res.data.subscription.status)
                
                let value_pay = res.data.subscription.plan.amount_decimal
                let value_pay_read = '12.99'
                if(res.data.subscription.plan.amount_decimal.length===3)
                    value_pay_read = value_pay.slice(0, 1) + "." + value_pay.slice(1)
                if(res.data.subscription.plan.amount_decimal.length===4)
                    value_pay_read = value_pay.slice(0, 2) + "." + value_pay.slice(2)
                else
                    value_pay_read = value_pay.slice(0, 3) + "." + value_pay.slice(3)

                setSubscriptionPlanObj({
                    value: value_pay_read,
                    type: value_pay_read==="12.99"?"Mensal":value_pay_read==="68.89"?"Semestral":"Anual",
                    monthly: value_pay_read==="12.99"?"12.99":value_pay_read==="68.89"?"11.49":"9.99",
                    a_cada: value_pay_read==="12.99"?"mês":value_pay_read==="68.89"?"6 meses":"12 meses",
                    cobrancas: value_pay_read==="12.99"?"mensais":value_pay_read==="68.89"?"semestrais":"anuais",
                    image: value_pay_read==="12.99"?basic:value_pay_read==="68.89"?medium:pro,
                    selected_plan: value_pay_read==="12.99"?1:value_pay_read==="68.89"?2:3
                })
                value_pay_read==="12.99"&&setSelectedPlan(1)
                value_pay_read==="68.89"&&setSelectedPlan(2)||setSelectedPlan(3)
                

                
                setSchedule(res.data.schedule)
                setIsLoaded(true)
                setLoading(false)
                
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
                setIsCanceled(false)
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
                    setIsCanceled(false)
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
                setIsCanceled(false)
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
                                date = {extenseDate(endDate/1000)}
                                confirm = {() => cancelSubscriptionFinal()}
                                />
                            :null
                    }
                    <div className={styles.subscription_title}>
                        <span className={styles.top_title}>Subscrição</span>
                    </div>
                    {
                        display!==1?
                        <div className={styles.display} style={{backgroundColor:endDate>currentDate?"#0358e5":"#fdd835"}}>
                            <div className={styles.display_top}>
                                <div className={styles.display_user}>
                                    <div className={styles.user_top_flex}>
                                        <span className={styles.user_desc_top}>Estado da Subscrição</span>
                                        {
                                            endDate>currentDate?
                                            <span className={styles.user_desc}>ATIVADA</span>
                                            :<span className={styles.user_desc_dark}>DESATIVADA</span>
                                        }
                                        
                                        {
                                            isCanceled?
                                            <div className={styles.future_end}>
                                                Fim da subscrição a <span style={{fontWeight:700}}>{endDate&&getDateToString(endDate/1000)}</span>
                                            </div>
                                            :null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :null
                    }
                    
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
                            {
                                display===0&&schedule&&!isCanceled?
                                <div className={display===0?styles.display_zero:`${styles.display_zero} ${styles.display_zero_hide}`}>
                                    <span className={styles.subtitle}>Plano</span>
                                    <div className={styles.divider}/>
                                    <div>
                                        <div style={{display:"flex", margin:"10px 0", alignItems:"center"}}>
                                            <span className={styles.subtitle_sub} style={{margin:"0"}}><span style={{fontWeight:"500"}}>Plano Ativo - </span></span>
                                            <span className={styles.ya}>{
                                                schedule.phases.length===2&&subscriptionPlanObj.selected_plan===1?"PLANO MENSAL"
                                                :!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===1?"PLANO MENSAL"
                                                :
                                                schedule.phases.length===2&&subscriptionPlanObj.selected_plan===2?"PLANO SEMESTRAL"
                                                :!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)===2?"PLANO SEMESTRAL"
                                                :
                                                schedule.phases.length===2&&subscriptionPlanObj.selected_plan===3?"PLANO ANUAL"
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
                                                        <span className={styles.prox_cobr_val} style={{color:"white"}}> {extenseDate(endDate/1000)}</span>
                                                    </div>
                                                    :
                                                    <div className={`${styles.sub_val_wrap}`} onClick={() => setSelectedMenu(0)}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={subscriptionPlanObj.image} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Plano {subscriptionPlanObj.type}</p>
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>VALOR:</span>
                                                                    <span className={styles.info_text}>€{subscriptionPlanObj.value}</span><span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white"}}> (equivalente a €{subscriptionPlanObj.monthly}/mês)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                                    <span className={styles.info_text}>{subscriptionPlanObj.type}<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:'400'}}>(a cada {subscriptionPlanObj.a_cada})</span></span>
                                                                </div>
                                                            </div>
                                                            {/* <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv} style={{marginTop:'10px'}}>
                                                                    <span className={styles.info_text_helper} style={{width:'180px'}}>Próxima cobrança:</span>
                                                                </div>
                                                            </div> */}
                                                            <div className={styles.info_div_pay}>
                                                                <span className={styles.info_text_helper} style={{width:'fit-content'}}>Próxima cobrança</span>
                                                                <span className={styles.info_text} style={{marginTop:'5px', color:"#0358e5"}}>{extenseDate(endDate/1000)}</span>
                                                                <span className={styles.info_text} style={{color:"#ffffff", fontWeight:400, fontSize:"0.9rem", marginTop:'-2px'}}>({daysTillCharge} dias)</span>
                                                            </div>

                                                            <p className={styles.selected_plan_value_information}>O cancelamento da subscrição pode ser feito a qualquer altura.</p>
                                                        </div>
                                                    </div>
                                                    
                                                    // <div className={styles.plan_meio}>
                                                    //     <span className={styles.prox_cobr}>Data da próxima cobrança </span>
                                                    //     <span className={styles.prox_cobr_val} style={{color:"white"}}>{extenseDate(endDate/1000)}</span>
                                                    // </div>

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
                                        </div>
                                    </div>
                                    <span className={styles.subtitle}>Método de Pagamento</span>
                                    <div className={styles.divider}/>
                                    <span className={styles.subtitle_sub}><span style={{fontWeight:"500"}}>Cartão</span> <span style={{marginLeft:"5px"}}>-</span> <span style={{color:subscriptionStatus==="active"?"#0358e5":"#fdd835", marginLeft:"5px"}}>{subscriptionStatus==="active"?<span style={{display:"flex", alignItems:"center"}}>ATIVO</span>:<span style={{display:"flex", alignItems:"center"}}>ERRO</span>}</span></span>
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
                                                <span style={{fontWeight:600}}>Ver Planos</span>
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
                                    <div className={selectedMenu===0?styles.indicator_div:`${styles.indicator_div} ${styles.indicator_div_plan_selected}`}>
                                            <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(0)} style={{transform:selectedMenu===1?"scale(1)":"scale(1.3)", transition:"ease-in-out all"}}>
                                                {/* {
                                                    selectedPlan?
                                                    <Check className={styles.indicator_check}/>
                                                    :null
                                                } */}
                                                <p className={styles.indicator_text} style={{color:selectedMenu===0||(selectedPlan&&selectedMenu===null)?"#0358e5":"#ffffff"}}>PLANO</p>
                                                <span className={styles.indicator} style={{backgroundColor:!selectedMenu||(selectedPlan&&selectedMenu===null)?"#0358e5":"#ffffff"}}></span>
                                            </div>
                                            <div className={styles.indicator_subdiv} style={{transform:selectedMenu===0?"scale(1)":"scale(1.1)", transition:"ease-in-out all"}} onClick={() => selectedPlan&&setSelectedMenu(1)}>
                                                <p className={styles.indicator_text} style={{color:selectedMenu===1?"#0358e5":""}}>
                                                    PAGAMENTO
                                                </p>
                                                <span className={styles.indicator} style={{backgroundColor:selectedMenu?"#0358e5":""}}></span>
                                            </div>
                                        </div>
                                    <div className={!selectedMenu?styles.plans:`${styles.plans} ${styles.plans_hide}`}>                                        
                                        <div className={styles.plans_area}>
                                            <p className={styles.plans_title}>Escolher o plano</p>
                                            <div className={styles.plans_sections}>
                                                <div className={selectedPlan===1?styles.section_selected:styles.section} onClick={() => setSelectedPlan(1)}>
                                                    <img src={basic} className={styles.section_img}/>                                         
                                                    <span className={styles.section_type}>Mensal</span>
                                                    <span className={styles.section_type_desc}>Pagamento a cada mês</span>
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
                                                        
                                                        :null
                                                    }
                                                    
                                                </div>
                                                <div className={selectedPlan===2?styles.section_selected:styles.section} onClick={() => setSelectedPlan(2)}>
                                                    <span className={styles.popular}>POPULAR</span>
                                                    <img src={medium} className={styles.section_img}/>
                                                    <span className={styles.section_type}>Semestral</span>
                                                    <span className={styles.section_type_desc}>Pagamento a cada 6 meses</span>
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
                                                <div className={selectedPlan===3?styles.section_selected:styles.section} onClick={() => setSelectedPlan(3)}>
                                                    <img src={pro} className={styles.section_img}/>
                                                    <span className={styles.section_type}>Anual</span>
                                                    <span className={styles.section_type_desc}>Pagamento a cada 12 meses</span>
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
                                                        // <span className={styles.section_button}>Selecionar</span>
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
                                                <div className={styles.sub_val_wrap}>
                                                    <div className={styles.sub_val_wrap_image}>
                                                        <img src={basic} className={styles.section_img_small}/>
                                                    </div>
                                                    <p className={styles.sub_val_date}>Plano Mensal</p>
                                                    <div className={styles.selected_plan_value_wrap}>
                                                        <p className={styles.selected_plan_value} style={{marginTop:'10px'}}>Pagamento de <span style={{fontWeight:600}}>12.99€ a cada mês</span>.</p>
                                                        <p className={styles.selected_plan_value_information}>Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura..</p>
                                                    </div>
                                                </div>
                                                :selectedPlan===2?
                                                <div className={styles.sub_val_wrap}>
                                                    <div className={styles.sub_val_wrap_image}>
                                                        <img src={medium} className={styles.section_img_small}/>
                                                    </div>
                                                    <p className={styles.sub_val_date}>Plano Semestral</p>
                                                    <div className={styles.selected_plan_value_wrap}>
                                                        <p className={styles.selected_plan_value} style={{marginTop:'10px'}}>Pagamento de <span style={{fontWeight:600}}>68.89€ a cada 6 meses</span>.</p>
                                                        <p className={styles.selected_plan_value_information}>Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura..</p>
                                                    </div>
                                                </div>
                                                :selectedPlan===3?
                                                <div className={styles.sub_val_wrap}>
                                                    <div className={styles.sub_val_wrap_image}>
                                                        <img src={pro} className={styles.section_img_small}/>
                                                    </div>
                                                    <p className={styles.sub_val_date}>Plano Anual</p>
                                                    <div className={styles.selected_plan_value_wrap}>
                                                        <p className={styles.selected_plan_value} style={{marginTop:'10px'}}>Pagamento de <span style={{fontWeight:600}}>119.89€ a cada 12 meses</span>.</p>
                                                        <p className={styles.selected_plan_value_information}>Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura..</p>
                                                    </div>
                                                </div>
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
                                                setSelectedPlan(null)
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
                                                {/* <span className={styles.details_title}>Detalhes de Pagamento</span> */}
                                                <div className={styles.right_sections_div}>
                                                    <div className={styles.right_section}>
                                                        <span className={styles.right_helper}>Nome no Cartão</span>
                                                        <input className={styles.right_input} maxLength={35} value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Nome Apelido"/>
                                                    </div>
                                                    <div className={styles.right_section}>
                                                        <span className={styles.right_helper}>Número do Cartão</span>
                                                        <CardNumberElement 
                                                            onChange={e => cardValidHanlder(e)} 
                                                            className={styles.right_input} 
                                                            style={{borderColor:validCard?"#0358e5":!validCard?"#ff3b30":""}}
                                                            options={{style:{base:{color:"#fff"}}}}/>
                                                        {/* {
                                                            !validCard?
                                                            <span className={styles.card_wrong}>Este número de cartão é inválido</span>
                                                            :null
                                                        } */}
                                                    </div>
                                                    <div className={styles.right_section_short_div}>
                                                        <div className={styles.right_section_short}>
                                                            <span className={styles.right_helper}>Válido até</span>
                                                            <CardExpiryElement onChange={e => dateValidHanlder(e)} className={styles.right_input_short} options={{style:{base:{color:"#fff"}}}}/>
                                                        </div>
                                                        <div className={styles.right_section_short}>
                                                            <span className={styles.right_helper}>CVV</span>
                                                            <CardCvcElement onChange={e => cvcValidHanlder(e)} className={styles.right_input_short} options={{style:{base:{color:"#fff"}}}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className={styles.selected_plan}>      
                                            <span className={styles.selected_plan_title}>Plano</span>
                                            {
                                                selectedPlan===1?
                                                <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                    <div className={styles.sub_val_wrap_image}>
                                                        <img src={basic} className={styles.section_img_small}/>
                                                    </div>
                                                    <p className={styles.sub_val_date}>Plano Mensal</p>
                                                    <div className={styles.selected_plan_value_wrap}>
                                                        <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                            <div className={styles.info_subdiv}>
                                                                <span className={styles.info_text_helper}>VALOR:</span>
                                                                <span className={styles.info_text}>€12.99</span><span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white"}}> (equivalente a €12.99/mês)</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.info_div}>
                                                            <div className={styles.info_subdiv}>
                                                                <span className={styles.info_text_helper}>Modelo:</span>
                                                                <span className={styles.info_text}>Cobranças mensais<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white"}}>(a cada mês)</span></span>
                                                            </div>
                                                        </div>
                                                        <p className={styles.selected_plan_value_information}>Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura..</p>
                                                    </div>
                                                </div>
                                                :selectedPlan===2?
                                                <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                    <div className={styles.sub_val_wrap_image}>
                                                        <img src={medium} className={styles.section_img_small}/>
                                                    </div>
                                                    <p className={styles.sub_val_date}>Plano Semestral</p>
                                                    <div className={styles.selected_plan_value_wrap}>
                                                        <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                            <div className={styles.info_subdiv}>
                                                                <span className={styles.info_text_helper}>VALOR:</span>
                                                                <span className={styles.info_text}>€68.89</span><span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}> (equivalente a €11.49/mês)</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.info_div}>
                                                            <div className={styles.info_subdiv}>
                                                                <span className={styles.info_text_helper}>Modelo:</span>
                                                                <span className={styles.info_text}>Cobranças semestrais<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}>(a cada 6 meses)</span></span>
                                                            </div>
                                                        </div>
                                                        <p className={styles.selected_plan_value_information}>Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura..</p>
                                                    </div>
                                                </div>
                                                :selectedPlan===3?
                                                <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                    <div className={styles.sub_val_wrap_image}>
                                                        <img src={pro} className={styles.section_img_small}/>
                                                    </div>
                                                    <p className={styles.sub_val_date}>Plano Anual</p>
                                                    <div className={styles.selected_plan_value_wrap}>
                                                        <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                            <div className={styles.info_subdiv}>
                                                                <span className={styles.info_text_helper}>VALOR:</span>
                                                                <span className={styles.info_text}>€119.89</span><span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white"}}> (equivalente a €9.99/mês)</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.info_div}>
                                                            <div className={styles.info_subdiv}>
                                                                <span className={styles.info_text_helper}>Modelo:</span>
                                                                <span className={styles.info_text}>Cobranças anuais<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}>(a cada 6 meses)</span></span>
                                                            </div>
                                                        </div>
                                                        {
                                                            isCanceled&&endDate>currentDate?
                                                            <span className={styles.selected_plan_value_information}>Esta nova subscrição apenas será cobrada no fim da sua subscrição atual (<span style={{color:"#FF785A", fontWeight:"400"}}>{getDateToString(endDate/1000)}</span>)</span>
                                                            :
                                                            <p className={styles.selected_plan_value_information}>Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura..</p>
                                                        }
                                                    </div>
                                                </div>
                                                :<span className={styles.selected_plan_no_value}>Sem Plano Selecionado</span>
                                            }
                                            
                                        </div>
                                        <div className={styles.buttons} style={{marginTop:"80px"}}>
                                            <span></span>
                                            {
                                                isCanceled&&endDate>currentDate?
                                                <span className={cardName.length>2&&validCard&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&validCvc&&updateCard()}>ADICIONAR CARTÃO E FINALIZAR</span>
                                                :
                                                <span className={cardName.length>2&&validCard&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&validCvc&&handlePayment()}>ADICIONAR CARTÃO E PAGAR</span>

                                            }
                                            <span className={styles.button_cancel} onClick={() => {
                                                !isCanceled?setDisplay(0):setDisplay(3)
                                                setSelectedMenu(0)
                                                setSelectedPlan(null)
                                                }}>CANCELAR</span>
                                        </div>
                                    </div>
                                </div>
                                // alterar plano area
                                :display===2?
                                <div style={{marginTop:"20px"}}>
                                    <span className={styles.subtitle_sub}>
                                        <span style={{fontWeight:"500"}}>ALTERAR PLANO</span>
                                    </span>
                                    <div className={styles.plans} style={{marginTop:'-40px'}}>

                                        <div className={styles.plans_area}>
                                            <p className={styles.plans_title}>ALTERAR o plano</p>
                                            <div className={styles.plans_sections}>
                                                <div 
                                                    className={selectedPlan===1?styles.section_selected:styles.section} 
                                                    style={{borderColor:selectedPlan===1&&subscriptionPlanObj.selected_plan!==1?"#FF785A":subscriptionPlanObj.selected_plan===1?"#0358e5":""}} 
                                                    onClick={() => setSelectedPlan(1)}>
                                                    {
                                                        subscriptionPlanObj.selected_plan===1?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :props.user.subscription?.plan===1&&!schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :null
                                                    }
                                                    <img src={basic} className={styles.section_img}/>
                                                    <span className={styles.section_type}>Mensal</span>
                                                    <span className={styles.section_type_desc}>Pagamento a cada mês</span>
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
                                                <div 
                                                    className={selectedPlan===2?styles.section_selected:styles.section}
                                                    style={{borderColor:selectedPlan===2&&subscriptionPlanObj.selected_plan!==2?"#FF785A":subscriptionPlanObj.selected_plan===2?"#0358e5":""}} 
                                                    onClick={() => setSelectedPlan(2)}>
                                                    {
                                                        subscriptionPlanObj.selected_plan===2?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :props.user.subscription?.plan===2&&!schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :null
                                                    }
                                                    <img src={medium} className={styles.section_img}/>
                                                    <span className={styles.section_type}>Semestral</span>
                                                    <span className={styles.section_type_desc}>Pagamento a cada 6 meses</span>
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
                                                <div 
                                                    className={selectedPlan===3?styles.section_selected:styles.section} 
                                                    style={{borderColor:selectedPlan===3&&subscriptionPlanObj.selected_plan!==3?"#FF785A":subscriptionPlanObj.selected_plan===3?"#0358e5":""}} 
                                                    onClick={() => setSelectedPlan(3)}>
                                                    {
                                                        subscriptionPlanObj.selected_plan===3?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :props.user.subscription?.plan===3&&!schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.ativo}>Ativo</span>
                                                        :null
                                                    }
                                                    <img src={pro} className={styles.section_img}/>
                                                    <span className={styles.section_type}>Anual</span>
                                                    <span className={styles.section_type_desc}>Pagamento a cada 12 meses</span>
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
                                                ALTERAÇÃO
                                            </span>
                                            <div className={styles.change_plan_wrap}>
                                                <div style={{flex:'1'}}>
                                                    <div className={`${styles.sub_val_wrap}`}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={subscriptionPlanObj.image} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano ATUAL</p>
                                                        <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>{subscriptionPlanObj.type}</p>
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                                                    <span className={styles.info_text} style={{fontSize:'0.8rem'}}>€{subscriptionPlanObj.value}</span>
                                                                    <span className={styles.info_text} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€{subscriptionPlanObj.monthly}/mês)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                                                    <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada {subscriptionPlanObj.a_cada}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <ArrowRightAltIcon className={styles.arrow}/>
                                                {
                                                    selectedPlan===1&&subscriptionPlanObj.selected_plan!==1?
                                                    <div style={{flex:'1'}}>
                                                        <div className={`${styles.sub_val_wrap}`} style={{backgroundColor:"#FF785A90", borderColor:"#FF785A"}}>
                                                            <div className={styles.sub_val_wrap_image} style={{backgroundColor:"#FF785A"}}>
                                                                <img src={basic} className={styles.section_img_small}/>
                                                            </div>
                                                            <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano NOVO</p>
                                                            <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>Mensal</p>
                                                            <div className={styles.selected_plan_value_wrap}>
                                                                <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.8rem'}}>€12.99</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€12.99/mês)</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada mês</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    selectedPlan===2&&subscriptionPlanObj.selected_plan!==2?
                                                    <div style={{flex:'1'}}>
                                                        <div className={`${styles.sub_val_wrap}`} style={{backgroundColor:"#FF785A90", borderColor:"#FF785A"}}>
                                                            <div className={styles.sub_val_wrap_image} style={{backgroundColor:"#FF785A"}}>
                                                                <img src={basic} className={styles.section_img_small}/>
                                                            </div>
                                                            <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano NOVO</p>
                                                            <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>Semestral</p>
                                                            <div className={styles.selected_plan_value_wrap}>
                                                                <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.8rem'}}>€68.89</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€11.49/mês)</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada 6 meses</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    selectedPlan===3&&subscriptionPlanObj.selected_plan!==3?
                                                    <div style={{flex:'1'}}>
                                                        <div className={`${styles.sub_val_wrap}`} style={{backgroundColor:"#FF785A90", borderColor:"#FF785A"}}>
                                                            <div className={styles.sub_val_wrap_image} style={{backgroundColor:"#FF785A"}}>
                                                                <img src={basic} className={styles.section_img_small}/>
                                                            </div>
                                                            <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano NOVO</p>
                                                            <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>Anual</p>
                                                            <div className={styles.selected_plan_value_wrap}>
                                                                <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.8rem'}}>€119.89</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€9.99/mês)</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                                                        <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada 12 meses</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :<span className={styles.selected_plan_no_value} style={{flex:1}}>Selecione um plano diferente</span>
                                                }
                                            </div>
                                            
                                        </div>
                                        <div style={{marginTop:"80px"}}>
                                            <span className={styles.alterar_plano}>A alteração do plano terá efeito imediato, mas <span style={{fontWeight:"600"}}>apenas será cobrado na data da próxima cobrança. </span></span>
                                            <p className={styles.alterar_plano}>Próxima cobrança do PLANO ATUAL - <span style={{color:"#0358e5", fontWeight:600}}>{extenseDate(endDate/1000)}</span> <span style={{color:"#ffffff", fontWeight:500}}>({daysTillCharge} dias)</span></p>
                                        </div>
                                        <div className={styles.buttons}>
                                            <span className={
                                                selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan?
                                                styles.button_add
                                                :
                                                selectedPlan&&!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)!==selectedPlan?
                                                styles.button_add
                                                :
                                                styles.button_add_disabled} 
                                                
                                                onClick={() => {
                                                selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan&&updatePlan()
                                                selectedPlan&&!schedule.phases[0].metadata.from_canceled&&getPlanFromPriceId(schedule&&schedule.phases[0].plans[0].price)!==selectedPlan&&updatePlan()
                                                }}>Alterar</span>
                                            <span className={styles.button_cancel} onClick={() => {
                                                setDisplay(0)
                                                setSelectedMenu(0)
                                                setSelectedPlan(subscriptionPlanObj.selected_plan)
                                                setAlterarPlano(false)
                                                }}>FECHAR</span>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                                :display===3&&isLoaded&&isCanceled?
                                <div className={styles.display_three_canceled}>
                                    <div className={styles.sub_val_wrap} style={{backgroundColor:"#fdd83590", border:"3px solid #fdd835"}}>
                                        <p className={styles.sub_val_date}>Subscrição desativada</p>
                                        <div className={styles.selected_plan_value_wrap}>
                                            <p className={styles.selected_plan_value} style={{marginTop:'10px', textAlign:'center'}}>Fim da subscrição a <span style={{fontWeight:600}}>{endDate&&extenseDate(endDate/1000)}</span>.</p>
                                        </div>
                                    </div>
                                    <span className={styles.display_three_button} onClick={() => {
                                        setSelectedMenu(0)
                                        setDisplay(1)}}>
                                        RE-ATIVAR SUBSCRIÇÃO
                                    </span>
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