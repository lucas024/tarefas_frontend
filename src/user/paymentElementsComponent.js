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

    const [validCard, setValidCard] = useState(false)
    const [validDate, setValidDate] = useState(false)
    const [validCvc, setValidCvc] = useState(false)
    
    const handlePayment = async () => {
    
        props.setLoading(true)
        if (!stripe || !elements || !props.paymentIntentObj) {
            props.setLoading(false)
            return;
        }
    
        let discount_aux = null
    
        if(props.user.subscription?.discount_subscriber)
            discount_aux = props.user.subscription?.discount_subscriber
        else
            discount_aux = '80_off'
    
        try
        {            
            const paymentConfirmation = await stripe.confirmCardPayment(
                    props.clientSecret, {
                        payment_method: {
                            card: elements.getElement(CardNumberElement),
                            billing_details: {
                                name: props.cardName,
                                email: props.user.email
                            }
                        }
                    }
                )
    
            
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
                    setTimeout(() => props.setCanceledHighlight(false), 4000)
                    props.setCanceledHighlight(true)
                }
                else if(paymentConfirmation.error.code === "card_declined")
                {
                    props.setFailPopin(true)
                    setTimeout(() => props.setFailPopin(false), 4000)
                    props.setFailHighlight(true)
                }
                else
                {
                    props.setGeneralFail(true)
                    setTimeout(() => props.setGeneralFail(false), 4000)
                }
                props.setLoading(false)
            }
            else
            {
                switch (paymentConfirmation.paymentIntent?.status) {
                    case "succeeded":
                        await axios.post(`${props.api_url}/update-subscription-paid`, {
                            purchase_date: purchase_date,
                            end_date: end_date,
                            pm_id: paymentConfirmation.paymentIntent.payment_method,
                            plan: props.selectedPlan,
                            _id: props.user._id,
                            stripe_id: props.customerId,
                            name: props.cardName,
                            price_id: props.selectedPlan&&props.getAmount(props.selectedPlan, discount_aux),
                            discount: discount_aux
                        })
    
                        props.refreshWorker()
                        props.setLoading(false)
                        props.setDisplay(0)
                        props.setSuccessPopin(true)
                        dispatch(worker_update_is_subscribed(true))
                        if(props.user_phone_verified&&props.user_email_verified&&props.user.regioes?.length>0&&props.user.trabalhos?.length>0)
                        {
                            axios.post(`${props.api_url}/worker/update_state`, {state: 1, user_id: props.user._id})
                        }
                        setTimeout(() => props.setSuccessPopin(false), 4000)
                        break;
          
                    // case 'processing':
                    //   setMessage("Payment processing. We'll update you when payment is received.");
                    //   break;
          
                    case 'requires_payment_method':
                        props.setLoading(false)
                        props.setFailPopin(true)
                        setTimeout(() => props.setFailPopin(false), 4000)
                        break;
          
                    default:
                        props.setLoading(false)
                        break;
                  }
            }
            
        }
        catch (err) {
            console.log(err)
            props.setGeneralFail(true)
            setTimeout(() => props.setGeneralFail(false), 4000)
            props.setLoading(false)
        }
        
    }

    return (
        <div>
            <PaymentElement />
            <div className={styles.buttons}>
            <span 
                className={!props.failHighlight?styles.button_add:styles.button_add_disabled} 
                onClick={() => !props.failHighlight&&handlePayment()}>FINALIZAR PAGAMENTO</span>
            <span className={styles.button_cancel} onClick={() => {
                props.setSelectedMenu(0)
                // scrolltopref.current.scrollIntoView({behavior: 'smooth'})
                }}>VOLTAR</span>
        </div>
        </div>
    )
}

export default PaymentElementsComponent