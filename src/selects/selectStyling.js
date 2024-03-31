import React from 'react';
import Select from 'react-select'
import {profissoesGrouped, profissoesMap} from '../general/util'
import select_styles from './select.module.css'

const TopSelect = (props) => {  
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.worker==null? "#161F28":"#0358e5",
            borderColor: "#0358e5",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            color: "#fff",
            fontWeight: 600,
            width:"100%",
            transition: "0.2s all ease-in-out",
            borderRadius: "5px",
            borderBottomLeftRadius: state.isFocused? 0: "5px",
            borderBottomRightRadius: state.isFocused? 0: "5px",
            border: 0,
            boxShadow: "white",
            height: "40px",
            "&:hover": {
                cursor: "pointer",
            },
            "&:placeholder": {
                color: "#ffffff"
            }
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "uppercase",
            cursor: "pointer",
            color: "#fff",
            fontWeight: state.isSelected? 600: 400,
            backgroundColor: state.isSelected? "#0358e5": state.isFocused? '#0358e550': "transparent",
            fontSize: '0.8rem',
            textAlign: 'left'
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:"100%",
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "#161F28",
            borderTop: 0,
            borderLeft: 0,
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            padding: "0",
            zIndex: 4
        }),
        dropdownIndicator : base => ({
            ...base,
            color: "#ffffff",
            transition: "0.15s all ease-in-out",
            "&:hover": {
                color: "#ffffff",
            }
        }),
        container: base => ({
            ...base,
            width: "100%",
        }),
        singleValue: base => ({
            ...base,
            color: "#fff",
            margin: "auto"
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "#ffffff"
        }),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px",
        }),
        input: base => ({
            ...base,
            marginLeft:'5px',
            fontWeight:600,
            color:'#ffffff'
        }),
        group: base => ({
            ...base,
            padding: "5px 0",
            borderBottom: '1px dashed #cccccc80',
            "&:last-child": {
                borderBottom: 'none',
            }
        }),
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
    
    return(
        <Select
            styles={stylesSelect}
            options={profissoesGrouped}
            formatGroupLabel={formatGroupLabelAux}
            formatOptionLabel={formatOptionLabelAux}
            isSearchable={true}
            value={props.worker?profissoesMap[props.worker]:null}
            placeholder={<span style={{color:"#fff", fontSize:'0.8rem', marginLeft:"10px"}}>ESCOLHER TAREFA</span>}
            onChange={val => {
                console.log(val)
                props.changeWorker(val)
            }}
        />
    )
}

export default TopSelect;
