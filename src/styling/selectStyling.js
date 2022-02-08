import React from 'react';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'

const TopSelect = (props) => {

    const navigate = useNavigate()

    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            margin: 'auto',
            backgroundColor: state.isSelected? "white": "transparent",
            borderColor: "#161f28",
            fontSize: "1rem",
            textTransform: "uppercase",
            color: "#ffffff",
            fontWeight: 600,
            transition: "0.5s all ease-in-out",
            borderRadius: 0,
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "40px",
            "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                cursor: "pointer",
                transition: "0.5s all ease-in-out",
            }
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "uppercase",
            cursor: "pointer",
            color: "black",
            fontWeight: state.isSelected? 600: 400,
            backgroundColor: state.isSelected? "rgba(0,0,0,0.5) ": state.isFocused? 'rgba(0,0,0,0.2)': "transparent",
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            margin: "auto",
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "rgba(255,255,255,1)",
            border: "3px solid white",
            borderTop: 0,
            borderLeft: 0,
            padding: "0"
        }),
        dropdownIndicator : base => ({
            ...base,
            color: "inherit",
            transition: "0.5s all ease-in-out",
            "&:hover": {
                color: "rgba(255,255,255,1)",
            }
        }),
        container: base => ({
            ...base,
            width: "100%"
        }),
        singleValue: base => ({
            ...base,
            color: "white"
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "white"
        }),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px"
        })
    }

    const options = [
        { value: 'eletricistas', label: 'eletricista' },
        { value: 'canalizadores', label: 'canalizador' },
        { value: 'carpinteiros', label: 'carpinteiro' }
    ]

    const selectChange = (newId) => {
        props.resetDate()
        navigate({
            pathname: `/servicos/${newId}`,
            search: `?p=1`
        })   
    }

    
    return(
        <Select
            styles={stylesSelect}
            options={options}
            value={options.filter(option => option.value === props.id)}
            isSearchable={false}
            onChange={value => {
                selectChange(value.value)
            }}
        />
    )
}

export default TopSelect;
