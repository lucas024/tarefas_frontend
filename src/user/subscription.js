import React, {useState, useEffect, useRef} from 'react'
import styles from './subscription.module.css'
import Check from '@mui/icons-material/Check';
import chip from '../assets/chip.png'
import validator from 'validator'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import hand from '../assets/hand.png'
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
import SubscriptionAlterar from './subscription_alterar';
import ConfirmBanner from '../general/confirmBanner';
import { useSelector } from 'react-redux'
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { 
    worker_update_is_subscribed,
    worker_update_trial
  } from '../store';
  import { useDispatch } from 'react-redux'
import SubscriptionPlans from './subscription_plans';

const Subscription = props => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})

    const scrolltopref = useRef(null)

    const dispatch = useDispatch()

    const [cardName, setCardName] = useState("")
    const [cardNumberDisplay, setCardNumberDisplay] = useState("")
    const [display, setDisplay] = useState(4)
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [cardIssuer, setCardIssuer] = useState(null)
    const [alterarPlano, setAlterarPlano] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cancelSubscriptionPopin, setCancelSubscriptionPopin] = useState(false)
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

    const [confirmBanner, setConfirmBanner] = useState(false)
    const [confirmFreeBanner, setConfirmFreeBanner] = useState(false)
    const [applyDiscount, setApplyDiscount] = useState(false)
    const [discountSubscriber, setDiscountSubscriber] = useState(false)
    const [trialActive, setTrialActive] = useState(false)

    const stripe = useStripe();
    const elements = useElements();

    const display_one_ref = useRef(null)

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    //display 4 - welcome tab
    //display 3 - canceled
    //display 2 - alterar
    //display 1 - ativar
    //display 0 - atual

    const discount_mensal_d = '2.59'
    const discount_mensal_d_euro = '2'
    const discount_mensal_d_centimo = '59'
    const discount_mensal = '259'
    const discount_mensal_monthly = '2.59'

    const discount_semestral_d = '13.78'
    const discount_semestral_d_euro = '13'
    const discount_semestral_d_centimo = '78'
    const discount_semestral = '1378'
    const discount_semestral_monthly = '2.39'

    const discount_anual_d = '23.98'
    const discount_anual_d_euro = '23'
    const discount_anual_d_centimo = '98'
    const discount_anual = '2398'
    const discount_anual_monthly = '1.99'

    const mensal_d = '12.99'
    const mensal_d_euro = '12'
    const mensal_d_centimo = '99'
    const mensal = '1299'
    const mensal_monthly = '12.99'

    const semestral_d = '68.89'
    const semestral_d_euro = '68'
    const semestral_d_centimo = '89'
    const semestral = '6889'
    const semestral_monthly = '11.49'
    const anual_d = '119.89'
    const anual_d_euro = '119'
    const anual_d_centimo = '89'
    const anual = '11989'
    const anual_monthly = '9.99'

    const saver = 'Sem qualquer tipo de vínculo, o cancelamento da subscrição pode ser feito a qualquer altura. Os previlégios de conta ativa mantêm-se até ao fim da data do plano escolhido. '

    useEffect(() => {
        setLoading(true)
        console.log(user)
        if(user.subscription){
            axios.post(`${api_url}/retrieve-subscription-and-schedule`, {
                subscription_id: user.subscription.id,
                schedule_id: user.subscription.sub_schedule
            })
            .then(res => {
                console.log(res)
                if(res.data.schedule.end_behavior === "cancel"){
                    setDisplay(0)
                    setIsCanceled(true)
                }
                else if(res.data.schedule.end_behavior){
                    setDisplay(0)
                    setIsCanceled(false)
                }
                else if(user.trial)
                {
                    setDisplay(0)
                    setIsCanceled(false)
                }
                else{
                    setDisplay(4)
                }
                setDaysTillCharge(moment(res.data.subscription.current_period_end*1000).diff(moment(new Date().getTime()), 'days'))
                setEndDate(res.data.subscription.current_period_end*1000)
                setSubscriptionStatus(res.data.subscription.status)

                console.log(res.data.subscription)
                
                let value_pay = res.data.subscription.plan.amount_decimal
                let type = value_pay===mensal||value_pay===discount_mensal?1:value_pay===semestral||value_pay===discount_semestral?2:3
                if(value_pay===discount_mensal||value_pay===discount_semestral||value_pay===discount_anual)
                {
                    setDiscountSubscriber(true)
                }
                
                let value_pay_read = null
                if(value_pay.length===3)
                    value_pay_read = value_pay.slice(0, 1) + "." + value_pay.slice(1)
                else if(value_pay.length===4)
                    value_pay_read = value_pay.slice(0, 2) + "." + value_pay.slice(2)
                else
                    value_pay_read = value_pay.slice(0, 3) + "." + value_pay.slice(3)

                setSubscriptionPlanObj({
                    value: value_pay_read,
                    type: type===1?"Mensal":type===2?"Semestral":"Anual",
                    monthly: type===1?!discountSubscriber?mensal_d:discount_mensal_d:type===2?!discountSubscriber?semestral_monthly:discount_semestral_monthly:!discountSubscriber?anual_monthly:discount_anual_monthly,
                    a_cada: type===1?"mês":type===2?"6 meses":"12 meses",
                    cobrancas: type===1?"mensais":type===2?"semestrais":"anuais",
                    image: type===1?basic:type===2?medium:pro,
                    selected_plan: type===1?1:type===2?2:3
                })
                type===1&&setSelectedPlan(1)
                type===2&&setSelectedPlan(2)||setSelectedPlan(3)
                
                setSchedule(res.data.schedule)
                setIsLoaded(true)
                setLoading(false)
                setTrialActive(false)
                setCurrentDate(new Date().getTime())
            })
        }
        else if(user.trial)
        {
            setDaysTillCharge(moment(user.trial?.end_date).diff(moment(new Date().getTime()), 'days'))
            setDisplay(0)
            setLoading(false)
            setTrialActive(true)
            setIsLoaded(true)
        }
        else{
            setDisplay(4)
            setIsLoaded(true)
            setLoading(false)
        }
        
    }, [user, discountSubscriber])

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

        let sub_obj = await axios.post(`${api_url}/create-subscription`, {
            stripe_id: user.stripe_id,
            amount: selectedPlan&&getAmountPay(selectedPlan)
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
                await axios.post(`${api_url}/confirm-subscription`, {
                    pm_id: paymentConfirmation.paymentIntent.payment_method,
                    plan: selectedPlan,
                    _id: user._id,
                    name: cardName,
                    sub_id: sub_obj.data.subscriptionId
                })
                props.refreshWorker()
                setLoading(false)
                setDisplay(0)
                setSuccessPopin(true)
                dispatch(worker_update_is_subscribed(true))
                if(user_phone_verified&&user_email_verified&&user.regioes.length>0&&user.trabalhos.length>0)
                {
                    axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
                }
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
        if(priceId === ("price_1LKQUyKC1aov6F9pTpM3gn0l"||"price_1P6rPWKC1aov6F9pIJWMdRNq")) return 2
        else if(priceId === ("price_1LKQVEKC1aov6F9p4RgyXAqj"||"price_1P6rOpKC1aov6F9pQ9twSRv7")) return 3
        else return 1
    }

    const getAmountPay = plan => {
        if(plan===1)
        {
            return discountSubscriber||applyDiscount?"price_1P6rPxKC1aov6F9pVup1aLnE":"price_1LKQUSKC1aov6F9p9gL1euLW"
        }
        else if(plan===2)
        {
            return discountSubscriber||applyDiscount?"price_1P6rPWKC1aov6F9pIJWMdRNq":"price_1LKQUyKC1aov6F9pTpM3gn0l"
        }
        else{
            return discountSubscriber||applyDiscount?"price_1P6rOpKC1aov6F9pQ9twSRv7":"price_1LKQVEKC1aov6F9p4RgyXAqj"
        }
    }

    const updateCard = async () => {
        setLoading(true)
        let val = await axios.post(`${api_url}/create-setup-intent`, {
            stripe_id: user.stripe_id,
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
                axios.post(`${api_url}/update-subscription-plan`, {
                    subscription: user.subscription,
                    current_amount: getAmountPay(user.subscription.plan),
                    new_amount: selectedPlan&&getAmountPay(selectedPlan),
                    plan: user.subscription.plan,
                    new_plan: selectedPlan,
                    payment_method: final.setupIntent.payment_method,
                    _id: user._id,
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

        let val = await axios.post(`${api_url}/update-subscription-plan`, {
            subscription: user.subscription,
            current_amount: getAmountPay(user.subscription.plan),
            new_amount: selectedPlan&&getAmountPay(selectedPlan),
            plan: user.subscription.plan,
            new_plan: selectedPlan,
            payment_method: user.subscription.payment_method_id,
            _id: user._id,
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
        setConfirmBanner(false)
        setLoading(true)
        if (!stripe || !elements) {
            return;
        }

        let val = await axios.post(`${api_url}/cancel-subscription-plan-update`, {
            subscription: user.subscription,
            current_amount: getAmountPay(user.subscription.plan),
        })

        switch (val.status) {
            case 200:
                props.refreshWorker()
                setDisplay(0)
                setSelectedMenu(0)
                setLoading(false)
                setCancelPlanPopin(true)
                setTimeout(() => setCancelPlanPopin(false), 4000)
                axios.post(`${api_url}/worker/update_state`, {state: 0, user_id: user._id})
                break;
  
        //     // case 'processing':
        //     //   setMessage("Payment processing. We'll update you when payment is received.");
        //     //   break;
  
            default:
                props.refreshWorker()
                setDisplay(1)
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

        let val = await axios.post(`${api_url}/cancel-subscription`, {
            subscription: user.subscription,
            current_amount: getAmountPay(user.subscription.plan),
        })

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

    const setFreePlanHandler = async () => {
        setApplyDiscount(false)
        setConfirmFreeBanner(false)
        setLoading(true)

        let start_date = new Date()
        let end_date = new Date(start_date)
        end_date.setDate(end_date.getDate()+90)

        console.log(start_date, end_date)

        await axios.post(`${api_url}/create-trial`, {
            id: user._id,
            start_date: start_date,
            end_date: end_date
        })
        if(user_phone_verified&&user_email_verified&&user.regioes.length>0&&user.trabalhos.length>0)
        {
            axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
        }
        dispatch(worker_update_is_subscribed(true))
        dispatch(worker_update_trial({
            start_date: start_date,
            end_date: end_date
        }))

        setDaysTillCharge(moment(end_date).diff(moment(new Date().getTime()), 'days'))
        setEndDate(end_date.getTime())
        setTrialActive(true)
        setLoading(false)
        setDisplay(0)
        setSuccessPopin(true)
        setIsCanceled(false)
        setTimeout(() => setSuccessPopin(false), 4000)
    }


    

    return (
        <div className={styles.subscription}>
            <Loader loading={loading}/>
            <div className={confirmFreeBanner||confirmBanner||loading?styles.backdrop:null} onClick={() => setConfirmFreeBanner(false)&&setConfirmBanner(false)}/>
            <CSSTransition 
                in={confirmBanner}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <ConfirmBanner type={'alterar'} cancel={() => setConfirmBanner(false)} confirm={() => cancelPlanChange()} color={'#ffffff'}/>
            </CSSTransition>
            <CSSTransition
                in={confirmFreeBanner}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <ConfirmBanner type={'three_months'} cancel={() => setConfirmFreeBanner(false)} confirm={() => setFreePlanHandler()} color={'#ffffff'}/>
            </CSSTransition>
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
                        display!==-1?
                        <div className={styles.display}>
                            <div className={styles.display_top}>
                                <div className={styles.display_user}>
                                    <div className={styles.user_top_flex}>
                                        <span className={styles.user_desc_top}>Estado da Subscrição</span>
                                        {
                                            endDate>currentDate || trialActive&&daysTillCharge?
                                            <span className={styles.user_desc} style={{color:"#0358e5"}}>ATIVADA</span>
                                            :<span className={styles.user_desc_dark} style={{color:"#fdd835"}}>DESATIVADA</span>
                                        }
                                        
                                        {
                                            isCanceled?
                                            <div className={styles.future_end}>
                                                Os teus previlégios terminam a <span style={{fontWeight:700}}>{endDate&&getDateToString(endDate/1000)}</span>
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
                        <Sessao text={successPopin?"Subscrição ativada com sucesso!"
                                        :failPopin?"Cartão inválido. Experimente outro!"
                                        :successPlanPopin?"Alteração de Plano marcado com sucesso!"
                                        :failPlanPopin?"Erro ao alterar plano."
                                        :cancelPlanPopin?"Alteração de Plano cancelado com sucesso."
                                        :cancelSubscriptionPopin?"Subscrição eliminada com sucesso."
                                        :
                                        ""}/>
                    </CSSTransition>

                        {
                            display===4||display===1?
                            <div className={styles.sub_info_main}>
                                {/* <span ref={scrolltopref}/> */}
                                <div className={styles.sub_info_wrap}>
                                    <div className={styles.verificar_top_wrapper}>
                                        <div className={styles.verificar_top}>
                                            <span className={styles.input_div_button_text_no_animation} style={{textTransform:'uppercase', backgroundColor:"transparent"}}>Ativar Subscrição</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.sub_info}>
                                        <span className={styles.sub_info_title} ref={scrolltopref}>Profissional no TAREFAS</span>
                                        {display===1 && applyDiscount?
                                            <p className={styles.sub_info_title_discount}>SUBSCRIÇÃO EXCLUSIVA FUNDADOR</p>
                                            :null
                                        }
                                        {
                                            display===4?
                                            <div className={styles.activate_info}>
                                                <div className={styles.line}>
                                                    <div className={styles.line_left}>
                                                        <TitleIcon className={styles.line_circle}/>
                                                        <span className={styles.helper_text}>Tarefas</span>
                                                    </div>
                                                    <span className={styles.connector}/>
                                                    <span className={styles.line_text}>Acesso desbloqueado aos detalhes de <strong>contacto</strong> e <strong>localização</strong> de todas as tarefas publicadas.</span>
                                                </div>
                                                <div className={styles.line} style={{margin:'10px 0'}}>
                                                    <div className={styles.line_left}>
                                                        <MessageIcon className={styles.line_circle}/>
                                                        <span className={styles.helper_text}>Mensagens</span>
                                                    </div>
                                                    <span className={styles.connector}/>
                                                    <span className={styles.line_text}>Acesso à <strong>plataforma de mensagens</strong>, onde podes contactar os teus clientes de forma fácil e direta.</span>
                                                </div>
                                                <div className={styles.line}>
                                                    <div className={styles.line_left}>
                                                        <PersonIcon className={styles.line_circle}/>
                                                        <span className={styles.helper_text}>Perfil</span>
                                                    </div>
                                                    <span className={styles.connector}/>
                                                    <span className={styles.line_text}>Criação do teu <strong>perfil de profissional</strong>, que será acessível a todos utilizadores do Tarefas. Maior exposição ao teu negócio!</span>
                                                </div>
                                            </div>
                                            :null
                                        }
                                        
                                    </div>
                                </div>
                                {
                                    display===4?
                                    <div className={styles.sub_info_bottom_wrapper}>
                                        <div className={styles.sub_info_bottom}>
                                            {
                                                !user.trial?
                                                <div>
                                                    <div style={{display:"flex", justifyContent:'center'}}>
                                                        <p className={styles.sub_info_title} style={{marginTop:'0px'}}>Planos de Subscrição</p>
                                                    </div>
                                                    
                                                    <div className={styles.info_bottom_text_wrapper}>
                                                        <div className={styles.info_bottom_text}>
                                                            <p className={styles.info_bottom_text_title}>Plano Fundador -80%</p>
                                                            <p style={{textAlign:'left'}}>Ativa a tua subscrição com um <strong style={{color:"#FF785A"}}>desconto de 80% </strong> sobre qualquer plano, para sempre.</p>
                                                            <p style={{fontWeight:300, marginTop:'3px'}}>Aproveita o desconto vitalício e exclusivo de
                                                            primeira ativação de subscrição</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.options}>
                                                        <div className={styles.options_card}>
                                                            <span className={styles.discount}>-80%</span>
                                                            <img className={styles.options_card_img} src={basic}/>
                                                            <p className={styles.options_card_title}>Mensal</p>
                                                            <div className={styles.options_price_flex}>
                                                                <div className={styles.options_price_flex_flex}>
                                                                    <EuroSymbolIcon className={styles.price_euro}/>
                                                                    <p className={styles.options_price_value}>{mensal_d_euro}</p>
                                                                    <p className={styles.options_price_decimal}>.{mensal_d_centimo}</p>
                                                                </div>
                                                                <ArrowRightIcon className={styles.price_arrow}/>
                                                                <div className={styles.options_price_flex_flex} style={{color:"#FF785A", fontWeight:'700'}}>
                                                                    <EuroSymbolIcon className={styles.price_euro}/>
                                                                    <p className={styles.options_price_value_new}>{discount_mensal_d_euro}</p>
                                                                    <p className={styles.options_price_decimal_new}>.{discount_mensal_d_centimo}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.options_card}>
                                                            <span className={styles.discount}>-80%</span>
                                                            <img className={styles.options_card_img} src={medium}/>
                                                            <p className={styles.options_card_title}>Semestral</p>
                                                            <div className={styles.options_price_flex}>
                                                                <div className={styles.options_price_flex_flex}>
                                                                    <EuroSymbolIcon className={styles.price_euro}/>
                                                                    <p className={styles.options_price_value}>{semestral_d_euro}</p>
                                                                    <p className={styles.options_price_decimal}>.{semestral_d_centimo}</p>
                                                                </div>
                                                                <ArrowRightIcon className={styles.price_arrow}/>
                                                                <div className={styles.options_price_flex_flex} style={{color:"#FF785A", fontWeight:'700'}}>
                                                                    <EuroSymbolIcon className={styles.price_euro}/>
                                                                    <p className={styles.options_price_value_new}>{discount_semestral_d_euro}</p>
                                                                    <p className={styles.options_price_decimal_new}>.{discount_semestral_d_centimo}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.options_card}>
                                                            <span className={styles.discount}>-80%</span>
                                                            <img className={styles.options_card_img} src={pro}/>
                                                            <p className={styles.options_card_title}>Anual</p>
                                                            <div className={styles.options_price_flex}>
                                                                <div className={styles.options_price_flex_flex}>
                                                                    <EuroSymbolIcon className={styles.price_euro}/>
                                                                    <p className={styles.options_price_value}>{anual_d_euro}</p>
                                                                    <p className={styles.options_price_decimal}>.{anual_d_centimo}</p>
                                                                </div>
                                                                <ArrowRightIcon className={styles.price_arrow}/>
                                                                <div className={styles.options_price_flex_flex} style={{color:"#FF785A", fontWeight:'700'}}>
                                                                    <EuroSymbolIcon className={styles.price_euro}/>
                                                                    <p className={styles.options_price_value_new}>{discount_anual_d_euro}</p>
                                                                    <p className={styles.options_price_decimal_new}>.{discount_anual_d_centimo}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    
                                                    </div>
                                                    <div className={styles.trial_button}
                                                        onClick={() => {
                                                            setApplyDiscount(true)
                                                            setDisplay(1)
                                                            // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                                        }}>
                                                        {/* <span className={styles.trial_button_banner}>DESCONTO FUNDADOR 80%</span> */}
                                                        <span className={styles.trial_button_text}>VER PLANOS EXCLUSIVOS FUNDADOR</span>
                                                    </div>
                                                    <p className={styles.info_bottom_or}>OU</p>
                                                    <p className={styles.info_bottom_text_title}>Plano Gratuito</p>
                                                    <div className={styles.discount_2}>
                                                        <p className={styles.discount_text_2}>3 meses subscrição grátis</p>
                                                    </div>
                                                    <div className={styles.info_bottom_text_wrapper}>
                                                        
                                                        <div className={styles.info_bottom_text}>
                                                            <p style={{textAlign:'left'}}>Ativa a tua subscrição durante <strong>90 dias de forma gratuita</strong>.</p>
                                                            <p style={{fontWeight:300, marginTop:'3px'}}>Depois continua a usar a tua conta com um plano regular.</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className={styles.trial_button} onClick={() => setConfirmFreeBanner(true)}>
                                                        {/* <span className={styles.trial_button_banner}>GRATUITO</span> */}
                                                        <span className={styles.trial_button_text}>ATIVAR PLANO 90 DIAS GRÁTIS</span>
                                                    </div>
                                                    
                                                </div>
                                                :
                                                <div>
                                                    <div className={styles.info_bottom_text_wrapper}>
                                                        <div className={styles.info_bottom_text}>
                                                            <p>Ativa a tua conta</p>
                                                            <p style={{fontWeight:300}}>Acede a todos os benefícios de ser um profissional do Tarefas.</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.trial_button}
                                                        onClick={() => {
                                                            setApplyDiscount(false)
                                                            setDisplay(1)
                                                        }}>
                                                        <span className={styles.trial_button_text}>VER PLANOS</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    :null
                                }
                                
                            </div>
                            :null
                        }
                        {
                            display!==4?
                                <div className={styles.mid_content}>
                                {
                                    display===0&&schedule || display===0&&trialActive?
                                    <div className={styles.display_zero}>
                                        <span className={styles.subtitle}>Plano</span>
                                        <div className={styles.divider}/>
                                        <div>
                                            <div className={styles.subtitle_sub}>
                                                {
                                                    trialActive?
                                                    <span className={styles.ya} style={{color:daysTillCharge?"#0358e5":"#fdd835"}}>GRATUÍTO</span>
                                                    :
                                                    <span className={styles.ya}>{
                                                        schedule.phases.length===2&&subscriptionPlanObj.selected_plan===1?"MENSAL"
                                                        :subscriptionPlanObj.selected_plan===1?"MENSAL"
                                                        :
                                                        schedule.phases.length===2&&subscriptionPlanObj.selected_plan===2?"SEMESTRAL"
                                                        :subscriptionPlanObj.selected_plan===2?"SEMESTRAL"
                                                        :
                                                        schedule.phases.length===2&&subscriptionPlanObj.selected_plan===3?"ANUAL"
                                                        :subscriptionPlanObj.selected_plan===3?"ANUAL"
                                                        :null
                                                        }
                                                    </span>

                                                }
                                                
                                                <span>
                                                    {
                                                        !trialActive&&schedule.phases.length===2&&schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.helper_two}>(Início a {getDateToString(schedule.current_phase?.end_date)} - fim da subscrição previamente cancelada)</span>
                                                        :null
                                                    }
                                                </span>
                                            </div>
                                            
                                            <div className={styles.selected_plan_info}>
                                                    {
                                                        !trialActive&&schedule&&schedule.phases.length>1&&!schedule.phases[0].metadata.from_canceled?
                                                        <div className={styles.sub_val_wrap}>
                                                            <div className={styles.sub_val_wrap_image}>
                                                                <img src={subscriptionPlanObj.image} className={styles.section_img_small}/>
                                                            </div>
                                                            {
                                                                discountSubscriber?
                                                                <div>
                                                                    <p className={styles.sub_val_date_discount}>fundador</p>
                                                                    <p className={styles.sub_val_date_discount_small}>F</p>
                                                                </div>
                                                                :null
                                                            }
                                                            <p className={styles.sub_val_date}>{subscriptionPlanObj.type}</p>
                                                            <div className={styles.selected_plan_value_wrap}>
                                                                <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper}>VALOR:</span>
                                                                        <span className={styles.info_text}>€{subscriptionPlanObj.value}</span>
                                                                        {
                                                                            discountSubscriber?
                                                                            <span className={styles.discount_number}>-80%</span>
                                                                            :null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper}>Modelo:</span>
                                                                        <span className={styles.info_text}>A cada {subscriptionPlanObj.a_cada}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div_pay}>
                                                                    <span className={styles.info_text_helper} style={{width:'fit-content'}}><span className={styles.prox_cobr}>alteração de plano</span></span>
                                                                    <span className={styles.info_text} style={{marginTop:'5px', color:"#FF785A"}}>{extenseDate(endDate/1000)}</span>
                                                                    <span className={styles.info_text_days_charge}>{daysTillCharge} dias</span>
                                                                </div>

                                                                <p className={styles.selected_plan_value_information}>O cancelamento desta alteração ou da subscrição pode ser feito a qualquer altura.</p>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className={styles.sub_val_wrap} 
                                                            style={{borderColor:daysTillCharge?discountSubscriber?"#FF785A":"#0358e5":"#fdd835",
                                                                    backgroundColor:daysTillCharge?"#0358e590":"#fdd83590"}}>
                                                            {
                                                                trialActive?
                                                                <div className={styles.sub_val_wrap_image} style={{backgroundColor:daysTillCharge?discountSubscriber?"#FF785A":"#0358e5":"#fdd835"}}>
                                                                    <img src={hand} className={styles.section_img_small}/>
                                                                </div>
                                                                :
                                                                <div className={styles.sub_val_wrap_image} style={{backgroundColor:daysTillCharge?discountSubscriber?"#FF785A":"#0358e5":"#fdd835"}}>
                                                                    <img src={subscriptionPlanObj.image} className={styles.section_img_small}/>
                                                                </div>

                                                            }
                                                            
                                                            {
                                                                discountSubscriber?
                                                                <div>
                                                                    <p className={styles.sub_val_date_discount}>fundador</p>
                                                                    <p className={styles.sub_val_date_discount_small}>F</p>
                                                                </div>
                                                                :null
                                                            }
                                                            <p className={styles.sub_val_date}>{subscriptionPlanObj.type}</p>
                                                            {
                                                                isCanceled?
                                                                <p className={styles.canceled_title}>SUBSCRIÇÃO CANCELADA</p>
                                                                :null
                                                            }
                                                            <div className={styles.selected_plan_value_wrap}>
                                                                <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{color:isCanceled?"#71848d":"#fff"}}>VALOR:</span>
                                                                        {
                                                                            trialActive?
                                                                            <span className={styles.info_text} style={{color:isCanceled?"#71848d":"#fff"}}>€0.00</span>
                                                                            :
                                                                            <span className={styles.info_text} style={{color:isCanceled?"#71848d":"#fff"}}>€{subscriptionPlanObj.value}</span>
                                                                        }
                                                                        {
                                                                            discountSubscriber?
                                                                            <span className={styles.discount_number} style={{backgroundColor:isCanceled?"#71848d":"#FF785A", color:isCanceled?"#161F28":"#fff"}}>-80%</span>
                                                                            :null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.info_div}>
                                                                    <div className={styles.info_subdiv}>
                                                                        <span className={styles.info_text_helper} style={{color:isCanceled?"#71848d":"#fff"}}>Modelo:</span>
                                                                        {
                                                                            trialActive?
                                                                            <span className={styles.info_text} style={{color:isCanceled?"#71848d":"#fff"}}>90 dias</span>
                                                                            :
                                                                            <span className={styles.info_text} style={{color:isCanceled?"#71848d":"#fff"}}>A cada {subscriptionPlanObj.a_cada}</span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div style={{display:'flex', justifyContent:'center', marginTop:'20px'}}>
                                                                    <span className={styles.info_text_helper_date} style={{width:'fit-content'}}>{trialActive?'Fim da subscrição experimental':!isCanceled?'Próxima cobrança':'Data de término efetivo da Subscrição'}</span>
                                                                </div>
                                                                <div className={styles.info_div_pay}>
                                                                    {
                                                                        trialActive?
                                                                        <span className={styles.info_text} style={{marginTop:'5px', color:daysTillCharge?"#0358e5":"#fdd835", textTransform:'uppercase'}}>
                                                                            {user.trial?.end_date?extenseDate(new Date(user.trial?.end_date).getTime()/1000):extenseDate(new Date(endDate).getTime()/1000)}</span>
                                                                        :
                                                                        <span className={styles.info_text} style={{marginTop:'5px', color:"#0358e5"}}>{extenseDate(endDate/1000)}</span>
                                                                    }
                                                                    
                                                                    <span className={styles.info_text_days_charge}>{daysTillCharge} dias</span>
                                                                </div>
                                                                {
                                                                    trialActive?
                                                                    <p className={styles.selected_plan_value_information}>Podes iniciar a tua subscrição regular a qualquer momento.</p>
                                                                    :
                                                                    !isCanceled?
                                                                    <p className={styles.selected_plan_value_information}>O cancelamento da subscrição pode ser feito a qualquer altura.</p>
                                                                    :
                                                                    <p className={styles.selected_plan_value_information}>Poderás fazer uma nova subscrição no momento de término efetivo da atual.</p>
                                                                }
                                                                
                                                            </div>
                                                        </div>

                                                    }
                                                {
                                                    schedule&&schedule.phases.length>1&&!schedule.phases[0].metadata.from_canceled?
                                                    <div className={styles.changing_plan}>
                                                        <span className={styles.prox_cobr}>Alteração de PLANO</span>
                                                        <SubscriptionAlterar 
                                                            trialActive={trialActive}
                                                            subscriptionPlanObj={subscriptionPlanObj}
                                                            selectedPlan={false}
                                                            nextPlan={getPlanFromPriceId(schedule&&schedule.phases[1].plans[0].price)}
                                                            discountSubscriber={discountSubscriber}/>
                                                    </div>
                                                    :null
                                                }
                                                {
                                                    schedule&&schedule.phases.length>1&&!schedule.phases[0].metadata.from_canceled?
                                                    <p className={styles.selected_plan_value_information}>O <span style={{color:"#FF785A"}}>plano novo</span> entrará em vigor a {getDateToString(endDate/1000)}.</p>
                                                    :null
                                                }
                                            </div>
                                        </div>
                                        {
                                            !isCanceled&&schedule?
                                            <div className={styles.post_pay}>
                                                <span className={styles.subtitle}>Método de Pagamento</span>
                                                <div className={styles.divider}/>
                                                <span className={styles.subtitle_sub}><span style={{fontWeight:"500"}}>Cartão</span> <span style={{marginLeft:"5px"}}>-</span> <span style={{color:subscriptionStatus==="active"?"#0358e5":"#fdd835", marginLeft:"5px"}}>{subscriptionStatus==="active"?<span style={{display:"flex", alignItems:"center"}}>ATIVO</span>:<span style={{display:"flex", alignItems:"center"}}>ERRO</span>}</span></span>
                                                <div className={styles.initial}>

                                                    <div className={styles.card} style={{marginTop:"10px", border:subscriptionStatus==="delay"?"6px solid #fdd835":""}}>
                                                        <div className={styles.card_top}>
                                                            {
                                                                user.subscription.payment_method.card.brand==="visa"?
                                                                <img src={visa} className={styles.brand}/>
                                                                :
                                                                user.subscription.payment_method.card.brand==="mastercard"?
                                                                <img src={mastercard} className={styles.brand_master}/>
                                                                :
                                                                user.subscription.payment_method.card.brand==="american"?
                                                                <img src={american} className={styles.brand_american}/>
                                                                :null
                                                            }
                                                        </div>
                                                        <div className={styles.card_mid}>
                                                            <img src={chip} className={styles.chip}/>
                                                        </div>
                                                        <div className={styles.card_number}>
                                                            <span className={styles.card_number_value}>**** **** **** {user.subscription.payment_method.card.last4}</span>
                                                        </div>
                                                        <div className={styles.card_name_date}>
                                                            <div className={styles.card_name}>
                                                                <span className={styles.name_helper}>Nome</span>
                                                                <span className={styles.name_val}>{user.subscription.payment_method.billing_details.name}</span>
                                                            </div>
                                                            <div className={styles.card_name}>
                                                                <span className={styles.name_helper}>Data</span>
                                                                <span className={styles.name_val}>{user.subscription.payment_method.card.exp_month}/{user.subscription.payment_method.card.exp_year}</span>
                                                            </div>
                                                        </div>
                                                    </div>                                
                                                </div>
                                            </div>
                                            :null

                                        }
                                        
                                        {
                                            !isCanceled?
                                            <div className={styles.card_right}>
                                                {
                                                    trialActive?
                                                    <div className={styles.card_right_button} onClick={() => {
                                                        setDisplay(1)}}>
                                                        <span style={{fontWeight:600}}>Iniciar subscrição regular</span>
                                                    </div>
                                                    :
                                                    schedule&&schedule.phases[1]&&!schedule.phases[0].metadata.from_canceled?
                                                    <div className={styles.card_right_button} onClick={() => setConfirmBanner(true)}>
                                                        <span>Cancelar <span style={{fontWeight:600}}>Alteração de plano</span></span>
                                                    </div>
                                                    :
                                                    <div className={styles.card_right_button} onClick={() => {
                                                        setDisplay(2)
                                                        setAlterarPlano(true)}}>
                                                        <span style={{fontWeight:600}}>Ver Planos</span>
                                                    </div>
                                                }
                                                {
                                                    trialActive?
                                                    null
                                                    :
                                                    <div className={styles.card_right_button_remove} onClick={() => cancelSubscriptionHandler()}>
                                                        <span>Cancelar Subscrição</span>
                                                    </div>
                                                }
                                                <div className={styles.card_right_bottom}>
                                                    
                                                </div>
                                            </div>
                                            :null

                                        }
                                        
                                    </div>
                                    :display===1?
                                    <div className={styles.display_one}>
                                        <span className={styles.subtitle_sub} style={{marginTop:"20px"}}>
                                            <span style={{color:"#71848d"}}>Ativar Subscrição <span style={{color:'#71848d'}}>{selectedMenu+1}/2</span></span>
                                        </span>
                                        <div className={styles.indicator_div}>
                                                <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(0)}>
                                                    <p className={styles.indicator_text} style={{color:selectedMenu===0||(selectedPlan&&selectedMenu===null)?"#ffffff":"#0358e5"}}>1 - PLANO</p>
                                                    <span className={styles.indicator} style={{backgroundColor:!selectedMenu||(selectedPlan&&selectedMenu===null)?"#ffffff":"#0358e5"}}></span>
                                                </div>
                                                <div className={styles.indicator_subdiv} onClick={() => selectedPlan&&setSelectedMenu(1)}>
                                                    <p className={styles.indicator_text} style={{color:selectedMenu===1?"#ffffff":""}}>
                                                        2 - PAGAMENTO
                                                    </p>
                                                    <span className={styles.indicator} style={{backgroundColor:selectedMenu===1?"#ffffff":""}}></span>
                                                </div>
                                        </div>
                                        <div className={selectedMenu===0?styles.plans:`${styles.plans} ${styles.plans_hide}`}>                                        
                                            <div className={styles.plans_area}>
                                                <p className={styles.plans_title}>1 - Escolher o plano</p>
                                                <div className={styles.plans_sections}>
                                                    <div className={selectedPlan===1?styles.section_selected:styles.section} onClick={() => setSelectedPlan(1)}>
                                                        {
                                                            applyDiscount?
                                                            <span className={styles.discount}>-80%</span>
                                                            :null
                                                        }
                                                        <img src={basic} className={styles.section_img}/>                                         
                                                        <span className={styles.section_type}>Mensal</span>
                                                        <span className={styles.section_type_desc}>Pagamento a cada mês</span>
                                                        <div className={styles.section_valor_div}>
                                                            {
                                                                applyDiscount?
                                                                <div className={styles.section_discount}>
                                                                    <div className={styles.section_valor_top}>
                                                                        <EuroSymbolIcon className={styles.section_valor_top_symbol_discount}/>
                                                                        <span className={styles.section_valor_top_number_discount}>{mensal_d_euro}</span>
                                                                        <span className={styles.section_valor_top_number_decimal_discount}>.{mensal_d_centimo}</span>
                                                                    </div>
                                                                    <ArrowRightIcon className={styles.discount_arrow}/>
                                                                    <div className={styles.section_valor_top}>
                                                                        <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                                        <span className={styles.section_valor_top_number}>{discount_mensal_d_euro}</span>
                                                                        <span className={styles.section_valor_top_number_decimal}>.{discount_mensal_d_centimo}</span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className={styles.section_valor_top}>
                                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol} style={{color:"#fff"}}/>
                                                                    <span className={styles.section_valor_top_number} style={{color:"#fff"}}>{mensal_d_euro}</span>
                                                                    <span className={styles.section_valor_top_number_decimal} style={{color:"#fff"}}>.{mensal_d_centimo}</span>
                                                                </div>
                                                            }
                                                            {
                                                                applyDiscount?
                                                                <div style={{display:'flex', alignItems:'center'}}>
                                                                    <span className={styles.section_desc_of_pay_discount}>{mensal_d}€/mês</span>
                                                                    <ArrowRightIcon className={styles.discount_arrow_small}/>
                                                                    <span className={styles.section_desc_of_pay_discount_new}>{discount_mensal_d}€/mês</span>
                                                                </div>
                                                                :
                                                                <span className={styles.section_desc_of_pay}>{mensal_d}€/mês</span>
                                                            }
                                                            
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
                                                        {
                                                            applyDiscount?
                                                            <span className={styles.discount}>-80%</span>
                                                            :null
                                                        }
                                                        <img src={medium} className={styles.section_img}/>
                                                        <span className={styles.section_type}>Semestral</span>
                                                        <span className={styles.section_type_desc}>Pagamento a cada 6 meses</span>
                                                        <div className={styles.section_valor_div}>
                                                            {
                                                                applyDiscount?
                                                                <div className={styles.section_discount}>
                                                                    <div className={styles.section_valor_top}>
                                                                        <EuroSymbolIcon className={styles.section_valor_top_symbol_discount}/>
                                                                        <span className={styles.section_valor_top_number_discount}>{semestral_d_euro}</span>
                                                                        <span className={styles.section_valor_top_number_decimal_discount}>.{semestral_d_centimo}</span>
                                                                    </div>
                                                                    <ArrowRightIcon className={styles.discount_arrow}/>
                                                                    <div className={styles.section_valor_top}>
                                                                        <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                                        <span className={styles.section_valor_top_number}>{discount_semestral_d_euro}</span>
                                                                        <span className={styles.section_valor_top_number_decimal}>.{discount_semestral_d_centimo}</span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className={styles.section_valor_top}>
                                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol} style={{color:"#fff"}}/>
                                                                    <span className={styles.section_valor_top_number} style={{color:"#fff"}}>{semestral_d_euro}</span>
                                                                    <span className={styles.section_valor_top_number_decimal} style={{color:"#fff"}}>.{semestral_d_centimo}</span>
                                                                </div>
                                                            }
                                                            {
                                                                applyDiscount?
                                                                <div style={{display:'flex', alignItems:'center'}}>
                                                                    <span className={styles.section_desc_of_pay_discount}>{semestral_monthly}€/mês</span>
                                                                    <ArrowRightIcon className={styles.discount_arrow_small}/>
                                                                    <span className={styles.section_desc_of_pay_discount_new}>{discount_semestral_monthly}€/mês</span>
                                                                </div>
                                                                :
                                                                <span className={styles.section_desc_of_pay}>{semestral_monthly}€/mês</span>
                                                            }
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
                                                        {
                                                            applyDiscount?
                                                            <span className={styles.discount}>-80%</span>
                                                            :null
                                                        }
                                                        <img src={pro} className={styles.section_img}/>
                                                        <span className={styles.section_type}>Anual</span>
                                                        <span className={styles.section_type_desc}>Pagamento a cada 12 meses</span>
                                                        <div className={styles.section_valor_div}>
                                                            {
                                                                applyDiscount?
                                                                <div className={styles.section_discount}>
                                                                    <div className={styles.section_valor_top}>
                                                                        <EuroSymbolIcon className={styles.section_valor_top_symbol_discount}/>
                                                                        <span className={styles.section_valor_top_number_discount}>{anual_d_euro}</span>
                                                                        <span className={styles.section_valor_top_number_decimal_discount}>.{anual_d_centimo}</span>
                                                                    </div>
                                                                    <ArrowRightIcon className={styles.discount_arrow}/>
                                                                    <div className={styles.section_valor_top}>
                                                                        <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                                        <span className={styles.section_valor_top_number}>{discount_anual_d_euro}</span>
                                                                        <span className={styles.section_valor_top_number_decimal}>.{discount_anual_d_centimo}</span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className={styles.section_valor_top}>
                                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol} style={{color:"#fff"}}/>
                                                                    <span className={styles.section_valor_top_number} style={{color:"#fff"}}>{anual_d_euro}</span>
                                                                    <span className={styles.section_valor_top_number_decimal} style={{color:"#fff"}}>.{anual_d_centimo}</span>
                                                                </div>
                                                            }
                                                            {
                                                                applyDiscount?
                                                                <div style={{display:'flex', alignItems:'center'}}>
                                                                    <span className={styles.section_desc_of_pay_discount}>{anual_monthly}€/mês</span>
                                                                    <ArrowRightIcon className={styles.discount_arrow_small}/>
                                                                    <span className={styles.section_desc_of_pay_discount_new}>{discount_anual_monthly}€/mês</span>
                                                                </div>
                                                                :
                                                                <span className={styles.section_desc_of_pay}>{anual_monthly}€/mês</span>
                                                            }
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
                                                        {
                                                        applyDiscount?
                                                        <div>
                                                            <p className={styles.sub_val_date_discount}>fundador</p>
                                                            <p className={styles.sub_val_date_discount_small}>F</p>
                                                        </div>
                                                        :null
                                                        }
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.selected_plan_discount_wrap}>
                                                                <span className={styles.selected_plan_value}>Pagamento de </span>
                                                                {
                                                                    applyDiscount?
                                                                    <span style={{display:'flex', alignItems:'center'}}>
                                                                        <span className={styles.section_desc_of_pay_discount_bottom}>{mensal_d}€</span>
                                                                        <ArrowRightIcon className={styles.discount_arrow_small_bottom}/>
                                                                        <span className={styles.section_desc_of_pay_discount_new_bottom}>{discount_mensal_d}€</span>
                                                                    </span>
                                                                    :
                                                                    <span className={styles.selected_plan_value_normal}> {mensal_d}€</span>
                                                                }
                                                                <span className={styles.selected_plan_value}> a cada mês.</span>
                                                            </div>
                                                            
                                                            <p className={styles.selected_plan_value_information}>{saver}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===2?
                                                    <div className={styles.sub_val_wrap}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={medium} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Plano Semestral</p>
                                                        {
                                                            applyDiscount?
                                                            <div>
                                                                <p className={styles.sub_val_date_discount}>fundador</p>
                                                                <p className={styles.sub_val_date_discount_small}>F</p>
                                                            </div>
                                                            :null
                                                        }
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.selected_plan_discount_wrap}>
                                                                <span className={styles.selected_plan_value}>Pagamento de </span>
                                                                {
                                                                    applyDiscount?
                                                                    <span style={{display:'flex', alignItems:'center'}}>
                                                                        <span className={styles.section_desc_of_pay_discount_bottom}>{semestral_d}€</span>
                                                                        <ArrowRightIcon className={styles.discount_arrow_small_bottom}/>
                                                                        <span className={styles.section_desc_of_pay_discount_new_bottom}>{discount_semestral_d}€</span>
                                                                    </span>
                                                                    :
                                                                    <span className={styles.selected_plan_value_normal}> {semestral_d}€</span>
                                                                }
                                                                <span className={styles.selected_plan_value}> a cada 6 meses.</span>
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===3?
                                                    <div className={styles.sub_val_wrap}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={pro} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Plano Anual</p>
                                                        {
                                                        applyDiscount?
                                                        <div>
                                                            <p className={styles.sub_val_date_discount}>fundador</p>
                                                            <p className={styles.sub_val_date_discount_small}>F</p>
                                                        </div>
                                                        :null
                                                        }
                                                        <div className={styles.selected_plan_value_wrap}>
                                                        <div className={styles.selected_plan_discount_wrap}>
                                                                <span className={styles.selected_plan_value}>Pagamento de </span>
                                                                {
                                                                    applyDiscount?
                                                                    <span style={{display:'flex', alignItems:'center'}}>
                                                                        <span className={styles.section_desc_of_pay_discount_bottom}>{anual_d}€</span>
                                                                        <ArrowRightIcon className={styles.discount_arrow_small_bottom}/>
                                                                        <span className={styles.section_desc_of_pay_discount_new_bottom}>{discount_anual_d}€</span>
                                                                    </span>
                                                                    :
                                                                    <span className={styles.selected_plan_value_normal}> {anual_d}€</span>
                                                                }
                                                                <span className={styles.selected_plan_value}> a cada 12 meses.</span>
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver}</p>
                                                        </div>
                                                    </div>
                                                    :<span className={styles.selected_plan_no_value}>Escolha um plano</span>
                                                }
                                                
                                            </div>
                                            <div className={styles.buttons}>
                                                <span className={selectedPlan?styles.button_add:styles.button_add_disabled} 
                                                    style={{width:isCanceled?'70%':'100%'}}
                                                onClick={() => {
                                                    selectedPlan&&setSelectedMenu(1)
                                                    // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                                    }}>Continuar</span>
                                                    <span className={styles.button_cancel} onClick={() => {
                                                        if(trialActive) setDisplay(0)
                                                        else setDisplay(4)
                                                        setSelectedMenu(0)
                                                        setSelectedPlan(null)
                                                        setApplyDiscount(false)
                                                        // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                                        }}>CANCELAR</span>
                                            </div>
                                        </div>
                                        {/* CARTAO */}
                                        <div className={selectedMenu?styles.details:`${styles.details} ${styles.details_hide}`}>
                                        <span className={styles.details_title}>2 - Detalhes de Pagamento</span>
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
                                                            <div className={`${styles.right_section_short} ${styles.right_Section_short_helper}`}>
                                                                <span className={styles.right_helper}>CVC</span>
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
                                                        {
                                                        applyDiscount?
                                                        <div>
                                                            <p className={styles.sub_val_date_discount}>fundador</p>
                                                            <p className={styles.sub_val_date_discount_small}>F</p>
                                                        </div>
                                                        :null
                                                        }
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>VALOR:</span>
                                                                    <span className={styles.info_text}>
                                                                        {
                                                                            applyDiscount?
                                                                            <span style={{color:"#FF785A"}}>{discount_mensal_d}€</span>
                                                                            :<span>€{mensal_d}</span>
                                                                        }
                                                                    </span>
                                                                    <span className={styles.equivalente} style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}> (equivalente a €{applyDiscount?<span style={{color:"#FF785A", fontWeight:500}}>{discount_mensal_d}</span>:mensal_d}/mês)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                                    <span className={styles.info_text}>Cobranças mensais<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}} className={styles.equivalente}>(a cada mês)</span></span>
                                                                </div>
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===2?
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={medium} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Plano Semestral</p>
                                                        {
                                                        applyDiscount?
                                                        <div>
                                                            <p className={styles.sub_val_date_discount}>fundador</p>
                                                            <p className={styles.sub_val_date_discount_small}>F</p>
                                                        </div>
                                                        :null
                                                        }
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>VALOR:</span>
                                                                    <span className={styles.info_text}>
                                                                        {
                                                                            applyDiscount?
                                                                            <span style={{color:"#FF785A"}}>€{discount_semestral_d}</span>
                                                                            :<span>€{semestral_d}</span>
                                                                        }
                                                                    </span>
                                                                    <span className={styles.equivalente} style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}> (equivalente a €{applyDiscount?<span style={{color:"#FF785A", fontWeight:500}}>{discount_semestral_monthly}</span>:semestral_monthly}/mês)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                                    <span className={styles.info_text}>Cobranças semestrais<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}} className={styles.equivalente}>(a cada 6 meses)</span></span>
                                                                </div>
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===3?
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={pro} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Plano Anual</p>
                                                        {
                                                        applyDiscount?
                                                        <div>
                                                            <p className={styles.sub_val_date_discount}>fundador</p>
                                                            <p className={styles.sub_val_date_discount_small}>F</p>
                                                        </div>
                                                        :null
                                                        }
                                                        <div className={styles.selected_plan_value_wrap}>
                                                            <div className={styles.info_div} style={{marginTop:'10px'}}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>VALOR:</span>
                                                                    <span className={styles.info_text}>
                                                                        {
                                                                            applyDiscount?
                                                                            <span style={{color:"#FF785A"}}>€{discount_anual_d}</span>
                                                                            :<span>€{anual_d}</span>
                                                                        }
                                                                    </span>
                                                                    <span className={styles.equivalente} style={{marginLeft:"5px", fontSize:"0.7rem", color:"white"}}> (equivalente a €{applyDiscount?<span style={{color:"#FF785A", fontWeight:500}}>{discount_anual_monthly}</span>:anual_monthly}/mês)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>Modelo:</span>
                                                                    <span className={styles.info_text}>Cobranças anuais<span style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}} className={styles.equivalente}>(a cada 12 meses)</span></span>
                                                                </div>
                                                            </div>
                                                            {
                                                                isCanceled&&endDate>currentDate?
                                                                <span className={styles.selected_plan_value_information}>Esta nova subscrição apenas será cobrada no fim da tua subscrição atual (<span style={{color:"#FF785A", fontWeight:"400"}}>{getDateToString(endDate/1000)}</span>)</span>
                                                                :
                                                                <p className={styles.selected_plan_value_information}>{saver}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    :<span className={styles.selected_plan_no_value}>Escolha um plano</span>
                                                }
                                                
                                            </div>
                                            <div className={styles.buttons} style={{marginTop:"105px"}}>
                                                <span></span>
                                                {
                                                    isCanceled&&endDate>currentDate?
                                                    <span className={cardName.length>2&&validCard&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&validCvc&&updateCard()}>ADICIONAR CARTÃO E FINALIZAR</span>
                                                    :
                                                    <span className={cardName.length>2&&validCard&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&validCvc&&handlePayment()}>ADICIONAR CARTÃO E SUBSCREVER</span>

                                                }
                                                {
                                                    isCanceled?
                                                    <span className={styles.button_cancel} onClick={() => {
                                                        setDisplay(0)
                                                        setSelectedMenu(0)
                                                        setSelectedPlan(null)
                                                        }}>CANCELAR</span>
                                                    :
                                                    <span className={styles.button_cancel} onClick={() => {
                                                        setSelectedMenu(0)
                                                        // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                                        }}>VOLTAR</span>
                                                }
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
                                                <SubscriptionPlans 
                                                    selectedPlan={selectedPlan}
                                                    subscriptionPlanObj={subscriptionPlanObj}
                                                    discountSubscriber={discountSubscriber}
                                                    user={user}
                                                    schedule={schedule}

                                                    discount_mensal_d_euro={discount_mensal_d_euro}
                                                    discount_mensal_d_centimo={discount_mensal_d_centimo}
                                                    discount_mensal_d={discount_mensal_monthly}
                                                    mensal_d={mensal_monthly}

                                                    discount_semestral_d_euro={discount_semestral_d_euro}
                                                    discount_semestral_d_centimo={discount_semestral_d_centimo}
                                                    discount_semestral_monthly={discount_semestral_monthly}
                                                    semestral_monthly={semestral_monthly}

                                                    discount_anual_d_euro={discount_anual_d_euro}
                                                    discount_anual_d_centimo={discount_anual_d_centimo}
                                                    discount_anual_monthly={discount_anual_monthly}
                                                    anual_monthly={anual_monthly}

                                                    setSelectedPlan={setSelectedPlan}
                                                    
                                                    />
                                            </div>
                                            <div className={styles.selected_plan} style={{marginTop:"20px"}}>
                                                <span className={styles.selected_plan_title}>
                                                    ALTERAÇÃO
                                                </span>
                                                <SubscriptionAlterar
                                                    trialActive={trialActive}
                                                    discountSubscriber={discountSubscriber}
                                                    subscriptionPlanObj={subscriptionPlanObj}
                                                    selectedPlan={selectedPlan}/>
                                                
                                            </div>
                                            <div className={styles.alterar_plano_wrap}>
                                                <span className={styles.alterar_plano}>A alteração do plano ficará suspensa, sendo que o novo plano <span style={{fontWeight:"600"}}>apenas terá início na data da próxima cobrança do plano atual</span>, sendo cobrado o valor do novo plano selecionado. </span>
                                                <span className={styles.alterar_plano}>A alteração do plano poderá ser cancelada até à data da proxíma cobrança. </span>
                                                <p className={styles.alterar_plano} style={{marginTop:'20px'}}>Data da próxima cobrança do plano atual: 
                                                    <div style={{display:'flex', alignItems:'center', marginTop:'5px'}}><p className={styles.alterar_plano_date}>{extenseDate(endDate/1000)}</p> <span className={styles.info_text_days_charge} style={{color:"#0358e5", fontWeight:700, marginLeft:'5px'}}>({daysTillCharge} dias)</span></div>
                                                </p>
                                            </div>
                                            <div className={styles.buttons}>
                                                <span className={
                                                    selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan?
                                                    styles.button_add
                                                    :
                                                    selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan?
                                                    styles.button_add
                                                    :
                                                    styles.button_add_disabled} 
                                                    
                                                    onClick={() => {
                                                    selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan&&updatePlan()
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
                                    :null
                                }
                                </div>
                            :null
                        }
                        
                    </div>
                </div>
                :null
            }
        </div>
        
    )
}

export default Subscription