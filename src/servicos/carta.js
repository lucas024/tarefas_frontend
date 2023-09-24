import React, { useState, useEffect } from 'react'
import styles from './carta.module.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import {regioesOptions, profissoesOptions, profissoesPngs} from '../general/util'

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
                <span key={i} className={props.locationActive===val?styles.options_selected:styles.options}> {regioesOptions[val]}<span style={{color:"#71848d"}}>{i+1<worker.regioes.length?" |":null}</span></span>
            )
        })
    }

    const displayTrabalhosExtense = () => {
        let arrTrabalhos = [...worker.trabalhos]
        arrTrabalhos.sort(function(a, b){
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        })
        return arrTrabalhos.map((val, i) => {
            return (
                <span key={i} className={props.workerActive===val?styles.options_selected:styles.options}> {profissoesOptions[val]}<span style={{color:"#71848d"}}>{i+1<worker.trabalhos.length?" |":null}</span></span>
            )
        })
    }

    const displayTrabalhosImages = () => {
        let arrTrabalhos = [...worker.trabalhos]
        arrTrabalhos.sort(function(a, b){
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        })
        return arrTrabalhos.map((val, i) => {
            return (
                <div key={i} className={props.workerActive===val?styles.top_image_div_selected:styles.top_image_div} 
                        style={{marginLeft:i!==0?'5px':'0px'}}>
                    <img className={styles.top_image} src={profissoesPngs[val]}/>
                </div>
                
            )
        })
    }

    return(
        <div className={styles.box} style={{border:props.worker?._id===props.user?._id?"3px solid #FF785A":""}}>
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
                                <div>
                                    <p>Empresa</p>
                                    <p style={{textTransform:"capitalize", color:"black"}}>{worker.entity_name}</p>
                                </div>
                                
                                :
                                'Particular'
                            }
                            
                        </span>
                    </div>
                    <div style={{marginLeft:'20px'}}>
                        <div className={styles.middle}>
                            <div className={styles.middle_images}>
                                <div className={styles.middle_images_background}>
                                    {worker&&displayTrabalhosImages()}
                                </div>
                            </div>
                        </div>
                        <span className={styles.top_desc}>
                            {worker?.description}
                        </span>
                    </div>
                </div>
                :null
                }
                <div className={styles.bottom}>
                    <div className={styles.bottom_div}>
                        <BuildIcon className={styles.bottom_div_icon} style={{color:worker?.trabalhos.includes(props.workerActive)?"#FF785A":"#71848d"}}/>
                        <div className={styles.bottom_div_text}>
                            {worker&&displayTrabalhosExtense()}
                        </div>
                    </div>
                    <div className={styles.bottom_div}>
                        <LocationOnIcon className={styles.bottom_div_icon} style={{color:worker?.regioes.includes(props.locationActive)?"#FF785A":"#71848d"}}/>
                        <div className={styles.bottom_div_text}>
                            {worker&&displayRegioesExtense()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carta