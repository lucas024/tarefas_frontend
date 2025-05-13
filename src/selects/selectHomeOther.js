import React, { useState } from 'react';
import Select, {components} from 'react-select'
import styles from './select.module.css'
import LanguageIcon from '@mui/icons-material/Language';
import { profissoesGrouped, profissoesMap } from '../general/util';
import zIndex from '@mui/material/styles/zIndex';

const SelectHomeOther = (props) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('');
    
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
            borderRadius: 0,
            backgroundColor: props.professions?"transparent":'',
            border: props.professions?'none':'',
            boxShadow: props.professions?'none':'',
            borderLeft: 0,
            borderTop: 0,
            borderRadius: 8,
            padding: "0",
            zIndex: 5,
            marginTop: '12px',
            width: props.professions?'100%':'calc(min(240px, 16.8vw))',
            position: props.professions?'absolute':'absolute',
            display: props.professions?'flex':'',
            flexDirection: props.professions?'row':'',
            justifyContent: props.professions?'center':'',
            top: props.professions?0:'',

        }),
        menuList: base => ({
            ...base,
            padding: 0,
            height: props.professions?'max-content':'100%',
            maxHeight: props.professions?'max-content':'300px',
            minWidth: '150px',
            width: 'max-content',
            backgroundColor: '#fff',
            borderRadius: 8,
            position: props.professions?'absolute':'static',
            display: props.professions?'grid':'',
            gridTemplateColumns: props.professions?'repeat(auto-fit, minmax(200px, 1fr))':'',
            gridAutoFlow: 'row dense', /* Items flow in rows first */
            gridAutoRows: 'min-content', /* Each row's height is content-based */
            gap: props.professions?'10px':'',
            // width: props.professions?'100%':'',
            width: props.professions?'max-content':'',
            overflowY: 'auto',
            zIndex: 20,
        }),
        input: base => ({
            ...base,
            color: "#000000",
            paddingLeft:"5px",
            fontWeight: 500,
            padding: 0
        }),
        indicatorContainer: base => ({
            ...base,
            width:'5px',
            height:'5px'
        }),
        singleValue: base => ({
            ...base,
            color: "#000",
            margin: "auto",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            fontWeight: 600
        }),
        valueContainer: base => ({
            ...base,
            height:'100%',
            width:'100%',
            padding: 0,
            color: '#000000',
        }),
        group: base => ({
            ...base,
            margin: 0,
            padding: 0,
            width: '100%',
            "& div": {
                display: "flex",
                flexDirect:'row',
                flexWrap: 'wrap',
                maxHeight: 'max-content',
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
            display: state.isFocused? 'none' : 'block',
        }),
        container: base => ({
            ...base,
            height:'100%',
            maxHeight: '25px',
            position: props.professions?'static':'relative'
        }),
        groupHeading: base => ({
            ...base,
            cursor: 'inherit',
            textTransform:'inherit',
            width: '100%',
            padding:0
        })
    }

    const selectChange = (val) => {
        setSearchValue('')
        setMenuOpen(false)
        props.changeOption(val)
    }

    const formatGroupLabelAuxProfs = (data) => (
        data.solo?
        <div className={`${styles.group_label} ${((data?.value == props.option?.value))?styles.label_profs_active:''}`}>
            <img src={data.options[0].img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.options[0].label}</span>
        </div>
        :
        <div className={styles.group_label}>
            <img src={data.img} className={styles.group_icon}/>
            <span className={styles.group_title}>{data.label}</span>
        </div>
    )

    const formatOptionLabelAuxProfs = (data, context) => {
        return (
            data.solo&&context === 'menu'?null
            :
            <div className={`${context === 'menu'?styles.label_profs:styles.label} ${((data?.value == props.option?.value) && (context === 'menu'))?styles.label_profs_active:''}`}
                style={{marginLeft:context !== 'menu'?0:''}}>
                <div className={styles.label_main_wrapper}>
                    {
                        data?.value === 'online' && <LanguageIcon className={styles.label_online}/>
                    }
                    <p className={styles.label_other_profs}>{data.label}</p>
                </div>
            </div>
        )
    }

    //regioes
    const formatOptionLabelAux = (data, context) => {
        return (
            <div className={`${styles.label} ${((data?.value === props.option?.value) && (context === 'menu'))?styles.label_active:''}`}>
                <div className={styles.label_main_wrapper}>
                    {
                        data?.value === 'online' && <LanguageIcon className={styles.label_online}/>
                    }
                    <p className={styles.label_other}>{data.label}</p>
                </div>
            </div>
        )
    }


    const CustomMenuList = ({ children }, maxHeight) => {
        // const numColumns = 5; // Number of columns you want
        // const columns = Array.from({ length: numColumns }, () => []);
        let columns = [[]]
        let currentColumn = 0;
        let currentHeight = 0;
        
        // Function to simulate height calculation since we don't have real DOM elements yet
        const simulateHeight = (child) => {
          // This is a placeholder function. You'd need to adjust this based on real data or elements
          let num_childs = child.props.children.length
          return 35 + (num_childs>1&&32*child.props.children.length || 0) // Example height for each child

        };
      
        // Distribute children across columns
        React.Children.forEach(children, (child, index) => {
          let childHeight = simulateHeight(child);
          if (currentHeight + childHeight > maxHeight) {
            columns.push([])
            currentColumn = (currentColumn + 1);
            currentHeight = 0;
          }
          
          columns[currentColumn].push(child);
          currentHeight += childHeight;
        });

      
        return (
          <div className={styles.customMenuList}>
            {columns.map((column, index) => (
              <div key={index} className={styles.customMenuList_column}>
                {column}
              </div>
            ))}
          </div>
        );
    };

    const CustomGroup = ({children}) => {
        console.log(children)
        if(children.length===1&&children[0].props.data.solo) return null
        else return children
    }
    
    return(
        <Select
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null, 
            Menu:(p) => {
                const { children, ...rest } = p;

                return (
                    props.professions?
                    <div className={styles.menu_wrapper}>
                        <components.Menu {...rest}>
                            {children}
                        </components.Menu>
                    </div>
                    :
                    <components.Menu {...rest}>
                        {children}
                    </components.Menu>
                )
            },
            Group:(p) => {
                const { children, ...rest } = p;
                return (
                    props.professions?
                    <div className={children.length===1&&children[0].props.data.solo?styles.group_wrapper_solo:styles.group_wrapper}
                        onClick={() => {
                            if(children.length===1&&children[0].props.data.solo){
                                selectChange(profissoesMap[children[0].props.value])
                            }
                        }}
                        >

                        <components.Group {...rest}>
                            {CustomGroup({children})}
                        </components.Group>
                    </div>
                    :
                    <components.Group {...rest}>
                        {children}
                    </components.Group>
                )
            },
            MenuList:(p) => {
                const { children, ...rest } = p;

                return (
                    props.professions?
                    <components.MenuList {...rest}>
                        {CustomMenuList({children}, 700, p)}
                    </components.MenuList>
                    :
                    <components.MenuList {...rest}>
                        {children}
                    </components.MenuList>
                )
            },
            NoOptionsMessage:(p) => {
                const { children, ...rest } = p;

                return (
                    <div className={styles.no_options}>
                        <components.NoOptionsMessage {...rest}>
                            Sem resultados
                        </components.NoOptionsMessage>
                    </div>
                )
            },
            Input:(p) => {
                const { children, ...rest } = p;

                return (
                        <components.Input {...rest} className={styles.input_wrapper}>
                            {children}
                        </components.Input>
                )
            },
        
            }}
            placeholder={
                <span className={styles.placeholder}>
                    <span className={`${styles.placeholder_desc} ${props.searchBar&&styles.placeholder_desc_navbar}`}>{props.placeholder_desc}</span>                   
                </span>}
            isSearchable={menuOpen}
            styles={stylesSelect}
            options={props.options}
            // options={[]}
            value={props.option}
            // inputValue={searchValue}
            // onInputChange={setSearchValue}
            menuIsOpen={menuOpen}
            // menuIsOpen={true}
            // menuIsOpen={props.professions}
            onMenuOpen={() => {
                setMenuOpen(true)
                props.menuOpen()
            }}
            onBlur={() => props.menuClose()&&setMenuOpen(false)}
            onMenuClose={() => {
                setMenuOpen(false)
                props.menuClose()
            }}
            formatGroupLabel={formatGroupLabelAuxProfs}
            formatOptionLabel={(option, {context}) => {
                return props.professions&&formatOptionLabelAuxProfs(option, context)||formatOptionLabelAux(option, context)
            }}
            onChange={value => {
                selectChange(value)
            }}
        />
    )
}

export default SelectHomeOther;
