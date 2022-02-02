import React, { useEffect } from 'react'
import styles from './home.module.css'
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import {useNavigate} from 'react-router-dom'

const Home = () => {
        
    useEffect(() => {
        
    })

    const navigate = useNavigate()
    
    return(
        <div className={styles.home}>
            <div className={styles.home_back}>
                <div className={styles.section_elet} onClick={() => navigate('/servicos/eletricistas')}>
                    <a className={styles.link}>
                        <p className={styles.section_title}>
                            ELETRICISTA
                        </p>
                    </a>
                    
                    <img className={styles.section_img} src={elec}/>
                </div>
                <div className={styles.section_cana} onClick={() => navigate('/servicos/canalizadores')}>
                    <a className={styles.link}>
                        <p className={styles.section_title}>
                            CANALIZADOR
                        </p>
                    </a>
                    <img className={styles.section_img} src={cana}/>
                </div>
                <div className={styles.section_carp} onClick={() => navigate('/servicos/carpinteiros')}>
                    <a className={styles.link}>
                    <p className={styles.section_title}>
                        CARPINTEIRO
                    </p>
                    </a>
                    <img className={styles.section_img} src={carp}/>
                </div>
            </div>
            <div className={styles.tag}>
                <p className={styles.tag_text}>
                    Do que precisas hoje?
                </p>
            </div>
        </div>
    )
}

export default Home;