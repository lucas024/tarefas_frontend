import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import styles from '../servicos/main.module.css'
import select_styles from './select.module.css'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TitleIcon from '@mui/icons-material/Title';
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

    useEffect(() => {
        console.log(props.option)
    }, [props.option])
   
 
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.option?props.selected==='trabalhos'?"#0358e5":'#FF785A':"#ffffff",
            borderColor: "#161F28",
            fontSize: "1rem",
            fontFamily: "inherit",
            fontWeight: "400",
            color: "#FF785A",
            width:"100%",
            transition: "0.2s all ease-in-out",
            borderRadius: "5px",
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "100%",
            minHeight: '20px',
            padding: "0 5px",
            color: "#ccc",
            height: '100%',
            "&:hover": {
                cursor: "pointer",
            }
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "capitalize",
            cursor: "pointer",
            color: "#161F28",
            fontWeight: state.isSelected? 600: 400,
            backgroundColor: state.isSelected? "#0358e5": state.isFocused? '#0358e550': "transparent",
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:"100%",
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "#ffffff",
            borderTop: 0,
            borderLeft: 0,
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            padding: "0",
            zIndex: 4,
        }),
        dropdownIndicator : base => ({
            ...base,
            color: !props.option?props.selected==='trabalhos'?"#0358e5":'#FF785A':"#ffffff",
            transition: "0.15s all ease-in-out",
            "&:hover": {
                color: "#0358e5",
            }
        }),
        singleValue: base => ({
            ...base,
            color: "#ffffff",
            textTransform: "Capitalize",
            fontWeight: "500",
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minWidth: '150px',
            marginLeft: '5px'
        }),
        indicatorSeparator : () => ({}),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px",
            color: "#ffffff"
        }),
        placeholder: base => ({
            ...base,
            color: "#ccc",
        }),
        group: base => ({
            ...base,
            padding: "0px 0px 0px 0",
            borderBottom: '1px dashed #ccc',
            "&:last-child": {
                borderBottom: 'none',
            }
        }),
        input: base => ({
            ...base,
            color: props.option?'#ffffff':'#000000',
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
                
                <p className={select_styles.label_label} style={{marginLeft:data.img?"5px":"0px"}}>{data.label}</p>
            </div>
        )
    }

    return (
        <Select
            styles={stylesSelect}
            options={options}
            value={props.option?props.type==='zona'?regioesMap[props.option]:profissoesMap[props.option]:null}
            formatGroupLabel={formatGroupLabelAux}
            formatOptionLabel={formatOptionLabelAux}
            isSearchable={true}
            onChange={value => {
                props.valueChanged(value.value)
            }}
            placeholder={
                props.type==="zona"?
                <span className={styles.placeholder}>
                    <LocationOnOutlinedIcon className={styles.placeholder_icon}/>
                    Região
                </span>
                :props.trabalho?
                <span className={styles.placeholder}>
                    <TitleIcon className={styles.placeholder_icon}/>
                    Tarefa
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