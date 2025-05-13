import React, {useEffect, useState} from 'react'
import styles from './landing.module.css'
import { useNavigate } from 'react-router-dom'
import {CSSTransition}  from 'react-transition-group';
import Welcome from './welcome'

const Landing = (props) => {

    const navigate = useNavigate()

    const [showWelcomeTrigger, setShowWelcomeTrigger] = useState(false)
    const [showWelcomeTrigger1000, setShowWelcomeTrigger1000] = useState(false)
    const [showWelcomeTrigger2000, setShowWelcomeTrigger2000] = useState(false)

    useEffect(() => {
        setShowWelcomeTrigger(true)
        setShowWelcomeTrigger1000(true)
    }, [])

    const showWelcomeHandler = () => {
        localStorage.setItem('firstAccessMade', 1)
        navigate('/')
    }

    return (
        <div className={styles.landing}>
            <CSSTransition
                in={showWelcomeTrigger}
                onEntered={() => {
                    setTimeout(() => {
                        showWelcomeHandler()
                    }, 2500);
                }}
                timeout={1000}
                classNames="fade"
                unmountOnExit
                >
                <Welcome showWelcomeTrigger1000={showWelcomeTrigger1000} showWelcomeTrigger2000={showWelcomeTrigger2000} closeWelcome={() => showWelcomeHandler()}/>
            </CSSTransition>
        </div>
    )
}

export default Landing