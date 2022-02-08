import React, { useEffect, useState, forwardRef } from 'react';
import styles from './servicos.module.css'
import { useParams, useSearchParams } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import { useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css" 
import Select from 'react-select'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import TopSelect from '../styling/selectStyling';
import curveArrow from '../assets/curve-arrow.png'
import dayjs from 'dayjs';
import elec from '../assets/electrician.png'
import cana from '../assets/worker.png'
import carp from '../assets/driver.png'


require('dayjs/locale/pt')


const Servicos = () => {

    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currPage, setCurrPage] = useState(0)
    const [currDisplay, setCurrDisplay] = useState("solo")
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    const [date, setDate] = useState('dd/mm/yyyy')
    const [dateObj, setDateObj] = useState(null)
    const [timeStart, setTimeStart] = useState(null)
    const [timeEnd, setTimeEnd] = useState(null)
    const [timeStartOptions, setTimeStartOptions] = useState([])
    const [timeEndOptions, setTimeEndOptions] = useState([])
    dayjs.locale('pt')

    useEffect(() => {
        let aux = []
        for(let i = 0; i < 40; i++) aux.push(i)
        let page = parseInt(Object.fromEntries([...searchParams]).p)
        console.log(page);
        if(aux.length >= page*24 && page>1){
            if(aux.length > (page*24 + 24)) setItems(aux.slice((page-1)*24,(page-1)*24+24))
            else setItems(aux.slice((page-1)*24, (page)*24 + 24 - (page-1)*24 + 24 - aux.length))
            setCurrPage(page)
            setCurrDisplay("middle")
        }
        else if(aux.length < page*24 && page>1){
            setCurrPage(page)
            setItems(aux.slice((page-1)*24))
            setCurrDisplay("last")
        }
        else{
            setCurrPage(1)
            if(aux.length > 24){
                setItems(aux.slice(0,24))
                setCurrDisplay("init")
            }
            else{
                setItems(aux)
                setCurrDisplay("solo")
            }
        }     
        
        setTimeStartOptions(getTimeList(new Date()))
        setTimeEndOptions(getTimeList(new Date()))
        
    }, [searchParams, id])
    
    useEffect(() => {
        if(timeStart !== null){
            let tempo = new Date()
            tempo.setMinutes(parseInt(timeStart.slice(3)))
            tempo.setHours(parseInt(timeStart.slice(0,2)))
            setTimeEndOptions(getTimeList(new Date(tempo)))
        }
    }, [timeStart])

    const stylesTimeSelect = {
        control: (base, state) => ({
            ...base,
            margin: 'auto',
            border: 0,
            fontSize: "1rem",
            textTransform: "uppercase",
            fontWeight: 600,
            transition: "0.5s all ease-in-out",
            borderRadius: 0,
            boxShadow: "white",
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
            borderLeft: 0
        }),
        container: base => ({
            ...base,
            width: "100%"
        }),
        singleValue: base => ({
            ...base,
            color: "#ef6c00"
        }),
    }

    const resetDate = () => {
        setDateObj(null)
        setDate('dd/mm/yyyy')
        setTimeStart(null)
        setTimeEnd(null)
        setTimeStartOptions([])
        setTimeEndOptions([])
    }

    const getTimeList = (temp) => {
        let finalTemp = new Date(temp)
        if(temp.getDate() !== new Date().getDate())
            temp = new Date(temp.setHours(7))
        finalTemp = new Date(new Date(finalTemp.setHours(18)).setMinutes(0))
        let array = []
        let valMin = null
        while(temp.getTime() < finalTemp.getTime()){
            valMin = getRoundedDate(30, new Date(temp.setMinutes(temp.getMinutes() + 30)))
            array.push({value: `${formatTime('hours', valMin.getHours())}:${formatTime('min', valMin.getMinutes())}`,
                        label: `${formatTime('hours', valMin.getHours())}:${formatTime('min', valMin.getMinutes())}`})
        }
        return array
    }

    const formatTime = (type, val) => {
        if(type === "min"){
            if(parseInt(val)===0)
                return '00'
        }
        else
            if(parseInt(val)<10)
                return `0${val}`

        return val
    }

    const updateHours = (dt) => {
        setTimeStart(null)
        setTimeEnd(null)
        setTimeEndOptions(getTimeList(new Date(dt)))
        setTimeStartOptions(getTimeList(new Date(dt)))
    }

    const getRoundedDate = (minutes, d=new Date()) => {
        let ms = 1000 * 60 * minutes;
        let roundedDate = new Date(Math.round(d.getTime() / ms) * ms);
        return roundedDate
    }

    const mapBoxesToDisplay = () => {
        return items.map((val, i) => {
            return(
                <div key={i} className={styles.box_case}>
                    <div className={styles.box}>
                        {val}
                    </div>
                </div>
            )
        })
    }
    const arrowClick = (val) => {
        navigate({
            pathname: `/servicos/${id}`,
            search: `?p=${currPage + val}`
        })   
    }

    const arrowStyle = {
        color: id==="eletricistas"?orange[800]
        :id==="canalizadores"?red[600]
        :orange[600],
        fontSize:30
    }

    const getMaxDate = () => {
        let val = new Date()
        val.setMonth(new Date().getMonth() + 6)
        return val
    }

    const dateSelectHandler = (val) => {
        setDateObj(new Date(val))
        let aux = new Date(val)
        let day = aux.getDate()>9?aux.getDate():`0${aux.getDate()}`
        let month = aux.getMonth()<9?`0${aux.getMonth() + 1}`:aux.getMonth()+1
        let year = aux.getFullYear()
        setDate(`${day}/${month}/${year}`)
        updateHours(val)
    }

    const getMinDate = () => {
        const minDate = new Date()
        const tomorrow = new Date(minDate.getTime() + (1000 * 60 * 60 * 24))
        return tomorrow
    }
    return (
        <div className={styles.servicos}>
            <div className={styles.flex}>
                <div className={styles.flex_left}>
                    <div className={styles[`left_${id}`]}>
                        <div className={styles.select}>
                            <TopSelect
                                id={id}
                                resetDate={() => resetDate()}  
                            />
                        </div>
                        <div className={styles.left_area_calendar}>
                            <p className={styles.calendar_title}>Data e Hora</p>
                            <div className={styles.calendar_div}>
                                <div className={styles.calendar_input} style={{borderBottom:date==="dd/mm/yyyy"?"1px dashed #ccc":"1px solid #ef6c00"}}>
                                    <p className={date !== "dd/mm/yyyy"?styles.date_selected:styles.date_not_selected}>{date}</p>
                                </div>
                                <Calendar className={styles.calendar_new}
                                    locale="pt-PT"
                                    minDate={getMinDate()}
                                    next2Label=""
                                    prev2Label=""
                                    view="month"
                                    minDetail="month"
                                    maxDate={getMaxDate()}
                                    onChange={val => dateSelectHandler(val)}
                                    value={dateObj}
                                    formatShortWeekday={(locale, date) => dayjs(date).format('dd')}
                                    />
                                <div className={styles.hour_div}>
                                    <div className={styles.calendar_input_hora_start} style={{borderBottom:timeStart!==null && timeEnd !== null?"1px solid #ef6c00":timeStart!==null?"1px dashed #ef6c00":"1px dashed #ccc"}}>
                                        <Select
                                            styles={stylesTimeSelect}
                                            placeholder={<p style={{color:"#ccc"}}>HH:MM</p>}
                                            options={timeStartOptions}
                                            value={timeStartOptions.filter(option => option.value === timeStart)}
                                            isSearchable={false}
                                            onChange={value => {
                                                setTimeStart(value.value)
                                            }}
                                            components={{ DropdownIndicator:() => null, 
                                                IndicatorSeparator:() => null }}
                                            noOptionsMessage={() => {

                                                return "Escolhe uma data"
                                            }}
                                        />                                </div>
                                    <div className={styles.calendar_input_hora_end}>
                                        <Select
                                            styles={stylesTimeSelect}
                                            placeholder={<p style={{color:"#ccc"}}>HH:MM</p>}
                                            options={timeEndOptions}
                                            value={timeEndOptions.filter(option => option.value === timeEnd)}
                                            isSearchable={false}
                                            onChange={value => {
                                                setTimeEnd(value.value)
                                            }}
                                            components={{ DropdownIndicator:() => null, 
                                                IndicatorSeparator:() => null }}
                                            noOptionsMessage={() => null}
                                        />
                                    </div>
                                    <img className={styles.hour_arrow} src={curveArrow}/>
                                    <p className={styles.limpar} onClick={() => resetDate()}>Limpar</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.left_logo}>
                            <img className={styles.left_logo_img} src={id==="eletricistas"?elec
                                                                        :id==="canalizadores"?cana
                                                                        :carp}/>
                        </div>
                    </div>
                </div>
                <div className={styles.flex_right}>
                    <div className={styles.top}>
                        <div className={styles[`top_${id}`]}>
                        </div>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.search_div}>
                            <input className={styles.search}></input>
                        </div>
                        <div className={styles.grid}>
                            {mapBoxesToDisplay()}
                        </div>
                        <div className={styles.num}>
                            {
                                currDisplay === "solo"?
                                <span></span>
                                :currDisplay === "init"?
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <span style={{color:"white"}}>_</span>
                                        <span style={{color:"white"}}>_</span>
                                        <span className={styles.num_style}>{currPage}</span>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(1)}>{currPage + 1}</span>
                                        <ArrowCircleRightIcon className={styles.arrow} sx={arrowStyle}
                                                    onClick={() => arrowClick(1)}/>
                                        
                                    </div>
                                </div>
                                :currDisplay === "middle"?
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <ArrowCircleLeftIcon className={styles.arrow} sx={arrowStyle}
                                                    onClick={() => arrowClick(-1)}/>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(-1)}>{currPage - 1}</span>
                                        <span className={styles.num_style}>{currPage}</span>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(1)}>{currPage + 1}</span>
                                        <ArrowCircleRightIcon className={styles.arrow} sx={arrowStyle}
                                                    onClick={() => arrowClick(1)}/>
                                    </div>
                                </div>
                                :
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <ArrowCircleLeftIcon className={styles.arrow} sx={arrowStyle}
                                                    onClick={() => arrowClick(-1)}/>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(-1)}>{currPage - 1}</span>
                                        <span className={styles.num_style}>{currPage}</span>
                                        <span style={{color:"white"}}>__</span>
                                        <span style={{color:"white"}}>__</span>
                                    </div>
                                </div>
                            }
                        </div>
                        
                        
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Servicos;
