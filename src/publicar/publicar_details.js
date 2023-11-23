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

Geocode.setApiKey("AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk")
Geocode.setRegion("pt");
dayjs.locale('pt')

const PublicarDetails = props => {

    const [address, setAddress] = useState('')

    const setAddressHandler = (val) => {
        Geocode.fromAddress(val.label).then(
            (response) => {
                let longDistrict = null
                console.log(response.results[0].address_components);
                for(let el of response.results[0].address_components){
                    if(el.types.includes("administrative_area_level_1")){
                        console.log(el.long_name);
                        longDistrict = el.long_name
                        break
                    }
                }
                if(longDistrict){
                    for(let obj of regioes){
                        if(obj.label === longDistrict){
                            props.setDistrict(obj.value)
                        }
                    }
                }
                const { lat, lng } = response.results[0].geometry.location
                props.setLat(lat)
                props.setLng(lng)
                setAddress(val.label)
                props.setAddressParent(val.label)
            })
    }


    return (
        <div>
            <div className={styles.top}>
                <div className={styles.diff_right_title_container}>
                    <span className={styles.diff_right_title}>
                        Localização do Trabalho<span className={styles.action}>*</span>
                    </span>
                    <div className={styles.top_check} style={{backgroundColor:props.correct_location?'#0358e5':"", top:0, right:0}}>
                        <DoneIcon className={styles.top_check_element}/>
                    </div>
                </div>
                {/* <div className={styles.bot_title_wrapper} style={{alignItems:props.editReservation?.type===2&&props.getFieldWrong('location')?'flex-start':""}}>
                    {
                        props.editReservation?.type===2&&props.getFieldWrong('location')?
                        <div className={styles.diff_right_title_container} style={{alignItems:"flex-start"}}>
                            <span className={styles.bot_title} 
                                style={{ marginBottom:0}}>Localização
                            </span>
                            <span className={styles.diff_right_title_wrong_div}>
                            <span className={styles.editar_tit}>editar</span> {props.getFieldWrongText('location')}
                            </span>
                        </div>
                        :
                        <span className={styles.bot_title}>Localização
                        </span>
                    }
                </div> */}
                <div className={styles.contact_area} onClick={() => props.divRef.current.scrollIntoView({ behavior: 'smooth' })}>
                    {
                        props.edit?
                        <BorderColorIcon className={styles.top_abs_edit}/>
                        :null
                    }
                    {
                        props.edit&&!props.activateEditAddress?
                            <div>
                                <div className={styles.edit_address_line}>
                                    <div className={styles.bot_input_div} style={{marginTop:0}}>
                                        <span style={{borderColor:"#26B282"}} className={styles.area_label_inverse}>Rua<span className={styles.asterisc}>*</span></span>
                                        <input tabindex={props.selectedTab===2?'1':'-1'} disabled={true} value={props.editAddress} className={styles.bot_input_long}></input>
                                    </div>
                                </div>
                                <div className={styles.address_flex}>
                                    <div className={styles.bot_input_div}>
                                        <span style={{borderColor:"#26B282"}} className={styles.area_label_inverse}>Porta<span className={styles.asterisc}>*</span></span>
                                        <input tabindex={props.selectedTab===2?'1':'-1'} disabled={true} style={{width:"100px"}} maxLength={5} value={props.porta} className={styles.bot_input_short}></input>
                                    </div>
                                    <div className={styles.bot_input_div}>
                                        <span style={{borderColor:"#26B282"}} className={styles.area_label_inverse}>Andar</span>
                                        <input tabindex={props.selectedTab===2?'1':'-1'} disabled={true} style={{width:"100px", marginLeft:"10px"}} maxLength={11} onChange={e => props.setAndar(e.target.value)} value={props.andar} className={styles.bot_input_short}></input>
                                    </div>
                                </div>
                                <div style={{marginTop:"10px", display:"flex"}} onClick={() => props.setActivateEditAddress(true)}>
                                    <span className={styles.nova_morada}>Nova morada</span>
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
                                    <GooglePlacesAutocomplete
                                        tabindex={props.selectedTab===2?'1':'-1'}
                                        apiKey="AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk"
                                        autocompletionRequest={{
                                            // bounds: [ //BOUNDS LISBOA
                                            // { lat: 38.74, lng: -9.27 },
                                            // { lat: 38.83, lng: -9.17 },
                                            // { lat: 38.79, lng: -9.09 },
                                            // { lat: 38.69, lng: -9.21 },
                                            // ],
                                            componentRestrictions: {
                                            country: ['pt'],
                                            }
                                        }}
                                        selectProps={{
                                            address,
                                            onChange: setAddressHandler,
                                            styles: {
                                            input: (provided) => ({
                                                ...provided,
                                                color: '#ffffff',
                                                fontWeight: 500,
                                            }),
                                            option: (provided) => ({
                                                ...provided,
                                                color: '#161F28',
                                                fontWeight: 500
                                            }),
                                            singleValue: (provided) => ({
                                                ...provided,
                                                color: '#ffffff',
                                                fontWeight: 500,
                                                textAlign:'left'
                                            }),
                                            control: (provided, state) => ({
                                                ...provided,
                                                width: "100% !important",
                                                borderRadius: "2px",
                                                height: "40px",
                                                fontSize:"0.9rem",
                                                backgroundColor: "#161F28",
                                                border:"none",
                                                borderBottom: address!==''?'2px solid #0358e5':state.isFocused?"2px solid #ffffffaa":"2px solid #161F28",
                                                "&:hover": {
                                                    borderBottom: address===''?"2px solid #ffffffaa":"",
                                                    cursor: "text",
                                                },
                                                boxShadow: state.isFocused?"none":"none",
                                                zIndex: 1,
                                            }),
                                            container: (provided, state) => ({
                                                ...provided,
                                                border: state.isFocused?"none":"none",
                                                zIndex: 1
                                            }),
                                            dropdownIndicator: () => ({
                                                color:"#161F28",
                                                zIndex: 4
                                            }),
                                            indicatorSeparator: () => null
                                            },
                                            IndicatorsContainer:()=>(<></>),
                                            placeholder: "Pesquisar...",
                                            noOptionsMessage: () => "Pesquisar morada",
                                            loadingMessage: () => "A pesquisar...",
                                        }}
                                        />
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

                            {
                                props.edit&&address?
                                <div style={{display:"flex", justifyContent:"center", marginTop:"20px"}}>
                                    <div style={{marginLeft:"10px"}} onClick={() => props.setActivateEditAddress(false)}>
                                        <span className={styles.nova_morada_cancelar}>Cancelar</span>
                                    </div>
                                </div>

                                :null
                            }
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
                            props.expired?
                            <div className={props.phone.length!==9?styles.verify_box_incomplete:props.correct_phone?styles.verify_box:styles.verify_box_no}
                                onClick={() => !props.correct_phone&&props.phone.length===9&&props.setVerifyPhone(1)}>
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
                        <div className={props.correct_email?styles.verify_box:styles.verify_box_no}>
                            <UnsubscribeIcon className={styles.verify_box_icon}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicarDetails