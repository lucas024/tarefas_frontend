import React, { useState } from 'react'
import styles from './worker.module.css'
import Schedule from './schedule';
import ListW from './list';
import WorkerSidebar from './workerSidebar';
import { useSearchParams } from 'react-router-dom';
import Dados from './dados';

const Worker = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const displayCurrentArea = () => {
        let val = Object.fromEntries([...searchParams]).t
        if(val === "trabalhos")
            return <ListW/>
        else if(val === "calendario")
            return <Schedule/>
        else if(val === "dados")
            return <Dados worker={worker}/>
        else return <Schedule/>

    }
    

    const worker = {
        _id: "620a9935dd773b6c652adf99",
        name: {first: "Lucas", last: "620a9935dd773b6c652adf99"},
        img: "https://firebasestorage.googleapis.com/v0/b/hustle-292f2.appspot.com/o/IMG_1538.jpg?alt=media&token=e4014301-2e1a-4347-b7d9-bf76b840f9c8",
        rating: 4,
        description: "Trato de coisas da casa",
        email: "lucas.a.perry98@gmail.com",
        number: "915072070",
        IBAN: "PT50 3746 0000 2837 4885 4652 1"
    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <WorkerSidebar worker={worker} />
                </div>
                <div className={styles.right}>
                    <div className={styles.worker_area}>
                        <div className={styles.area}>
                            {displayCurrentArea()}
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    )
}

export default Worker