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
            borderBottomLeftRadius: state.menuIsOpen? 0: "5px",
            borderBottomRightRadius: state.menuIsOpen? 0: "5px",
            border: props.home&&state.isSelected?"2px solid white":state.isSelected? "1px solid white":props.home?'2px solid #ffffff40': 0,
            boxShadow: "white",
            height: "40px",
            "&:hover": {
                cursor: "pointer",
            },
            position: props.profs&&state.menuIsOpen?'absolute':'',
            top: '-40px',
            left: 0,
            zIndex: props.profs?4:'',
            boxShadow: 
                props.profs&&!props.option?
                    props.optionFirst?.value==='trabalhos'?'0px -1px 10px 0px rgba(3,88,229,0.8)':'0px -1px 10px 0px rgba(255,120,90,0.8)':
                props.home&&props.second&&!props.option?
                    props.optionFirst?.value==='trabalhos'?'0px -1px 10px 0px rgba(3,88,229,0.8)':'0px -1px 10px 0px rgba(255,120,90,0.8)'
                :'',

        }),
        option: (base, state) => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            width:props.profs&&!props.smallWindow?'33%':'100%',
            cursor: "pointer",
            color: "#161F28",
            fontSize:"0.8rem",
            fontWeight: state.isSelected? 800: 500,
            backgroundColor: "transparent",
            padding: props.profs?'none':'',
            "&:first-of-type": {
                borderBottom: props.regioes?'1px dashed #ccc':'none',
            },
            
        }),
        menu: base => ({
            ...base,
            textTransform: props.publicar?"normal":"uppercase",
            width:props.publicar||props.home?"100%":"250px",
            margin: "auto",
            borderRadius: 0,
            backgroundColor: props.profs?'#161F28aa':"#ffffff",
            borderTop: 0,
            borderLeft: 0,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "0",
            zIndex: 5,
            height: props.profs&&!props.smallWindow?'450px':'300px',
            position: props.profs?'absolute':'',
            left: props.profs?0:'',
            top: props.profs?0:'',
            boxShadow: props.profs?props.optionFirst?.value==='trabalhos'?'0px 1px 15px 0px rgba(3,88,229,0.8)':'0px 1px 15px 0px rgba(255,120,90,0.8)':''
        }),
        menuList: base => ({
            ...base,
            maxHeight:props.profs&&!props.smallWindow?'445px':'295px',
            borderRadius:props.profs?'10px':''
        }),
        dropdownIndicator : base => ({
            ...base,
            color: "#ffffff",
            transition: "0.15s all ease-in-out",
            zIndex:0,
            marginTop:props.home?'':'-10px',
            "&:hover": {
                color: "#161F28",
            }
        }),
        container: base => ({
            ...base,
            width: "100%",
            position: props.profs?'unset':'relative'
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
            // borderBottom: '2px solid #ccc',
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

    const formatOptionLabelAux = (data, context) => {
        return (
            <div className={data.value==='online'?styles.label_online:styles.label} style={{padding:context==='value'?0:''}}>
                {
                    data.img?
                    <img src={data.img} className={styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={data.value==='online'?styles.label_label_online:styles.label_label} style={{marginLeft:data.img?"5px":"0px"}}>{data.label}</p>
            </div>
        )
    }
    
    const formatGroupLabelAuxProfs = data => (
        data.label==='no-label'?
        <div className={styles.group_label}>
            <img src={data.options[0].img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.options[0].label}</span>
        </div>
        :
        <div className={styles.group_label}>
            <img src={data.img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAuxProfs = data => {
        return (
            <div className={styles.label_profs} style={{
                backgroundColor: props.optionFirst?.value==='trabalhos'?'#0358e5aa':'#FF785Aaa',
                border: props.optionFirst?.value==='trabalhos'?'4px solid #0358e5':'4px solid #FF785A',
            }}>
                {
                    data.img?
                    <img src={data.img} className={styles.label_img} style={{marginLeft:data.solo?'-7px':''}}/>
                    :null
                }
                
                <p className={styles.label_label_profs}>{data.label}</p>
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
            onMenuClose={() => props.menuClose()}
            formatGroupLabel={props.profs?formatGroupLabelAuxProfs:formatGroupLabelAux}
            formatOptionLabel={(option, {context}) => {
                return context==='menu'?props.profs?formatOptionLabelAuxProfs(option):formatOptionLabelAux(option):
                formatOptionLabelAux(option, context)
            }}
            // menuIsOpen={props.profs}
            onChange={value => {
                selectChange(value)
            }}
        />
    )
}

export default SelectHome;
