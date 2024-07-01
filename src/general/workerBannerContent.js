import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import logo_full_orange from '../assets/logo_full_orange.png'
import tarefas from '../assets/tarefas_logo.png'
import mensagens from '../assets/messages_logo.png'
import perfil from '../assets/perfil_logo.png'
import SubscriptionPlans from '../user/subscription_plans';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';


const WorkerBannerContent = props => {
    const user = useSelector(state => {return state.user})
    const navigate = useNavigate()

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


    return (
        <div className={props.workerPage?styles.popup_wrapper_worker:styles.popup_wrapper} style={{padding:props.workerPage?'20px':''}}>
            <div className={styles.value_brand_wrapper}>
                <img className={styles.value_brand_img} src={logo_full_orange}/>
                <p className={styles.value_brand_text} style={{color:props.workerPage?'#ffffff':''}}>PROFISSIONAL</p>
                <div className={styles.discount} style={{color:props.workerPage?'#161F28':'', backgroundColor:props.workerPage?'#ffffff':''}}>
                    {
                        props.workerPage?
                        <p className={styles.discount_text} style={{color:props.workerPage?'#161F28':''}}>3 meses subscrição grátis</p>
                        :
                        <p className={styles.discount_text}>3 meses subscrição grátis*</p>
                    }
                </div>
            </div>
            <div className={styles.divider} style={{marginTop:'15px'}}/>
            <div className={props.workerPage?styles.popup_inner_worker:styles.popup_inner}>
                <span className={styles.title} style={{color:props.workerPage?'#ffffff':''}}>
                    Queres encontrar tarefas para realizar, receber contacto dos utlizadores e expôr o teu négocio?
                    {
                        props.registerPage?
                        <p style={{fontWeight:'400'}}>Torna-te um profissional ativando o modo profissional.</p>
                        :
                        <p style={{fontWeight:'400'}}>Torna-te um profissional criando a tua conta e ativando o modo profissional.</p>
                    }
                    
                </span>
                <span className={styles.line_title} style={{marginTop:'15px', color:props.workerPage?'#ffffff':''}}>Benefícios</span>
                <div className={styles.line}>
                    <img className={styles.line_image} src={tarefas}/>
                    <span className={styles.helper_text}>Tarefas</span>
                    <span className={styles.line_text} style={{color:props.workerPage?'#ffffff':''}}>Acesso desbloqueado aos detalhes de <span className={styles.action}>contacto</span> e <span className={styles.action}>localização</span> de <span className={styles.bold}>todas as tarefas publicadas</span>.</span>
                </div>
                <div className={styles.line}>
                    <img className={styles.line_image} src={mensagens}/>
                    <span className={styles.helper_text}>Mensagens</span>
                    <span className={styles.line_text} style={{color:props.workerPage?'#ffffff':''}}>Acesso à <span className={styles.action}>plataforma de mensagens</span> onde podes contactar os teus clientes de forma <span className={styles.bold}>fácil</span> e <span className={styles.bold}>direta</span>.</span>
                </div>
                <div className={styles.line} style={{borderBottom:props.workerPage?'':'1px solid #71848d', paddingBottom:props.workerPage?'':"25px"}}>
                    <img className={styles.line_image} src={perfil}/>
                    <span className={styles.helper_text}>Perfil</span>
                    <span className={styles.line_text} style={{color:props.workerPage?'#ffffff':''}}>Criação do teu <span className={styles.action}>perfil de profissional</span> que será acessível a todos clientes do TAREFAS.</span>
                </div>
                {
                    props.workerPage?
                    null
                    :
                    <span className={styles.line_title}>Pacotes de Subscrição</span>
                }
                {
                    props.workerPage?
                    null
                    :
                    <div className={`${styles.info_bottom_text}`}>
                        <p className={styles.info_bottom_text}>Ativa a tua subscrição com um <strong style={{color:"#FF785A"}}>desconto de 80% </strong> sobre qualquer pacote de dias. Este desconto exclusivo será aplicado em futuras compras de pacotes, <strong>para sempre</strong>.</p>
                        {/* <p className={styles.info_bottom_text_helper}>O desconto é exclusivo de primeira ativação de subscrição.</p> */}
                    </div>
                }
                {
                    props.workerPage?
                    null
                    :
                    <div>
                    <div style={{display:'flex', justifyContent:'center', marginTop:'20px', marginBottom:'-20px'}}>
                        <span className={styles.line_title} style={{textDecoration:'none'}}>Pacotes</span>
                    </div>
                    <SubscriptionPlans 
                        workerBanner={true}

                        selectedPlan={0}
                        subscriptionPlanObj={{}}
                        discountSubscriber={true}
                        user={0}
                        schedule={0}

                        discount_mensal_d_euro={discount_mensal_d_euro}
                        discount_mensal_d_centimo={discount_mensal_d_centimo}
                        discount_mensal_d={discount_mensal_monthly}
                        mensal_d={mensal_monthly}
                        mensal_d_euro={mensal_d_euro}
                        mensal_d_centimo={mensal_d_centimo}

                        discount_semestral_d_euro={discount_semestral_d_euro}
                        discount_semestral_d_centimo={discount_semestral_d_centimo}
                        discount_semestral_monthly={discount_semestral_monthly}
                        semestral_monthly={semestral_monthly}
                        semestral_d_euro={semestral_d_euro}
                        semestral_d_centimo={semestral_d_centimo}

                        discount_anual_d_euro={discount_anual_d_euro}
                        discount_anual_d_centimo={discount_anual_d_centimo}
                        discount_anual_monthly={discount_anual_monthly}
                        anual_monthly={anual_monthly}
                        anual_d_euro={anual_d_euro}
                        anual_d_centimo={anual_d_centimo}

                        setSelectedPlan={() => {}}/>
                </div>
                }
                {
                    props.workerPage?
                    null
                    :
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <p className={styles.ou}>OU</p>
                    </div>
                }
                {
                    props.workerPage?
                    null
                    :
                    <div className={styles.discount_area}>
                        <span className={styles.line_discount}><strong>*</strong>Aproveita a oferta de <strong>3 meses de subscrição gratuitos</strong> para novos profissionais.</span>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <div className={styles.discount_big}>
                                <p className={styles.discount_text_big}>90 dias subscrição grátis</p>
                            </div>
                        </div>
                    </div>
                }
                {
                    props.workerPage?
                    null
                    :
                    <span className={styles.line_title} style={{marginBottom:'10px'}}>3 passos</span>
                }
                {
                    props.workerPage?
                    null
                    :
                    <div className={styles.steps} style={{paddingBottom:props.workerPage?'20px':''}}>
                        <p className={styles.info_bottom_text} style={{marginBottom:'10px', fontWeight:500}}>Ser um profissional no TAREFAS é simples.<br/>Segue os passos abaixo e começa a realizar tarefas.</p>
                        <div className={styles.steps_line}>
                            <span className={styles.steps_line_number}>1</span>
                            {
                                user?._id || props.registerPage?
                                <p className={styles.steps_line_text}>Ativa o modo profissional</p>
                                :
                                <p className={styles.steps_line_text}>Cria a tua conta e ativa o modo profissional</p>
                            }
                            
                        </div>
                        <div className={styles.steps_line}>
                            <span className={styles.steps_line_number}>2</span>
                            {
                                user?._id&&user?.email_verified?
                                <span className={styles.steps_line_text} style={{color:"#0358e5"}}>Verifica a tua conta/email (já se encontra verificada)</span>
                                :
                                <p className={styles.steps_line_text}>Verifica a tua conta/email</p>
                            }
                            
                        </div>
                        <div className={styles.steps_line}>
                            <span className={styles.steps_line_number}>3</span>
                            <p className={styles.steps_line_text}>Preenche alguns detalhes e ativa a tua subscrição</p>
                        </div>
                        
                    </div>
                }
                
                
                
                
                
            </div>
            

            {
                user?.worker || props.workerPage || props.registerPage?
                null
                :
                <span className={styles.confirm_button} onClick={() => {
                    if(props.authPage)
                        props.confirm()
                    else if(user?._id)
                        navigate('/user?t=profissional')
                    else
                        navigate('/authentication/user?type=0', {state : {workerMode: true}})
                }}>
                    {
                        
                        props.authPage||user?._id?
                        'ATIVAR MODO PROFISSIONAL'
                        :
                        'CONTINUAR PARA CRIAÇÃO DE CONTA'
                    }
                </span>
            }

            {
                props.workerPage?
                null
                :
                <span className={styles.cancel} onClick={() => props.cancel()}>fechar</span>
            }

        </div>
    )
}

export default WorkerBannerContent