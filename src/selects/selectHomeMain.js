import React, { useState } from 'react';
import Select from 'react-select'
import styles from './select.module.css'

const SelectHomeMain = (props) => {

    const [menuOpen, setMenuOpen] = useState(false)
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: "#ffffff",
            fontSize: "calc(max(0.55vw, 10px))",
            textTransform: "normal",
            color: '#000000',
            fontWeight: 600,
            width: "100%",
            transition: "0.5s all ease-in-out",
            borderRadius: "5px",
            height: '100%',
            minHeight:props.mediumWindow?'none':'',
            "&:hover": {
                cursor: "pointer",
            },
            border: 'none',
            boxShadow: 'none',       
        }),
        option: (base, state) => ({
            ...base,
            width: '100%',
            cursor:"pointer",
            color: "#161F28",
            fontWeight: state.isSelected? 800: 500,
            backgroundColor: "transparent",
        }),
        menu: base => ({
            ...base,
            width: "100%",
            borderRadius: 0,
            backgroundColor: "#ffffff",
            borderLeft: 0,
            borderTop: 0,
            borderRadius: 8,
            padding: "0",
            zIndex: 5,
            marginTop: '10px',
            
        }),
        menuList: base => ({
            ...base,
        }),
        container: base => ({
            ...base,
            width: "100%",
            position: 'relative',
            height: '100%'
        }),
        input: base => ({
            ...base,
            color: "#000000",
            paddingLeft:"5px",
            fontWeight:500,
            padding: 0,
            fontSize: "calc(max(0.55vw, 10px))",
        }),
        singleValue: base => ({
            ...base,
            color: "#000",
            margin: "auto",
            display: 'flex',
            justifyContent: 'center',
            fontSize: "calc(max(0.55vw, 10px))",
            alignItems: 'center'
        }),
        valueContainer: base => ({
            ...base,
            height:'100%',
            width:'100%',
            padding: 0
        }),
        group: base => ({
            ...base,
            padding: "0px 0px 0px 0",
            "&:last-child": {
                borderBottom: 'none',
            },
            marginBottom: 0,
            "& div": {
                display: "flex",
                flexDirect:'row',
                justifyContent:'space-between',
                flexWrap: 'wrap'
            },
        }),
        placeholder: (base, state) => ({
            ...base,
            fontStyle: 'normal !important',
            fontFamily: 'Montserrat, sans-serif !important',
            fontWeight: '600',
            textAlign: 'center',
            color: '#000000',
            height:'100%',
            margin: 0,
            display: state.isFocused? 'none' : 'block'
        }),
        container: base => ({
            ...base,
            height:'100%',
        })
    }

    const selectChange = (val) => {
        props.changeOption(val)
    }

    const formatOptionLabelAux = (data, context) => {
        return (
            <div>
                <div className={styles.label} style={{padding:context==='value'?0:''}}>
                    {
                        data.img?
                        <img src={data.img} className={styles.label_img}/>
                        :null
                    }
                    
                    <p className={styles.label_main} style={{marginLeft:data.img?"5px":"0px"}}>{data.label}</p>
                </div>
                {
                    context === 'menu' && <p className={styles.label_desc}>{data.desc}</p>
                }
            </div>
        )
    }
    
    return(
        <Select
            components={{ IndicatorSeparator:() => null }}
            styles={stylesSelect}
            options={props.options}
            value={props.option}
            isSearchable={props.searcheable===false?false:true}
            onMenuOpen={() => {
                props.menuOpen()
            }}
            onBlur={() => props.menuClose()&&setMenuOpen(false)}
            onMenuClose={() => props.menuClose()}
            formatOptionLabel={(option, {context}) => {
                return formatOptionLabelAux(option, context)
            }}
            onChange={value => {
                selectChange(value)
            }}
        />
    )
}

export default SelectHomeMain;
