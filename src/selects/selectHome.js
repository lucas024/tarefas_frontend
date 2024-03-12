import React from 'react';
import Select from 'react-select'

const SelectHome = (props) => {
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.publicar?'#161F28':props.option==='trabalhos'?"#0358e5":props.option==='trabalhadores'?"#FF785A":props.option?"#161F28":"#252d36",
            borderColor: "#ffffff",
            fontSize: "0.7rem",
            textTransform: props.publicar?"normal":"uppercase",
            color: "#ffffff",
            fontWeight: 600,
            width:props.publicar?"100%":"160px",
            transition: "0.5s all ease-in-out",
            borderRadius: "5px",
            // borderBottomRightRadius: "0px",
            // borderBottomLeftRadius: state.isFocused? 0: "10px",
            // borderBottomRightRadius: state.isFocused? 0: "10px",
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "40px",
            "&:hover": {
                cursor: "pointer",
            }
        }),
        option: (base, state) => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            cursor: "pointer",
            color: "#161F28",
            fontSize:"0.8rem",
            fontWeight: state.isSelected? 800: 500,
            backgroundColor: state.isSelected? "#161F2840 ": state.isFocused? '#161F2810': "transparent",
        }),
        menu: base => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            width:props.publicar?"100%":"160px",
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "#ffffff",
            borderTop: 0,
            borderLeft: 0,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "0",
            zIndex: 5,
        }),
        dropdownIndicator : base => ({
            ...base,
            color: "#ffffff",
            transition: "0.15s all ease-in-out",
            zIndex:1,
            marginTop:'-10px',
            "&:hover": {
                color: "#161F28",
            }
        }),
        container: base => ({
            ...base,
            width: "100%",
        }),
        singleValue: base => ({
            ...base,
            color: "#ffffff",
            margin: "auto",
            fontSize: props.publicar?"0.8rem":"0.7rem",
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "#ffffff",
            display:'none'
        }),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px",
        })
    }

    const selectChange = (val) => {
        props.changeOption(val)
    }

    
    return(
        <Select
            placeholder={<span style={{marginLeft:'5px', color:'#ffffff80'}}>{props.placeholder}</span>}
            styles={stylesSelect}
            options={props.options}
            value={props.options?.filter(option => option.value === props.option)}
            isSearchable={false}
            onChange={value => {
                selectChange(value.value)
            }}
        />
    )
}

export default SelectHome;
