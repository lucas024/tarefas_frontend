import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import styles from '../servicos/main.module.css'
import select_styles from './select.module.css'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TitleIcon from '@mui/icons-material/Title';
import ConstructionIcon from '@mui/icons-material/Construction';
import {regioes, profissoesGrouped, profissoesMap, regioesMap} from '../general/util'

const SelectPublications = (props) => {

    const [options, setOptions] = useState([])

    useEffect(() => {
        if(props.type==="zona"){
            setOptions(regioes)
        }
        else if(props.type === "worker"){
            setOptions(profissoesGrouped)
        }
    }, [props.type])
   
 
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.option?props.selected==='trabalhos'?"#0358e5":'#FF785A':"#252d36",
            borderColor: "#161F28",
            fontSize: "1rem",
            fontFamily: "inherit",
            fontWeight: "400",
            color: "#FF785A",
            width: '100%',
            transition: "0.2s background-color ease-in-out",
            borderRadius: "5px",
            border: state.isSelected? "1px solid white": 0,
            borderBottomLeftRadius: state.menuIsOpen? 0: "5px",
            borderBottomRightRadius: state.menuIsOpen? 0: "5px",
            boxShadow: "white",
            height: props.profs&&state.menuIsOpen?'':"100%",
            minHeight: '20px',
            padding: "0 5px",
            color: "#ccc",
            "&:hover": {
                cursor: "pointer",
            },
            position: props.profs&&state.menuIsOpen?'absolute':'',
            top: 0,
            left: 0,
            zIndex: props.profs?7:'',
            boxShadow: 
                props.profs&&state.menuIsOpen?
                    props.selected==='trabalhos'?
                    '0px -3px 10px 0px rgba(3,88,229,0.8)':
                    '0px 1px 15px 0px rgba(255,120,90,0.8)':
                    '',
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "capitalize",
            width:props.profs&&!props.smallWindow?'33%':'100%',
            cursor: "pointer",
            color: "#161F28",
            fontWeight: state.isSelected? 600: 400,
            backgroundColor: state.isSelected? "#0358e5": state.isFocused? '#0358e550': "transparent",
            "&:first-of-type": {
                borderBottom: props.regioes?'1px dashed #ccc':'none',
            },
            backgroundColor: "transparent",
            padding: props.profs?'none':'',
        }),
        menu: (base, state) => ({
            ...base,
            textTransform: "uppercase",
            width: '100%',
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: props.profs?'#161F28aa':"#ffffff",
            borderTop: 0,
            borderLeft: 0,
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            padding: "0",
            zIndex: 6,
            height: props.profs&&!props.smallWindow?'450px':'300px',
            // position: props.profs?'absolute':'',
            left: 0,
            top: 0,
            boxShadow: props.profs?props.selected==='trabalhos'?
                '0px -1px 10px 0px rgba(3,88,229,0.8)':
                '0px 1px 15px 0px rgba(255,120,90,0.8)':
                ''
        }),
        menuList: base => ({
            ...base,
            maxHeight:props.profs&&!props.smallWindow?'445px':'295px',
            borderRadius:props.profs?'10px':''
        }),
        dropdownIndicator : base => ({
            ...base,
            color: !props.option?props.selected==='trabalhos'?"#0358e5":'#FF785A':"#ffffff",
            transition: "0.15s all ease-in-out",
            "&:hover": {
                color: "#0358e5",
            }
        }),
        singleValue: (base, state) => ({
            ...base,
            color: "#ffffff",
            textTransform: "Capitalize",
            fontWeight: "500",
            display: 'flex',
            justifyContent: props.profs?'center':'center',
            alignItems: 'center',
            minWidth: '150px',
            marginLeft: '5px',
            maxHeight:'36px',
            marginTop:0
        }),
        container: base => ({
            ...base,
            position: props.profs?'unset':'relative'
        }),
        indicatorSeparator : () => ({}),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px",
            color: "#ffffff",
            maxHeight:'36px',
            padding: 0
        }),
        placeholder: base => ({
            ...base,
            // color: "#ccc",
        }),
        group: base => ({
            ...base,
            padding: "0px 0px 0px 0px",
            borderBottom: props.profs?'':'1px dashed #ccc',
            "&:last-child": {
                borderBottom: 'none',
            },
            "& div": {
                display: "flex",
                flexDirect:'row',
                justifyContent:'space-between',
                flexWrap: 'wrap'
            },
            
        }),
        input: base => ({
            ...base,
            color: props.option?'#ffffff':'#ffffff',
            fontWeight: 600
        })
    }

    const formatGroupLabelAux = data => (
        data.label==='no-label'?
        null
        :
        <div className={select_styles.group_label}>
            <img src={data.img} className={select_styles.group_icon}/>
            <span className={select_styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAux = data => {
        return (
            <div className={select_styles.label} style={{marginTop:data.solo?'-3px':''}}>
                {
                    data.img?
                    <img src={data.img} className={select_styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={select_styles.label_label} style={{marginLeft:data.img?"5px":"0px", textTransform:'uppercase'}}>{data.label}</p>
            </div>
        )
    }

    const formatGroupLabelAuxProfs = data => (
        data.label==='no-label'?
        <div className={select_styles.group_label}>
            <img src={data.options[0].img} className={select_styles.group_icon}/>
            <span className={select_styles.group_title}>{data.options[0].label}</span>
        </div>
        :
        <div className={select_styles.group_label}>
            <img src={data.img} className={select_styles.group_icon}/>
            <span className={select_styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAuxProfs = data => {
        return (
            <div className={select_styles.label_profs} style={{
                backgroundColor: props.selected==='trabalhos'?'#0358e5aa':'#FF785Aaa',
                border: props.selected==='trabalhos'?'4px solid #0358e5':'4px solid #FF785A',
            }}>
                {
                    data.img?
                    <img src={data.img} className={select_styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={select_styles.label_label_profs} style={{textTransform:props.profs?'uppercase':''}}>{data.label}</p>
            </div>
        )
    }

    return (
        <Select
            styles={stylesSelect}
            options={options}
            value={props.option?props.type==='zona'?regioesMap[props.option]:profissoesMap[props.option]:null}
            formatGroupLabel={props.profs?formatGroupLabelAuxProfs:formatGroupLabelAux}
            formatOptionLabel={(option, {context}) => {
                return context==='menu'?props.profs?formatOptionLabelAuxProfs(option):formatOptionLabelAux(option):
                formatOptionLabelAux(option, context)
            }}
            isSearchable={true}
            // menuIsOpen={props.profs}
            onChange={value => {
                props.valueChanged(value.value)
            }}
            onMenuOpen={() => props.onMenuOpen()}
            onMenuClose={() => props.onMenuClose()}
            placeholder={
                props.type==="zona"?
                <span className={styles.placeholder}>
                    <LocationOnOutlinedIcon className={styles.placeholder_icon}/>
                    Região
                </span>
                :props.trabalho?
                <span className={styles.placeholder}>
                    <ConstructionIcon className={styles.placeholder_icon}/>
                    Tipo de Serviço
                </span>
                :
                <span className={styles.placeholder}>
                    <PersonIcon className={styles.placeholder_icon}/>
                    Profissional
                </span>
            }
        />
    )
}

export default SelectPublications