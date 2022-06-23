import React, { useState, useEffect } from 'react'
import styles from './carta.module.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

const Carta = (props) => {
    
    const [worker, setWorker] = useState(null)
    const [availPoints, setAvailPoints] = useState(50)
    const [availColor, setAvailColor] = useState('')

    useEffect(() => {
        if(props.worker!==null){
            setWorker(props.worker)
        } 
    }, [props.worker])

    const starColorStyle = (rating) => {
        return ({
                color: rating<2.5?"red"
                :rating<3.5?"orange"
                :"yellow",
                fontSize: 20
        })
    }

    useEffect(() => {
        if(availPoints > 30){
            setAvailColor("#FF785A")
        }
        else if(availPoints > 15){
            setAvailColor("#BA8376")
        }
        else{
            setAvailColor("#d50000")
        }
    }, [availPoints])

    return(
        <div className={styles.box}
           >
            <div className={styles.box_mask}>
                {
                worker?
                <div className={styles.top_flex}>
                    <img className={styles.worker_img} 
                        src={worker.img!==""?worker.img:""}/>
                    <div className={styles.worker_info_div}>
                        <span className={styles.worker_info_name}>{worker.name.first} {worker.name.first}</span>
                        <span className={styles.worker_info_type}>
                            Particular
                        </span>
                    </div>
                </div>
                :null
                }
                <div className={styles.middle}>
                    <span className={styles.middle_desc}>
                        asdwoqkd sadqwokdosakd sadokasodkowqdsad kasdasdpwqdosap daspdoqpwoesad Sdasdasd
                    </span>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.bottom_div}>
                        <LocationOnIcon className={styles.bottom_div_icon} style={{color:props.locationActive?"#FF785A":"#71848d"}}/>
                        <span className={styles.bottom_div_text}>Lisboa, Setúbal</span>
                    </div>
                    <div className={styles.bottom_div}>
                        <PersonIcon className={styles.bottom_div_icon} style={{color:props.workerActive?"#FF785A":"#71848d"}}/>
                        <span className={styles.bottom_div_text}>Eletricista, Carpinteiro, Jardins</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carta