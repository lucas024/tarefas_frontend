import React, {useEffect, useState} from 'react'
import styles from './reserva.module.css'
import no_pic from '../assets/worker_default.png'

const Reserva = (props) => {

    const [type, setType] = useState(0)
    const [typeColor, setTypeColor] = useState("#A9A9A9")

    useEffect(() => {
        if(type===0) {setTypeColor("#a9a9a9")}
        if(type===1) {setTypeColor("#fdd835")}
    }, [type])

    return (
        <div className={styles.reserva}>
            <div className={styles.button_cancel_area}>
                <span className={styles.button_cancel}>Cancelar Reserva</span>
            </div>
            <p className={styles.top_title} onClick={() => setType(1)}>Reserva</p>
            <div className={styles.reserva_top}>
                <img className={styles.top_img} ></img>
                <div className={styles.top_text}>
                    <span className={styles.text_name}>António Silva</span>
                    <span className={styles.text_desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut nulla ultrices, finibus leo eu, placerat tortor. Nunc diam eros, vestibulum molestie leo in, viverra lacinia sem. Donec nec eros condimentum, eleifend quam sed, imperdiet sem. Morbi iaculis nunc felis. Ut sed laoreet enim, vel viverra sapien. Sed ex sapien.</span>
                </div>
            </div>

            <div className={styles.middle}>
                <div className={styles.middle_button_div}>
                    <p className={styles.middle_title}></p>
                    <div className={styles.button_area}>
                        <div className={styles.button_proceed} style={{borderColor:typeColor, backgroundColor:typeColor+"50"}}>
                            <span className={styles.button_proceed_text}>
                                {
                                    type===1?"Por Confirmar":
                                        "Pendente"
                                    }
                            </span>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.middle_main} style={{borderColor:typeColor}}>
                    {
                        type===0?
                        <div className={styles.middle_pendent_frontdrop}>
                            <span className={styles.middle_front_text}>PENDENTE</span>
                        </div>
                        :null
                    }
                    <div className={styles.middle_flex}>
                        <div className={styles.middle_day}>
                        <span className={styles.middle_aux_text}>dia</span>
                            <span className={styles.middle_day_text}>15 de maio</span>
                        </div>
                        <div className={styles.hours_flex}>
                            <span className={styles.middle_aux_text}>horário</span>
                            <span className={styles.hours_start}>12:30</span>
                            <span className={styles.hours_divide}>-</span>
                            <span className={styles.hours_end}>15:30</span>
                        </div>
                    </div>
                    <div className={styles.divider}></div>
                    {/* <div className={styles.middle_worker}>
                        <img className={styles.worker_img}></img>
                        <span className={styles.worker_text}></span>
                    </div> */}
                    <div className={styles.middle_info}>
                        <span className={styles.middle_aux_text} style={{color:"white", fontSize:"0.9rem"}}>Detalhes da reserva</span>
                        <div className={styles.middle_info_zone}>
                            <div className={styles.middle_info_flex} style={{paddingTop:"15px"}}>
                                <span className={styles.middle_aux_text_minor}>Descrição</span>
                                <span className={styles.middle_info_text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut nulla ultrices, finibus leo eu, placerat tortor. Nunc diam eros, vestibulum molestie leo in, viverra lacinia sem. Donec nec eros condimentum, eleifend quam sed, imperdiet sem. Morbi iaculis nunc felis. Ut sed laoreet enim, vel viverra sapien. Sed ex sapien.</span>
                            </div>
                            <div className={styles.middle_info_flex} style={{paddingTop:"15px"}}>
                                <span className={styles.middle_aux_text_minor}>Localização</span>
                                <span className={styles.middle_info_text}>R. Conselheiro José Silvestre Ribeiro, 16</span>
                            </div>
                        </div>
                        
                    </div>
                    <div className={styles.middle_info} style={{marginTop:"30px", marginBottom:"15px"}}>
                        <span className={styles.middle_aux_text} style={{color:"white", fontSize:"0.9rem"}}>Profissional</span>
                        <div className={styles.middle_info_zone}>
                            <div className={styles.middle_info_flex} style={{paddingTop:"5px"}}>
                                <span className={styles.middle_info_text_worker}>António Silva</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.bottom_flex}>
                        <div className={styles.money}>
                            <span className={styles.money_label}></span>
                            <span className={styles.money_value}></span>
                        </div>
                        <div className={styles.details}>
                            {/* TODO */}
                        </div>
                    </div>
                    <div>
                        <span className={styles.bottom_por_confirmar_text}>
                            {
                                type===1?
                                    "Feliz com o dia e horário proposto?"
                                :"Pedido de reserva a ser processado"
                            }
                            </span>
                    </div>
                    <div className={type===0?styles.bottom_button_disabled:styles.bottom_button} style={{backgroundColor:typeColor}}>
                        <span className={styles.button_text}>{
                            type===1?
                                "Confirmar Reserva"
                                :"PENDENTE"
                        }</span>
                    </div>
                    {/* <div className={styles.button_cancel_area_bottom}>
                        <span className={styles.button_cancel_bottom}>Cancelar Reserva</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Reserva