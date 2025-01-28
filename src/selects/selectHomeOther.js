import React, { useState } from 'react';
import Select, {components} from 'react-select'
import styles from './select.module.css'
import LanguageIcon from '@mui/icons-material/Language';

const SelectHomeOther = (props) => {

    const [menuOpen, setMenuOpen] = useState(false)
    
    const stylesSelect = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            borderColor: "#ffffff",
            fontSize: "calc(max(0.57vw, 8px))",
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
            width: "100%",
            borderRadius: 0,
            backgroundColor: "#ffffff",
            borderLeft: 0,
            borderTop: 0,
            borderRadius: 8,
            padding: "0",
            zIndex: 5,
            marginTop: 'calc(max(0.65vw, 3px))',
            width: '12vw',
            // position: 'static'
        }),
        menuList: base => ({
            ...base,
            padding: 0,
            height: '100%',
            maxHeight: props.professions?'700px':'300px',
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
            width: props.professions?'100%':'',
            overflowY: 'auto',
        }),
        input: base => ({
            ...base,
            color: "#000000",
            paddingLeft:"5px",
            fontWeight: 500,
            padding: 0,
            fontSize: "calc(max(0.57vw, 8px))",
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
            fontSize: "calc(max(0.57vw, 8px))",
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
            padding: "0px 0px 0px 0",
            marginBottom: 0,
            "& div": {
                display: "flex",
                flexDirect:'row',
                justifyContent:'space-between',
                flexWrap: 'wrap',
                maxHeight: 'max-content'
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
            textTransform:'inherit'
        })
    }

    const selectChange = (val) => {
        props.changeOption(val)
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

    const formatOptionLabelAuxProfs = (data, context) => {
        return (
            !data.solo&&
            <div className={`${styles.label_profs} ${((data?.value === props.option?.value) && (context === 'menu'))?styles.label_profs_active:''}`}
                style={{marginLeft:(context !== 'menu'?0:'')}}>
                <div className={styles.label_main_wrapper}>
                    {
                        data?.value === 'online' && <LanguageIcon className={styles.label_online}/>
                    }
                    <p className={styles.label_other_profs} style={{fontWeight: props.professions&&context==='menu'?500:600}}>{data.label}</p>
                </div>
            </div>
        )
    }

    const formatOptionLabelAux = (data, context) => {
        return (
            !data.solo&&
            <div className={`${styles.label} ${((data?.value === props.option?.value) && (context === 'menu'))?styles.label_active:''}`}>
                <div className={styles.label_main_wrapper}>
                    {
                        data?.value === 'online' && <LanguageIcon className={styles.label_online}/>
                    }
                    <p className={styles.label_other} style={{fontWeight: props.professions&&context==='menu'?400:600}}>{data.label}</p>
                </div>
            </div>
        )
    }


    const CustomMenuList = ({ children }, maxHeight) => {
        const numColumns = 5; // Number of columns you want
        const columns = Array.from({ length: numColumns }, () => []);
        let currentColumn = 0;
        let currentHeight = 0;
        
        console.log(children)
        // Function to simulate height calculation since we don't have real DOM elements yet
        const simulateHeight = (child) => {
          // This is a placeholder function. You'd need to adjust this based on real data or elements
          let num_childs = child.props.children.length
          return 35 + (num_childs>1&&42*child.props.children.length || 0) // Example height for each child

        };
      
        // Distribute children across columns
        React.Children.forEach(children, (child, index) => {
          let childHeight = simulateHeight(child);
          console.log(currentHeight, childHeight, maxHeight)
          if (currentHeight + childHeight > maxHeight) {
            currentColumn = (currentColumn + 1) % numColumns;
            currentHeight = 0;
          }
          
          console.log(currentColumn)
          columns[currentColumn].push(child);
          currentHeight += childHeight;
        });

        console.log(columns[1])
      
        return (
          <div className={styles.customMenuList} style={{ maxHeight: `${maxHeight}px` }}>
            {columns.map((column, index) => (
              <div key={index} className={styles.customMenuList_column}>
                {column}
              </div>
            ))}
          </div>
        );
    };

    const CustomGroup = ({children}) => {
        return children.length>1&&children
    }
    
    return(
        <Select
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null, 
            Menu:(p) => {
                const { children, ...rest } = p;

                return (
                    props.professions?
                    <div className={styles.menu_wrapper}>
                        {children}
                    </div>
                    :
                    <components.Menu {...rest}>
                        {children}
                    </components.Menu>
                )
            },
            Group:(p) => {
                const { children, ...rest } = p;
                console.log(children)
                return (
                    props.professions?
                    <div className={children.length===1?styles.group_wrapper_solo:styles.group_wrapper}>
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
            }
        
            }}
            placeholder={
                <span className={styles.placeholder}>
                    <span className={styles.placeholder_desc}>{props.placeholder_desc}</span>                   
                </span>}
            styles={stylesSelect}
            options={props.options}
            value={props.option}
            menuIsOpen={props.professions}
            onMenuOpen={() => {
                props.menuOpen()
            }}
            onBlur={() => props.menuClose()&&setMenuOpen(false)}
            onMenuClose={() => props.menuClose()}
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
