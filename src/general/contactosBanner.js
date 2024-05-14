import React, {useEffect, useState} from 'react'
import styles from './workerBanner.module.css'
import {CSSTransition}  from 'react-transition-group';
import MailIcon from '@mui/icons-material/Mail';
import InstagramIcon from '@mui/icons-material/Instagram';

const ContactosBanner = (props) => {

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
                <span className={styles.value_brand}>Contactos</span>
                <div className={styles.divider}/>

                <p className={styles.contact_text_top}>Se tiveres alguma dúvida sobre a utilização do site, podes entrar em contacto conosco através do chat de Suporte, na tua área pessoal.</p>

                <p className={styles.contact_text_top} style={{marginBottom:'5px', marginTop:'15px'}}>Para outros assuntos:</p>
                <span className={styles.contact_title}>E-mail</span>
                <div className={styles.contact_center}>
                    <MailIcon className={styles.contact_icon}/>
                    <span className={styles.contact_text}>pt.tarefas@gmail.com</span>
                </div>
                <span className={styles.contact_title} style={{marginTop:'20px'}}>Instagram</span>
                <div className={styles.contact_center}>
                    <InstagramIcon className={styles.contact_icon}/>
                    <span className={styles.contact_text}>tarefaspt</span>
                </div>
                
                <span className={styles.cancel} style={{marginTop:'30px'}} onClick={() => props.cancel()}>fechar</span>
            </div>
            </CSSTransition>
        </div>
    )
}

export default ContactosBanner