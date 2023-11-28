import React, {useState, useEffect} from 'react'
import {CSSTransition}  from 'react-transition-group';
import styles from './popup.module.css'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CircleIcon from '@mui/icons-material/Circle';

const PopupElimination = (props) => {

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
                        <span className={styles.value} style={{color:"#FF785A"}}>Remover Publicação</span>
                        <div className={styles.divider}></div>
                        {/* <div className={styles.list_item}>
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
                        </div> */}
                        <div className={styles.center_text_div}>
                            <span className={styles.center_text}>
                                Tem a certeza de que quer <span className={styles.center_text_special} style={{fontWeight:600}}>remover</span> a publicação?
                            </span>
                        </div>
                    
                        <span className={styles.button_eliminate} onClick={() => props.confirmDeleteHandler()}>
                            remover
                        </span>
                        <span className={styles.button_cancel} onClick={() => props.cancelHandler()}>
                            Cancelar
                        </span>
                        {/* <span className={styles.confirm_button_support}>
                            <span>Falar com Suporte</span>
                            <SupportAgentIcon className={styles.support}/>
                        </span> */}
                    </div>
            </CSSTransition>
        </div>
    )
}

export default PopupElimination