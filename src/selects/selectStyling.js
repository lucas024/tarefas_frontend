import React from 'react';
import Select from 'react-select'
import {profissoes} from '../general/util'

const TopSelect = (props) => {
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "#161F28",
            borderColor: "#161F28",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            color: "#FF785A",
            fontWeight: 600,
            width:"170px",
            transition: "0.2s all ease-in-out",
            borderRadius: "10px",
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
            color: "#fff",
            fontWeight: state.isSelected? 600: 400,
            backgroundColor: state.isSelected? "#FF785A ": state.isFocused? '#FF785A50': "transparent",
            fontSize: '0.8rem'
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:"170px",
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "#161F28",
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
            transition: "0.15s all ease-in-out",
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
            color: "#fff",
            margin: "auto"
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
        props.changeWorker(val)
    }

    
    return(
        <Select
            styles={stylesSelect}
            options={profissoes}
            value={profissoes.filter(option => option.value === props.id)}
            isSearchable={false}
            placeholder="Serviço..."
            onChange={value => {
                selectChange(value.value)
            }}
        />
    )
}

export default TopSelect;
