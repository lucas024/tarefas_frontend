import React from 'react';
import Select from 'react-select'

const SelectHome = (props) => {
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "#ffffff",
            borderColor: "#ffffff",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            color: "#FF785A",
            fontWeight: 600,
            width:"160px",
            transition: "0.2s all ease-in-out",
            borderRadius: "10px",
            borderBottomRightRadius: "0px",
            borderBottomLeftRadius: state.isFocused? 0: "10px",
            borderBottomRightRadius: state.isFocused? 0: "10px",
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "40px",
            "&:hover": {
                cursor: "pointer",
            }
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "uppercase",
            cursor: "pointer",
            color: "#161F28",
            fontSize:"0.8rem",
            fontWeight: state.isSelected? 600: 500,
            backgroundColor: state.isSelected? "#FF785A ": state.isFocused? '#FF785A50': "transparent",
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:"160px",
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "#ffffff",
            borderTop: 0,
            borderLeft: 0,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "0",
            zIndex: 4
        }),
        dropdownIndicator : base => ({
            ...base,
            color: "#FF785A",
            transition: "0.3s all ease-in-out",
            "&:hover": {
                color: "#FF785A",
            }
        }),
        container: base => ({
            ...base,
            width: "100%",
        }),
        singleValue: base => ({
            ...base,
            color: "#161F28",
            margin: "auto",
            fontSize: "0.7rem"
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "#FF785A"
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
            placeholder={props.placeholder}
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
