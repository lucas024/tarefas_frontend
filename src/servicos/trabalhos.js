import React, { useEffect, useState, useRef } from 'react';
import styles from './trabalhadores.module.css'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import SelectPublications from '../selects/selectPublications';
import Row from './row';
import Loader from './../general/loader';
import NoPage from '../general/noPage';
import clearIcon from '../assets/search_clear.png'
import {regioesOptions, profissoesOptions} from '../general/util'

require('dayjs/locale/pt')

const Trabalhos = (props) => {

    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currPage, setCurrPage] = useState(0)
    const [currDisplay, setCurrDisplay] = useState("solo")
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    const [scrollPosition, setScrollPosition] = useState(0)
    const [loading, setLoading] = useState(false)
    const [clear, setClear] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    dayjs.locale('pt')
    const [allItems, setAllItems] = useState([])
    const [locationActive, setLocationActive] = useState(null)
    const [workerActive, setWorkerActive] = useState(null)
    const [listAnim, setListAnim] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [trabalhosVistos, setTrabalhosVistos] = useState([])


    const myRef = useRef(null)

    
    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        paramsAux.region?setLocationActive(paramsAux.region):setLocationActive(false)
        paramsAux.work?setWorkerActive(paramsAux.work):setWorkerActive(false)
        setCurrPage(paramsAux.page)  
        let listaTrabalhosVistos = JSON.parse(window.localStorage.getItem('listaTrabalhosVistos'))
        if(listaTrabalhosVistos?.length>0)
        {
            console.log(listaTrabalhosVistos);
            setTrabalhosVistos(listaTrabalhosVistos)
        }

    }, [searchParams])

    
    useEffect(() => {
        if(locationActive||workerActive){
            fetchJobsByFilter()
        }
        else if(locationActive===false && workerActive===false){
            fetchJobs()
        }
    }, [locationActive, workerActive])
    

    useEffect(() => {
        setLoaded(props.userLoadAttempt)

        return () => setLoaded(false)
    }, [props.userLoadAttempt])

    useEffect(() => {
        if(allItems!==null){
            if(allItems.length >= currPage*24 && currPage>1){
                if(allItems.length > (currPage*24 + 24)) setItems(allItems.slice((currPage-1)*24,(currPage-1)*24+24))
                else setItems(allItems.slice((currPage-1)*24, (currPage)*24 + 24 - (currPage-1)*24 + 24 - allItems.length))
                setCurrDisplay("middle")
            }
            else if(allItems.length < currPage*24 && currPage>1){
                setItems(allItems.slice((currPage-1)*24))
                setCurrDisplay("last")
            }
            else{
                setCurrPage(1)
                if(allItems.length > 24){
                    setItems(allItems.slice(0,24))
                    setCurrDisplay("init")
                }
                else{
                    setItems(allItems)
                    setCurrDisplay("solo")
                }
            }
        }
    }, [allItems])

    const fetchJobs = () => {
        setLoading(true)
        axios.get(`${props.api_url}/reservations`).then(res => {
            if(res.data!==null){
                let arr = res.data
                setAllItems(arr)
            }
            setLoading(false)
        })
    }


    const fetchJobsByFilter = () => {
        setListAnim(true)
        setLoading(true)
        if(searchVal===""&&!workerActive&&!locationActive)
        {
            fetchJobs()
        }
        else
        {
            var searchValFinal = ""
            if(searchVal!=="")
            {
                for(let el of searchVal.split(' '))
                {
                    searchValFinal += `\"${el}\" `
                }
            }
            axios.post(`${props.api_url}/reservations/get_reservations_by_filter`, {
                region: locationActive,
                trabalho: workerActive,
                search: searchValFinal
            }).then(res => {
                if(res.data!=='non_existing'){
                    let arr = res.data
                    setAllItems(arr)
                }
                setLoading(false)
            }).catch(err => console.log(err))
        }
    }
    
    const getSearchParams = id => {
        if(workerActive&&locationActive){
            return `?id=${id}&page=${currPage}&work=${workerActive}&region=${locationActive}`
        }
        else if(workerActive){
            return `?id=${id}&page=${currPage}&work=${workerActive}`
        }
        else if(locationActive){
            return `?id=${id}&page=${currPage}&region=${locationActive}`
        }
        else{
            return `?id=${id}&page=${currPage}`
        }
    }

    const navigatePubHandler = (id) => {
        navigate(`/main/publications/publication${getSearchParams(id)}`, {
                    state: {
                        fromUserPage: false,
                    }
                }
            )
    }

    const extenseDate = timestamp => {
        let iso_date = new Date(timestamp)
        let day = iso_date.toISOString().split("T")[0].slice(-2)
        let month = monthNames[parseInt(iso_date.toISOString().split("T")[0].slice(5,7))]
        let year = iso_date.toISOString().split("T")[0].slice(0,4)
        return `${day} de ${month}, ${year}`
    }

    const getDiffDate = (prevDate, currDate) => {
        const prev = new Date(prevDate)
        const curr = new Date(currDate)
        return prev.getDate() !== curr.getDate()
    }

    const mapRowsToDisplay = () => {
        return items?.map((item, i) => {
            return(
                <div key={i} className={styles.row}>
                    {
                        i>0&&getDiffDate(items[i-1].timestamp, item.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(item.timestamp)}</span>
                        </div>
                        :null
                    }
                    <Row
                        onClick={() => navigatePubHandler(item._id)}
                        item={item}
                        locationActive={locationActive}
                        workerActive={workerActive}
                        user={props.user}
                        trabalhoVisto={trabalhosVistos.includes(item._id)}
                    />
                </div>
            )
        })
    }
    const arrowClick = (val) => {
        navigate({
            search: `?p=${currPage + val}`
        })
        handleScrollTop()
    }


    const handleScroll = async event => {
        const {scrollTop} = event.target.scrollTop
        if(scrollTop > 0 ){
            setScrollPosition(true)
        }
        else setScrollPosition(false)
    }
    
    const handleScrollTop = () => {
        myRef.current.scrollIntoView()
    }
      
    const handleSearchVal = val => {
        setSearchVal(val.target.value)
        handleScrollTop()
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            fetchJobsByFilter()
        }
    }

    const limparPesquisa = () => {
        setLocationActive(false)
        setWorkerActive(false)
        searchParams.delete("work")
        searchParams.delete("region")
        setSearchParams(searchParams)
        setClear(!clear)
        setSearchVal("")
        fetchJobs()
    }

    return (
        <div className={styles.servicos}>
            <Loader loading={loading}/>
            <div className={styles.main} onScroll={handleScroll}>
                <div className={styles.search_div} ref={myRef}>
                    <div className={styles.search_input_div}>
                        <input value={searchVal} onKeyDown={handleKeyDown} onChange={val => handleSearchVal(val)} spellCheck={false} className={!scrollPosition?styles.searchTop:styles.search} placeholder={`Eletricista, Porto...`}></input>
                        {/* <PersonSearchIcon className={styles.search_input_div_icon}/> */}
                        <SearchIcon className={styles.search_final_icon} onClick={() => fetchJobsByFilter()}/>
                    </div>
                    <div className={styles.search_filter_div_wrapper}>
                        <div className={styles.search_filter_div}>
                            <SelectPublications 
                                type="zona" 
                                clear={clear}
                                urlVal={locationActive}
                                valueChanged={val => {
                                    workerActive&&setSearchParams({'work': workerActive, 'region': val})
                                    !workerActive&&setSearchParams({'region': val})
                                    setLocationActive(val)}}/>
                            <div style={{marginLeft:"10px"}}>
                                <SelectPublications
                                    type="worker"
                                    trabalho={true}
                                    clear={clear}
                                    urlVal={workerActive}
                                    valueChanged={val => {
                                        locationActive&&setSearchParams({'work': val, 'region': locationActive})
                                        !locationActive&&setSearchParams({'work': val})
                                        setWorkerActive(val)}}/>
                            </div>
                        </div>
                        <div className={styles.search_clear_wrapper} onClick={() => limparPesquisa()}>
                            <span className={styles.search_clear}>
                                Limpar Pesquisa
                            </span>
                            <img src={clearIcon} className={styles.search_clear_icon}/>
                        </div>
                    </div>
                </div>
                <div className={styles.divider}></div>          
                    <div className={styles.top_info}>
                        
                        {
                            allItems.length===1?
                            <span className={styles.top_info_numbers}>1 TRABALHO</span>
                            :<span className={styles.top_info_numbers}>{allItems.length} trabalhos</span>
                        }
                        <div className={styles.top_info_filter}>
                            <div className={styles.top_info_filter_flex}>
                                {/* <LocationOnIcon className={styles.top_info_filter_icon}/> */}
                                <span  className={styles.top_info_filter_text}>distrito</span>
                            </div>
                            {
                                locationActive?
                                <span  className={styles.top_info_filter_value_on}>
                                    {regioesOptions[locationActive]}
                                </span>
                                :
                                <span  className={styles.top_info_filter_value}>
                                    Todos
                                </span>
                            }
                        </div>
                        <div className={styles.top_info_filter}>
                            <div className={styles.top_info_filter_flex}>
                                {/* <PersonIcon className={styles.top_info_filter_icon}/> */}
                                <span  className={styles.top_info_filter_text}>Tipo de Trabalho</span>
                            </div>
                            {
                                workerActive?
                                <span  className={styles.top_info_filter_value_on}>
                                    {profissoesOptions[workerActive]}
                                </span>
                                :
                                <span  className={styles.top_info_filter_value}>
                                    Todos
                                </span>
                            }
                        </div>
                    </div>
                    {
                    items.length>0?
                    <div>
                        <div className={listAnim?styles.animList:styles.list} 
                                    onAnimationEnd={() =>{
                                        setListAnim(false)
                                    }}>
                            {
                                !loading?
                                mapRowsToDisplay()
                                :
                                <div>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                </div>
                            }
                        </div>
                        <div className={styles.num}>
                            {
                                currDisplay === "solo"?
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <span style={{color:"white"}}>_</span>
                                        <span style={{color:"white"}}>_</span>
                                        <span className={styles.num_style} style={{textDecoration:"underline"}}>{currPage}</span>
                                        <span style={{color:"white"}}>_</span>
                                        <span style={{color:"white"}}>_</span>
                                    </div>
                                </div>
                                :currDisplay === "init"?
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <span style={{color:"white"}}>_</span>
                                        <span style={{color:"white"}}>_</span>
                                        <span className={styles.num_style} style={{textDecoration:"underline"}}>{currPage}</span>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(1)}>{currPage + 1}</span>
                                        <ArrowForwardIosIcon className={styles.arrow}
                                                    onClick={() => arrowClick(1)}/>
                                        
                                    </div>
                                </div>
                                :currDisplay === "middle"?
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <ArrowBackIosNewIcon className={styles.arrow}
                                                    onClick={() => arrowClick(-1)}/>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(-1)}>{currPage - 1}</span>
                                        <span className={styles.num_style} style={{textDecoration:"underline"}}>{currPage}</span>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(1)}>{currPage + 1}</span>
                                        <ArrowForwardIosIcon className={styles.arrow}
                                                    onClick={() => arrowClick(1)}/>
                                    </div>
                                </div>
                                :
                                <div className={styles.num_flex}>
                                    <div className={styles.num_flex_content}>
                                        <ArrowBackIosNewIcon className={styles.arrow}
                                                    onClick={() => arrowClick(-1)}/>
                                        <span className={styles.num_style_side} onClick={() => arrowClick(-1)}>{currPage - 1}</span>
                                        <span className={styles.num_style} style={{textDecoration:"underline"}}>{currPage}</span>
                                        <span style={{color:"white"}}>__</span>
                                        <span style={{color:"white"}}>__</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    :loaded?
                        <NoPage object="no_search" limparPesquisa={() => limparPesquisa()}/>
                    :null
                }
            </div>
        </div>
    )
}

export default Trabalhos;
