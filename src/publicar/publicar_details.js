import React, {useEffect, useState} from 'react'
import styles from '../user/publicar.module.css'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode, { setLanguage } from "react-geocode";
import dayjs from 'dayjs';
import { regioes } from '../general/util';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoneIcon from '@mui/icons-material/Done';
import PhonelinkEraseIcon from '@mui/icons-material/PhonelinkErase';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SelectAddress from '../selects/selectAddress';
import Loader from '../general/loader';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SelectHome from '../selects/selectHome';

Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')


const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"
const GISGRAPHY_BASE_URL = "https://services.gisgraphy.com/fulltext/fulltextsearch?"

const PublicarDetails = props => {
    const api_url = useSelector(state => {return state.api_url})

    const [address, setAddress] = useState('')
    const [addressManual, setAddressManual] = useState('')
    const [addressOptions, setAddressOptions] = useState([])
    const [addressOptionsText, setAddressOptionsText] = useState([])
    const [optionIndex, setOptionIndex] = useState(null)
    const [loadingMore, setLoadingMore] = useState(null)
    const [allowNow, setAllowNow] = useState(null)
    const [allowLater, setAllowLater] = useState(false)
    const [openTing, setOpenTing] = useState(true)
    // 0 = presencial, 1 = presencial, morada manual, 2 = online
    const [manualSelected, setManualSelected] = useState(false)

    const changeAddressText = val => {
        const params = {
            q: val,
            format: 'json',
            country:'PT'
        }

        props.setAddressParent(null)
        setAddress(val)
        setOptionIndex(null)
        setOpenTing(true)
        if(val.length>0)
            setLoadingMore(true)
        else setLoadingMore(false)
        const queryString = new URLSearchParams(params).toString()
        if(val.length>0)
        {
            if(allowNow===null || new Date() > allowNow){
                console.log('triggering now')
                axios.post(`${api_url}/fulltextsearch`, {search: val})
                .then(result => {
                    addressSearchHelper(result.data?.response?.docs)
                })
                var date = new Date()
                date.setSeconds(date.getSeconds() + 3)
                setAllowNow(date)
                setAllowLater(true)
            }
            else if(allowLater===true){
                console.log('going to trigger in', Date.parse(allowNow) - Date.now())
                setTimeout(() => {
                    axios.post(`${api_url}/fulltextsearch`, {search: address})
                    .then(result => {
                        addressSearchHelper(result.data?.response?.docs)
                        console.log('triggered successfuly')
                    })
                }, [Date.parse(allowNow) - Date.now()])
                setAllowLater(false)
            }
        }
    }

    const changeAddressTextManual = val => {
        setAddressManual(val)
        props.setAddressManual(val)
    }

    const addressSearchHelper = docs => {
        setAddressOptions(docs)
        let i = 0
        let val = []
        var aux = []
        for(let el of docs)
        {
            if(!aux.includes(el.fully_qualified_name))
            {
                aux.push(el.fully_qualified_name)
                let res = {value: i, label: `${el.fully_qualified_name}`}
                val.push(res)
            }
            i++
        }
        setAddressOptionsText(val)
        setLoadingMore(false)
    }

    const setAddressHandler = (index) => {
        setOptionIndex(index)
        for(let el of addressOptionsText)
        {
            if(el.value === index)
            {
                setAddress(el.label)
                props.setAddressParent(el.label)
                console.log(el)
                break
            }
        }
        let capital = addressOptions[index].is_in_adm
        let found = false
        if(capital!==null && capital!=="")
        {
            for(let reg of regioes)
            {
                if(reg.label === capital)
                {
                    props.setDistrictHelper(reg.value)
                    found = true
                    break
                }
            }
        }
        if(!found)
            props.setDistrictHelper(null)
        console.log(addressOptions[index])
        props.setLat(addressOptions[index].lat)
        props.setLng(addressOptions[index].lon)
        setAddressOptions([])
        setAddressOptionsText([])
    }


    return (
        <div>
            <div className={styles.top} onClick={() => setOpenTing(false)}>
                <div className={styles.helper_wrap}>
                    {/* <span className={styles.helper_divider}>-</span> */}
                    <span className={styles.helper_text}>campo obrigatório</span>
                    <span className={styles.helper_asterisc}>*</span>
                </div>
                {/* <div className={styles.diff_right_title_container}>
                    <span className={styles.diff_right_title}>
                        Tipo de Tarefa<span className={styles.action}>*</span>
                    </span>
                </div> */}
                <div className={styles.contact_area} onClick={() => props.divRef?.current?.scrollIntoView({ behavior: 'smooth' })}>
                <div className={styles.diff_right_title_container}>
                    <span className={styles.diff_right_title}>
                        Localização da Tarefa<span className={styles.action}>*</span>
                    </span>
                    <div className={styles.top_check} style={{backgroundColor:(props.correct_location||props.correct_location_online)?'#0358e5':"", top:0, right:0}}>
                        <DoneIcon className={styles.top_check_element}/>
                    </div>
                </div>
                <div className={styles.online_task_button}>
                        <div 
                            className={styles.online_task_button_side_wrapper}
                            style={{backgroundColor:props.taskType!==2?"#0358e5":"#0358e580"}}
                            onClick={() =>  {
                                if(manualSelected)
                                {
                                    props.setTaskType(1)
                                }
                                else
                                {
                                    props.setTaskType(0)
                                }
                            }}>
                            <span style={{fontWeight:props.taskType!==2?500:400}}
                                className={styles.online_task_button_side}>tarefa presencial</span>
                        </div>
                        <div 
                            className={styles.online_task_button_side_wrapper}
                            style={{backgroundColor:props.taskType===2?"#0358e5":"#0358e580"}}
                            onClick={() => {
                                props.setTaskType(2)
                            }}>
                            <span style={{fontWeight:props.taskType===2?500:400}}
                                className={styles.online_task_button_side}>tarefa online</span>
                        </div>
                    </div>
                    {
                        props.taskType!==2?
                        <div className={styles.tarefa_separator}/>
                        :null
                    }
                    
                {
                        props.taskType!==2?
                        <div>
                            {
                                props.taskType===0?
                                <div className={styles.bot_address_flex}>
                                    <div className={styles.bot_input_div_search} style={{flex:1}}>
                                        <div className={styles.input_address_wrapper}>
                                            <input 
                                                placeholder='Pesquisar morada da tarefa...' 
                                                type="text" 
                                                autoComplete='off' 
                                                value={address} 
                                                onChange={val => changeAddressText(val.target.value)} className={styles.input_address}
                                                style={{borderBottomColor:!props.wrongAddress&&optionIndex!==null?"#0358e5":""}}/>
                                            {
                                                loadingMore&&openTing?
                                                <div className={styles.input_address_bottom}>
                                                    <Loader loading={loadingMore} small={true}/>
                                                </div>
                                                :addressOptionsText.length===0&&optionIndex==null&&address.length>0&&openTing?
                                                <div className={styles.input_address_bottom}>
                                                    <span className={styles.input_address_bottom_none}>Sem resultados para a pesquisa.</span>
                                                </div>
                                                :null
                                            }
                                        </div>
                                        <SelectAddress open={loadingMore===false&&addressOptionsText.length>0&&address.length>0&&openTing} options={addressOptionsText} optionIndex={optionIndex} changeOption={val => setAddressHandler(val)}/>
                                        <span 
                                            style={{borderColor:props.badAddress||props.wrongAddress?"red":!props.badAddress&&!props.wrongAddress&&optionIndex!==null?"#0358e5":"", borderBottomRightRadius:'5px', padding:"2px 5px 0px 5px"}}
                                            className={styles.area_label_inverse}>
                                                Morada
                                        <span className={styles.asterisc}>*</span></span>
                                    </div>
                                    <div className={styles.bot_input_div_search_select}>
                                        <SelectHome 
                                            publicar={true}
                                            options={regioes}
                                            option={props.district}
                                            changeOption={val => {
                                                props.setDistrictHelper(val)}}
                                            placeholder={'Região...'}/>
                                        <span 
                                            style={{borderColor:props.badAddress||props.wrongAddress?"red":!props.badAddress&&!props.wrongAddress&&optionIndex!==null?"#0358e5":"", borderBottomRightRadius:'5px', zIndex:0}}
                                            className={styles.area_label_inverse}>
                                                Região
                                        <span className={styles.asterisc}>*</span></span>
                                    </div>
                                </div>
                                :
                                <div className={styles.bot_address_flex}>
                                    <div className={styles.bot_input_div_search} style={{flex:1}}>
                                            <input 
                                                placeholder='Morada manual' 
                                                type="text" 
                                                autoComplete='off' 
                                                value={addressManual} 
                                                onChange={val => changeAddressTextManual(val.target.value)} className={styles.input_address}
                                                style={{fontWeight:500, borderBottomColor:!props.wrongAddress&&addressManual.length>10?"#0358e5":"", borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px'}}/>
                                        <span 
                                            style={{borderColor:props.badAddress||props.wrongAddress?"red":!props.badAddress&&!props.wrongAddress&&optionIndex!==null?"#0358e5":"", borderBottomRightRadius:'5px'}}
                                            className={styles.area_label_inverse}>
                                                Morada Manual
                                        <span className={styles.asterisc}>*</span></span>
                                    </div>
                                    <div className={styles.bot_input_div_search_select}>
                                        <SelectHome 
                                            publicar={true}
                                            options={regioes}
                                            option={props.district} 
                                            changeOption={val => {
                                                props.setDistrictHelper(val)}}
                                            placeholder={'Região...'}/>
                                        <span 
                                            style={{borderColor:props.badAddress||props.wrongAddress?"red":!props.badAddress&&!props.wrongAddress&&optionIndex!==null?"#0358e5":"", borderBottomRightRadius:'5px', zIndex:0}}
                                            className={styles.area_label_inverse}>
                                                Região
                                        <span className={styles.asterisc}>*</span></span>
                                    </div>
                                </div>
                            }
                            
                            <div className={styles.address_flex}>
                                <div className={styles.bot_input_div}>
                                    <span 
                                        style={{borderColor:props.porta.length>0?"#0358e5":""}} 
                                        className={styles.area_label_inverse}>
                                            Porta<span className={styles.asterisc}>*</span>
                                    </span>
                                    <input 
                                        tabindex={props.selectedTab===2?'1':'-1'}
                                        style={{width:"100px", borderColor:props.porta.length>0?"#0358e5":"", fontSize:'0.9rem',}} 
                                        maxLength={5} 
                                        onChange={e => props.setPorta(e.target.value)}
                                        value={props.porta} 
                                        className={styles.top_input_short}/>
                                </div>
                                <div className={styles.bot_input_div}>
                                    <span
                                        style={{borderColor:props.andar.length>0?"#0358e5":""}} 
                                        className={styles.area_label_inverse}>Andar</span>
                                    <input 
                                        tabindex={props.selectedTab===2?'1':'-1'}
                                        style={{width:"100px", marginLeft:"10px", fontSize:'0.9rem',
                                        borderColor:props.andar.length>0?"#0358e5":""}}
                                        maxLength={11} 
                                        onChange={e => props.setAndar(e.target.value)} 
                                        value={props.andar} 
                                        className={styles.top_input_short}></input>
                                </div>
                            </div>
                        </div>
                        :
                        null
                        
                    }
                    {
                        props.taskType!==2?
                        <div style={{display:"flex"}}>
                            <div className={styles.address_help_wrapper}>
                                <span className={styles.address_help_title}>Se não encontras a morada, seleciona <span style={{textDecoration:"underline"}}>morada manual</span></span>
                                <div className={styles.address_help_button_wrapper}>
                                    <div 
                                        className={styles.address_help_button} onClick={() => {
                                                props.setTaskType(0)
                                                setManualSelected(false)}}
                                        style={{backgroundColor:props.taskType===0?"#0358e5":"#0358e580"}}>
                                        <span>Automática</span>
                                    </div>
                                    <div 
                                        className={styles.address_help_button} onClick={() => {
                                            props.setTaskType(1)
                                            setManualSelected(true)}}
                                        style={{backgroundColor:props.taskType===1?"#0358e5":"#0358e580"}}>
                                        <span>Manual</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :null
                    }
                </div>
                <div className={styles.diff_right_title_container} style={{marginTop:'60px'}}>
                    <span className={styles.diff_right_title}>
                        Detalhes de Contacto<span className={styles.action}>*</span>
                    </span>
                    <div className={styles.top_check} style={{backgroundColor:props.phone.length!==9?"#71848d":props.correct_phone&&props.correct_email?'#0358e5':"#fdd835", top:0, right:0}}>
                        <DoneIcon className={styles.top_check_element}/>
                    </div>
                </div>
                <div className={styles.contact_area}>
                    <div className={styles.bot_input_div_contact} style={{marginTop:'5px'}}>
                        <span 
                            style={{borderColor:"#0358e5", color:"#71848d"}} 
                            className={styles.area_label_inverse}>Nome<span className={styles.asterisc}>*</span></span>
                        <input 
                            tabindex={props.selectedTab===2?'1':'-1'}
                            style={{borderColor:"#0358e5", width:"100%", color:"#71848d"}}
                            maxLength={11}
                            disabled={true}
                            value={props.nome} 
                            className={styles.top_input_short}></input>
                    </div>
                    <div className={styles.bot_input_div_contact} style={{marginTop:"5px"}}>
                        <div style={{position:'relative', width:"100%"}}>
                            <span 
                                style={{borderColor:props.correct_phone?"#0358e5":props.phone.length===9?"#fdd835":""}} 
                                className={styles.area_label_inverse}>Telemóvel<span className={styles.asterisc}>*</span></span>
                            <input 
                                tabindex={props.selectedTab===2?'1':'-1'}
                                style={{borderColor:props.correct_phone?"#0358e5":props.phone.length===9?"#fdd835":"", width:"100%"}}
                                maxLength={11} 
                                onChange={e => props.setPhone(e.target.value)} 
                                value={props.phoneVisual} 
                                className={styles.top_input_short}/>
                        </div>
                        
                        {
                            props.correct_phone?
                            <div className={styles.verify_box}>
                                <MobileFriendlyIcon className={styles.verify_box_icon} style={{color:"white"}}/>
                            </div>
                            :
                            props.expired?
                            <div className={props.phone.length!==9?styles.verify_box_incomplete:styles.verify_box_no}
                                onClick={() => props.phone.length===9&&props.setVerifyPhone(1)}>
                                <PhonelinkEraseIcon className={styles.verify_box_icon}/>
                            </div>
                            :
                            <div className={styles.verify_box_no}>
                                <span className={styles.verify_box_seconds}>{props.seconds}s</span>
                            </div>
                        }
                        
                    </div>
                    <div className={styles.bot_input_div_contact} style={{marginTop:"5px"}}>
                        <div style={{position:'relative', width:"100%"}}>
                            <span 
                                style={{borderColor:props.correct_email?"#0358e5":"#fdd835", color:"#71848d"}} 
                                className={styles.area_label_inverse}>E-mail<span className={styles.asterisc}>*</span></span>
                            <input 
                                tabindex={props.selectedTab===2?'1':'-1'}
                                style={{borderColor:props.correct_email?"#0358e5":"#fdd835", width:"100%", color:"#71848d"}} 
                                maxLength={11}
                                disabled={true}
                                value={props.email} 
                                className={styles.top_input_short}></input>
                        </div>
                        {
                            
                        }
                        {
                            props.correct_email?
                            <div className={styles.verify_box}>
                                <MarkEmailReadIcon className={styles.verify_box_icon} style={{color:"white"}}/>
                            </div>
                            :
                            <div className={styles.verify_box_no} onClick={() => props.setVerifyEmail(1)}>
                                <UnsubscribeIcon className={styles.verify_box_icon}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicarDetails