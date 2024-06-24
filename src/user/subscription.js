import React, {useState, useEffect, useRef} from 'react'
import styles from './subscription.module.css'
import Check from '@mui/icons-material/Check';
import chip from '../assets/chip.png'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium_3.png'
import hand from '../assets/free-trial.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import axios from 'axios'
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
import SubscriptionAlterar from './subscription_alterar';
import ConfirmBanner from '../general/confirmBanner';
import { useSelector } from 'react-redux'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { 
    worker_update_is_subscribed,
    worker_update_subscription
  } from '../store';
  import { useDispatch } from 'react-redux'
import SubscriptionPlans from './subscription_plans';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const Subscription = props => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})

    const scrolltopref = useRef(null)

    const dispatch = useDispatch()

    const [cardName, setCardName] = useState("")
    const [cardNumberDisplay, setCardNumberDisplay] = useState("")
    const [display, setDisplay] = useState(4)
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [cardIssuer, setCardIssuer] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)
    const [failPopin, setFailPopin] = useState(false)
    const [generalFail, setGeneralFail] = useState(false)
    const [successPlanPopin, setSuccessPlanPopin] = useState(false)
    const [failPlanPopin, setFailPlanPopin] = useState(false)
    const [failHighlight, setFailHighlight] = useState(false)
    const [canceledHighlight, setCanceledHighlight] = useState(false)
    const [cancelPlanPopin, setCancelPlanPopin] = useState(false)
    const [endDate, setEndDate] = useState(null)
    const [currentDate, setCurrentDate] = useState(null)
    const [daysTillCharge, setDaysTillCharge] = useState(null)
    const [showHistory, setShowHistory] = useState(false)

    const [validCard, setValidCard] = useState(false)
    const [validDate, setValidDate] = useState(false)
    const [validCvc, setValidCvc] = useState(false)


    const [isLoaded, setIsLoaded] = useState(false)

    const [subscriptionStatus, setSubscriptionStatus] = useState(null)
    const [schedule, setSchedule] = useState(null)
    const [subscriptionPlanObj, setSubscriptionPlanObj] = useState({})

    const [confirmBanner, setConfirmBanner] = useState(false)
    const [confirmFreeBanner, setConfirmFreeBanner] = useState(false)
    const [applyDiscount, setApplyDiscount] = useState(false)
    const [discountSubscriber, setDiscountSubscriber] = useState(false)
    const [subscriptionActive, setSubscriptionActive] = useState(false)

    const test_mode = true

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

    const discount_mensal_d = '2.99'
    const discount_mensal_d_euro = '2'
    const discount_mensal_d_centimo = '99'
    const discount_mensal = '299'
    const discount_mensal_2 = '50'
    const discount_mensal_monthly = '0.10'

    const discount_semestral_d = '10.99'
    const discount_semestral_d_euro = '10'
    const discount_semestral_d_centimo = '99'
    const discount_semestral = '1099'
    const discount_semestral_monthly = '0.06'

    const discount_anual_d = '14.99'
    const discount_anual_d_euro = '14'
    const discount_anual_d_centimo = '99'
    const discount_anual = '1499'
    const discount_anual_monthly = '0.04'

    const mensal_d = '14.95'
    const mensal_d_euro = '14'
    const mensal_d_centimo = '95'
    const mensal = '1495'
    const mensal_monthly = '0.49'

    const semestral_d = '54.95'
    const semestral_d_euro = '54'
    const semestral_d_centimo = '95'
    const semestral = '5495'
    const semestral_monthly = '0.30'

    const anual_d = '74.95'
    const anual_d_euro = '74'
    const anual_d_centimo = '95'
    const anual = '7495'
    const anual_monthly = '0.20'

    const saver = (days) => {
        return <span className={styles.saver_color}>Sem vínculo, a compra de um pacote de dias é feita num único pagamento, sem qualquer tipo de pagamento recorrente ou subscrição adicional. <br/>A compra deste pacote de dias acrescenta <strong>{days} dias</strong> ao número de dias atual que tens na tua subscrição. <br/>
                {
                    worker_is_subscribed?
                    <span> O teu total de dias será <strong>{daysTillCharge} + {days} = ({daysTillCharge + days} dias)</strong>. </span>
                    :null
                }
            </span>
    }

    useEffect(() => {
        setLoading(true)
        if(user.subscription){
            setDisplay(0)
            setDaysTillCharge(moment(user.subscription.end_date).diff(moment(new Date().getTime()), 'days'))
            setEndDate(user.subscription.end_date)
            setLoading(false)
            setSubscriptionActive(true)
            setIsLoaded(true)
            setDiscountSubscriber(user.discount_subscriber)
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

        let customer_id = user.stripe_id

        if(customer_id===null)
        {
            const obj = await axios.post(`${api_url}/create-customer`, {
                name: user.name,
                phone: user.phone,
                email: user.email.toLocaleLowerCase(),
            })
            customer_id = obj.data.customer.id
        }

        try
        {
            // let sub_obj = await axios.post(`${api_url}/create-subscription`, {
            //     stripe_id: obj.data.customer.id,
            //     amount: selectedPlan&&getFuturePay(selectedPlan),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            let payment_intent_obj = await axios.post(`${api_url}/create-payment-intent`, {
                    stripe_id: customer_id,
                    amount: selectedPlan&&getAmount(selectedPlan),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })


            
            const paymentConfirmation = await stripe.confirmCardPayment(
                    payment_intent_obj.data.clientSecret, {
                        payment_method: {
                            card: elements.getElement(CardNumberElement),
                            billing_details: {
                                name: cardName,
                                email: user.email
                            }
                        }
                    }
                )

            
            let purchase_date = new Date()
            let end_date = purchase_date

            if(user.subscription?.end_date && (new Date(user.subscription?.end_date) > new Date()))
                end_date = new Date(user.subscription?.end_date)
        
            end_date.setDate(end_date.getDate()+getDays(selectedPlan))

            let discount_aux = null

            if(user.subscription?.discount_subscriber)
                discount_aux = user.subscription?.discount_subscriber
            else if(discountSubscriber||applyDiscount)
                discount_aux = '80_off'
            
            if(paymentConfirmation.error !== null && paymentConfirmation.error !== undefined)
            {
                if(paymentConfirmation.error.code === "payment_intent_authentication_failure")
                {
                    setTimeout(() => setCanceledHighlight(false), 4000)
                    setCanceledHighlight(true)
                }
                else if(paymentConfirmation.error.code === "card_declined")
                {
                    setFailPopin(true)
                    setTimeout(() => setFailPopin(false), 4000)
                    setFailHighlight(true)
                }
                else
                {
                    setGeneralFail(true)
                    setTimeout(() => setGeneralFail(false), 4000)
                }
                setLoading(false)
            }
            else
            {
                switch (paymentConfirmation.paymentIntent?.status) {
                    case "succeeded":
                        // await axios.post(`${api_url}/confirm-subscription`, {
                        //     pm_id: paymentConfirmation.paymentIntent.payment_method,
                        //     plan: selectedPlan,
                        //     _id: user._id,
                        //     name: cardName,
                        //     sub_id: sub_obj.data.subscriptionId,
                        //     price_id: selectedPlan&&getFuturePay(selectedPlan),
                        //     discount: discountSubscriber||applyDiscount
                        // })
                        await axios.post(`${api_url}/update-subscription-paid`, {
                            purchase_date: purchase_date,
                            end_date: end_date,
                            pm_id: paymentConfirmation.paymentIntent.payment_method,
                            plan: selectedPlan,
                            _id: user._id,
                            stripe_id: customer_id,
                            name: cardName,
                            price_id: selectedPlan&&getAmount(selectedPlan),
                            discount: discount_aux
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
            
        }
        catch (err) {
            console.log(err)
            setGeneralFail(true)
            setTimeout(() => setGeneralFail(false), 4000)
            setLoading(false)
        }
        
    }

    // const getPlanFromPriceId = priceId => {
    //     if(test_mode)
    //     {
    //         if(priceId === ("price_1LKQUyKC1aov6F9pTpM3gn0l"||"price_1P6rPWKC1aov6F9pIJWMdRNq")) return 2
    //         else if(priceId === ("price_1LKQVEKC1aov6F9p4RgyXAqj"||"price_1P6rOpKC1aov6F9pQ9twSRv7")) return 3
    //         else return 1
    //     }
    //     else
    //     {
    //         if(priceId === ("price_1PIoZ3KC1aov6F9pqIDTD2VU"||"price_1PIoZ3KC1aov6F9pOWGt2QVr")) return 2
    //         else if(priceId === ("price_1PIoYsKC1aov6F9pvUQj1ee4"||"price_1PIoYsKC1aov6F9prY0S3Bw3")) return 3
    //         else return 1
    //     }
    // }

    const getDays = plan => {
        if(plan === 1) return 30
        else if(plan === 2) return 180
        else return 360
    }

    // const getFuturePay = plan => {
    //     if(test_mode)
    //     {
    //         if(plan===1)
    //             {
    //                 return discountSubscriber||applyDiscount?"price_1P6rPxKC1aov6F9pVup1aLnE"
    //                                                         :
    //                                                         "price_1LKQUSKC1aov6F9p9gL1euLW"
    //             }
    //             else if(plan===2)
    //             {
    //                 return discountSubscriber||applyDiscount?"price_1P6rPWKC1aov6F9pIJWMdRNq":"price_1LKQUyKC1aov6F9pTpM3gn0l"
    //             }
    //             else{
    //                 return discountSubscriber||applyDiscount?"price_1P6rOpKC1aov6F9pQ9twSRv7":"price_1LKQVEKC1aov6F9p4RgyXAqj"
    //             }
    //     }
    //     else
    //     {
    //         if(plan===1)
    //             {
    //                 return discountSubscriber||applyDiscount?"price_1PIoZ8KC1aov6F9p615as8bo"
    //                                                         // "price_1PJI3fKC1aov6F9pbLQDFWlj"
    //                                                         :
    //                                                         "price_1PIoZ8KC1aov6F9p1538vD7u"
    //             }
    //             else if(plan===2)
    //             {
    //                 return discountSubscriber||applyDiscount?"price_1PIoZ3KC1aov6F9pOWGt2QVr":"price_1PIoZ3KC1aov6F9pqIDTD2VU"
    //             }
    //             else{
    //                 return discountSubscriber||applyDiscount?"price_1PIoYsKC1aov6F9prY0S3Bw3":"price_1PIoYsKC1aov6F9pvUQj1ee4"
    //             }
    //     }
    // }

    const getAmount = plan => {
        if(test_mode)
        {
            if(plan===1)
            {
                return 299
            }
            else if(plan===2)
            {
                return 999
            }
            else{
                return 1499
            }
        }
        else
        {
            if(plan===1)
            {
                return 299
            }
            else if(plan===2)
            {
                return 999
            }
            else{
                return 1499
            }
        }
    }

    

    const getAmountPay = subscription => {
        if(subscription.new_price_id !== null && subscription.new_price_id !== undefined)
        {
            if(new Date(subscription.new_price_date*1000) < new Date())
            {
                return subscription.new_price_id
            }
            else
            {
                return subscription.price_id
            }
        }
        else
        {
            return subscription.price_id
        }
    }

    // const updateCard = async () => {
    //     setLoading(true)
    //     let val = await axios.post(`${api_url}/create-setup-intent`, {
    //         stripe_id: user.stripe_id,
    //     })
        
    //     let final = await stripe.confirmCardSetup(val.data.clientSecret, {
    //         payment_method: {
    //             type: 'card',
    //             card: elements.getElement(CardNumberElement),
    //             billing_details: {
    //                 name: cardName,
    //             }
    //         }
    //     })

    //     switch (final.setupIntent.status) {
    //         case "succeeded":
    //             axios.post(`${api_url}/update-subscription-plan`, {
    //                 subscription: user.subscription,
    //                 current_amount: getAmountPay(user.subscription),
    //                 new_amount: selectedPlan&&getFuturePay(selectedPlan),
    //                 plan: user.subscription.plan,
    //                 new_plan: selectedPlan,
    //                 payment_method: final.setupIntent.payment_method,
    //                 _id: user._id,
    //                 from_canceled: schedule.phases[0].metadata.from_canceled
    //             }).then(() => {
    //                 props.refreshWorker()
    //                 setLoading(false)
    //                 setSuccessPopin(true)
    //                 setTimeout(() => setSuccessPopin(false), 4000)})
    //     }
    // }

    // const updatePlan = async () => {
    //     setLoading(true)
    //     if (!stripe || !elements) {
    //         return;
    //     }

    //     let val = await axios.post(`${api_url}/update-subscription-plan`, {
    //         subscription: user.subscription,
    //         current_amount: getAmountPay(user.subscription),
    //         new_amount: selectedPlan&&getFuturePay(selectedPlan),
    //         plan: user.subscription.plan,
    //         new_plan: selectedPlan,
    //         payment_method: user.subscription.payment_method_id,
    //         _id: user._id,
    //         from_canceled: schedule.phases[0].metadata.from_canceled,
    //     })

    //     switch (val.status) {
    //         case 200:
    //             props.refreshWorker()
    //             setDisplay(0)
    //             setSelectedMenu(0)
    //             setLoading(false)
    //             setSuccessPlanPopin(true)
    //             setTimeout(() => setSuccessPlanPopin(false), 4000)
    //             break;
  
    //     //     // case 'processing':
    //     //     //   setMessage("Payment processing. We'll update you when payment is received.");
    //     //     //   break;
  
    //         case 'requires_payment_method':
    //             setLoading(false)
    //             setFailPlanPopin(true)
    //             setTimeout(() => setFailPlanPopin(false), 4000)
    //             break;
  
    //         default:
    //             setLoading(false)
    //             break;
    //     }
    // }

    const cancelPlanChange = async () => {
        setConfirmBanner(false)
        setLoading(true)
        if (!stripe || !elements) {
            return;
        }

        let val = await axios.post(`${api_url}/cancel-subscription-plan-update`, {
            subscription: user.subscription,
            current_amount: getAmountPay(user.subscription),
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


    const cardValidHanlder = val => {
        if(failHighlight)setFailHighlight(false)
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

        let purchase_date = new Date()
        let end_date = purchase_date
        end_date.setDate(end_date.getDate()+90)

        await axios.post(`${api_url}/update-subscription-free`, {
            id: user._id,
            purchase_date: purchase_date,
            end_date: end_date
        })
        if(user_phone_verified&&user_email_verified&&user.regioes.length>0&&user.trabalhos.length>0)
        {
            axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
        }
        dispatch(worker_update_is_subscribed(true))
        dispatch(worker_update_subscription({
            end_date: end_date
        }))

        setDaysTillCharge(moment(end_date).diff(moment(new Date().getTime()), 'days'))
        setEndDate(end_date.getTime())
        setSubscriptionActive(true)
        setLoading(false)
        setDisplay(0)
        setSuccessPopin(true)
        setTimeout(() => setSuccessPopin(false), 4000)
    }

    const mapHistory = () => {
        return user.subscription_history?.map((el, i) => {
            return(
                <div>
                    
                </div>
            )
        })
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
                    <div className={styles.mid}>
                    
                    <CSSTransition 
                        in={successPopin||failPopin||successPlanPopin||failPlanPopin||canceledHighlight||generalFail}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <Sessao 
                            error={failPopin||failPlanPopin||generalFail||canceledHighlight}
                            text={successPopin?"Dias adicionados à Subscrição com sucesso!"
                                        :canceledHighlight?"Não conseguimos autenticar o teu método de pagamento, não foste cobrado."
                                        :failPopin?"Método de pagamento inválido. Por-favor tenta de novo com outro cartão, não foste cobrado."
                                        :generalFail?"Erro a processar a tua acção. Por-favor tenta de novo mais tarde ou com outro cartão, não foste cobrado."
                                        :
                                        ""}/>
                    </CSSTransition>

                        {
                            display===4||display===1?
                            <div className={styles.sub_info_main}>
                                {/* <span ref={scrolltopref}/> */}
                                {/* <div className={styles.sub_info_wrap}>
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
                                                    <span className={styles.line_text}>Criação do teu <strong>perfil de profissional</strong>, que será acessível a todos clientes do TAREFAS. Maior exposição ao teu negócio!</span>
                                                </div>
                                            </div>
                                            :null
                                        }
                                        
                                    </div>
                                </div> */}
                                {
                                    !worker_is_subscribed?
                                    <div className={styles.verificar_top_wrapper}>
                                        <div className={styles.verificar_top}>
                                            <span className={styles.input_div_button_text_no_animation} style={{textTransform:'uppercase', backgroundColor:"transparent"}}>Ativar Subscrição</span>
                                        </div>
                                    </div>
                                    :null
                                }
                                

                                {
                                    display===4?
                                    <div className={styles.sub_info_bottom_wrapper}>
                                        
                                        <div className={styles.sub_info_bottom}>
      
                                            {
                                                !user.subscription?
                                                <div>
                                                    <div style={{display:"flex", justifyContent:'center'}}>
                                                        <p className={styles.sub_info_title} style={{marginTop:'0px'}}>Pacotes de Subscrição</p>
                                                    </div>
                                                    
                                                    <div className={styles.info_bottom_text_wrapper}>
                                                        <div className={styles.info_bottom_text}>
                                                            <p className={styles.info_bottom_text_title} style={{marginTop:"30px"}}>Pacotes Fundador -80%</p>
                                                            <p style={{textAlign:'left'}}>Ativa a tua subscrição com um <strong style={{color:"#FF785A"}}>desconto de 80% </strong> sobre qualquer pacote de dias. Este desconto exclusivo será aplicado em futuras compras de pacotes, <strong>para sempre</strong>.</p>
                                                            <p style={{fontWeight:300, marginTop:'3px'}}>Aproveita o desconto exclusivo de fundador.</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.options}>
                                                        <div className={styles.options_card}>
                                                            <span className={styles.discount}>-80%</span>
                                                            <img className={styles.options_card_img} src={basic}/>
                                                            <p className={styles.options_card_title}>+30 dias</p>
                                                            <p className={styles.options_card_title_helper}>Adiciona 30 dias à tua subscrição.</p>
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
                                                            <p className={styles.options_card_title}>+180 dias</p>
                                                            <p className={styles.options_card_title_helper}>Adiciona 180 dias à tua subscrição.</p>
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
                                                            <p className={styles.options_card_title}>+360 dias</p>
                                                            <p className={styles.options_card_title_helper}>Adiciona 360 dias à tua subscrição.</p>
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
                                                        <span className={styles.trial_button_text}>VER PACOTES EXCLUSIVOS FUNDADOR</span>
                                                    </div>
                                                    <p className={styles.info_bottom_or}>OU</p>
                                                    <p className={styles.info_bottom_text_title}>Pacote Experimental</p>
                                                    <div className={styles.discount_2}>
                                                        <p className={styles.discount_text_2}>+90 dias subscrição grátis</p>
                                                    </div>
                                                    <div className={styles.info_bottom_text_wrapper}>
                                                        
                                                        <div className={styles.info_bottom_text}>
                                                            <p style={{textAlign:'left'}}>Ativa a tua subscrição experimental durante <strong>90 dias de forma gratuita</strong>.</p>
                                                            <p style={{fontWeight:300, marginTop:'3px'}}>Depois continua a usar a tua conta com pacotes regulares.</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className={styles.trial_button} onClick={() => setConfirmFreeBanner(true)}>
                                                        {/* <span className={styles.trial_button_banner}>GRATUITO</span> */}
                                                        <span className={styles.trial_button_text}>ATIVAR PACOTE +90 DIAS GRÁTIS</span>
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
                                    display===0&&schedule || display===0&&subscriptionActive?
                                    <div className={styles.display_zero}>
                                        <span className={styles.subtitle}>Subscrição</span>
                                        <div className={styles.divider}/>
                                        <div>
                                            <div className={styles.subtitle_sub}>
                                                {
                                                    <span className={styles.ya} style={{color:daysTillCharge?"#0358e5":"#fdd835"}}>ATIVA</span>
                                                }
                                                
                                                <span>
                                                    {
                                                        !subscriptionActive&&schedule.phases.length===2&&schedule.phases[0].metadata.from_canceled?
                                                        <span className={styles.helper_two}>(Início a {getDateToString(schedule.current_phase?.end_date)} - fim da subscrição previamente cancelada)</span>
                                                        :null
                                                    }
                                                </span>
                                            </div>
                                            
                                            <div className={styles.selected_plan_info}>
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_subscribed}`} 
                                                        style={{borderColor:daysTillCharge?discountSubscriber?"#FF785A":"#0358e5":"#fdd835",
                                                                backgroundColor:daysTillCharge?"#0358e590":"#fdd83590"}}>
                                                        {/* {
                                                            subscriptionActive?
                                                            <div className={styles.sub_val_wrap_image} style={{backgroundColor:daysTillCharge?discountSubscriber?"#FF785A":"#0358e5":"#fdd835"}}>
                                                                <img src={hand} className={styles.section_img_small}/>
                                                            </div>
                                                            :
                                                            null

                                                        } */}
                                                        
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
                                                            <div className={styles.days_top}>
                                                                <span className={styles.days_top_value}>{daysTillCharge}</span>
                                                                <span className={styles.days_top_title}>DIAS</span>
                                                            </div>
                                                            <div className={styles.info_div_pay}>
                                                                <span className={styles.info_text_helper_date} style={{width:'fit-content'}}>Data de fim da subscrição</span>
                                                                <span className={styles.info_text_days} style={{color:daysTillCharge?"#0358e5":"#fdd835", textTransform:'uppercase'}}>
                                                                    {user.subscription?.end_date?extenseDate(new Date(user.subscription?.end_date).getTime()/1000):extenseDate(new Date(endDate).getTime()/1000)}</span>                                                                        
                                                            </div>

                                                            <p className={styles.selected_plan_value_information}>Podes adicionar dias à tua subscrição a qualquer altura.</p>
                                                            
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                        {/* {
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

                                        } */}
                                        
                                        <div className={styles.card_right} style={{paddingBottom:0}}>
                                            <div className={styles.card_right_button} onClick={() => {
                                                setDisplay(1)}}>
                                                <span style={{fontWeight:600}}>Adicionar dias</span>
                                            </div>
                                        </div>
                                        <div className={styles.history}>
                                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", cursor:'pointer'}} onClick={() => setShowHistory(!showHistory)}>
                                                <span className={styles.history_title}>Histórico de transações</span>
                                                <ArrowForwardIosIcon className={!showHistory?styles.top_complete_arrow:styles.top_complete_arrow_show}/>
                                            </div>
                                            <div className={styles.history_map}>
                                                {mapHistory()}
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    :display===1?
                                    <div className={styles.display_one}>
                                        {
                                            !worker_is_subscribed?
                                            <span className={styles.subtitle_sub} style={{marginTop:"20px"}}>
                                                <span style={{color:"#71848d"}}>Comprar pacote de dias <span className={styles.fontFam} style={{color:'#71848d'}}>{selectedMenu+1}/2</span></span>
                                            </span>
                                            :
                                            <span className={styles.subtitle_sub} style={{marginTop:"20px"}}>
                                                <span style={{color:"#71848d"}}>Adicionar dias <span className={styles.fontFam} style={{color:'#71848d'}}>{selectedMenu+1}/2</span></span>
                                            </span>
                                        }
                                        
                                        <div className={styles.indicator_div}>
                                                <div className={styles.indicator_subdiv} onClick={() => setSelectedMenu(0)}>
                                                    <p className={styles.indicator_text} style={{color:selectedMenu===0||(selectedPlan&&selectedMenu===null)?"#ffffff":"#0358e5"}}>1 - PACOTE</p>
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
                                                <p className={styles.plans_title}>1 - Escolher o pacote de dias</p>
                                                <div className={styles.plans_sections}>
                                                    <div className={selectedPlan===1?styles.section_selected:styles.section} onClick={() => setSelectedPlan(1)}>
                                                        {
                                                            applyDiscount?
                                                            <span className={styles.discount}>-80%</span>
                                                            :null
                                                        }
                                                        <img src={basic} className={styles.section_img}/>                                         
                                                        <span className={styles.section_type}>+30 dias</span>
                                                        <span className={styles.section_type_desc}>Adiciona 30 dias à tua subscrição</span>
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
                                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                                    <span className={styles.section_valor_top_number}>{mensal_d_euro}</span>
                                                                    <span className={styles.section_valor_top_number_decimal}>.{mensal_d_centimo}</span>
                                                                </div>
                                                            }
                                                            {
                                                                applyDiscount?
                                                                <div style={{display:'flex', alignItems:'center'}}>
                                                                    <span className={styles.section_desc_of_pay_discount}>{mensal_monthly}€/dia</span>
                                                                    <ArrowRightIcon className={styles.discount_arrow_small}/>
                                                                    <span className={styles.section_desc_of_pay_discount_new}>{discount_mensal_monthly}€/dia</span>
                                                                </div>
                                                                :
                                                                <span className={styles.section_desc_of_pay}>{mensal_monthly}€/dia</span>
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
                                                        <span className={styles.section_type}>+180 dias</span>
                                                        <span className={styles.section_type_desc}>Adiciona 180 dias à tua subscrição</span>
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
                                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                                    <span className={styles.section_valor_top_number}>{semestral_d_euro}</span>
                                                                    <span className={styles.section_valor_top_number_decimal}>.{semestral_d_centimo}</span>
                                                                </div>
                                                            }
                                                            {
                                                                applyDiscount?
                                                                <div style={{display:'flex', alignItems:'center'}}>
                                                                    <span className={styles.section_desc_of_pay_discount}>{semestral_monthly}€/dia</span>
                                                                    <ArrowRightIcon className={styles.discount_arrow_small}/>
                                                                    <span className={styles.section_desc_of_pay_discount_new}>{discount_semestral_monthly}€/dia</span>
                                                                </div>
                                                                :
                                                                <span className={styles.section_desc_of_pay}>{semestral_monthly}€/dia</span>
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
                                                        <span className={styles.section_type}>+360 dias</span>
                                                        <span className={styles.section_type_desc}>Adiciona 360 dias à tua subscrição</span>
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
                                                                    <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                                                                    <span className={styles.section_valor_top_number}>{anual_d_euro}</span>
                                                                    <span className={styles.section_valor_top_number_decimal}>.{anual_d_centimo}</span>
                                                                </div>
                                                            }
                                                            {
                                                                applyDiscount?
                                                                <div style={{display:'flex', alignItems:'center'}}>
                                                                    <span className={styles.section_desc_of_pay_discount}>{anual_monthly}€/dia</span>
                                                                    <ArrowRightIcon className={styles.discount_arrow_small}/>
                                                                    <span className={styles.section_desc_of_pay_discount_new}>{discount_anual_monthly}€/dia</span>
                                                                </div>
                                                                :
                                                                <span className={styles.section_desc_of_pay}>{anual_monthly}€/dia</span>
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
                                                    PACOTE
                                                </span>
                                                {
                                                    selectedPlan===1?
                                                    <div className={styles.sub_val_wrap}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={basic} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Pacote +30 dias</p>
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
                                                                <span className={styles.selected_plan_value}>Pagamento único de </span>
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
                                                            </div>
                                                            
                                                            <p className={styles.selected_plan_value_information}>{saver(30)}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===2?
                                                    <div className={styles.sub_val_wrap}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={medium} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Pacote +180 dias</p>
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
                                                                <span className={styles.selected_plan_value}>Pagamento único de </span>
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
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver(180)}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===3?
                                                    <div className={styles.sub_val_wrap}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={pro} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Pacote +360 dias</p>
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
                                                                <span className={styles.selected_plan_value}>Pagamento único de </span>
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
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver(360)}</p>
                                                        </div>
                                                    </div>
                                                    :<span className={styles.selected_plan_no_value}>Escolha um pacote</span>
                                                }
                                                
                                            </div>
                                            <div className={styles.buttons}>
                                                <span className={selectedPlan?styles.button_add:styles.button_add_disabled} 
                                                    style={{width:'100%'}}
                                                onClick={() => {
                                                    selectedPlan&&setSelectedMenu(1)
                                                    // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                                    }}>Continuar</span>
                                                    <span className={styles.button_cancel} onClick={() => {
                                                        if(subscriptionActive) setDisplay(0)
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
                                                <div>
                                                    <div className={styles.card} style={{border:failHighlight?'6px solid #ff3b30':""}}>
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
                                                    {
                                                        failHighlight?
                                                        <span className={styles.card_wrong}>Método de pagamento inválido.</span>
                                                        :null
                                                    }
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
                                                                style={{borderColor:validCard?"#0358e5":!validCard||failHighlight?"#ff3b30":""}}
                                                                options={{style:{base:{color:"#fff"}}}}/>
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
                                                <span className={styles.selected_plan_title}>Pacote</span>
                                                {
                                                    selectedPlan===1?
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={basic} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Pacote +30 dias</p>
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
                                                                    <span className={styles.equivalente} style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}> (equivalente a €{applyDiscount?<span style={{color:"#FF785A", fontWeight:500}}>{discount_mensal_d}</span>:mensal_monthly}/dia)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>dias:</span>
                                                                    <span className={styles.info_text}>+30</span>
                                                                </div>
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver(30)}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===2?
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={medium} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Pacote +180 dias</p>
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
                                                                    <span className={styles.equivalente} style={{marginLeft:"5px", fontSize:"0.7rem", color:"white", fontWeight:400}}> (equivalente a €{applyDiscount?<span style={{color:"#FF785A", fontWeight:500}}>{discount_semestral_monthly}</span>:semestral_monthly}/dia)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>dias:</span>
                                                                    <span className={styles.info_text}>+180</span>
                                                                </div>
                                                            </div>
                                                            <p className={styles.selected_plan_value_information}>{saver(180)}</p>
                                                        </div>
                                                    </div>
                                                    :selectedPlan===3?
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_wrap_hover}`} onClick={() => setSelectedMenu(0)}>
                                                        <div className={styles.sub_val_wrap_image}>
                                                            <img src={pro} className={styles.section_img_small}/>
                                                        </div>
                                                        <p className={styles.sub_val_date}>Pacote +360 dias</p>
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
                                                                    <span className={styles.equivalente} style={{marginLeft:"5px", fontSize:"0.7rem", color:"white"}}> (equivalente a €{applyDiscount?<span style={{color:"#FF785A", fontWeight:500}}>{discount_anual_monthly}</span>:anual_monthly}/dia)</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.info_div}>
                                                                <div className={styles.info_subdiv}>
                                                                    <span className={styles.info_text_helper}>dias:</span>
                                                                    <span className={styles.info_text}>+360</span>
                                                                </div>
                                                            </div>
                                                            {
                                                                endDate>currentDate?
                                                                <span className={styles.selected_plan_value_information}>Esta nova subscrição apenas será cobrada no fim da tua subscrição atual (<span style={{color:"#FF785A", fontWeight:"400"}}>{getDateToString(endDate/1000)}</span>)</span>
                                                                :
                                                                <p className={styles.selected_plan_value_information}>{saver(360)}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    :<span className={styles.selected_plan_no_value}>Escolha um pacote de dias</span>
                                                }
                                                
                                            </div>
                                            <div className={styles.buttons} style={{marginTop:"150px"}}>
                                                <span></span>
                                                <span className={cardName.length>2&&validCard&&!failHighlight&&validDate&&validCvc?styles.button_add:styles.button_add_disabled} onClick={() => cardName.length>2&&validCard&&validDate&&!failHighlight&&validCvc&&handlePayment()}>ADICIONAR CARTÃO E FINALIZAR</span>
                                                <span className={styles.button_cancel} onClick={() => {
                                                    setSelectedMenu(0)
                                                    // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                                                    }}>VOLTAR</span>
                                            </div>
                                        </div>
                                    </div>
                                    // alterar plano area
                                    // :display===2?
                                    // <div style={{marginTop:"20px"}}>
                                    //     <span className={styles.subtitle_sub}>
                                    //         <span style={{fontWeight:"500"}}>ALTERAR PLANO</span>
                                    //     </span>
                                    //     <div className={styles.plans} style={{marginTop:'-40px'}}>
                                    //         <div className={styles.plans_area}>
                                    //             <p className={styles.plans_title}>ALTERAR o plano</p>
                                    //             <SubscriptionPlans 
                                    //                 selectedPlan={selectedPlan}
                                    //                 subscriptionPlanObj={subscriptionPlanObj}
                                    //                 discountSubscriber={discountSubscriber}
                                    //                 user={user}
                                    //                 schedule={schedule}

                                    //                 discount_mensal_d_euro={discount_mensal_d_euro}
                                    //                 discount_mensal_d_centimo={discount_mensal_d_centimo}
                                    //                 discount_mensal_d={discount_mensal_monthly}
                                    //                 mensal_d={mensal_monthly}
                                    //                 mensal_d_euro={mensal_d_euro}
                                    //                 mensal_d_centimo={mensal_d_centimo}
                        
                                    //                 discount_semestral_d_euro={discount_semestral_d_euro}
                                    //                 discount_semestral_d_centimo={discount_semestral_d_centimo}
                                    //                 discount_semestral_monthly={discount_semestral_monthly}
                                    //                 semestral_monthly={semestral_monthly}
                                    //                 semestral_d_euro={semestral_d_euro}
                                    //                 semestral_d_centimo={semestral_d_centimo}
                        
                                    //                 discount_anual_d_euro={discount_anual_d_euro}
                                    //                 discount_anual_d_centimo={discount_anual_d_centimo}
                                    //                 discount_anual_monthly={discount_anual_monthly}
                                    //                 anual_monthly={anual_monthly}
                                    //                 anual_d_euro={anual_d_euro}
                                    //                 anual_d_centimo={anual_d_centimo}

                                    //                 setSelectedPlan={setSelectedPlan}
                                                    
                                    //                 />
                                    //         </div>
                                    //         <div className={styles.selected_plan} style={{marginTop:"20px"}}>
                                    //             <span className={styles.selected_plan_title}>
                                    //                 ALTERAÇÃO
                                    //             </span>
                                    //             <SubscriptionAlterar
                                    //                 subscriptionActive={subscriptionActive}
                                    //                 discountSubscriber={discountSubscriber}
                                    //                 subscriptionPlanObj={subscriptionPlanObj}
                                    //                 selectedPlan={selectedPlan}/>
                                                
                                    //         </div>
                                    //         <div className={styles.alterar_plano_wrap}>
                                    //             <span className={styles.alterar_plano}>A alteração do plano ficará suspensa, sendo que o novo plano <span style={{fontWeight:"600"}}>apenas terá início na data da próxima cobrança do plano atual</span>, sendo cobrado o valor do novo plano selecionado. </span>
                                    //             <span className={styles.alterar_plano}>A alteração do plano poderá ser cancelada até à data da proxíma cobrança. </span>
                                    //             <p className={styles.alterar_plano} style={{marginTop:'20px'}}>Data da próxima cobrança do plano atual: 
                                    //                 <div style={{display:'flex', alignItems:'center', marginTop:'5px'}}><p className={styles.alterar_plano_date}>{extenseDate(endDate/1000)}</p> <span className={styles.info_text_days_charge} style={{color:"#0358e5", fontWeight:700, marginLeft:'5px'}}>({daysTillCharge} dias)</span></div>
                                    //             </p>
                                    //         </div>
                                    //         <div className={styles.buttons}>
                                    //             <span className={
                                    //                 selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan?
                                    //                 styles.button_add
                                    //                 :
                                    //                 selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan?
                                    //                 styles.button_add
                                    //                 :
                                    //                 styles.button_add_disabled} 
                                                    
                                    //                 onClick={() => {
                                    //                     selectedPlan&&subscriptionPlanObj.selected_plan!==selectedPlan&&updatePlan()
                                    //                 }}>Alterar</span>
                                    //             <span className={styles.button_cancel} onClick={() => {
                                    //                 setDisplay(0)
                                    //                 setSelectedMenu(0)
                                    //                 setSelectedPlan(subscriptionPlanObj.selected_plan)
                                    //                 }}>FECHAR</span>
                                    //         </div>
                                            
                                            
                                    //     </div>
                                    // </div>
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