import React, {useState, useEffect} from 'react'
import styles from './subscription.module.css'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import hand from '../assets/hand.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const SubscriptionAlterar = props => {

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

    const planPricingArray = [
        {
            total: props.discountSubscriber?discount_mensal_d:mensal_d,
            monthly: props.discountSubscriber?discount_mensal_monthly:mensal_monthly,
        },
        {
            total: props.discountSubscriber?discount_semestral_d:semestral_d,
            monthly: props.discountSubscriber?discount_semestral_monthly:semestral_monthly,
        },
        {
            total: props.discountSubscriber?discount_anual_d:anual_d,
            monthly: props.discountSubscriber?discount_anual_monthly:anual_monthly,
        },
    ]
    const newObject = [
        {
            type: 'MENSAL',
            a_cada: 'mês',
            image: basic
        },
        {
            type: 'SEMESTRAL',
            a_cada: '6 meses',
            image: medium
        },
        {
            type: 'ANUAL',
            a_cada: '12 meses',
            image: pro
        }
    ]
    
    useEffect(() => {
        console.log(props.subscriptionPlanObj)
    }, [props.subscriptionPlanObj])

    return (
        <div className={styles.change_plan_wrap}>
            <div style={{flex:'1', width:"100%"}}>
                <div className={`${styles.sub_val_wrap_small}`} style={{borderColor:"#FFFFFF"}}>
                    {
                        props.discountSubscriber?
                        <div>
                            <p className={styles.sub_val_date_discount}>fundador</p>
                            <p className={styles.sub_val_date_discount_small}>F</p>
                        </div>
                        :null
                    }
                    <div className={styles.sub_val_wrap_image} style={{backgroundColor:"#FFFFFF"}}>
                        {
                            props.trialActive?
                            <img src={hand} className={styles.section_img_small}/>
                            :
                            <img src={props.subscriptionPlanObj.image} className={styles.section_img_small}/>
                        }
                        
                    </div>
                    <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.8rem'}}>Plano ATUAL</p>
                    {
                        props.trialActive?
                        <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>GRATUITO</p>
                        :
                        <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>{props.subscriptionPlanObj?.type}</p>
                    }
                    <div className={styles.selected_plan_value_wrap}>
                        <div className={styles.info_div} style={{marginTop:'10px'}}>
                            <div className={styles.info_subdiv}>
                                <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                {
                                    props.trialActive?
                                    <span className={styles.info_text} style={{fontSize:'0.8rem', color:props.discountSubscriber?"#FF785A":"#ffffff"}}>€0.00</span>
                                    :
                                    <div>
                                        <span className={styles.info_text} style={{fontSize:'0.8rem', color:props.discountSubscriber?"#FF785A":"#ffffff"}}>€{props.subscriptionPlanObj.value}</span>
                                        <span className={styles.info_text} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€{props.subscriptionPlanObj.monthly}/mês)</span>
                                        
                                    </div>
                                }
                                
                            </div>
                        </div>
                        <div className={styles.info_div}>
                            <div className={styles.info_subdiv}>
                                <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                {
                                    props.trialActive?
                                    <span className={styles.info_text} style={{fontSize:'0.8rem'}}>90 Dias</span>
                                    :
                                    <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada {props.subscriptionPlanObj.a_cada}</span>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <ArrowRightAltIcon className={styles.arrow}/>
            {
                props.subscriptionPlanObj.selected_plan!==props.selectedPlan?
                <div style={{flex:'1', width:"100%"}}>
                    <div className={`${styles.sub_val_wrap_small}`} style={{backgroundColor:"#FF785A90", borderColor:"#FF785A"}}>
                        {
                            props.discountSubscriber?
                            <div>
                                <p className={styles.sub_val_date_discount}>fundador</p>
                                <p className={styles.sub_val_date_discount_small}>F</p>
                            </div>
                            
                            :null
                        }
                        <div className={styles.sub_val_wrap_image} style={{backgroundColor:"#FF785A"}}>
                            <img src={newObject[props.nextPlan?props.nextPlan:props.selectedPlan-1]?.image} className={styles.section_img_small}/>
                        </div>
                        <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano NOVO</p>
                        <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>{newObject[props.nextPlan?props.nextPlan:props.selectedPlan-1]?.type}</p>
                        <div className={styles.selected_plan_value_wrap}>
                            <div className={styles.info_div} style={{marginTop:'10px'}}>
                                <div className={styles.info_subdiv}>
                                    <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                    <span className={styles.info_text} style={{fontSize:'0.8rem', color:props.discountSubscriber?"#FF785A":"#ffffff"}}>€{planPricingArray[props.nextPlan?props.nextPlan:props.selectedPlan-1]?.total}</span>
                                    <span className={`${styles.info_text}`} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€{planPricingArray[props.nextPlan?props.nextPlan:props.selectedPlan-1]?.monthly}/mês)</span>
                                </div>
                            </div>
                            <div className={styles.info_div}>
                                <div className={styles.info_subdiv}>
                                    <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                    <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada {newObject[props.nextPlan?props.nextPlan:props.selectedPlan-1]?.a_cada}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :<span className={styles.selected_plan_no_value} style={{flex:1, padding:"10px 0", backgroundColor:"#FF785A90"}}>Seleciona um plano diferente do atual</span>
            }
        </div>
    )
}

export default SubscriptionAlterar