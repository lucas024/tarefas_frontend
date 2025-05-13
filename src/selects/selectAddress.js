import React, { useEffect } from 'react';
import Select from 'react-select'

const SelectAddress = (props) => {
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "#161F28",
            borderColor: "#ffffff",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            color: "#ffffff",
            fontWeight: 600,
            width:"100%",
            transition: "0.5s all ease-in-out",
            borderRadius: "5px",
            borderBottomLeftRadius:0,
            borderBottomRightRadius:0,
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "0",
            "&:hover": {
                cursor: "pointer",
            },
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "uppercase",
            cursor: "pointer",
            color: "#ffffff",
            fontSize:"0.8rem",
            fontWeight: state.isSelected? 800: 500,
            backgroundColor: state.isSelected? "#161F2840 ": state.isFocused? '#161F2810': "transparent",
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
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "0",
            zIndex: 4,
            color:"#ffffff",
            position:'absolute'
        }),
        dropdownIndicator : base => ({
            ...base,
            color: "#ffffff",
            transition: "0.15s all ease-in-out",
        }),
        container: base => ({
            ...base,
            color:"#ffffff",
            width: "100%",
        }),
        singleValue: base => ({
            ...base,
            color: "#ffffff",
            margin: "auto",
            fontSize: "0.7rem"
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "#ffffff",

            display:'none'
        }),
        valueContainer: base => ({
            ...base,
            color:"#ffffff",
            padding: "2px 10px 2px 2px",
        }),
        input: base => ({
            ...base,
            color:"#ffffff",
            padding: "0px 0px 0px 5px"
        }),
    }

    const selectChange = (val) => {
        props.changeOption(val)
    }

    
    return(
        <Select
            placeholder={<span style={{marginLeft:'5px', color:'#ffffff80'}}>Escreva a localização da tarefa</span>}
            styles={stylesSelect}
            options={props.options}
            value={props.options?.filter(option => option.value === props.optionIndex)}
            isSearchable={false}
            menuIsOpen={props.open}
            onChange={value => {
                selectChange(value.value)
            }}
        />
    )
}

export default SelectAddress
