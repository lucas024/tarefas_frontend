import React, { useEffect, useState, forwardRef } from 'react';
import styles from './servicos.module.css'
import { useParams, useSearchParams } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import { useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css" 
import pt from 'date-fns/locale/pt';
import Select from 'react-select'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import TopSelect from '../styling/selectStyling';

const Servicos = () => {

    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currPage, setCurrPage] = useState(0)
    const [currDisplay, setCurrDisplay] = useState("solo")
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    const [date, setDate] = useState('dd/mm/yyyy')
    const [timeStart, setTimeStart] = useState(null)
    const [timeEnd, setTimeEnd] = useState(null)
    const [timeStartOptions, setTimeStartOptions] = useState([])
    const [timeEndOptions, setTimeEndOptions] = useState([])

    useEffect(() => {
        let aux = []
        for(let i = 0; i < 80; i++) aux.push(i)
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
        console.log(timeStart);
        if(timeStart !== null){
            let tempo = new Date()
            console.log(timeStart.slice(3));
            console.log(timeStart.slice(0,2));
            tempo.setMinutes(parseInt(timeStart.slice(3)))
            tempo.setHours(parseInt(timeStart.slice(0,2)))
            console.log(tempo);
            setTimeEndOptions(getTimeList(new Date(tempo)))
        }
    }, [timeStart])

    useEffect(() => {

    }, [timeEnd])

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
        let aux = new Date(val)
        let day = aux.getDate()>9?aux.getDate():`0${aux.getDate()}`
        let month = aux.getMonth()<9?`0${aux.getMonth() + 1}`:aux.getMonth()+1
        let year = aux.getFullYear()
        setDate(`${day}/${month}/${year}`)
        updateHours(val)
    }
    return (
        <div className={styles.servicos}>
            <div className={styles.flex}>
                <div className={styles.flex_left}>
                    <div className={styles[`left_${id}`]}>
                        <div className={styles.left_spacing}></div>
                        <div className={styles.select}>
                            <TopSelect
                                id={id}    
                            />
                        </div>
                        <div className={styles.left_area_calendar}>
                            <p className={styles.calendar_title}>Data e Hora</p>
                            <div className={styles.calendar_div}>
                                <div className={styles.calendar_input} style={{borderBottom:date==="dd/mm/yyyy"?"4px solid #ddd":"4px solid #ef6c00"}}>
                                    <p className={date !== "dd/mm/yyyy"?styles.date_selected:styles.date_not_selected}>{date}</p>
                                </div>
                                <Calendar className={styles.calendar_new}
                                    locale="pt-PT"
                                    minDate={new Date()}
                                    next2Label=""
                                    prev2Label=""
                                    view="month"
                                    minDetail="month"
                                    maxDate={getMaxDate()}
                                    onChange={val => dateSelectHandler(val)}
                                    />
                                <div className={styles.calendar_input_hora_start}>
                                    <Select
                                        //styles={stylesSelect}
                                        placeholder="hh:mm"
                                        options={timeStartOptions}
                                        value={timeStartOptions.filter(option => option.value === timeStart)}
                                        isSearchable={false}
                                        onChange={value => {
                                            setTimeStart(value.value)
                                        }}
                                        components={{ DropdownIndicator:() => null, 
                                            IndicatorSeparator:() => null }}
                                    />                                </div>
                                <div className={styles.calendar_input_hora_end}>
                                    {/* <p className={timeEnd !== "hh:mm"?styles.date_selected:styles.date_not_selected}>{timeEnd}</p> */}
                                    <Select
                                        //styles={stylesSelect}
                                        placeholder="hh:mm"
                                        options={timeEndOptions}
                                        value={timeEndOptions.filter(option => option.value === timeEnd)}
                                        isSearchable={false}
                                        onChange={value => {
                                            setTimeEnd(value.value)
                                        }}
                                        components={{ DropdownIndicator:() => null, 
                                            IndicatorSeparator:() => null }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.flex_right}>
                    <div className={styles.top}>
                        <div className={styles[`top_${id}`]}>
                        </div>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.grid}>
                            {mapBoxesToDisplay()}
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
                                <span></span>
                            </div>
                        </div>
                        
                        
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Servicos;
