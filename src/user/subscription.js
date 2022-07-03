import React from 'react'
import styles from './subscription.module.css'


const Subscription = props => {
    return (
        <div className={styles.subscription}>
            <div className={styles.subscription_title}>
                <span className={styles.top_title}>Subscrição</span>
            </div>
            <div className={styles.mid}>
                <div className={styles.display}>
                    <div className={styles.display_user}>
                        <img className={styles.user_img}/>
                        <div className={styles.user_top_flex}>
                            <span className={styles.user_name}></span>
                            <span className={styles.user_desc}>Trabalhador</span>
                        </div>
                    </div>
                    <div className={styles.display_sub}>
                        <span className={styles.sub_pre}></span>
                        <span className={styles.sub_val_date}></span>
                    </div>
                </div>
                <div className={styles.details}>
                    <span className={styles.details_title}>Detalhes de Pagamento</span>
                </div>
            </div>

            
        </div>
    )
}

export default Subscription