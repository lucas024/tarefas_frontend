import React, { useState } from 'react'
import styles from './worker.module.css'
import StarRateIcon from '@mui/icons-material/StarRate';
import yellow from "@material-ui/core/colors/yellow";
import Schedule from './schedule';


const Worker = () => {

    const [currentArea, updateCurrentArea] = useState(0)

    const displayCurrentArea = () => {
        return <Schedule/>
    }

    const worker = {
        _id: "620a9935dd773b6c652adf99",
        name: {first: "Lucas", last: "620a9935dd773b6c652adf99"},
        img: "https://firebasestorage.googleapis.com/v0/b/hustle-292f2.appspot.com/o/IMG_1538.jpg?alt=media&token=e4014301-2e1a-4347-b7d9-bf76b840f9c8",
        rating: 4,
        description: "Trato de coisas da casa"
    }

    return (
        <div className={styles.worker}>
            <div className={styles.flex}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <div className={styles.right_top}>
                        <div className={styles.top_flex}>
                            <div className={styles.worker_data_flex}>
                                <img src={worker.img?worker.img:"trabalhador"} className={styles.worker_img}/>
                                <div className={styles.worker_personal_flex_column}>
                                    <span className={styles.name}>{`${worker.name.first} ${worker.name.first}`}</span>
                                    <div className={styles.rating_div}>
                                        <StarRateIcon
                                            className={styles.star}
                                            sx={{fontSize: 10, color:yellow[500]}}/>
                                        <span className={styles.rating}>{parseFloat(worker.rating).toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.worker_desc_div}>
                                <span className={styles.worker_desc}>
                                    {worker.description}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.worker_area}>
                        <div className={styles.area_tabs_div}>
                            <span 
                                onClick={() => updateCurrentArea(0)}
                                className={currentArea===0?
                                            styles.selectedTab:
                                            styles.tab}>Calendário</span>
                            <span onClick={() => updateCurrentArea(1)}
                                className={currentArea===1?
                                            styles.selectedTab:
                                            styles.tab}>Trabalhos</span>
                            <span onClick={() => updateCurrentArea(2)}
                                className={currentArea===2?
                                            styles.selectedTab:
                                            styles.tab}>Dados pessoais</span>
                        </div>
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