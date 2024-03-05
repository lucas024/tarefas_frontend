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

Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')


const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

const PublicarDetails = props => {

    const [address, setAddress] = useState('')
    const [addressOptions, setAddressOptions] = useState([])
    const [addressOptionsText, setAddressOptionsText] = useState([])
    const [optionIndex, setOptionIndex] = useState(null)
    const [loadingMore, setLoadingMore] = useState(null)
    const [allowNow, setAllowNow] = useState(null)
    const [allowLater, setAllowLater] = useState(false)

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    }

    const changeAddressText = val => {
        const params = {
            q: val,
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 0
        }

        props.setAddressParent(null)
        setAddress(val)
        setOptionIndex(null)
        const queryString = new URLSearchParams(params).toString()
        if(val.length>0)
        {
            if(allowNow===null || new Date() > allowNow){
                console.log('triggering now')
                setLoadingMore(true)
                fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                    .then(res => res.text())
                    .then(result => {
                        const result_parsed = JSON.parse(result)
                        setAddressOptions(result_parsed)
                        let i = 0
                        let val = []
                        for(let el of result_parsed)
                        {
                            let res = {value: i, label: `${el.display_name}`}
                            i++
                            val.push(res)
                        }
                        setAddressOptionsText(val)
                        setLoadingMore(false)
                    })
                var date = new Date()
                date.setSeconds(date.getSeconds() + 3)
                setAllowNow(date)
                setAllowLater(true)
            }
            else if(allowLater===true){
                console.log('going to trigger in', Date.parse(allowNow) - Date.now())
                setLoadingMore(true)
                setTimeout(() => {
                    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                    .then(res => res.text())
                    .then(result => {
                        const result_parsed = JSON.parse(result)
                        setAddressOptions(result_parsed)
                        let i = 0
                        let val = []
                        for(let el of result_parsed)
                        {
                            let res = {value: i, label: `${el.display_name}`}
                            i++
                            val.push(res)
                        }
                        setAddressOptionsText(val)
                        setLoadingMore(false)
                    })
                }, [Date.parse(allowNow) - Date.now()])
                setAllowLater(false)
            }
        }
    }

    const setAddressHandler = (index) => {
        setOptionIndex(index)
        setAddress(addressOptionsText[index].label)

        console.log(addressOptions[index])
        props.setLat(addressOptions[index].lat)
        props.setLng(addressOptions[index].lon)
        props.setAddressParent(addressOptionsText[index].label)

        
        
        setAddressOptions([])
        setAddressOptionsText([])
    }


    return (
        <div>
            <div className={styles.top}>
                <div className={styles.helper_wrap}>
                    {/* <span className={styles.helper_divider}>-</span> */}
                    <span className={styles.helper_text}>campo obrigatório</span>
                    <span className={styles.helper_asterisc}>*</span>
                </div>
                <div className={styles.diff_right_title_container}>
                    <span className={styles.diff_right_title}>
                        Localização da Tarefa<span className={styles.action}>*</span>
                    </span>
                    <div className={styles.top_check} style={{backgroundColor:props.correct_location?'#0358e5':"", top:0, right:0}}>
                        <DoneIcon className={styles.top_check_element}/>
                    </div>
                </div>
                <div className={styles.contact_area} onClick={() => props.divRef?.current?.scrollIntoView({ behavior: 'smooth' })}>
                    {
                        props.edit&&!props.activateEditAddress?
                            <div>
                                <div className={styles.edit_address_line}>
                                    <div className={styles.bot_input_div} style={{marginTop:'5px', width:'100%'}}>
                                        <span 
                                            style={{borderColor:props.editAddress?.length>0?"#0358e5":"", opacity:0.6, borderTopLeftRadius:'5px', color:"#ccc"}} 
                                            className={styles.area_label_inverse}>Rua<span className={styles.asterisc}>*</span></span>
                                        <input 
                                            tabindex={props.selectedTab===2?'1':'-1'} 
                                            disabled={true} 
                                            value={props.editAddress}
                                            className={styles.top_input_short_no_hover}
                                            style={{borderColor:props.editAddress?.length>0?"#0358e5":"", width:'100%', color:"#ccc"}}/>
                                    </div>
                                </div>
                                <div className={styles.address_flex}>
                                    <div className={styles.bot_input_div}>
                                        <span 
                                            style={{borderColor:props.porta.length>0?"#0358e5":"", opacity:0.6, borderTopLeftRadius:'5px', color:"#ccc"}} 
                                            className={styles.area_label_inverse}>Porta<span className={styles.asterisc}>*</span></span>
                                        <input tabindex={props.selectedTab===2?'1':'-1'} disabled={true} style={{width:"100px", borderColor:props.porta.length>0?"#0358e5":"", color:"#ccc"}} maxLength={5} value={props.porta} className={styles.top_input_short_no_hover}></input>
                                    </div>
                                    <div className={styles.bot_input_div}>
                                        <span 
                                            style={{borderColor:props.andar.length>0?"#0358e5":"", opacity:0.6, borderTopLeftRadius:'5px', color:"#ccc"}}
                                            className={styles.area_label_inverse}>Andar</span>
                                        <input tabindex={props.selectedTab===2?'1':'-1'} disabled={true} style={{width:"100px", marginLeft:"10px", borderColor:props.andar.length>0?"#0358e5":"", color:"#ccc"}} maxLength={11} onChange={e => props.setAndar(e.target.value)} value={props.andar} className={styles.top_input_short_no_hover}></input>
                                    </div>
                                </div>
                                <div className={styles.nova_morada_div} onClick={() => props.setActivateEditAddress(true)}>
                                    <span className={styles.nova_morada}>Nova localização</span>
                                </div>
                            </div>
                        :
                        <div>
                            <div className={styles.bot_address_flex}>
                                <div className={styles.bot_input_div_search}>
                                    <span 
                                        style={{borderColor:props.badAddress||props.wrongAddress?"red":!props.badAddress&&!props.wrongAddress&&address!==null?"#0358e5":""}}
                                        className={styles.area_label_inverse}>
                                            Morada
                                    <span className={styles.asterisc}>*</span></span>
                                    <div className={styles.input_address_wrapper}>
                                        <input placeholder='Pesquisar localização da tarefa...' type="text" autoComplete='off' value={address} onChange={val => changeAddressText(val.target.value)} className={styles.input_address}/>
                                        {
                                            loadingMore?
                                            <div className={styles.input_address_bottom}>
                                                <Loader loading={loadingMore} small={true}/>
                                            </div>
                                            :addressOptionsText.length===0&&optionIndex==null&&address.length>0?
                                            <div className={styles.input_address_bottom}>
                                                <span className={styles.input_address_bottom_none}>Sem resultados para a pesquisa.</span>
                                            </div>
                                            :null
                                        }
                                    </div>
                                    <SelectAddress open={loadingMore===false&&addressOptionsText.length>0} options={addressOptionsText} optionIndex={optionIndex} changeOption={val => setAddressHandler(val)}/>
                                    </div>
                                </div>
                                <div className={styles.address_flex}>
                                    <div className={styles.bot_input_div}>
                                        <span 
                                            style={{borderColor:props.porta.length>0?"#0358e5":""}} 
                                            className={styles.area_label_inverse}>
                                                Porta<span className={styles.asterisc}>*</span>
                                        </span>
                                        <input 
                                            tabindex={props.selectedTab===2?'1':'-1'}
                                            style={{width:"100px", borderColor:props.porta.length>0?"#0358e5":""}} 
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
                                            style={{width:"100px", marginLeft:"10px",
                                            borderColor:props.andar.length>0?"#0358e5":""}} 
                                            maxLength={11} 
                                            onChange={e => props.setAndar(e.target.value)} 
                                            value={props.andar} 
                                            className={styles.top_input_short}></input>
                                    </div>
                                </div>
                        </div>
                    }
                    
                </div>
                <div className={styles.diff_right_title_container} style={{marginTop:'20px'}}>
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