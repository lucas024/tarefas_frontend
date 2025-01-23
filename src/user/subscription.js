import React, {useState, useEffect, useRef} from 'react'
import styles from './subscription.module.css'
import Check from '@mui/icons-material/Check';
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium_3.png'
import hand from '../assets/free-trial.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import axios from 'axios'
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';
import moment from 'moment';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import Loader from '../general/loader';
import ConfirmBanner from '../general/confirmBanner';
import { useSelector } from 'react-redux'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { 
    worker_update_is_subscribed,
    worker_update_subscription
  } from '../store';
import { useDispatch } from 'react-redux'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PaymentElementsComponent from './paymentElementsComponent';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import multibanco from '../assets/multibanco.png'



//AQUI

//LOCALHOST
// const stripePromise = loadStripe('pk_test_51GttAAKC1aov6F9poPimGBQDSxjDKl0oIEmJ2qEPqWFtRDvikJEt0OojYfKZiiT0YDcfdCvDQ5O3mHs9nyBgUwZU00qt1OdcAd');
// const test_mode = true

//LIVE
const stripePromise = loadStripe('pk_live_ypMbNWLAJDZYOWG4JqncBktA00qBx03bOR')
const test_mode = false

//

const Subscription = props => {
    const api_url = useSelector(state => {return state.api_url})
    const user = useSelector(state => {return state.user})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})

    const scrolltopref = useRef(null)

    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [display, setDisplay] = useState(4)
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successPopin, setSuccessPopin] = useState(false)
    const [multibancoPopin, setMultibancoPopin] = useState(false)
    const [failPopin, setFailPopin] = useState(false)
    const [generalFail, setGeneralFail] = useState(false)
    const [canceledHighlight, setCanceledHighlight] = useState(false)
    const [endDate, setEndDate] = useState(null)
    const [daysTillCharge, setDaysTillCharge] = useState(null)
    const [showHistory, setShowHistory] = useState(false)

    const [paymentIntentObj, setPaymentIntentObj] = useState(false)
    const [customerId, setCustomerId] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false)

    const [confirmBanner, setConfirmBanner] = useState(false)
    const [confirmFreeBanner, setConfirmFreeBanner] = useState(false)
    const [seeMultibancoDetails, setSeeMultibancoDetails] = useState(false)
    const [applyDiscount, setApplyDiscount] = useState(false)
    const [discountSubscriber, setDiscountSubscriber] = useState(false)
    const [subscriptionActive, setSubscriptionActive] = useState(false)

    

    const display_one_ref = useRef(null)

    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    //display 4 - welcome tab
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

    const appearance = {
        theme: 'flat',
        variables: {
            colorPrimary: '#0358e5',
        },
        rules: {
            '.Label': {
              color: '#ffffff'
            },
        }
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

    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        if(paramsAux.redirect_status==='succeeded')
        {
            setLoading(true)
            axios.get(`${api_url}/retrieve-payment-intent`, {params: {payment_intent: paramsAux.payment_intent}})
            .then(res => {
                if((res.data.paymentIntent.metadata.user_id === user?._id) &&
                    !(user?.subscription_secrets_used?.includes(res.data.paymentIntent.client_secret)
                ))
                {                
                    if(res.data.paymentIntent.status==="succeeded")
                    {
                        axios.post(`${api_url}/update-subscription-paid`, {
                            payment_intent: res.data.paymentIntent,
                            payment_intent_metadata: res.data.paymentIntent.metadata
                        })
                        .then(() => {
                            props.refreshWorker()
                            setSelectedMenu(0)
                            dispatch(worker_update_is_subscribed(true))
                            if(user_phone_verified&&user_email_verified&&user.regioes?.length>0&&user.trabalhos?.length>0)
                            {
                                axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
                            }
                            navigate({
                                pathname: `/user`,
                                search: `?st=subscription&t=profissional`
                            }, {replace: true})
                            setLoading(false)
                            setSuccessPopin(true)
                            setTimeout(() => setSuccessPopin(false), 10000)
                            
                        })
                    }

                }
                else
                {
                    navigate({
                        pathname: `/user`,
                        search: `?st=subscription&t=profissional`
                    }, {replace: true})
                    setLoading(false)
                }
            }) 
        }
        else if(paramsAux.redirect_status)
        {
            navigate({
                pathname: `/user`,
                search: `?st=subscription&t=profissional`
            }, {replace: true})
            
            setLoading(false)
            setGeneralFail(true)
            setTimeout(() => setGeneralFail(false), 15000)
        }

    }, [searchParams])



    const saver = (days) => {
        return <span className={styles.saver_color}>Sem vínculo, a compra de um pacote de dias é feita num único pagamento, sem qualquer tipo de pagamento recorrente ou subscrição adicional. <br/>
            {
                user.subscription?
                <span>A compra deste pacote de dias acrescenta <strong>{days} dias</strong> ao número de dias atual que tens na tua subscrição. </span>
                :
                <div>
                    <p>A compra deste pacote de dias dá-te <strong>{days} dias</strong> de subscrição. </p>
                    {
                        applyDiscount?
                        <p>Serás agora um <span style={{color:"#FF785A", fontWeight:'600'}}>profissional fundador</span>, ficando com <span style={{color:"#FF785A", fontWeight:'600'}}>80% de desconto na futura compra de dias, para sempre</span>.</p>
                        :null
                    }
                    
                </div>

            }
                {
                    worker_is_subscribed?
                    <span> O teu total de dias será <strong>{daysTillCharge} + {days} = ({daysTillCharge + days} dias)</strong>. </span>
                    :null
                }
            </span>
    }

    const createPaymentIntent = async () => {
        setLoading(true)
        
        let customer_id = user.customer_id
        if(customer_id===null)
        {
            const obj = await axios.post(`${api_url}/create-customer`, {
                name: user.name,
                phone: user.phone,
                email: user.email.toLocaleLowerCase(),
            })
            customer_id = obj.data.customer.id
        }

        setCustomerId(customer_id)

        let discount_aux = null

        if(user.subscription?.discount_subscriber)
            discount_aux = user.subscription?.discount_subscriber
        else
            discount_aux = applyDiscount

        let purchase_date = new Date()

        try
        {
            let payment_intent_obj = await axios.post(`${api_url}/create-payment-intent`, {
                amount: getAmount(selectedPlan, discount_aux),
                purchase_date: purchase_date,
                end_date: user?.subscription?.end_date,
                customer_id: customer_id,
                discount: discount_aux||null,
                plan: parseInt(selectedPlan),
                user_id: user._id,
                user_name: user.name,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setPaymentIntentObj(payment_intent_obj.data.clientSecret)
            setSelectedMenu(1)
            setLoading(false)
        }
        catch (err) {
            setGeneralFail(true)
            setPaymentIntentObj(false)
            setTimeout(() => setGeneralFail(false), 15000)
            setLoading(false)
        }

    }

    const getDays = plan => {
        if(plan === 0) return 90
        else if(plan === 1) return 30
        else if(plan === 2) return 180
        else return 360
    }
    
    const getPrice = price => {
        if(price)
        {
            let toString = price.toString()
            if(toString.length===3) return `${toString.slice(0,1)}.${toString.slice(1)}`
            else if(toString.length===4) return `${toString.slice(0,2)}.${toString.slice(2)}`
            else return `${toString.slice(0,3)}.${toString.slice(3)}`
        }
        else
        {
            return '0.00'
        }

    }

    const getAmount = (plan, discount) => {
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
                if(discount=== "80_off")
                    return 299
                else
                    return 1495
            }
            else if(plan===2)
            {
                if(discount=== "80_off")
                    return 999
                else
                    return 5495
            }
            else{
                if(discount=== "80_off")
                    return 1499
                else
                    return 7495
            }
        }
    }

    const extenseDate = date => {
        let iso_date = new Date(date*1000)
        let day = iso_date.toISOString().split("T")[0].slice(-2)
        let month = monthNames[parseInt(iso_date.toISOString().split("T")[0].slice(5,7))]
        let year = iso_date?.toISOString().split("T")[0].slice(0,4)
        return `${day} de ${month}, ${year}`
    }

    const setFreePlanHandler = async () => {
        setApplyDiscount(false)
        setConfirmFreeBanner(false)
        setLoading(true)

        let purchase_date = new Date()
        let end_date = new Date()
        end_date.setDate(end_date.getDate()+90)

        await axios.post(`${api_url}/update-subscription-free`, {
            id: user._id,
            purchase_date: purchase_date,
            end_date: end_date,
            discount: null
        })
        if(user_phone_verified&&user_email_verified&&user.regioes.length>0&&user.trabalhos.length>0)
        {
            axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
        }
        dispatch(worker_update_is_subscribed(true))
        // dispatch(worker_update_subscription({
        //     end_date: end_date
        // }))
        props.refreshWorker()

        setDaysTillCharge(moment(end_date).diff(moment(new Date().getTime()), 'days'))
        setEndDate(end_date.getTime())
        setSubscriptionActive(true)
        setLoading(false)
        setDisplay(0)
        setSuccessPopin(true)
        setTimeout(() => setSuccessPopin(false), 10000)
    }
    
    const getTime = (val) => {
        let time = new Date(val)
        return time.toISOString().split("T")[0]
    }

    const getTimeAux = (val) => {
        let time = new Date(val)
        return time.toISOString().split("T")[1].slice(0,-8)
    }

    const getDateAux = date => {
        return <span>{`${date.getDate()} de ${monthNames[date.getMonth()]}, ${date.getFullYear()}`}</span>
    }

    const mapHistory = () => {
        let reverse = [...user.subscription_history]?.reverse()
        return reverse?.map((el, i) => {
            if(el.next_action!=null&&!user?.subscription_secrets_used.includes(el.client_secret)||el.next_action==null)
            return(
                <div key={i} className={styles.history_element}>
                    <div className={styles.history_image} style={{backgroundColor:el.next_action!=null?new Date(el.next_action.multibanco_display_details.expires_at*1000) < new Date()?'#ff3b30':"#fdd835":'', borderColor:el.next_action!=null?"#fdd835":''}}>
                        <img className={styles.history_image_value} src={el.pacote===1?basic:el.pacote===2?medium:el.pacote===3?pro:hand}/>
                    </div>
                    <div className={styles.history_right}>
                        <div className={styles.history_right_west}>
                            <span className={styles.history_west_title} style={{color:el.next_action!=null?"#fdd835":''}}>+{getDays(el.pacote)} Dias</span>
                            <span className={styles.history_west_value}>€{getPrice(el.amount)}</span>
                        </div>
                        {
                            el.next_action!=null?
                            displayMultibanco(el)
                            :
                            null
                        }
                        <div className={styles.history_right_east}>
                            <span className={styles.history_east_date}>{getDateAux(new Date(el.purchase_date))}</span>
                            <span className={styles.history_east_date}>{getTimeAux(el.purchase_date)}</span>
                        </div>
                    </div>
                </div>
            )
        })
    }

    const displayMultibanco = (sub, full) => {
        if(!user?.subscription_secrets_used.includes(sub.client_secret))
            return (
                <div className={styles.history_temporary} onClick={() => setSeeMultibancoDetails(sub)} style={{backgroundColor:new Date(sub.next_action.multibanco_display_details.expires_at*1000) < new Date()?'#ff3b30':''}}>
                    <div className={styles.temporary_image}>
                        <img src={multibanco} className={styles.temporary_image_val}/>
                    </div>

                    <div className={full?styles.temporary_east_full:styles.temporary_east}>
                        <span className={styles.temporary_east_title}>
                            {
                                new Date(sub.next_action.multibanco_display_details.expires_at*1000) < new Date()?
                                'Pagamento Expirado'
                                :
                                'Pagamento Pendente'
                            }
                        </span>
                        <p className={styles.temporary_east_date}>Expira a {getTime(sub.next_action.multibanco_display_details.expires_at*1000)}</p>
                    </div>
                </div>
            )
    }

    

    return (
        <div className={styles.subscription}>
            <Loader loading={loading}/>
            <div className={confirmFreeBanner||confirmBanner||seeMultibancoDetails||loading?styles.backdrop:null} onClick={() => {
                setConfirmFreeBanner(false)
                setConfirmBanner(false)
                setSeeMultibancoDetails(false)
            }}/>
            <CSSTransition
                in={confirmFreeBanner}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <ConfirmBanner type={'three_months'} cancel={() => setConfirmFreeBanner(false)} confirm={() => setFreePlanHandler()} color={'#ffffff'}/>
            </CSSTransition>
            <CSSTransition
                in={seeMultibancoDetails}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <ConfirmBanner type={'multibanco'} days={getDays(seeMultibancoDetails?.pacote)} expires={seeMultibancoDetails?.next_action&&`${getTime(seeMultibancoDetails?.next_action?.multibanco_display_details.expires_at*1000)}, ${getTimeAux(new Date(seeMultibancoDetails?.next_action?.multibanco_display_details.expires_at*1000))}`} price={`€${getPrice(seeMultibancoDetails?.amount)}`} data={seeMultibancoDetails} cancel={() => setSeeMultibancoDetails(false)} confirm={() => setSeeMultibancoDetails(false)} color={'#ffffff'}/>
            </CSSTransition>
            {
                isLoaded?
                <div style={{position:"relative", height:'100%'}}>         
                    <div className={styles.mid}>
                    
                    <CSSTransition 
                        in={successPopin||failPopin||canceledHighlight||generalFail}
                        timeout={1000}
                        classNames="transition"
                        unmountOnExit
                        >
                        <Sessao 
                            removePopin={() => {
                                setSuccessPopin(false)
                                setCanceledHighlight(false)
                                setGeneralFail(false)
                                setFailPopin(false)
                                setMultibancoPopin(false)
                            }}
                            user_page={true}
                            error={failPopin||generalFail||canceledHighlight}
                            text={successPopin?"Dias adicionados à subscrição com sucesso!"
                                        :canceledHighlight?"Não conseguimos autenticar o teu método de pagamento, não foste cobrado."
                                        :failPopin?"Método de pagamento inválido. Por-favor tenta de novo mais tarde ou tenta com outro método de pagamento, não foste cobrado."
                                        :generalFail?"Erro a processar a tua acção. Por-favor tenta de novo mais tarde, não foste cobrado."
                                        :multibancoPopin?"Pagamento multibanco iniciado com sucesso."
                                        :
                                        ""}/>
                    </CSSTransition>
                        {
                            display===4||display===1?
                            <div className={styles.sub_info_main}>
                                {/* <span ref={scrolltopref}/> */}
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
                                        <div>
                                            <div style={{borderBottom:'4px solid white', paddingBottom:'30px'}}>
                                                <div style={{display:'flex', justifyContent:'center'}}>
                                                    <span className={styles.ya} style={{color:"#fdd835"}}>DESATIVADA</span>
                                                </div>
                                                <div className={`${styles.sub_val_wrap} ${styles.sub_val_not_subscribed}`} style={{marginTop:'10px'}}>
                                                    <div className={styles.days_top} style={{marginBottom:'10px'}}>
                                                        <span className={styles.days_top_value}>0</span>
                                                        <span className={styles.days_top_title} style={{color:"#fff"}}>DIAS</span>
                                                    </div>
                                                    <div style={{display:'flex', justifyContent:'center', width:'80%'}}>
                                                        <p className={styles.selected_plan_value_information}>Adiciona dias à tua subscrição.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        
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
                                                            setApplyDiscount('80_off')
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
                                    </div>
                                    :null
                                }
                                
                            </div>
                            :null
                        }
                        {
                            display!==4?
                                <div className={styles.mid_content}>
                                <Carousel
                                    swipeable={false}
                                    showArrows={false} 
                                    showStatus={false} 
                                    showIndicators={false} 
                                    showThumbs={false}
                                    selectedItem={display}>
                                    <div className={styles.display_zero}>
                                        <div style={{display:'flex', justifyContent:'center'}}>
                                            {user?.subscription_history&&
                                                user?.subscription_history.at(-1).next_action&&
                                                    new Date(user?.subscription_history.at(-1).next_action.multibanco_display_details.expires_at*1000) > new Date()&&
                                                displayMultibanco(user?.subscription_history.at(-1), true)}
                                        </div>
                                        
                                        <div>
                                            <div className={styles.subtitle_sub}>
                                                <span className={styles.ya} style={{color:daysTillCharge?"#0358e5":"#fdd835"}}>ATIVA</span>
                                            </div>
                                            
                                            <div className={styles.selected_plan_info}>
                                                    <div className={`${styles.sub_val_wrap} ${styles.sub_val_subscribed}`} 
                                                        style={{borderColor:daysTillCharge?discountSubscriber?"#FF785A":"#0358e5":"#fdd835",
                                                                backgroundColor:daysTillCharge?"#0358e590":"#fdd83590"}}>
                                                        
                                                        {
                                                            discountSubscriber?
                                                            <div>
                                                                <p className={styles.sub_val_date_discount}>fundador</p>
                                                                <p className={styles.sub_val_date_discount_small}>F</p>
                                                            </div>
                                                            :null
                                                        }
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
                                        <div className={styles.operations_wrapper}>
                                            <span className={styles.title_operations}>Operações</span>
                                        </div>
                                        <div className={styles.card_right} style={{paddingBottom:0}}>
                                            <div className={styles.card_right_button} onClick={() => {
                                                setDisplay(1)
                                                setPaymentIntentObj(null)}}>
                                                <span style={{fontWeight:600}}>Adicionar dias</span>
                                            </div>
                                        </div>
                                        <div className={styles.history}>
                                            <div className={styles.history_button} onClick={() => setShowHistory(!showHistory)}>
                                                <span className={styles.history_title}>Ver histórico de transações</span>
                                                <span className={styles.history_title_small}>histórico</span>
                                                <ArrowForwardIosIcon className={!showHistory?styles.top_complete_arrow:styles.top_complete_arrow_show}/>
                                            </div>
                                            <div className={styles.history_map} style={{display:showHistory?'block':'none'}}>
                                                {user?.subscription_history&&mapHistory()}
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    <div className={styles.display_one}>
                                        <div className={styles.previous} onClick={() => {
                                            if(selectedMenu===0)
                                                setDisplay(0)
                                            else
                                                setSelectedMenu(0)
                                        }}>
                                            <ArrowBackIcon className={styles.previous_symbol}/>
                                            <span className={styles.previous_text}>{
                                                selectedMenu===0?'CANCELAR':'VOLTAR'}</span>
                                        </div>
                                        <div style={{borderBottom:'4px solid #fff', paddingBottom:'30px'}}>
                                            <div className={`${styles.sub_val_wrap} ${daysTillCharge?styles.sub_val_subscribed:styles.sub_val_not_subscribed}`} style={{marginTop:'20px'}}>
                                                <div className={styles.days_top_small}>
                                                    <span className={styles.days_top_title_main}>subscrição</span>
                                                    <span className={styles.days_top_title_help}>Com a compra deste pacote ficarás com:</span>
                                                    <div className={styles.top_background_flex}>
                                                        <div className={styles.top_background}>
                                                            <span className={styles.days_top_value_small_number}>{daysTillCharge||'000'}</span>
                                                            <span className={styles.days_top_value_small_number}> + </span>
                                                            <span className={styles.days_top_value_small_number} style={{color:selectedPlan===null?'#71848d':'#FF785A'}}>{selectedPlan===1?'030':selectedPlan===2?180:selectedPlan===3?360:'000'}</span>
                                                            <span className={styles.days_top_value_small_number} style={{color:selectedPlan===null?'#71848d':''}}> = </span>
                                                            <span className={styles.days_top_value_small_number} style={{color:selectedPlan===null?'#71848d':"#FF785A"}}>{daysTillCharge+(selectedPlan===1?30:selectedPlan===2?180:selectedPlan===3?360:0)}</span>
                                                        </div>
                                                        <span className={styles.days_top_title_small} style={{color:selectedPlan===null?'#71848d':"#FF785A"}}>DIAS TOTAIS de subscrição</span>
                                                    </div>
                                                </div>
                                                {
                                                    applyDiscount?
                                                    <div className={styles.days_top_discount}>
                                                        <span className={styles.days_top_value_small_number}>+</span>
                                                        <span className={styles.days_top_discount_info}>Desconto vitalício de Fundador 80%</span>
                                                    </div>
                                                    :null
                                                }
                                            </div>
                                        </div>
                                        {
                                            // user?.subscription?
                                            // <span className={styles.subtitle_sub} style={{marginTop:"40px"}}>
                                            //     <span >Comprar pacote de dias <span className={styles.fontFam}>{selectedMenu+1}/2</span></span>
                                            // </span>
                                            // :
                                            <span className={styles.subtitle_sub} style={{marginTop:"40px"}}>
                                                <span>Adicionar dias <span className={styles.fontFam}>{selectedMenu+1}/2</span></span>
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
                                        <Carousel
                                            swipeable={false}
                                            showArrows={false} 
                                            showStatus={false} 
                                            showIndicators={false} 
                                            showThumbs={false}
                                            selectedItem={selectedMenu}
                                        >
                                            {/* PACOTE */}
                                            <div className={styles.plans}>                                        
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
                                                        :<span className={styles.selected_plan_no_value}>Escolhe um pacote</span>
                                                    }
                                                    
                                                </div>
                                                <div className={styles.buttons}>
                                                    <span className={selectedPlan?styles.button_add:styles.button_add_disabled} 
                                                    onClick={async () => {
                                                        selectedPlan&&createPaymentIntent()
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
                                            <div className={styles.details}>
                                                <div className={styles.selected_plan}>      
                                                    <span className={styles.selected_plan_title} style={{marginTop:'10px'}}>Pacote</span>
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
                                                                <p className={styles.selected_plan_value_information}>{saver(360)}</p>
                                                            </div>
                                                        </div>
                                                        :<span className={styles.selected_plan_no_value}>Escolhe um pacote de dias</span>
                                                    }
                                                    
                                                </div>
                                                <span className={styles.details_title}>2 - Pagamento</span>
                                                <div className={styles.details_area}>
                                                    {
                                                        paymentIntentObj?
                                                        <Elements stripe={stripePromise} options={{
                                                            clientSecret: paymentIntentObj,
                                                            appearance: appearance,
                                                            locale: 'pt'
                                                        }}>
                                                            <PaymentElementsComponent 
                                                                test_mode={test_mode}
                                                                clientSecret={paymentIntentObj}
                                                                setLoading={val => setLoading(val)}
                                                                user={user}
                                                                getDays={val => getDays(val)}
                                                                selectedPlan={selectedPlan}
                                                                applyDiscount={applyDiscount}
                                                                setCanceledHighlight={val => setCanceledHighlight(val)}
                                                                setFailPopin={val => setFailPopin(val)}
                                                                setGeneralFail={val => setGeneralFail(val)}
                                                                setSuccessPopin={val => setSuccessPopin(val)}
                                                                setMultibancoPopin={val => setMultibancoPopin(val)}
                                                                api_url={api_url}
                                                                customerId={customerId}
                                                                getAmount={(val1, val2) => getAmount(val1, val2)}
                                                                refreshWorker={() => props.refreshWorker()}
                                                                setDisplay={val => setDisplay(val)}
                                                                user_email_verified={user_email_verified}
                                                                user_phone_verified={user_phone_verified}
                                                                setSelectedMenu={val => setSelectedMenu(val)}
                                                                />
                                                        </Elements>
                                                        :null
                                                    }
                                                </div>
                                            </div>
                                        </Carousel>
                                    </div>
                                </Carousel>
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