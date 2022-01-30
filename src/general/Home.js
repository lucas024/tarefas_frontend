import React, { useEffect } from 'react'
import styles from './home.module.css'

const Home = () => {
        
    useEffect(() => {
        
    });
    
    return(
        <div className={styles.home}>
            <div className='wid-main'>
                <div className='row content'>
                    <div className={styles.home_back}>
                        <p className={styles.home_title}>As minhas publicacoes</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;