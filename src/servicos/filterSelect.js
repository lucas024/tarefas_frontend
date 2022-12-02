import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import styles from './trabalhadores.module.css'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import {regioes, profissoes} from '../general/util'

const FilterSelect = (props) => {

    const [selectedValue, setSelectedValue] = useState(null)
    const [options, setOptions] = useState([])

    useEffect(() => {
        if(props.type==="zona"){
            setOptions(regioes)
        }
        else if(props.type === "worker"){
            setOptions(profissoes)
        }
    }, [props.type])

    useEffect(() => {
        setSelectedValue(null)
    }, [props.clear])

    useEffect(() => {
        props.urlVal&&setSelectedValue(props.urlVal)
    }, [props.urlVal])
    
 
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: selectedValue?"#FF785A":"#ffffff",
            borderColor: "#161F28",
            fontSize: "1rem",
            fontFamily: "inherit",
            fontWeight: "500",
            color: "#FF785A",
            width:"200px",
            transition: "0.2s all ease-in-out",
            borderRadius: "5px",
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "40px",
            padding: "0 5px",
            color: "#ccc",
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
            backgroundColor: state.isSelected? "#FF785A ": state.isFocused? '#FF785A50': "transparent",
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:"200px",
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
            color: !selectedValue?"#FF785A":"#ffffff",
            transition: "0.3s all ease-in-out",
            "&:hover": {
                color: "#FF785A",
            }
        }),
        singleValue: base => ({
            ...base,
            color: "#ffffff",
            textTransform: "Capitalize",
            fontWeight: "600"
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
        })
    }

    return (
        <Select
            styles={stylesSelect}
            options={options}
            value={options.filter(option => option.value === selectedValue)}
            formatOptionLabel={option => (
                <div className={styles.option}>
                    {
                        props.type==="worker"?
                        <img src={option.img_cor} className={styles.option_image}/>
                        :null
                    }
                    <span>{option.label}</span>
                </div>
              )}
            isSearchable={true}
            onChange={value => {
                props.valueChanged(value.value)
                setSelectedValue(value.value)
            }}
            placeholder={
                props.type==="zona"?
                <span className={styles.placeholder}>
                    <LocationOnIcon className={styles.placeholder_icon}/>
                    Distrito
                </span>
                :props.trabalho?
                <span className={styles.placeholder}>
                    <BuildIcon className={styles.placeholder_icon}/>
                    Trabalho
                </span>
                :
                <span className={styles.placeholder}>
                    <PersonIcon className={styles.placeholder_icon}/>
                    Trabalhador
                </span>
            }
        />
    )
}

export default FilterSelect