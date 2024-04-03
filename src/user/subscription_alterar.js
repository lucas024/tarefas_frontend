import React, {useState, useEffect} from 'react'
import styles from './subscription.module.css'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import hand from '../assets/hand.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const SubscriptionAlterar = props => {

    const planPricingArray = [
        {
            total: props.discountSubscriber?'6.49':'12.99',
            monthly: props.discountSubscriber?'6.49':'12.99',
        },
        {
            total: props.discountSubscriber?'34.45':'68.89',
            monthly: props.discountSubscriber?'5.75':'11.49',
        },
        {
            total: props.discountSubscriber?'59.95':'119.89',
            monthly: props.discountSubscriber?'4.99':'9.99',
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

    return (
        <div className={styles.change_plan_wrap}>
            <div style={{flex:'1'}}>
                <div className={`${styles.sub_val_wrap}`} style={{borderColor:"#FFFFFF"}}>
                    {
                        props.discountSubscriber?
                        <p className={styles.sub_val_date_discount}>fundador</p>
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
                    <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano ATUAL</p>
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
                                    <span className={styles.info_text} style={{fontSize:'0.8rem'}}>100 Dias</span>
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
                <div style={{flex:'1'}}>
                    <div className={`${styles.sub_val_wrap}`} style={{backgroundColor:"#FF785A90", borderColor:"#FF785A"}}>
                        {
                            props.discountSubscriber?
                            <p className={styles.sub_val_date_discount}>fundador</p>
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
                                    <span className={`${styles.info_text} ${styles.equivalente}`} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€{planPricingArray[props.nextPlan?props.nextPlan:props.selectedPlan-1]?.monthly}/mês)</span>
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
                :<span className={styles.selected_plan_no_value} style={{flex:1, padding:"10px 0", backgroundColor:"#FF785A90"}}>Selecione um plano diferente do atual</span>
            }
        </div>
    )
}

export default SubscriptionAlterar