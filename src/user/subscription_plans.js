import React, {useState, useEffect, useRef} from 'react'
import styles from './subscription.module.css'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import Check from '@mui/icons-material/Check';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const SubscriptionPlans = props => {
    return (
        <div className={styles.plans_sections}>
            <div 
                className={props.workerBanner?styles.section_worker:props.selectedPlan===1?styles.section_selected:styles.section} 
                style={{borderColor:props.subscriptionPlanObj.selected_plan===1?"#FFFFFF":""}} 
                onClick={() => props.setSelectedPlan(1)}>
                {
                    props.discountSubscriber?
                    <div>
                        <span className={styles.discount_letters} style={{fontSize:'0.6rem'}}>{props.workerBanner?'-80%':'FUNDADOR'}</span>
                        <span className={styles.discount_letters_small} style={{fontSize:'0.6rem'}}>{props.workerBanner?'-80%':'F'}</span>
                    </div>
                    :null
                }
                {
                    props.subscriptionPlanObj.selected_plan===1?
                    <span className={styles.ativo}>Ativo</span>
                    :props.user.subscription?.plan===1&&!props.schedule.phases[0].metadata.from_canceled?
                    <span className={styles.ativo}>Ativo</span>
                    :null
                }
                <img src={basic} className={styles.section_img} style={{marginTop:props.workerBanner?"30px":"20px"}}/>
                <span className={styles.section_type}>Mensal</span>
                <span className={styles.section_type_desc}>Pagamento a cada mês</span>
                <div className={styles.section_valor_div}>
                    {
                        props.discountSubscriber?
                        <div className={styles.options_price_flex}>
                            <div className={styles.options_price_flex_flex}>
                                <EuroSymbolIcon className={styles.price_euro}/>
                                <p className={styles.options_price_value}>{props.mensal_d_euro}</p>
                                <p className={styles.options_price_decimal}>.{props.mensal_d_centimo}</p>
                            </div>
                            <ArrowRightIcon className={styles.price_arrow}/>
                            <div className={styles.options_price_flex_flex} style={{color:"#FF785A", fontWeight:'700'}}>
                                <EuroSymbolIcon className={styles.price_euro}/>
                                <p className={styles.section_valor_top_number}>{props.discount_mensal_d_euro}</p>
                                <p className={styles.section_valor_top_number_decimal}>.{props.discount_mensal_d_centimo}</p>
                            </div>
                        </div>
                        // <div className={styles.section_valor_top}>
                        //     <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                        //     <span className={styles.section_valor_top_number}>{props.discount_mensal_d_euro}</span>
                        //     <span className={styles.section_valor_top_number_decimal}>.{props.discount_mensal_d_centimo}</span>
                        // </div>
                        :
                        <div className={styles.section_valor_top}>
                            <EuroSymbolIcon className={styles.section_valor_top_symbol} style={{color:'#ffffff'}}/>
                            <span className={styles.section_valor_top_number} style={{color:'#ffffff'}}>{props.mensal_d_euro}</span>
                            <span className={styles.section_valor_top_number_decimal} style={{color:'#ffffff'}}>.{props.mensal_d_centimo}</span>
                        </div>
                    }
                    {
                        props.discountSubscriber?
                        <span className={styles.section_desc_of_pay}>{props.discount_mensal_d}€/mês</span>
                        :<span className={styles.section_desc_of_pay}>{props.mensal_d}€/mês</span>
                    }
                    
                </div>
                {
                    props.selectedPlan===1?
                    <div className={styles.section_button_selected}>
                        <Check className={styles.section_button_selected_icon}/>
                    </div>
                    :null
                }
                
            </div>
            <div 
                className={props.workerBanner?styles.section_worker:props.selectedPlan===2?styles.section_selected:styles.section}
                style={{borderColor:props.subscriptionPlanObj.selected_plan===2?"#FFFFFF":""}} 
                onClick={() => props.setSelectedPlan(2)}>
                {
                    props.discountSubscriber?
                    <div>
                        <span className={styles.discount_letters} style={{fontSize:'0.6rem'}}>{props.workerBanner?'-80%':'FUNDADOR'}</span>
                        <span className={styles.discount_letters_small} style={{fontSize:'0.6rem'}}>{props.workerBanner?'-80%':'F'}</span>
                    </div>
                    :null
                }
                {
                    props.subscriptionPlanObj.selected_plan===2?
                    <span className={styles.ativo}>Ativo</span>
                    :props.user.subscription?.plan===2&&!props.schedule.phases[0].metadata.from_canceled?
                    <span className={styles.ativo}>Ativo</span>
                    :null
                }
                <img src={medium} className={styles.section_img} style={{marginTop:props.workerBanner?"30px":"20px"}}/>
                <span className={styles.section_type}>Semestral</span>
                <span className={styles.section_type_desc}>Pagamento a cada 6 meses</span>
                <div className={styles.section_valor_div}>
                    {
                        props.discountSubscriber?
                        <div className={styles.options_price_flex}>
                            <div className={styles.options_price_flex_flex}>
                                <EuroSymbolIcon className={styles.price_euro}/>
                                <p className={styles.options_price_value}>{props.semestral_d_euro}</p>
                                <p className={styles.options_price_decimal}>.{props.semestral_d_centimo}</p>
                            </div>
                            <ArrowRightIcon className={styles.price_arrow}/>
                            <div className={styles.options_price_flex_flex} style={{color:"#FF785A", fontWeight:'700'}}>
                                <EuroSymbolIcon className={styles.price_euro}/>
                                <p className={styles.section_valor_top_number}>{props.discount_semestral_d_euro}</p>
                                <p className={styles.section_valor_top_number_decimal}>.{props.discount_semestral_d_centimo}</p>
                            </div>
                        </div>
                        // <div className={styles.section_valor_top}>
                        //     <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                        //     <span className={styles.section_valor_top_number}>{props.discount_semestral_d_euro}</span>
                        //     <span className={styles.section_valor_top_number_decimal}>.{props.discount_semestral_d_centimo}</span>
                        // </div>
                        :
                        <div className={styles.section_valor_top}>
                            <EuroSymbolIcon className={styles.section_valor_top_symbol} style={{color:'#ffffff'}}/>
                            <span className={styles.section_valor_top_number} style={{color:'#ffffff'}}>{props.semestral_d_euro}</span>
                            <span className={styles.section_valor_top_number_decimal} style={{color:'#ffffff'}}>.{props.semestral_d_centimo}</span>
                        </div>
                    }
                    {
                        props.discountSubscriber?
                        <span className={styles.section_desc_of_pay}>{props.discount_semestral_monthly}€/mês</span>
                        :<span className={styles.section_desc_of_pay}>{props.semestral_monthly}€/mês</span>
                    }
                </div>
                {
                    props.selectedPlan===2?
                    <div className={styles.section_button_selected}>
                        <Check className={styles.section_button_selected_icon}/>
                    </div>

                    :null
                }
            </div>
            <div 
                className={props.workerBanner?styles.section_worker:props.selectedPlan===3?styles.section_selected:styles.section} 
                style={{borderColor:props.subscriptionPlanObj.selected_plan===3?"#FFFFFF":""}} 
                onClick={() => props.setSelectedPlan(3)}>
                {
                    props.discountSubscriber?
                    <div>
                        <span className={styles.discount_letters} style={{fontSize:'0.6rem'}}>{props.workerBanner?'-80%':'FUNDADOR'}</span>
                        <span className={styles.discount_letters_small} style={{fontSize:'0.6rem'}}>{props.workerBanner?'-80%':'F'}</span>
                    </div>
                    :null
                }
                {
                    props.subscriptionPlanObj.selected_plan===3?
                    <span className={styles.ativo}>Ativo</span>
                    :props.user.subscription?.plan===3&&!props.schedule.phases[0].metadata.from_canceled?
                    <span className={styles.ativo}>Ativo</span>
                    :null
                }
                <img src={pro} className={styles.section_img} style={{marginTop:props.workerBanner?"30px":"20px"}}/>
                <span className={styles.section_type}>Anual</span>
                <span className={styles.section_type_desc}>Pagamento a cada 12 meses</span>
                <div className={styles.section_valor_div}>
                    {
                        props.discountSubscriber?
                        <div className={styles.options_price_flex}>
                            <div className={styles.options_price_flex_flex}>
                                <EuroSymbolIcon className={styles.price_euro}/>
                                <p className={styles.options_price_value}>{props.anual_d_euro}</p>
                                <p className={styles.options_price_decimal}>.{props.anual_d_centimo}</p>
                            </div>
                            <ArrowRightIcon className={styles.price_arrow}/>
                            <div className={styles.options_price_flex_flex} style={{color:"#FF785A", fontWeight:'700'}}>
                                <EuroSymbolIcon className={styles.price_euro}/>
                                <p className={styles.section_valor_top_number}>{props.discount_anual_d_euro}</p>
                                <p className={styles.section_valor_top_number_decimal}>.{props.discount_anual_d_centimo}</p>
                            </div>
                        </div>
                        // <div className={styles.section_valor_top}>
                        //     <EuroSymbolIcon className={styles.section_valor_top_symbol}/>
                        //     <span className={styles.section_valor_top_number}>{props.discount_anual_d_euro}</span>
                        //     <span className={styles.section_valor_top_number_decimal}>.{props.discount_anual_d_centimo}</span>
                        // </div>
                        :
                        <div className={styles.section_valor_top}>
                            <EuroSymbolIcon className={styles.section_valor_top_symbol} style={{color:'#ffffff'}}/>
                            <span className={styles.section_valor_top_number} style={{color:'#ffffff'}}>{props.anual_d_euro}</span>
                            <span className={styles.section_valor_top_number_decimal} style={{color:'#ffffff'}}>.{props.anual_d_centimo}</span>
                        </div>
                    }
                    {
                        props.discountSubscriber?
                        <span className={styles.section_desc_of_pay}>{props.discount_anual_monthly}€/mês</span>
                        :<span className={styles.section_desc_of_pay}>{props.anual_monthly}€/mês</span>
                    }
                </div>
                {
                    props.selectedPlan===3?
                    <div className={styles.section_button_selected}>
                        <Check className={styles.section_button_selected_icon}/>
                    </div>
                    
                    :null
                }
            </div>
        </div>
    )
}

export default SubscriptionPlans