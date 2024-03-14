import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {regioes, profissoes, regioesOptions, profissoesOptions} from '../general/util'
import SelectWorker from '../selects/selectWorker';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const AuthCarouselWorker = props => {

    const getCheckedProf = trab => {
        if(props.selectedProf?.includes(trab)) return true
        return false
    }

    const setCheckedProf = trab => {
        let arr = [...props.selectedProf]
        if(props.selectedProf.includes(trab)){
            arr.splice(arr.indexOf(trab), 1) 
        }
        else{
            arr.push(trab)
        }
        props.updateSelectedProfessions(arr)
    }
    
    const getCheckedReg = trab => {
        if(props.selectedReg?.includes(trab)) return true
        return false
    }

    const setCheckedReg = trab => {
        let arr = [...props.selectedReg]
        if(props.selectedReg.includes(trab)){
            arr.splice(arr.indexOf(trab), 1) 
        }
        else{
            arr.push(trab)
        }
        props.updateSelectedRegions(arr)
    }

    const mapTrabalhos = () => {
        return profissoes.map((trab, i) => {
            return (
                <div key={i} className={styles.container} onClick={() => setCheckedProf(trab.value)}>
                    <div className={styles.container_flex}>
                        <input type="checkbox" readOnly checked={getCheckedProf(trab.value)}/>
                        <span className={styles.checkmark}></span>
                        <div className={styles.checkbox_flex}>
                            <img src={trab.img} className={styles.checkbox_image}/>
                            <span className={styles.checkbox_text}>{trab.label}</span>
                        </div>
                        
                    </div>
                </div>
            )
        })
    }

    const mapRegioes = () => {
        return regioes.map((reg, i) => {
            return (
                <div key={i} className={styles.container} onClick={() => setCheckedReg(reg.value)}>
                    <div className={styles.container_flex}>
                        <input type="checkbox" readOnly checked={getCheckedReg(reg.value)}/>
                        <span className={styles.checkmark}></span>
                        <div className={styles.checkbox_flex}>
                            <span className={styles.checkbox_text}>{reg.label}</span>
                        </div>
                        
                    </div>
                </div>
            )
        })
    }

    const mapTrabalhosList = () => {
        if(props.selectedProf)
        {
            let arrTrabalhos = [...props.selectedProf]
            arrTrabalhos.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
            return arrTrabalhos.map((val, i) => {
                return (
                    <div key={i} className={styles.list_el_wrapper}>
                        <span className={styles.list_el}>{profissoesOptions[val]}</span>
                    </div>
                )
            })
        }
        
    }

    const mapRegioesList = () => {
        if(props.selectedReg)
        {
            let arrRegioes = [...props.selectedReg]
            arrRegioes.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
            return arrRegioes.map((val, i) => {
                return (
                    <div key={i} className={styles.list_el_wrapper}>
                        <span className={styles.list_el}>{regioesOptions[val]}</span>
                    </div>
                )
            })
        }
    }
    

    return (
        <Carousel 
            swipeable={false}
            showArrows={false} 
            showStatus={false} 
            showIndicators={false} 
            showThumbs={false}
            selectedItem={props.registarTab-3}>
            <div className={styles.login}>
                <p className={styles.register_title}>Particular ou Empresa</p>
                <div className={styles.radio_div}>
                    <SelectWorker 
                        editBottom={true} 
                        worker_type={props.selectedType}
                        worker={true}
                        changeType={val => {
                            props.updateSelectedType(val)
                            props.updateEntityName('')
                        }}/>
                    {
                        props.selectedType===1?
                        <div 
                            className={styles.input_div_wrapper_editable} 
                            style={{borderColor:props.entityNameWrong&&props.entityName.length<=1?'#161F28':'#FF785A', borderColor:props.entityNameWrong||props.entityName.length<=1?'#161F28':'#FF785A'}}>
                            <div className={styles.input_icon_div}>
                                {
                                    props.entityNameWrong||props.entityName.length<=1?
                                    <AccountBalanceOutlinedIcon className={styles.input_icon} style={{color:'#161F28'}}/>
                                    :
                                    <AccountBalanceIcon className={styles.input_icon} style={{color:'#161F28'}}/>
                                }
                            </div>
                            <span className={styles.input_icon_seperator} style={{backgroundColor:props.entityNameWrong||props.entityName.length<=1?'#161F28':'#FF785A'}}>.</span>
                            <input className={styles.input_input}
                                    value={props.entityName}
                                    onChange={e => props.updateEntityName(e.target.value)}>
                            </input>
                        </div>
                        :
                        null
                    }
                </div>
            </div>

            <div className={styles.login}>
                <p className={styles.register_title}>As tarefas que excerce</p>
                <span className={styles.selected_number}>({props.selectedProf.length}/9)</span>
                <div className={styles.map_div}>
                    {mapTrabalhos()}
                </div>
            </div>

            <div className={styles.login}>
                <p className={styles.register_title}>Os distritos ou regiões onde trabalha</p>
                <span className={styles.selected_number}>({props.selectedReg.length}/18)</span>
                <div className={styles.map_div}>
                    {mapRegioes()}
                </div>
            </div>
            <div className={styles.login}>
                <span className={styles.area_bot_intro_wrapper}>
                    <AccountBalanceIcon className={styles.area_bot_intro_icon}/>
                    {
                        props.selectedType===0?
                        <span className={styles.area_bot_intro_strong_two}>Particular</span>
                        :
                        <div>
                            <span className={styles.area_bot_intro_strong_two}>Empresa - {props.entityName}</span>
                        </div>
                    }
                </span>

                <div className={styles.bottom}>
                    <div className={styles.bottom_wrapper}>
                        <span className={styles.bottom_title}>Tarefas</span>
                        <div className={styles.list}>
                            {mapTrabalhosList()}
                        </div>
                    </div>
                    <span className={styles.bottom_divider}></span>
                    <div className={styles.bottom_wrapper}>
                        <span className={styles.bottom_title}>Regiões</span>
                        <div className={styles.list}>
                            {mapRegioesList()}
                        </div>
                    </div>
                </div>
            </div>
        </Carousel>
    )
}

export default AuthCarouselWorker