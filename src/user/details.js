import React, {useState, useEffect, useRef} from 'react'
import styles from './personal.module.css'
import { useSelector, useDispatch } from 'react-redux'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import HandymanIcon from '@mui/icons-material/Handyman';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import {regioes, profissoesMap, profissoesGrouped, regioesOptions} from '../general/util'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import axios from 'axios';
import Loader from '../general/loader';
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';
import SelectWorker from '../selects/selectWorker';
import { user_update_field, worker_update_profile_complete } from '../store';
import SelectHome from '../selects/selectHome';


const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
}

const Details = props => {
    const dispatch = useDispatch()
    
    const shakeError = useRef(null)

    const api_url = useSelector(state => {return state.api_url})
    const user_email_verified = useSelector(state => {return state.user_email_verified})
    const user_phone_verified = useSelector(state => {return state.user_phone_verified})
    const worker_is_subscribed = useSelector(state => {return state.worker_is_subscribed})
    const user = useSelector(state => {return state.user})

    const [displayTop, setDisplayTop] = useState(false)

    const [radioSelected, setRadioSelected] = useState(0)
    const [entityName, setEntityName] = useState("")
    const [entityWrong, setEntityWrong] = useState(false)
    const [loadingBottom, setLoadingBottom] = useState(false)
    const [bottomPop, setBottomPop] = useState(false)
    const [listValue, setListValue] = useState('')
    const [shakeTarefas, setShakeTarefas] = useState(false)
    const [fullList, setFullList] = useState(false)
    const [editBottom, setEditBottom] = useState(false)
    const [selectedProf, setSelectedProf] = useState([])
    const [selectedReg, setSelectedReg] = useState([])
    const [shake, setShake] = useState(false)

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        function handleResize() {
          setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, [])

    useEffect(() => {
        if(user){
            if(!user_email_verified||!user_phone_verified||user.regioes?.length===0||user.trabalhos?.length===0||!user.regioes||!user.trabalhos)
            {
                setDisplayTop(true)
            }

            setSelectedProf(user.trabalhos)
            setSelectedReg(user.regioes)
            if(user.entity!==undefined) {
                setRadioSelected(user.entity)
                setEntityName(user.entity_name)
            }
            else{
                setEntityWrong(true)
            }
            if(user.regioes?.length===0||user.trabalhos?.length===0){
                setEditBottom(true)
                setListValue('')
            }
        }
    }, [user])

    useEffect(() => {
        if(entityName.length>1){
            setEntityWrong(false)
        }
    }, [entityName])

    const getCheckedProf = trab => {
        if(selectedProf?.includes(trab)) return true
        return false
    }
    
    const setCheckedProf = trab => {
        if(editBottom){
            let arr = selectedProf?[...selectedProf]:[]
            if(selectedProf?.includes(trab)){
                arr.splice(arr.indexOf(trab), 1) 
                setFullList(false)
            }
            else if(arr.length<=8){
                if(arr.length===8) setFullList(true)
                arr.push(trab)
            }
    
            else if(arr.length===9)
            {
                setShakeTarefas(true)
                setTimeout(() => setShakeTarefas(false), 1000)
            } 
            setSelectedProf(arr)
        }
    }

    const getCheckedReg = reg => {
        if(selectedReg?.includes(reg)) return true
        return false
    }
    
    const setCheckedReg = reg => {
        if(editBottom){
            let arr = selectedReg?[...selectedReg]:[]
            if(selectedReg?.includes(reg)){
                arr.splice(arr.indexOf(reg), 1) 
            }
            else{
                arr.push(reg)
            }
            setSelectedReg(arr)
        }
    }

    const checkExistsInSearch = options => {
        for(let el of options)
        {
            if(listValue?.length===0||el.value.toLowerCase().includes(listValue.toLowerCase()))
                return true
        }
        return false
    }

    const subMapTrabalhos = options => {
        return options?.map((trab, i) => {
            return (
                listValue?.length===0||trab.value.toLowerCase().includes(listValue.toLowerCase())?
                <div key={i} style={{cursor:(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?"pointer":"default"}} className={`${styles.container} ${styles.subcontainer}`} onClick={() => {
                    setCheckedProf(trab.value)
                    setListValue('')
                }}>
                    <input type="checkbox" readOnly checked={getCheckedProf(trab.value)}/>
                    <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkmark:styles.checkmark_disabled}></span>
                    <div style={{display:'flex', alignItems:'center'}}>
                        {/* <img src={trab.img} className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkmark_image:styles.checkmark_image_disabled}/> */}
                        <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkbox_text:styles.checkbox_text_disabled} style={{marginLeft:'30px'}}>{trab.label}</span>
                    </div>
                </div>
                :null
            )
            
        })
    }

    const mapTrabalhos = () => {
        return profissoesGrouped?.map((trab, i) => {
            return (
                trab.label==='no-label'?
                    listValue?.length===0||trab.options[0].value.toLowerCase().includes(listValue.toLowerCase())?
                    <div key={i} style={{cursor:(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?"pointer":"default"}} className={styles.container} onClick={() => {
                        setCheckedProf(trab.options[0].value)
                        setListValue('')}}>
                        <input type="checkbox" readOnly checked={getCheckedProf(trab.options[0].value)}/>
                        <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?styles.checkmark:styles.checkmark_disabled}></span>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <img src={trab.options[0].img} className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?styles.checkmark_image:styles.checkmark_image_disabled}/>
                            <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.options[0].value)?styles.checkbox_text:styles.checkbox_text_disabled}>{trab.options[0].label}</span>
                        </div>
                    </div>
                    :null
                :
                <div key={i} className={styles.checkbox_submap}>
                    {
                        checkExistsInSearch(trab.options)?
                        <div style={{display:'flex', alignItems:'center', marginBottom:'10px'}}>
                            <img src={trab.img} className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkmark_image:styles.checkmark_image_disabled} style={{marginLeft:0}}/>
                            <span className={(editBottom&&!fullList)||editBottom&&getCheckedProf(trab.value)?styles.checkbox_submap:styles.checkbox_submap_disabled}>{trab.label}</span>
                        </div>
                        :null
                    }
                    
                    <div>
                        {subMapTrabalhos(trab.options)}
                    </div>
                    
                </div>
                
            )
        })
    }

    const mapRegioes = () => {
        return regioes.map((trab, i) => {
            return (
                <div key={i} style={{cursor:editBottom?"pointer":"default", paddingLeft:"35px", borderBottom:trab.value==='online'?'1px dashed #ccc':'none', paddingBottom:trab.value==='online'?'10px':'none'}} className={styles.container} onClick={() => setCheckedReg(trab.value)}>
                    <input type="checkbox" readOnly checked={getCheckedReg(trab.value)}/>
                    <span className={editBottom?styles.checkmark:styles.checkmark_disabled}></span>
                    <span className={editBottom?styles.checkbox_text:styles.checkbox_text_disabled}>{trab.label}</span>
                </div>
            )
        })
    }


    const bottomEditDoneHandler = () => {
        if(radioSelected===1 && entityName.length<=1){
            setEntityWrong(true)
        }
        else if(selectedProf?.length>0 && selectedReg?.length>0){
            if((radioSelected===1 && entityName.length>1)||radioSelected===0){
                setEditBottom(false)
                setListValue('')
                setLoadingBottom(true)
                axios.post(`${api_url}/worker/update_selected`, {
                    user_id : user._id,
                    trabalhos : selectedProf,
                    regioes: selectedReg,
                    entity: radioSelected,
                    entity_name: entityName
                }).then(() => {
                    dispatch(
                        user_update_field(
                            [
                                {field: 'trabalhos', value: selectedProf},
                                {field: 'regioes', value: selectedReg},
                                {field: 'entity', value: radioSelected},
                                {field: 'entity_name', value: entityName}
                            ]
                        )
                    )
                    dispatch(worker_update_profile_complete(true))
                    setLoadingBottom(false)
                    setBottomPop(true)
                    setTimeout(() => setBottomPop(false), 4000)
                    if(user_phone_verified&&user_email_verified&&worker_is_subscribed)
                    {
                        if(user.state!==1)
                        {
                            axios.post(`${api_url}/worker/update_state`, {state: 1, user_id: user._id})
                        }
                            
                    }
                        
                })
            }
        }
        else{
            shakeError.current?.scrollIntoView({behavior: 'smooth'})
            setShake(true)
            setTimeout(() => setShake(false), 1000)
        }
    }

    const getPercentagem = () => {
        let val = 0
        if(selectedProf?.length>0) val += 1
        if(selectedReg?.length>0) val += 1
        if(radioSelected!==null) val += 1
        return Math.ceil((val/3)*100)
    }

    const mapSelected = (list, type) => {
        if(list?.length>0)
            return list?.map((el, i) => {
                return (
                    type==='jobs'?
                    <p className={styles.map_label} style={{opacity:editBottom?1:0.7}}
                        
                        onClick={() => setCheckedProf(el)}>{profissoesMap[el]?.label}</p>
                    :
                    <p className={styles.map_label} onClick={() => setCheckedReg(el)} style={{opacity:editBottom?1:0.7}}>{regioesOptions[el]}</p>
                    
                )
            })

        return (
            <p className={styles.map_label_no}>{type==='jobs'?'Sem serviços selecionados':'Sem regiões ou distritos selecionados'}</p>
        )
    }

    return (
        <div className={styles.details}>
            <CSSTransition 
                in={bottomPop}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao user_page={true} removePopin={() => setBottomPop(false)} text={"Detalhes profissional atualizados com sucesso!"}/>
            </CSSTransition>
            <div className={styles.top}>
                <div className={styles.top_info}  onClick={() => setDisplayTop(!displayTop)}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <span className={styles.top_complete}><span style={{color:getPercentagem()<100?"#fdd835":"#0358e5", fontWeight:"600"}}>{getPercentagem()}%</span> completo:</span>
                        <ArrowForwardIosIcon className={!displayTop?styles.top_complete_arrow:styles.top_complete_arrow_show}/>
                    </div>
                    {
                        displayTop?
                        <div className={getPercentagem()<100?styles.top_wrap_incomplete:styles.top_wrap_complete}>
                            <div className={styles.top_complete_line}>
                                <CorporateFareIcon className={radioSelected!==""?styles.line_icon:styles.line_icon_complete}/>
                                {
                                    radioSelected!==""?
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        <span className={styles.line_text_complete}>particular ou empresa</span>
                                        <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                    </div>
                                    
                                    :
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        <span className={styles.line_text}>particular ou empresa</span>
                                        <ClearIcon className={styles.line_val}></ClearIcon>
                                    </div>

                                }
                            </div>
                            <div className={styles.top_complete_line}>
                                <HandymanIcon className={selectedProf?.length>0?styles.line_icon:styles.line_icon_complete}/>
                                {
                                    selectedProf?.length>0?
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        <span className={styles.line_text_complete}>Serviços em que trabalho</span>
                                        <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                    </div>
                                    
                                    :
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        <span className={styles.line_text}>Serviços em que trabalho</span>
                                        <ClearIcon className={styles.line_val}></ClearIcon>
                                    </div>

                                }
                            </div>
                            <div className={styles.top_complete_line}>
                                <LocationOnIcon className={selectedReg?.length>0?styles.line_icon:styles.line_icon_complete}/>
                                {
                                    selectedReg?.length>0?
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        <span className={styles.line_text_complete}>Regiões ou distritos onde trabalho</span>
                                        <CheckIcon className={styles.line_val_complete}></CheckIcon>
                                    </div>
                                    
                                    :
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        <span className={styles.line_text}>Regiões ou distritos onde trabalho</span>
                                        <ClearIcon className={styles.line_val}></ClearIcon>
                                    </div>

                                }
                            </div>
                        </div>
                        :null
                    }
                </div>
                <div className={getPercentagem()===0?styles.top_separator:
                                getPercentagem()<100?styles.top_separator_incomplete:
                                styles.top_separator_complete}/>
            </div>
            <div className={styles.worker_area}>
            <span className={styles.flex_title} style={{marginTop:'10px', marginTop:'30px'}}>Particular ou Empresa</span>
                <div className={styles.title_flex} style={{marginTop:'0'}}>
                    <div>
                        
                        <div className={styles.radio_div}>
                            <SelectWorker 
                                details={true}
                                editBottom={editBottom} 
                                worker_type={radioSelected} 
                                changeType={val => {
                                    setRadioSelected(val)
                                    setEntityWrong(false)
                                }}/>
                            {
                                radioSelected===1?
                                <div 
                                    className={styles.input_div_wrapper_editable} 
                                    style={{borderColor:entityWrong&&entityName.length<=1?'#fdd835':'#FF785A', marginLeft:'10px', borderColor:!editBottom?'#FF785A90':entityWrong||entityName.length<=1?'#fdd835':'#FF785A'}}>
                                    <div className={styles.input_icon_div}>
                                        {
                                            entityWrong||entityName.length<=1?
                                            <AccountBalanceOutlinedIcon className={styles.input_icon} style={{color:'#ffffff'}}/>
                                            :
                                            <AccountBalanceIcon className={styles.input_icon} style={{color:!editBottom?'#FF785A90':'#FF785A'}}/>
                                        }
                                    </div>
                                    <span className={styles.input_icon_seperator} style={{backgroundColor:!editBottom?'#FF785A90':entityWrong||entityName.length<=1?'#fdd835':'#FF785A'}}>.</span>
                                    <input className={styles.input_input}
                                            style={{color:!editBottom?'#71848d':'#fff'}}
                                            value={entityName}
                                            onChange={e => setEntityName(e.target.value)}
                                            disabled={!editBottom}>
                                    </input>
                                </div>
                                :
                                null
                            }
                        </div>
                        {
                            radioSelected===1&&entityWrong&&entityName.length<=1?
                            <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor escreve pelo menos 2 caracteres.</span>
                            :radioSelected===1&&entityWrong?
                            <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper}>Por favor define a tua situação de trabalho.</span>
                            :null
                        }
                    </div>
                    {   
                        !editBottom?
                        <span className={styles.edit} onClick={() => setEditBottom(true)&&setListValue('')}>
                            EDITAR
                        </span>
                        :
                        <span className={styles.save} onClick={() => bottomEditDoneHandler()}>
                            GUARDAR
                        </span>
                    }
                </div>
                <Loader loading={loadingBottom}/>
                <div className={styles.area_flex}>
                    <span ref={shakeError} className={styles.flex_title}>Serviços em que trabalho</span>
                    {
                        editBottom&&selectedProf?.length===0||editBottom&&!selectedProf?
                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper} style={{marginBottom:'0'}}>Por favor escolhe pelo menos um tipo de serviço!</span>
                        :null
                    }
                    <span className={editBottom?styles.divider_active:styles.divider}></span>                    
                    
                    <div className={styles.area}>
                        <div className={styles.area_left}>
                            <div className={styles.area_left_title_wrapper}>
                                <p className={styles.area_left_title}>Selecionados <span className={shakeTarefas?`${styles.selected_number} ${styles.shake}`:styles.selected_number}>({selectedProf?selectedProf?.length:0}/9)</span></p>
                            </div>
                            
                            <div className={styles.area_left_map} style={{
                                backgroundColor:selectedProf?.length===0?'#fdd83580':editBottom?'':'#FF785A40', 
                                border:selectedProf?.length===0?'2px solid #fdd835':editBottom?'':'2px solid #FF785A80',
                                display:selectedProf?.length===0?'flex':''}}>
                                {mapSelected(selectedProf, 'jobs')}
                            </div>
                        </div>
                        
                        <div className={styles.area_right}>
                            <SelectHome 
                                menuOpen={() => {
                                }}
                                menuClose={() => {
                                }}
                                selectedArray={selectedProf}
                                home={true}
                                profs={true}
                                details={true}
                                edit={editBottom}
                                options={profissoesGrouped}
                                optionFirst={null} 
                                option={null} 
                                searcheable={editBottom}
                                smallWindow={windowDimensions.width <= 1024}
                                changeOption={val => {
                                    setCheckedProf(val.value)
                                }}
                                placeholder={'procurar serviços'}/>
                        </div>  
                    </div>
                </div>
                <div className={styles.area_flex} style={{marginTop:windowDimensions.width<1024?'350px':'460px'}}>
                    <span ref={shakeError} className={styles.flex_title}>Regiões ou Distritos onde trabalho</span>
                    {
                        editBottom&&selectedReg?.length===0||editBottom&&!selectedReg?
                        <span className={shake?`${styles.helper} ${styles.shake}`:styles.helper} style={{marginBottom:'0'}}>Por favor escolhe pelo menos uma região ou distrito</span>
                        :null
                    }
                    <span className={editBottom?styles.divider_active:styles.divider}></span>                    
                    
                    <div className={styles.area}>
                        <div className={styles.area_left}>
                            <div className={styles.area_left_title_wrapper}>
                                <p className={styles.area_left_title}>Selecionados</p>
                            </div>
                            
                            <div className={styles.area_left_map} style={{
                                backgroundColor:selectedReg?.length===0?'#fdd83580':editBottom?'':'#FF785A40', 
                                border:selectedReg?.length===0?'2px solid #fdd835':editBottom?'':'2px solid #FF785A80',
                                display:selectedReg?.length===0?'flex':''}}>
                                {mapSelected(selectedReg, 'regions')}
                            </div>
                        </div>
                        
                        <div className={styles.area_right_two}>
                            <div className={styles.flex_select_div}>
                                {mapRegioes()}
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details