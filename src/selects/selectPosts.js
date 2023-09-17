import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import styles from '../servicos/trabalhadores.module.css'
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import {regioes, profissoes} from '../general/util'
import AssignmentIcon from '@mui/icons-material/Assignment';
import {useLocation, useNavigate} from 'react-router-dom'

const SelectPosts = (props) => {

    const [selectedValue, setSelectedValue] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        setSelectedValue(null)
    }, [props.clear])
    
 
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            minHeight: '100px',
            height: '100px',
            backgroundColor: props.type==='trabalhos'?"#0358e5":"#FF785A",
            borderColor: "#161F28",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            fontWeight: "700",
            color: "white",
            width:"95%",
            transition: "0.2s all ease-in-out",
            borderRadius: "5px",
            border: state.isSelected? "1px solid white": 0,
            boxShadow: "white",
            height: "40px",
            padding: "0 5px",
            color: "#ccc",
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            "&:hover": {
                cursor: "pointer",
            },
        }),
        option: (base, state) => ({
            ...base,
            textTransform: "capitalize",
            cursor: "pointer",
            color: "#161F28",
            fontWeight: state.isSelected? 600: 400,
            backgroundColor: "#ffffff",
        }),
        menu: base => ({
            ...base,
            textTransform: "uppercase",
            width:"95%",
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
            color: !selectedValue?"#ffffff":"#ffffff",
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
            color: "#ffffff",
            justifyContent: 'center'
        }),
        placeholder: base => ({
            ...base,
            color: "#ccc",
            alignSelf:'center'
        }),
    }

    return (
        <Select
            hideSelectedOptions={true}
            styles={stylesSelect}
            options={props.options}
            value={props.options.filter(option => option.value === props.type)}
            formatOptionLabel={option => (
                <span className={styles.placeholder_left}>
                    {option.value==='trabalhos'?
                        <AssignmentIcon className={styles.placeholder_left_icon} style={{color:props.type===option.value?'#fff':'#161F28'}}/>
                        :<PersonIcon className={styles.placeholder_left_icon} style={{color:props.type===option.value?'#fff':'#FF785A'}}/>
                    }
                    
                    <span className={props.type===option.value?styles.placeholder_left_text:styles.placeholder_left_text_nonselcted}
                                    style={{color:props.type===option.value?'#fff':option.value==='trabalhos'?'#0358e5':'#FF785A'}}>{option.label}</span>
                </span>
            )}
            isSearchable={false}
            onChange={value => {
                setSelectedValue(value.value)
                navigate(`/main/publications/${value.value}`)
            }}
        />
    )
}

export default SelectPosts