import React, {useState, useEffect} from 'react'
import {CSSTransition}  from 'react-transition-group';
import styles from './popup.module.css'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CircleIcon from '@mui/icons-material/Circle';

const Popup_detalhes = (props) => {

    const [transition, setTransition] = useState(false)

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])

    return (
        <div className={styles.popup_backdrop} onClick={() => props.cancelHandler()}>
            <CSSTransition 
                in={transition}
                timeout={600}
                classNames="transition"
                unmountOnExit
                >
                <div className={styles.popup}>
                    <span className={styles.value}>Detalhes</span>
                    <div className={styles.divider} style={{borderColor:"#1EACAA"}}></div>
                    <div className={styles.list_item}>
                        <div className={styles.list_item_left}>
                            <CircleIcon className={styles.list_item_circle}/>
                            <span className={styles.list_item_desc}>Mão-de-obra eletricista</span>
                        </div>
                        <div className={styles.list_item_right}>
                            <span className={styles.list_item_value}>12.00</span>
                        </div>
                    </div>
                    <div className={styles.list_item}>
                        <div className={styles.list_item_left}>
                            <span className={styles.list_item_number}>x3</span>
                            <span className={styles.list_item_desc}>Parafusos</span>
                        </div>
                        <div className={styles.list_item_right}>
                            <span className={styles.list_item_value}>12.00</span>
                        </div>
                    </div>

                    <div className={styles.divider} style={{borderTop:"2px dashed white"}}></div>
                    <div className={styles.line}>
                        <span className={styles.line_total}>Total: <span className={styles.line_total_val}>24.00€</span></span>
                    </div>
                
                    <span className={styles.confirm_button_pagar} onClick={() => props.cancelHandler()}>
                        OK
                    </span>
                    {/* <span className={styles.cancel_text} onClick={() => props.cancelHandler()}>Falar com Suporte</span> */}
                    <span className={styles.confirm_button_support}>
                        <span>Falar com Suporte</span>
                        <SupportAgentIcon className={styles.support}/>
                    </span>
                </div>
            </CSSTransition>
        </div>
    )
}

export default Popup_detalhes