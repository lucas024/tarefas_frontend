import React, { useEffect, useState, useRef } from 'react';
import styles from './main.module.css'
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import SelectPublications from '../selects/selectPublications';
import Row from './row';
import Loader from '../general/loader';
import NoPage from '../general/noPage';
import clearIcon from '../assets/search_clear.png'
import {regioesOptions, profissoesOptions} from '../general/util'
import SelectPosts from '../selects/selectPosts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import Carta from './carta'

require('dayjs/locale/pt')

const Main = (props) => {

    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currPage, setCurrPage] = useState(0)
    const [currDisplay, setCurrDisplay] = useState("solo")
    const [items, setItems] = useState(null)
    const navigate = useNavigate()
    const [scrollPosition, setScrollPosition] = useState(0)
    const [loading, setLoading] = useState(false)
    const [clear, setClear] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    dayjs.locale('pt')
    const [allItems, setAllItems] = useState(null)
    const [locationActive, setLocationActive] = useState(null)
    const [workerActive, setWorkerActive] = useState(null)
    const [listAnim, setListAnim] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [trabalhosVistos, setTrabalhosVistos] = useState([])
    const [gridAnim, setGridAnim] = useState(true)

    const [selectedType, setSelectedType] = useState('trabalhos')


    const myRef = useRef(null)
    const location = useLocation()
    
    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        let arrPathnameAux = location.pathname.split('/')
        setSelectedType(arrPathnameAux[3])
    }, [location])

    useEffect(() => {
        if(selectedType==='trabalhos')
        {
            fetchJobs()
            let listaTrabalhosVistos = JSON.parse(window.localStorage.getItem('listaTrabalhosVistos'))
            if(listaTrabalhosVistos?.length>0)
            {
                setTrabalhosVistos(listaTrabalhosVistos)
            }
            setGridAnim(true)
        }
        else
        {
            fetchWorkers()
            if(window.history?.state?.usr?.from_page)
            {
                setGridAnim(false)
            }
        }
    }, [selectedType])
    
    useEffect(() => {
        const paramsAux = Object.fromEntries([...searchParams])
        paramsAux.region?setLocationActive(paramsAux.region):setLocationActive(false)
        paramsAux.work?setWorkerActive(paramsAux.work):setWorkerActive(false)
        setCurrPage(paramsAux.page)  
    }, [searchParams])

    
    useEffect(() => {
        if(locationActive||workerActive){
            if(selectedType==="trabalhos")
                fetchJobsByFilter()
            else
                fetchWorkersByFilter()
        }
        else if(locationActive===false && workerActive===false){
            if(selectedType==="trabalhos")
            {
                fetchJobs()
            }
               
            else{
                fetchWorkers()
            }
                
        }
    }, [locationActive, workerActive])
    

    useEffect(() => {
        setLoaded(props.userLoadAttempt)

        return () => setLoaded(false)
    }, [props.userLoadAttempt])

    useEffect(() => {
        if(allItems!==null){
            console.log(allItems)
            if(allItems.data.length >= currPage*24 && currPage>1){
                if(allItems.length > (currPage*24 + 24)) setItems({data: allItems.data.slice((currPage-1)*24,(currPage-1)*24+24), type:allItems.type})
                else setItems({data: allItems.data.slice((currPage-1)*24, (currPage)*24 + 24 - (currPage-1)*24 + 24 - allItems.data.length), type:allItems.type})
                setCurrDisplay("middle")
            }
            else if(allItems.data.length < currPage*24 && currPage>1){
                setItems({data: allItems.data.slice((currPage-1)*24), type:allItems.type})
                setCurrDisplay("last")
            }
            else{
                setCurrPage(1)
                if(allItems.data.length > 24){
                    setItems({data: allItems.data.slice(0,24), type:allItems.type})
                    setCurrDisplay("init")
                }
                else{
                    setItems({data: allItems.data, type:allItems.type})
                    setCurrDisplay("solo")
                }
            }
        }
    }, [allItems])

    const fetchJobs = () => {
        setLoading(true)
        axios.get(`${props.api_url}/reservations`).then(res => {
            if(res.data!==null){
                console.log(res.data.data)
                setListAnim(true)
                setAllItems({data: res.data.data, type: 'trabalhos'})
            }
            setLoading(false)
        })
    }


    const fetchJobsByFilter = () => {
        setLoading(true)
        console.log("use efefe")
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
                region: ((locationActive==null) || (locationActive===undefined))?false:locationActive!=='none'?locationActive:false,
                trabalho: ((workerActive==null) || (workerActive===undefined))?false:workerActive!=='none'?workerActive:false,
                search: searchValFinal
            }).then(res => {
                if(res.data!=='non_existing'){
                    let arr = res.data.data
                    setListAnim(true)
                    setAllItems({data: arr, type: 'trabalhos'})
                }
                setLoading(false)
            }).catch(err => console.log(err))
        }
    }

    const fetchWorkersByFilter = () => {
        console.log('teste')
        setLoading(true)
        var searchValFinal = ""
        if(searchVal!=="")
        {
            for(let el of searchVal.split(' '))
            {
                searchValFinal += `\"${el}\" `
            }
        }
        axios.post(`${props.api_url}/worker/get_workers_by_filter`, {
            region: ((locationActive==null) || (locationActive===undefined))?false:locationActive!=='none'?locationActive:false,
            trabalho: ((workerActive==null) || (workerActive===undefined))?false:workerActive!=='none'?workerActive:false,
            search: searchValFinal
        }).then(res => {
            if(res.data!=='non_existing'){
                console.log(res.data)
                let arr = res.data.data
                arr = fisher_yates_shuffle(arr)
                setAllItems({data: arr, type: 'trabalhadores'})
            }
            setLoading(false)
        }).catch(err => console.log(err))

    }

    const fetchWorkers = () => {
        setLoading(true)
        axios.get(`${props.api_url}/workers`).then(res => {
            if(res.data!==null){
                let arr = res.data.data
                arr = fisher_yates_shuffle(arr)
                setAllItems({data: arr, type: 'trabalhadores'})
            }
            setLoading(false)
        })
    }
    const fisher_yates_shuffle = arr => {
        let i = arr.length;
        while (--i > 0) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
        }
        return arr;
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
        return items?.data.map((item, i) => {
            return(
                <div key={i} className={styles.row}>
                    {
                        i>0&&getDiffDate(items[i-1].timestamp, item.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(item.timestamp)}</span>
                        </div>
                        :null
                    }
                    <div onClick={() => navigatePubHandler(item._id)}>
                        <Row
                            item={item}
                            locationActive={locationActive}
                            workerActive={workerActive}
                            user={props.user}
                            trabalhoVisto={trabalhosVistos.includes(item._id)}
                        />
                    </div>
                    
                </div>
            )
        })
    }

    const mapBoxesToDisplay = () => {
        console.log(items)
        return items?.data.map((worker, i) => {
            return(
                <div key={i} className={styles.box_case} onClick={() => navigate({
                                                                    pathname: `/main/publications/trabalhador`,
                                                                    search: getSearchParams(worker._id)
                                                                })}>
                    <Carta
                        user={props.user}
                        id={id}
                        worker={worker}
                        locationActive={locationActive}
                        workerActive={workerActive}
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
            if(selectedType==="trabalhos")
                fetchJobsByFilter()
            else
                fetchWorkersByFilter()
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
        if(selectedType==="trabalhos")
            fetchJobs()
        else
            fetchWorkers()
    }

    const options = [
        { value: 'trabalhadores', label: 'trabalhadores' },
        { value: 'trabalhos', label: 'trabalhos' },
    ]

    return (
        <div className={styles.servicos}>
            <Loader loading={loading}/>
            <div className={styles.main} onScroll={handleScroll}>
                <div className={styles.search_div} ref={myRef}>
                    <div className={styles.search_left}>
                    <SelectPosts
                        options={options}
                        type={selectedType}
                    />
                    </div>
                    <div className={styles.search_right}>
                        <div className={styles.search_input_div}>
                            <input 
                                value={searchVal} 
                                onKeyDown={handleKeyDown} 
                                onChange={val => handleSearchVal(val)} 
                                spellCheck={false} 
                                className={!scrollPosition?styles.searchTop:styles.search} 
                                placeholder={`Eletricista, Porto...`}></input>
                            <SearchIcon 
                                className={styles.search_final_icon} 
                                style={{backgroundColor:selectedType==='trabalhos'?'#0358e5':'#FF785A'}} 
                                onClick={() => searchVal.length>0?selectedType==="trabalhos"?fetchJobsByFilter():fetchWorkersByFilter():{}}/>
                        </div>
                        <div className={styles.search_filter_div_wrapper}>
                            <div className={styles.search_filter_div}>
                            <SelectPublications
                                        type="worker"
                                        trabalho={true}
                                        clear={clear}
                                        urlVal={workerActive}
                                        selected={selectedType}
                                        valueChanged={val => {
                                            locationActive&&setSearchParams({'work': val, 'region': locationActive})
                                            !locationActive&&setSearchParams({'work': val})
                                            setWorkerActive(val)}}/>
                                
                                <div style={{marginLeft:"10px"}}>
                                <SelectPublications 
                                    type="zona"
                                    clear={clear}
                                    urlVal={locationActive}
                                    selected={selectedType}
                                    valueChanged={val => {
                                        workerActive&&setSearchParams({'work': workerActive, 'region': val})
                                        !workerActive&&setSearchParams({'region': val})
                                        setLocationActive(val)}}/>
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

                </div>
                <div className={styles.divider}></div>          
                    <div className={styles.top_info}>
                        
                        {
                            allItems?.data.length===1?
                            <span className={styles.top_info_numbers}>1 {selectedType.slice(0, selectedType==="trabalhos"?-1:-2)}</span>
                            :<span className={styles.top_info_numbers}>{allItems?.data.length?allItems?.data.length:0} {selectedType}</span>
                        }
                        <div className={styles.top_info_filter}>
                            <div className={styles.top_info_filter_flex}>
                                {
                                    workerActive?
                                    <BuildIcon className={styles.top_info_filter_icon}/>
                                    :
                                    <BuildOutlinedIcon className={styles.top_info_filter_icon}/>
                                }
                            </div>
                            {
                                workerActive?
                                <span className={styles.top_info_filter_value_on}>
                                    {profissoesOptions[workerActive]}
                                </span>
                                :
                                <span  className={styles.top_info_filter_value}>
                                    Todos
                                </span>
                            }
                        </div>
                        <div className={styles.top_info_filter}>
                            <div className={styles.top_info_filter_flex}>
                                {
                                    locationActive?
                                    <LocationOnIcon className={styles.top_info_filter_icon}/>
                                    :
                                    <LocationOnOutlinedIcon className={styles.top_info_filter_icon}/>
                                }
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
                    </div>
                    {
                    items?.data.length>0?
                    <div>
                        <div className={listAnim?styles.animList:styles.list} 
                                    onAnimationEnd={() =>{
                                        setListAnim(false)
                                    }}>
                            {
                                selectedType==="trabalhos"?
                                !loading?  
                                    items?.type==="trabalhos"?
                                    mapRowsToDisplay()
                                    :null
                                :
                                <div>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                </div>
                                :
                                !loading?
                                <div style={{gridTemplateRows: `repeat(${Math.ceil(items?.data.length/2+1)}, 140px)`}} 
                                        className={gridAnim?styles.animGrid:styles.grid}
                                        onAnimationEnd={() => setGridAnim(false)}
                                >
                                {
                                    items?.type==="trabalhadores"?
                                    mapBoxesToDisplay()
                                    :null
                                }
                                </div>
                                :
                                <div className={gridAnim?styles.animGrid:styles.grid}>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div className={styles.loading_skeleton}/>
                                    <div style={{marginTop:"30px"}} className={styles.loading_skeleton}/>
                                    <div style={{marginTop:"30px"}} className={styles.loading_skeleton}/>
                                    <div style={{marginTop:"30px"}} className={styles.loading_skeleton}/>
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
                                        <ArrowForwardIosIcon className={styles.arrow_disabled}/>
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
                        <NoPage type={selectedType} object="no_search" limparPesquisa={() => limparPesquisa()}/>
                    :null
                }
            </div>
        </div>
    )
}

export default Main;
