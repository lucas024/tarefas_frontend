import React, { useEffect, useState } from 'react';
import styles from './servicos.module.css'
import { useParams } from 'react-router-dom';

const Servicos = () => {

    const {id} = useParams()

    const [items, setItems] = useState([])

    useEffect(() => {
        console.log(id);
        let aux = [1,2,3,4,5,6,7,1,2,3,4,5,6,7,1,2,3,4,5,
                    6,7,,5,6,7,1,2,3,4,5,6,7,1,2,3,4,5,6,
                    6,7,,5,6,7,1,2,3,4,5,6,7,1,2,3,4,5,6,]
        setItems(aux.slice(0,25))
    }, [])

    const mapBoxesToDisplay = () => {
        return items.map((val, i) => {
            return(
                <div key={i} className={styles.box_case}>
                    <div className={styles.box}>
                        {val}
                        {i}
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={styles.servicos}>
            <div className={styles.flex}>
                <div className={styles.flex_left}>
                    <div className={styles[`left_${id}`]}>

                    </div>
                </div>
                <div className={styles.flex_right}>
                    <div className={styles.top}>
                        <div className={styles[`top_${id}`]}>
                        </div>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.grid}>
                            {mapBoxesToDisplay()}
                            {items.length>20?
                                <div className={styles.num}>
                                    <div className={styles.num_flex}>
                                        <p>2</p>
                                    </div>
                                    
                                </div>
                                :
                                null
                            }
                        </div>
                        
                        
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Servicos;
