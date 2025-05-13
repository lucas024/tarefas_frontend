import React from 'react'
import styles from './banner.module.css'
import multibanco from '../assets/multibanco.png'

const ConfirmBanner = (props) => {

    return (
        <div className={styles.verification} onClick={() => props.cancel()}>
            {
                props.type==='alterar'?
                <div className={styles.main} style={{borderColor:props.color?props.color:""}} onClick={e => e.stopPropagation()}>
                    <p className={styles.title}>Cancelar Alteração</p>
                    <span className={styles.title_separator}/>
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Quer proceder com o <strong>cancelemento</strong> da alteração de plano?</p>                     
                        <div className={styles.button} style={{backgroundColor:'#FF785A'}} onClick={() => props.confirm()}>
                            <span className={styles.button_text}>CONFIRMAR</span>
                        </div>
                    </div>
                    <p className={styles.cancel} onClick={() => props.cancel()}>cancelar</p>
                </div>
                :
                props.type==='three_months'?
                <div className={styles.main} style={{borderColor:props.color?props.color:""}} onClick={e => e.stopPropagation()}>
                    <p className={styles.title}>Ativar Subscrição gratuita</p>
                    <span className={styles.title_separator}/>
                    <div className={styles.main_inner}>
                        <p className={styles.phone_description}>Ao procederes com a <strong>subscrição gratuita de 90 dias</strong>, não poderás usufruir do desconto exclusivo de primeira ativação, após o periodo gratuíto.</p>                     
                        <div className={styles.button} style={{backgroundColor:'#FF785A'}} onClick={() => props.confirm()}>
                            <span className={styles.button_text} style={{color:"white"}}>Ativar 90 dias Gratuitos</span>
                        </div>
                    </div>
                    <p className={styles.cancel} onClick={() => props.cancel()}>Cancelar</p>
                </div>
                :
                props.type==='multibanco'?
                <div className={styles.main} style={{borderColor:'#fdd835'}} onClick={e => e.stopPropagation()}>
                    <p className={styles.title}>Detalhes de Pagamento Multibanco</p>
                    <span className={styles.title_separator}/>
                    <div className={styles.main_inner}>
                        <div className={styles.main_inner_multibanco}>
                            <p className={styles.multibanco_days}>Compra de pacote de <strong>+{props.days}</strong> dias.</p> 
                            <div className={styles.multibanco_img_wrapper}>
                                <img className={styles.multibanco_img_val} src={multibanco}/>
                            </div>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <div className={styles.multibanco_item}>
                                    <div className={styles.multibanco_item_wrapper}>
                                        <span className={styles.multibanco_item_title}>Entidade:</span>
                                        <span className={styles.multibanco_item_title}>Referência:</span>
                                        <span className={styles.multibanco_item_title}>Valor:</span>
                                    </div>
                                    <div className={styles.multibanco_item_wrapper} style={{marginLeft:'10px'}}>
                                        <span className={styles.multibanco_item_value}>{props.data?.next_action?.multibanco_display_details.entity}</span>
                                        <span className={styles.multibanco_item_value}>{props.data?.next_action?.multibanco_display_details.reference}</span>
                                        <span className={styles.multibanco_item_value}>{props.price}</span>
                                    </div>                                  
                                </div>
                            </div>
                            
                            
                            <div className={styles.expires}>
                                <p style={{fontWeight:600}}>Este talão de pagamento expira a {props.expires}</p>
                                <p style={{marginTop:'10px', fontStyle:'normal'}}>Se já fizeste o pagamento, por-favor atualize a página.</p>
                                <p style={{marginTop:'10px', fontStyle:'normal'}}>Também podes fazer outro talão de pagamento multibanco ou comprar dias com outra forma de pagamento.</p>
                            </div>
                        </div>
                    </div>
                    <p className={styles.cancel} onClick={() => props.cancel()}>Fechar</p>
                </div>
                :null
            }
        </div>
    )
}

export default ConfirmBanner