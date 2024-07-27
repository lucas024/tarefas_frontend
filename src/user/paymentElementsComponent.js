import React, {useState, useEffect, useRef} from 'react'
import { 
    CardElement,
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement,
    useStripe,
    useElements,
    PaymentElement
} from '@stripe/react-stripe-js';
import axios from 'axios'
import { 
    worker_update_is_subscribed,
    worker_update_subscription
} from '../store';
import { useDispatch } from 'react-redux'
import styles from './subscription.module.css'


const PaymentElementsComponent = props => {
    const dispatch = useDispatch()
    const stripe = useStripe()
    const elements = useElements()

    const [paymentDataComplete, setPaymentDataComplete] = useState(false)


    const handleChange = data => {
        setPaymentDataComplete(data.complete)
    }
    
    const handlePayment = async () => {
        props.setLoading(true)
        if (!stripe || !elements) {
            props.setLoading(false)
            return;
        }
    
        try
        {
            const paymentConfirmation = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: 
                        props.test_mode?
                            'http://localhost:3000/user?t=profissional&st=subscription'
                            :
                            'https://pt-tarefas.pt/user?t=profissional&st=subscription'
                },
                redirect: 'if_required',
                payment_method_data: {
                    billing_details: {
                        name: props.user.name,
                        email: props.user.email,
                        phone: props.user.phone?`+351${props.user.phone}`:null
                    }
                }
            })
            
            console.log(paymentConfirmation)
            
            let purchase_date = new Date()
            let end_date = new Date()
    
            if(props.user.subscription?.end_date && (new Date(props.user.subscription?.end_date) > new Date()))
                end_date = new Date(props.user.subscription?.end_date)
        
            end_date.setDate(end_date.getDate()+props.getDays(props.selectedPlan))
    
            let discount_aux = null
    
            if(props.user.subscription?.discount_subscriber)
                discount_aux = props.user.subscription?.discount_subscriber
            else
                discount_aux = props.applyDiscount

            
            if(paymentConfirmation.error !== null && paymentConfirmation.error !== undefined)
            {
                if(paymentConfirmation.error.code === "payment_intent_authentication_failure")
                {
                    props.setCanceledHighlight(true)
                    setTimeout(() => props.setCanceledHighlight(false), 15000)
                    
                }
                else if(paymentConfirmation.error.code === "card_declined")
                {
                    props.setFailPopin(true)
                    setTimeout(() => props.setFailPopin(false), 15000)
                    props.setFailHighlight(true)
                }
                else
                {
                    props.setGeneralFail(true)
                    setTimeout(() => props.setGeneralFail(false), 15000)
                }
                props.setLoading(false)
            }
            else
            {
                console.log(paymentConfirmation.paymentIntent)
                switch (paymentConfirmation.paymentIntent?.status) {
                    case "succeeded":
                        await axios.post(`${props.api_url}/update-subscription-paid`, {
                            payment_intent: paymentConfirmation.paymentIntent,
                            payment_intent_metadata: {
                                purchase_date: purchase_date,
                                end_date: end_date,
                                plan: parseInt(props.selectedPlan),
                                user_id: props.user._id,
                                user_name: props.user.name,
                                customer_id: props.customerId,
                                discount: discount_aux
                            }
                        })
    
                        props.refreshWorker()
                        props.setLoading(false)
                        props.setSelectedMenu(0)
                        props.setDisplay(0)
                        props.setSuccessPopin(true)
                        dispatch(worker_update_is_subscribed(true))
                        if(props.user_phone_verified&&props.user_email_verified&&props.user.regioes?.length>0&&props.user.trabalhos?.length>0)
                        {
                            axios.post(`${props.api_url}/worker/update_state`, {state: 1, user_id: props.user._id})
                        }
                        setTimeout(() => props.setSuccessPopin(false), 10000)
                        break;
          
                    // case 'processing':
                    //   setMessage("Payment processing. We'll update you when payment is received.");
                    //   break;
          
                    case 'requires_payment_method':
                        props.setLoading(false)
                        props.setFailPopin(true)
                        setTimeout(() => props.setFailPopin(false), 15000)
                        break;

                    case "requires_action":
                        props.refreshWorker()
                        props.setLoading(false)
                        props.setSelectedMenu(0)
                        props.setDisplay(0)
                        props.setMultibancoPopin(true)

                    default:
                        props.setLoading(false)
                        break;
                  }
            }
            
        }
        catch (err) {
            console.log(err)
            props.setGeneralFail(true)
            setTimeout(() => props.setGeneralFail(false), 15000)
            props.setLoading(false)
        }
        
    }

    return (
        <div>
            <PaymentElement onChange={val => handleChange(val)}/>
            <div className={styles.buttons}>
            <span 
                className={paymentDataComplete?styles.button_add:styles.button_add_disabled} 
                onClick={() => paymentDataComplete&&handlePayment()}>FINALIZAR PAGAMENTO</span>
            <span className={styles.button_cancel} onClick={() => {
                props.setSelectedMenu(0)
                // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                }}>VOLTAR</span>
        </div>
        </div>
    )
}

export default PaymentElementsComponent