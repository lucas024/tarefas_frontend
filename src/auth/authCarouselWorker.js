import React, { useEffect, useState } from 'react'
import styles from './auth.module.css'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {regioes, profissoesGrouped, regioesOptions, profissoesMap} from '../general/util'
import styles_personal from '../user/personal.module.css'
import SelectWorker from '../selects/selectWorker';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const AuthCarouselWorker = props => {
    
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

    
    const mapSelected = (list, type) => {
        if(list?.length>0)
            return list?.map((el, i) => {
                return (
                    <p key={i} className={styles_personal.map_label} onClick={() => props.setCheckedProf(el)}>{profissoesMap[el]?.label}</p>
                    
                )
            })

        return (
            <p className={styles_personal.map_label_no} style={{fontWeight:'500'}}>{type==='jobs'?'Sem serviços selecionados':'Sem regiões ou distritos selecionados'}</p>
        )
    }

    // const subMapTrabalhos = options => {
    //     return options?.map((trab, i) => {
    //         return (
    //             listValue.length===0||trab.value.toLowerCase().includes(listValue.toLowerCase())?
    //             <div key={i} style={{cursor:!fullList?"pointer":"default"}} className={`${styles.container} ${styles.subcontainer}`} onClick={() => {
    //                 setCheckedProf(trab.value)
    //                 setListValue('')
    //             }}>
    //                 <input type="checkbox" readOnly checked={getCheckedProf(trab.value)}/>
    //                 <span className={styles.checkmark}></span>
    //                 <div className={styles.checkbox_flex}>
    //                     <img src={trab.img} className={styles.checkbox_image}/>
    //                     <span className={styles.checkbox_text}>{trab.label}</span>
    //                 </div>
    //             </div>
    //             :null
    //         )
            
    //     })
    // }

    // const mapTrabalhos = () => {
    //     return profissoesGrouped?.map((trab, i) => {
    //         return (
    //             trab.label==='no-label'?
    //                 listValue.length===0||trab.options[0].value.toLowerCase().includes(listValue.toLowerCase())?
    //                 <div key={i} style={{cursor:!fullList?"pointer":"default"}} className={styles.container} onClick={() => {
    //                     setCheckedProf(trab.options[0].value)
    //                     setListValue('')}}>
    //                     <input type="checkbox" readOnly checked={getCheckedProf(trab.options[0].value)}/>
    //                     <span className={styles.checkmark}></span>
    //                     <div className={styles.checkbox_flex}>
    //                         <img src={trab.options[0].img} className={styles.checkbox_image}/>
    //                         <span className={styles.checkbox_text}>{trab.options[0].label}</span>
    //                     </div>
    //                 </div>
    //                 :null
    //             :
    //             <div className={styles.checkbox_submap}>
    //                 {
    //                     checkExistsInSearch(trab.options)?
    //                     <div className={styles.checkbox_flex} style={{marginBottom:'10px'}}>
    //                         <img src={trab.img} className={styles.checkbox_image} style={{marginLeft:0}}/>
    //                         <span className={styles.checkbox_submap}>{trab.label}</span>
    //                     </div>
    //                     :null
    //                 }
                    
    //                 <div>
    //                     {subMapTrabalhos(trab.options)}
    //                 </div>
                    
    //             </div>
                
    //         )
    //     })
    // }

    const mapRegioes = () => {
        return regioes.map((reg, i) => {
            return (
                <div key={i} className={styles.container} style={{borderBottom:reg.value==='online'?'1px dashed #ccc':'none', paddingBottom:reg.value==='online'?'10px':'none'}} onClick={() => setCheckedReg(reg.value)}>
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
                        <span className={styles.list_el}>{profissoesMap[val]?.label}</span>
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
            selectedItem={props.registarTab-4}>
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
                <p className={styles.register_title}>Os serviços em que trabalhas</p>
                <span className={styles.selected_number}>({props.selectedProf.length}/9)</span>

                <div className={styles_personal.area_left_map} style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    overflowY:'hidden',
                    backgroundColor:props.selectedProf?.length===0?'#a8a8a8a8':'#FF785A', 
                    border:props.selectedProf?.length===0?'4px solid #a8a8a8a8':'2px solid #FF785A80',
                    display:props.selectedProf?.length===0?'flex':'block'}}>
                    {mapSelected(props.selectedProf, 'jobs')}
                </div>
                <div onClick={() => props.setShowSelectProfs(true)} className={styles.select_yoyo}>
                    {
                        props.selectedProf?.length===0?
                        <span>Selecionar Serviços</span>
                        :
                        <span>Editar Serviços</span>
                    }
                    
                </div>
                
                
                


                {/* <div className={styles.input_wrapper_list}>
                    <input 
                        onChange={e => setListValue(e.target.value)} 
                        placeholder='Pesquisar serviços...' 
                        value={listValue} 
                        className={styles.input_list} 
                        maxLength={20}/>
                </div>
                <div className={styles.map_div}>
                    {mapTrabalhos()}
                </div> */}
            </div>

            <div className={styles.login}>
                <p className={styles.register_title}>Distritos ou regiões onde trabalhas</p>
                <span className={styles.selected_number}>({props.selectedReg.length}/21)</span>
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
                        <span className={styles.bottom_title}>Serviços</span>
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