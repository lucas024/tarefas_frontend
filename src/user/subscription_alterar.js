import React, {useState, useEffect} from 'react'
import styles from './subscription.module.css'
import basic from '../assets/basic.png'
import medium from '../assets/real_medium.png'
import pro from '../assets/medium.png'
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const SubscriptionAlterar = props => {
    return (
        <div className={styles.change_plan_wrap}>
            <div style={{flex:'1'}}>
                <div className={`${styles.sub_val_wrap}`}>
                    <div className={styles.sub_val_wrap_image}>
                        <img src={props.subscriptionPlanObj.image} className={styles.section_img_small}/>
                    </div>
                    <p className={styles.sub_val_date} style={{fontWeight:400, fontSize:'0.9rem'}}>Plano ATUAL</p>
                    <p className={styles.sub_val_date} style={{marginTop:'3px', fontSize:'0.9rem'}}>{props.subscriptionPlanObj.type}</p>
                    <div className={styles.selected_plan_value_wrap}>
                        <div className={styles.info_div} style={{marginTop:'10px'}}>
                            <div className={styles.info_subdiv}>
                                <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>VALOR:</span>
                                <span className={styles.info_text} style={{fontSize:'0.8rem'}}>€{props.subscriptionPlanObj.value}</span>
                                <span className={styles.info_text} style={{fontSize:'0.7rem', fontWeight:400, marginLeft:'5px'}}>(€{props.subscriptionPlanObj.monthly}/mês)</span>
                            </div>
                        </div>
                        <div className={styles.info_div}>
                            <div className={styles.info_subdiv}>
                                <span className={styles.info_text_helper} style={{fontSize:'0.7rem'}}>Modelo:</span>
                                <span className={styles.info_text} style={{fontSize:'0.8rem'}}>A cada {props.subscriptionPlanObj.a_cada}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <ArrowRightAltIcon className={styles.arrow}/>
            {
                (props.selectedPlan===1||props.nextPlan===1)&&props.subscriptionPlanObj.selected_plan!==1?
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
                (props.selectedPlan===2||props.nextPlan===2)&&props.subscriptionPlanObj.selected_plan!==2?
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
                (props.selectedPlan===3||props.nextPlan===3)&&props.subscriptionPlanObj.selected_plan!==3?
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
    )
}

export default SubscriptionAlterar