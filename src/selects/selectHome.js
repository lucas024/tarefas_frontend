import React from 'react';
import Select from 'react-select'
import styles from './select.module.css'

const SelectHome = (props) => {
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: props.publicar?'#161F28':props.option?.value==='trabalhos'?"#0358e5":props.option?.value==='profissionais'?"#FF785A":props.option?.value?"#161F28":"#252d36",
            borderColor: "#ffffff",
            fontSize: "0.7rem",
            textTransform: props.publicar?"normal":"uppercase",
            color: "#ffffff",
            fontWeight: 600,
            width: props.publicar||props.home?"100%":"250px",
            transition: "0.5s all ease-in-out",
            borderRadius: "5px",
            // borderBottomRightRadius: "0px",
            // borderBottomLeftRadius: state.isFocused? 0: "10px",
            // borderBottomRightRadius: state.isFocused? 0: "10px",
            border: props.home&&state.isSelected?"2px solid white":state.isSelected? "1px solid white":props.home?'2px solid #ffffff40': 0,
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
            "&:first-of-type": {
                borderBottom: props.regioes?'1px dashed #ccc':'none',
            }
        }),
        menu: base => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            width:props.publicar||props.home?"100%":"250px",
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
            marginTop:props.home?'':'-10px',
            "&:hover": {
                color: "#161F28",
            }
        }),
        container: base => ({
            ...base,
            width: "100%",
        }),
        input: base => ({
            ...base,
            color: "#ffffff",
            paddingLeft:"5px"
        }),
        singleValue: base => ({
            ...base,
            color: "#ffffff",
            margin: "auto",
            minWidth:props.publicar?'0px':'200px',
            display: 'flex',
            justifyContent: 'center',
            fontSize: props.publicar?"0.8rem":"0.7rem",
            alignItems: 'center'
        }),
        indicatorSeparator : base => ({
            ...base,
            backgroundColor: "#ffffff",
            display:'none'
        }),
        valueContainer: base => ({
            ...base,
            padding: "2px 10px 2px 2px",
            margin: 'auto',
        }),
        group: base => ({
            ...base,
            padding: "0px 0px 0px 0",
            borderBottom: '1px dashed #ccc',
            "&:last-child": {
                borderBottom: 'none',
            }
        }),
        placeholder: base => ({
            ...base,
            fontStyle: 'normal !important',
            fontFamily: 'Montserrat, sans-serif !important',
            fontWeight: '400',
            fontSize: '0.9rem',
            textAlign: props.home?'center':'left'
        })
    }

    const selectChange = (val) => {
        props.changeOption(val)
    }

    const formatGroupLabelAux = data => (
        data.label==='no-label'?
        null
        :
        <div className={styles.group_label}>
            <img src={data.img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAux = data => {
        return (
            <div className={data.value==='online'?styles.label_online:styles.label} style={{marginTop:data.solo?'-3px':''}}>
                {
                    data.img?
                    <img src={data.img} className={styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={data.value==='online'?styles.label_label_online:styles.label_label} style={{marginLeft:data.img?"5px":"0px"}}>{data.label}</p>
            </div>
        )
    }
    
    return(
        <Select
            placeholder={<span style={{marginLeft:'5px', color:'#ffffff80'}}>{props.placeholder}</span>}
            styles={stylesSelect}
            options={props.options}
            value={props.option}
            isSearchable={props.searcheable===false?false:true}
            onMenuOpen={() => props.menuOpen()}
            onBlur={() => props.menuClose()}
            formatGroupLabel={formatGroupLabelAux}
            formatOptionLabel={formatOptionLabelAux}
            // menuIsOpen={true}
            onChange={value => {
                selectChange(value)
            }}
        />
    )
}

export default SelectHome;
