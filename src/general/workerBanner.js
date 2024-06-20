import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import {CSSTransition}  from 'react-transition-group';
import WorkerBannerContent from './workerBannerContent';

const WorkerBanner = props => {

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
                <div className={styles.popup} onClick={e => e.stopPropagation()}>
                    <WorkerBannerContent confirm={() => props.confirm()} authPage={props.authPage} registerPage={props.registerPage} cancel={() => props.cancel()}/>
                </div>
            </CSSTransition>
        </div>
    )
}

export default WorkerBanner