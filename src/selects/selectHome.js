import React, { useState } from 'react';
import Select from 'react-select'
import styles from './select.module.css'
import { border, display, fontWeight, height, margin, padding, width } from '@mui/system';

const SelectHome = (props) => {

    const [menuOpen, setMenuOpen] = useState(false)
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.home?'transparent':props.publicar?'#161F28':props.option?.value==='trabalhos'?"#0358e5":props.option?.value==='profissionais'?"#FF785A":props.option?.value?"#161F28":"#252d36",
            borderColor: "#ffffff",
            textTransform: props.publicar||props.home?"normal":"uppercase",
            color: props.home?'#000000':"#ffffff",
            fontWeight: 600,
            width: props.publicar||props.home?"100%":"250px",
            transition: "0.5s all ease-in-out",
            borderRadius: "5px",
            // borderBottomLeftRadius: state.menuIsOpen? 0: "5px",
            // borderBottomRightRadius: state.menuIsOpen? 0: "5px",
            // border: props.details&&props.edit?'1px solid #ffffff':
            //     props.home&&props.option?props.optionFirst?.value==='trabalhos'?'2px solid #0358e5':'2px solid #FF785A':state.isSelected? "1px solid white":props.home?'2px solid #ffffff40': 0,
            // boxShadow: "white",
            height:props.home?'100%':props.mediumWindow?'30px':"40px",
            minHeight:props.mediumWindow?'none':'',
            "&:hover": {
                cursor: "pointer",
            },
            position: props.profs&&state.menuIsOpen?'absolute':'',
            top: '-40px',
            left: 0,
            zIndex: props.profs?4:'',
            border: 'none',
            boxShadow: 'none',
            // boxShadow: 
            //     props.auth||props.publicarNew?'0px -1px 5px 0px rgba(255,255,255,0.8)':
            //     !props.details&&props.profs&&!props.option?
            //         props.optionFirst?.value==='trabalhos'?'0px -1px 10px 0px rgba(255,255,255,0.8)':'0px -1px 10px 0px rgba(255,255,255,0.8)':
            //     props.home&&props.second&&!props.option?
            //         props.optionFirst?.value==='trabalhos'?'0px -1px 10px 0px rgba(255,255,255,0.8)':'0px -1px 10px 0px rgba(255,255,255,0.8)'
            //     :'',
            

        }),
        option: (base, state) => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            width:props.profs&&!props.smallWindow?'33%':'100%',
            cursor: props.details?props.edit?'pointer':'default':"pointer",
            color: "#161F28",
            fontSize:"0.8rem",
            fontWeight: state.isSelected? 800: 500,
            backgroundColor: "transparent",
            padding: props.profs?'none':'',
            "&:first-of-type": {
                borderBottom: props.regioes?'1px dashed #ccc':'none',
            },
            "&:active": {
                backgroundColor: props.profs?"transparent":''
            },
            "&:hover": {
                backgroundColor: props.profs?"transparent":props.publicar?'#0358e550':props.home?props.optionFirst?.value==='trabalhos'?'#0358e550':'#FF785A50':''
            }
            
        }),
        menu: base => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            width:props.publicar||props.home?"100%":"250px",
            margin: "auto",
            borderRadius: 0,
            backgroundColor: props.profs?'#161F28aa':"#ffffff",
            borderLeft: 0,
            border: props.details?props.edit?'1px solid #ffffff':'1px solid #ffffff40':'',
            borderTop: 0,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "0",
            zIndex: 5,
            height: props.profs&&!props.smallWindow?'450px':'300px',
            position: props.profs?'absolute':'absolute',
            left: props.profs?0:'',
            top: props.profs?0:'',
            boxShadow: props.auth||props.publicarNew?'0px -1px 5px 0px rgba(255,255,255,0.8)':
            !props.details&&props.profs?props.optionFirst?.value==='trabalhos'?'0px 1px 15px 0px rgba(3,88,229,0.8)':'0px 1px 15px 0px rgba(255,120,90,0.8)':''
        }),
        menuList: base => ({
            ...base,
            maxHeight:props.profs&&!props.smallWindow?'445px':'295px',
            borderRadius:props.profs?'10px':''
        }),
        dropdownIndicator : base => ({
            ...base,
            color: props.details?props.edit?"#ffffff":"#ffffff40":"#ffffff",
            transition: "0.15s all ease-in-out",
            zIndex:0,
            marginTop:props.home?'':'-10px',
            "&:hover": {
                color: "#161F28",
            },
            
        }),
        indicatorsContainer: base => ({
            ...base,
            display: props.mediumWindow?'none':"",
        }),
        container: base => ({
            ...base,
            width: "100%",
            position: props.profs?'unset':'relative',
            height: props.home?'100%':props.mediumWindow?'30px':"40px",
        }),
        input: base => ({
            ...base,
            color: props.home?"#000000":"#ffffff",
            paddingLeft:"5px",
            fontSize:props.auth?'1rem':'inherit',
            fontWeight:500,
            padding: 0,
        }),
        singleValue: base => ({
            ...base,
            color: "#000",
            margin: "auto",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "#ffffff",
            display:'none'
        }),
        valueContainer: base => ({
            ...base,
            height:'100%',
            width:'100%',
            padding: 0
            // padding: "2px 10px 2px 2px",
            // margin: 'auto',
            // height: props.mediumWindow?'30px':"40px",
        }),
        group: base => ({
            ...base,
            padding: "0px 0px 0px 0",
            // borderBottom: '2px solid #ccc',
            "&:last-child": {
                borderBottom: 'none',
            },
            marginBottom: 0,
            "& div": {
                display: "flex",
                flexDirect:'row',
                justifyContent:'space-between',
                flexWrap: 'wrap'
            },

        }),
        placeholder: (base, state) => ({
            ...base,
            fontStyle: 'normal !important',
            fontFamily: 'Montserrat, sans-serif !important',
            fontWeight: '600',
            textAlign: props.home?'center':'left',
            color: state.isFocused?'transparent':props.details?'#ffffff':'#000000',
            height:'100%',
            margin: 0,
            display: state.isFocused || props.value ? 'none' : 'block'
        }),
        container: base => ({
            ...base,
            height:'50% !important',
        })
    }

    const selectChange = (val) => {
        props.changeOption(val)
    }

    const formatGroupLabelAux = data => (
        data.label==='no-label'?
        null
        :
        <div className={styles.group_label}>
            <img src={data.img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAux = (data, context) => {
        return (
            <div className={data.value==='online'?styles.label_online:styles.label} style={{padding:context==='value'?0:''}}>
                {
                    data.img?
                    <img src={data.img} className={styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={data.value==='online'?styles.label_label_online:styles.label_label} style={{marginLeft:data.img?"5px":"0px"}}>{data.label}</p>
            </div>
        )
    }
    
    const formatGroupLabelAuxProfs = data => (
        data.label==='no-label'?
        <div className={styles.group_label}>
            <img src={data.options[0].img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.options[0].label}</span>
        </div>
        :
        <div className={styles.group_label}>
            <img src={data.img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAuxProfs = data => {
        return (
            <div className={styles.label_profs} style={{
                backgroundColor: props.optionFirst?.value==='trabalhos'?'#0358e5aa':'#FF785Aaa',
                border: props.optionFirst?.value==='trabalhos'?'4px solid #0358e5':'4px solid #FF785A',
            }}>
                {
                    data.img?
                    <img src={data.img} className={styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={styles.label_label_profs}>{data.label}</p>
            </div>
        )
    }

    const formatOptionLabelAuxProfsDetails = data => {
        return (
            <div className={styles.label_profs} style={{
                backgroundColor: 
                props.selectedArray?.length===0&&props.edit?"#fdd83580":props.selectedArray?.includes(data.value)?props.edit?'#FF785A':'#FF785A80':props.edit?'#FF785A80':'#FF785A30',
                border: 'none',
                cursor: props.edit?'pointer':'default',
            }}>
                {
                    data.img?
                    <img src={data.img} className={styles.label_img} style={{marginLeft:data.solo?'-7px':'', opacity:props.edit?1:0.6}}/>
                    :null
                }
                
                <p className={styles.label_label_profs_small} style={{opacity:props.edit?1:0.6, marginLeft:props.smallWindow?0:''}}>{data.label}</p>
            </div>
        )
    }
    
    return(
        <Select
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            placeholder={
                props.home?
                <span className={styles.placeholder}>
                    <span className={styles.placeholder_desc}>{props.placeholder_desc}</span>                   
                </span>
                :
                <span style={{marginLeft:'5px', color:props.home?'#000000':props.details&&props.edit?'#ffffff':'#ffffff80'}}>{props.placeholder}</span>}
            styles={stylesSelect}
            options={props.options}
            value={props.option}
            isSearchable={props.searcheable===false?false:true}
            onMenuOpen={() => {
                props.menuOpen()
                // setMenuOpen(true)
            }}
            onBlur={() => props.menuClose()&&setMenuOpen(false)}
            onMenuClose={() => props.menuClose()}
            formatGroupLabel={props.profs?formatGroupLabelAuxProfs:formatGroupLabelAux}
            formatOptionLabel={(option, {context}) => {
                return context==='menu'?props.details?formatOptionLabelAuxProfsDetails(option):props.profs?formatOptionLabelAuxProfs(option):formatOptionLabelAux(option):
                formatOptionLabelAux(option, context)
            }}
            menuIsOpen={props.details||props.auth||props.publicarNew||true}
            onChange={value => {
                if(props.details&&props.edit) selectChange(value)
                else if(!props.details) selectChange(value)
            }}
        />
    )
}

export default SelectHome;
