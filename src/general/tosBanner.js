import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import {CSSTransition}  from 'react-transition-group';
import Tos from './tos';

const TosBanner = (props) => {

    const [transition, setTransition] = useState(false)

    useEffect(() => {
        setTransition(true)

        return () => {
            setTransition(false)
        }
    }, [])


    return (
        <div className={styles.banner} onClick={() => props.cancel()}>
            <CSSTransition 
                    in={transition}
                    timeout={1200}
                    classNames="banner"
                    unmountOnExit
                    >
            <div className={styles.popup}  onClick={e => e.stopPropagation()}>
                <span className={styles.value_brand}>Termos de utilização</span>
                <div className={styles.divider}/>
                <div className={styles.tos_wrapper}>
                    <Tos />
                </div>


                <span className={styles.cancel} onClick={() => props.cancel()}>fechar</span>
            </div>
            </CSSTransition>
        </div>
    )
}

export default TosBanner