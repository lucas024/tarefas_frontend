import React from 'react';
import Select from 'react-select'

const SelectWorker = (props) => {
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.worker?"#ffffff":props.editBottom?"#FF785A":"#FF785A80",
            borderColor: props.worker?"#FF785A":"#FF785A",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            color: props.worker?"#161F28":"#FF785A",
            fontWeight: 600,
            width:props.worker?"100%":"170px",
            transition: "0.2s all ease-in-out",
            borderRadius: "5px",
            borderBottomLeftRadius: state.isFocused? 0: "5px",
            borderBottomRightRadius: state.isFocused? 0: "5px",
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
            color: state.isSelected?"#fff":"#161F28",
            fontWeight: state.isSelected? 600: 500,
            backgroundColor: state.isSelected?props.worker?"#FF785A":"#FF785A":state.isFocused?props.worker?"#FF785A50":'#FF785A50':"transparent",
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:props.worker?"100%":"170px",
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
            color: props.worker?"#161F28":"#fff",
            opacity: props.details?!props.editBottom?0.7:1:1,
            transition: "0.15s all ease-in-out"
        }),
        container: base => ({
            ...base,
        }),
        singleValue: base => ({
            ...base,
            color: props.worker?"#161F28":"#fff",
            opacity: props.details?!props.editBottom?0.7:1:1,
            margin: "auto"
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: props.details?"#ffffff":"#161F28",
            opacity: props.details?!props.editBottom?0.7:1:1,
        }),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px",
            color: props.editBottom?"#71848d":"#fff",
        })
    }

    const options = [
        { value: 0, label: 'Particular' },
        { value: 1, label: 'Empresa' },
    ]

    const selectChange = (val) => {
        props.changeType(val)
    }

    
    return(
        <Select
            styles={stylesSelect}
            isDisabled={!props.editBottom}
            options={options}
            value={options.filter(option => option.value === props.worker_type)}
            isSearchable={false}
            onChange={value => {
                selectChange(value.value)
            }}
        />
    )
}

export default SelectWorker;
