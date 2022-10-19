import React, { useState, useEffect } from 'react'
import styles from './carta.module.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import {regioesOptions, profissoesOptions} from '../general/util'

const Carta = (props) => {
    
    const [worker, setWorker] = useState(null)

    useEffect(() => {
        if(props.worker!==null){
            setWorker(props.worker)
        } 
    }, [props.worker])

    const displayRegioesExtense = () => {
        let arrRegioes = [...worker.regioes]
        if(props.locationActive){
            if(arrRegioes.includes(props.locationActive)){
                arrRegioes.splice(arrRegioes.indexOf(props.locationActive), 1)
                arrRegioes = [props.locationActive, ...arrRegioes]
            }
        }
        return arrRegioes.map((val, i) => {
            return (
                <span key={i} className={props.locationActive===val?styles.options_selected:styles.options}> {regioesOptions[val]}<span>{i+1<worker.regioes.length?",":null}</span></span>
            )
        })
    }

    const displayTrabalhosExtense = () => {
        let arrTrabalhos = [...worker.trabalhos]
        if(props.workerActive){
            if(arrTrabalhos.includes(props.workerActive)){
                arrTrabalhos.splice(arrTrabalhos.indexOf(props.workerActive), 1)
                arrTrabalhos = [props.workerActive, ...arrTrabalhos]
            }
        }
        return arrTrabalhos.map((val, i) => {
            return (
                <span key={i} className={props.workerActive===val?styles.options_selected:styles.options}> {profissoesOptions[val]}<span>{i+1<worker.trabalhos.length?",":null}</span></span>
            )
        })
    }

    return(
        <div className={styles.box} style={{border:props.worker._id===props.user._id?"3px solid #FF785A":""}}>
            <div className={styles.box_mask}>
                {
                worker?
                <div className={styles.top_flex}>
                    <img className={styles.worker_img} 
                        src={worker.img!==""?worker.photoUrl:""}/>
                    <div className={styles.worker_info_div}>
                        <span className={styles.worker_info_name}>{worker.name}</span>
                        <span className={styles.worker_info_type}>
                            {
                                worker?.entity?
                                <span>Empresa <span style={{textTransform:"capitalize", color:"black"}}>{worker.entity_name}</span></span>
                                :
                                'Particular'
                            }
                            
                        </span>
                    </div>
                </div>
                :null
                }
                <div className={styles.middle}>
                    <span className={styles.middle_desc}>
                        {worker?.description}
                    </span>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.bottom_div}>
                        <LocationOnIcon className={styles.bottom_div_icon} style={{color:worker?.regioes.includes(props.locationActive)?"#FF785A":"#71848d"}}/>
                        <div className={styles.bottom_div_text}>
                            {worker&&displayRegioesExtense()}
                        </div>
                    </div>
                    <div className={styles.bottom_div}>
                        <PersonIcon className={styles.bottom_div_icon} style={{color:worker?.trabalhos.includes(props.workerActive)?"#FF785A":"#71848d"}}/>
                        <div className={styles.bottom_div_text}>
                            {worker&&displayTrabalhosExtense()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carta