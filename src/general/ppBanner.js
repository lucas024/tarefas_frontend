import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import {CSSTransition}  from 'react-transition-group';
import Pp from './pp';


const PpBanner = (props) => {

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
                <span className={styles.value_brand}>Política de Privacidade</span>
                <div className={styles.divider}/>
                <div className={styles.tos_wrapper}>
                    <Pp />
                </div>


                <div className={styles.cancel_wrapper}>
                    <span className={styles.cancel} onClick={() => props.cancel()}>fechar</span>
                </div>
            </div>
            </CSSTransition>
        </div>
    )
}

export default PpBanner