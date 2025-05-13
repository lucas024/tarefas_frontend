import React, { useState } from 'react';
import Select from 'react-select'
import styles from './select.module.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { components } from 'react-select';

const SelectHomeMain = (props) => {

    const [menuOpen, setMenuOpen] = useState(false)

    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: "#ffffff",
            textTransform: "normal",
            color: '#000000',
            fontWeight: 600,
            width: "100%",
            transition: "0.5s all ease-in-out",
            borderRadius: "5px",
            height: '100%',
            minHeight: props.mediumWindow ? 'none' : '',
            "&:hover": {
                cursor: "pointer",
            },
            border: 'none',
            boxShadow: 'none',
            display: 'flex !important',
            justifyContent: 'center !important',
            alignItems: 'center !important',
        }),
        option: (base, state) => ({
            ...base,
            width: '100%',
            cursor: "pointer",
            color: "#161F28",
            fontWeight: state.isSelected ? 800 : 500,
            backgroundColor: "transparent",
            overflow: 'hidden',
            padding: '0.15vw 0.2vw',
            "&:active": {
                backgroundColor: "#e4eaf0",
                borderRadius: '8px',
                transition: '10ms all'
            },
            "&:hover": {
                backgroundColor: "#e4eaf0",
                borderRadius: '8px',
                transition: '10ms all'
            },
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
            marginTop: '12px',
            width: 'calc(min(255px, 18vw))',
            minWidth: '150px'
        }),
        menuList: base => ({
            ...base,
            padding: 0
        }),
        container: base => ({
            ...base,
            width: "100%",
            position: 'relative',
            height: '100%'
        }),
        indicatorContainer: base => ({
            ...base,
            width: '5px',
            height: '5px'
        }),
        singleValue: base => ({
            ...base,
            color: "#000",
            margin: "auto",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px',
        }),
        ValueContainer: base => ({
            ...base,
            alignItems: 'center',
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
                flexDirect: 'row',
                justifyContent: 'space-between',
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
            height: '100%',
            margin: 0,
            display: state.isFocused ? 'none' : 'block'
        }),
        container: base => ({
            ...base,
            height: '100%',
        })
    }

    const selectChange = (val) => {
        props.changeOption(val)
    }

    const formatOptionLabelAux = (data, context) => {
        return (
            <div className={`${styles.label} ${((data.value === props.option.value) && (context === 'menu')) ? styles.label_active : ''}`} style={{ padding: (context === 'menu') ? '' : '0px' }}>
                <div className={styles.label_img_wrapper}>
                    {
                        data.img ?
                            <img src={data.img} className={styles.label_img} />
                            : null
                    }
                </div>
                <div style={{ marginLeft: data.img ? "8px" : "0px" }}>
                    {
                        context !== 'menu' && props.searchBar ? null
                            :
                            context !== 'menu' ? <p className={`${styles.label_main_control} ${props.searchBar && styles.label_main_control_navbar}`}>{data.label}</p>
                                :
                                context === 'menu' ?
                                    <p className={styles.label_main}>{data.label}</p>
                                    : null
                    }
                    {
                        context === 'menu' && <p className={styles.label_desc}>{data.desc}</p>
                    }
                </div>
            </div>
        )
    }

    return (
        <Select
            components={{
                IndicatorSeparator: () => null, IndicatorsContainer: () => {
                    return (
                        <div className={styles.arrow_downwards_wrapper}>
                            <ExpandMoreIcon className={styles.arrow_downwards} />
                        </div>
                    )
                },
                ValueContainer: (p) => {
                    const { children, ...rest } = p;

                    return (
                        <components.ValueContainer {...rest} className={styles.value_container}>
                            {children}
                        </components.ValueContainer>
                    )
                },
            }}
            styles={stylesSelect}
            options={props.options}
            value={props.option}
            // menuIsOpen={1}
            isSearchable={false}
            onMenuOpen={() => {
                props.menuOpen()
            }}
            onBlur={() => props.menuClose() && setMenuOpen(false)}
            onMenuClose={() => props.menuClose()}
            formatOptionLabel={(option, { context }) => {
                return formatOptionLabelAux(option, context)
            }}
            onChange={value => {
                selectChange(value)
            }}
        />
    )
}

export default SelectHomeMain;
