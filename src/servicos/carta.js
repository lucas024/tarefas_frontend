import React, { useState, useEffect } from 'react'
import styles from './carta.module.css'
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'
import StarRateIcon from '@mui/icons-material/StarRate';
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import yellow from "@material-ui/core/colors/yellow";

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
                color: rating<2.5?red[800]
                :rating<3.5?orange[600]
                :yellow[500],
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
        <div className={styles.box} style={{borderBottom:`3px solid ${availColor}`}}
           >
            <div className={styles.box_mask}>
                {
                worker?
                <div className={styles.top_flex}>
                    <img className={styles.worker_img} 
                        src={worker.img!==""?worker.img:props.id==="eletricistas"?elec
                        :props.id==="canalizadores"?cana
                        :carp}/>
                    <div className={styles.worker_info_div}>
                        <span className={styles.worker_info_name}>{worker.name.first} {worker.name.first}</span>
                        <span className={styles.worker_info_flex}>
                            <StarRateIcon className={styles.worker_info_star} sx={starColorStyle(worker.rating)}/> 
                            <span className={styles.worker_info_rating_div}>
                                <span className={styles.worker_info_rating}>{parseFloat(worker.rating).toFixed(1)}</span>
                            </span>
                        </span>
                    </div>
                </div>
                :null
                }
                <div className={styles.avail}>
                    <span className={styles.avail_info}>
                        <span style={{fontWeight:600, color:availColor}}>
                            {
                                availPoints>40?"Alta ":
                                availPoints>25?"Media ":
                                "Baixa "
                            }
                        </span> 
                        disponibilidade
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Carta