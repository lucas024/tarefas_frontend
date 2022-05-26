import React, {useEffect} from 'react'
import styles from './reserva.module.css'
import no_pic from '../assets/user.png'
import ClearIcon from '@mui/icons-material/Clear';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PinDropIcon from '@mui/icons-material/PinDrop';
const Reserva = (props) => {


    return (
        <div className={styles.reserva}>
            <p className={styles.top_title}>Reserva</p>
            <div className={styles.reserva_top}>
                <img className={styles.top_img} src={props.user&&props.user.photoUrl?props.user.photoUrl:no_pic}></img>
                <div className={styles.top_text}>
                    <span className={styles.text_name}>António Silva</span>
                    <span className={styles.text_desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut nulla ultrices, finibus leo eu, placerat tortor. Nunc diam eros, vestibulum molestie leo in, viverra lacinia sem. Donec nec eros condimentum, eleifend quam sed, imperdiet sem. Morbi iaculis nunc felis. Ut sed laoreet enim, vel viverra sapien. Sed ex sapien.</span>
                </div>
            </div>

            <div className={styles.middle}>
                <div className={styles.middle_button_div}>
                    <p className={styles.middle_title}></p>
                    <div className={styles.button_area}>
                        <div className={styles.button_proceed}>
                            <span className={styles.button_proceed_text}>
                                Por Confirmar
                            </span>
                        </div>
                        {/* <span className={styles.button_cancel_area}>
                            <ClearIcon className={styles.button_cancel}/>
                        </span> */}
                    </div>
                    
                </div>
                <div className={styles.middle_main}>
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
                        <span className={styles.middle_aux_text}>Detalhes da reserva</span>
                        <div className={styles.middle_info_zone}>
                            {/* <div className={styles.middle_desc}>
                                <span className={styles.desc} disable={true}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut nulla ultrices, finibus leo eu, placerat tortor. Nunc diam eros, vestibulum molestie leo in, viverra lacinia sem. Donec nec eros condimentum, eleifend quam sed, imperdiet sem. Morbi iaculis nunc felis. Ut sed laoreet enim, vel viverra sapien. Sed ex sapien.</span>
                            </div> */}
                            <div className={styles.middle_info_flex} style={{paddingTop:"15px"}}>
                                <EngineeringIcon className={styles.middle_aux_symbol}/>
                                <span className={styles.middle_info_text}>António Silva</span>
                            </div>
                            <div className={styles.middle_info_divider}></div>
                            <div className={styles.middle_info_flex}>
                                <PinDropIcon className={styles.middle_aux_symbol}/>
                                <span className={styles.middle_info_text}>R. Conselheiro Jose Silvestre Ribeiro</span>
                            </div>
                            <div className={styles.middle_location}>
                                {/* TODO */}
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
                    <div className={styles.bottom_button}>
                        <span className={styles.button_text}></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reserva