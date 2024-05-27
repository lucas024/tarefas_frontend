import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import {CSSTransition}  from 'react-transition-group';
import logo_full_orange from '../assets/logo_full_orange.png'
import tarefas from '../assets/tarefas_logo.png'
import mensagens from '../assets/messages_logo.png'
import perfil from '../assets/perfil_logo.png'
import SubscriptionPlans from '../user/subscription_plans';

const WorkerBanner = (props) => {

    const [transition, setTransition] = useState(false)

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])

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


    return (
        <div className={styles.banner} onClick={() => props.cancel()}>
            <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="banner"
                    unmountOnExit
                    >
            <div className={styles.popup}  onClick={e => e.stopPropagation()}>
                <div className={styles.value_brand_wrapper}>
                    <img className={styles.value_brand_img} src={logo_full_orange}/>
                    <p className={styles.value_brand_text}>PROFISSIONAL</p>
                    <div className={styles.discount}>
                        <p className={styles.discount_text}>3 meses subscrição grátis*</p>
                    </div>
                </div>
                <div className={styles.divider} style={{marginTop:'15px'}}/>
                <div className={styles.popup_inner}>
                    <span className={styles.line_title} style={{marginTop:'15px'}}>Benefícios</span>
                    <div className={styles.line}>
                        <img className={styles.line_image} src={tarefas}/>
                        <span className={styles.helper_text}>Tarefas</span>
                        <span className={styles.line_text}>Acesso desbloqueado aos detalhes de <span className={styles.action}>contacto</span> e <span className={styles.action}>localização</span> de <span className={styles.bold}>todas as tarefas publicadas</span>.</span>
                    </div>
                    <div className={styles.line}>
                        <img className={styles.line_image} src={mensagens}/>
                        <span className={styles.helper_text}>Mensagens</span>
                        <span className={styles.line_text}>Acesso à <span className={styles.action}>plataforma de mensagens</span> onde podes contactar os teus clientes de forma <span className={styles.bold}>fácil</span> e <span className={styles.bold}>direta</span>.</span>
                    </div>
                    <div className={styles.line} style={{borderBottom:'1px solid #71848d', paddingBottom:"25px"}}>
                        <img className={styles.line_image} src={perfil}/>
                        <span className={styles.helper_text}>Perfil</span>
                        <span className={styles.line_text}>Criação do teu <span className={styles.action}>perfil de profissional</span> que será acessível a todos clientes do TAREFAS.</span>
                    </div>
                    <span className={styles.line_title}>Planos de Subscrição</span>

                    <div className={`${styles.info_bottom_text}`}>
                        <p className={styles.info_bottom_text}>Ativa a tua subscrição com um <strong style={{color:"#FF785A"}}>desconto de 80% </strong> sobre qualquer plano, para sempre.</p>
                        <p className={styles.info_bottom_text_helper}>O desconto é exclusivo de primeira ativação de subscrição.</p>
                    </div>
                    <div>
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
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <p className={styles.ou}>OU</p>
                    </div>
                    
                    <div className={styles.discount_area}>
                        <span className={styles.line_discount}><strong>*</strong>Aproveita a oferta de <strong>3 meses de subscrição gratuitos</strong> para novos profissionais.</span>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <div className={styles.discount_big}>
                                <p className={styles.discount_text_big}>3 meses subscrição grátis</p>
                            </div>
                        </div>
                    </div>
                    <span className={styles.line_title} style={{marginBottom:'10px'}}>3 passos</span>
                    <div className={styles.steps}>
                        
                        <p className={styles.info_bottom_text} style={{marginBottom:'10px', fontWeight:500}}>Ser um profissional no TAREFAS é simples.<br/>Segue os passos abaixo e começa a encontrar tarefas.</p>
                        <div className={styles.steps_line}>
                            <span className={styles.steps_line_number}>1</span>
                            <p className={styles.steps_line_text}>Cria a tua conta de profissional</p>
                        </div>
                        <div className={styles.steps_line}>
                            <span className={styles.steps_line_number}>2</span>
                            <p className={styles.steps_line_text}>Verifica o teu e-mail</p>
                        </div>
                        <div className={styles.steps_line}>
                            <span className={styles.steps_line_number}>3</span>
                            <p className={styles.steps_line_text}>Ativa a tua subscrição</p>
                        </div>
                        
                    </div>
                    
                </div>
                

                <span className={styles.confirm_button} onClick={() => props.confirm()}>
                    {
                        props.authPage?
                        'CONTINUAR PARA CRIAÇÃO DE CONTA'
                        :
                        'CRIAR CONTA DE PROFISSIONAL'
                    }
                    
                </span>
                {
                    !props.authPage?
                    <span className={styles.cancel} onClick={() => props.cancel()}>fechar</span>
                    :null
                }
            </div>
            </CSSTransition>
        </div>
    )
}

export default WorkerBanner