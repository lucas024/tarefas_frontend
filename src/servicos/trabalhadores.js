import React, { useEffect, useState, useRef } from 'react'
import styles from './trabalhadores.module.css'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import Carta from './carta'
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import FilterSelect from './filterSelect'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import Loader from '../general/loader'
import NoPage from '../general/noPage'
import clearIcon from '../assets/search_clear.png'
import {regioesOptions, profissoesOptions} from '../general/util'

require('dayjs/locale/pt')


const Servicos = (props) => {

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
    const [gridAnim, setGridAnim] = useState(true)
    const [locationActive, setLocationActive] = useState(false)
    const [workerActive, setWorkerActive] = useState(false)
    const [loaded, setLoaded] = useState(false)
    
    const location = useLocation()

    const myRef = useRef(null)

    useEffect(() => {
        fetchWorkers()
        setClear(!clear)
        setLocationActive(false)
        setWorkerActive(false)
    //eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])
    
    useEffect(() => {
        setLoaded(props.userLoadAttempt)

        return () => setLoaded(false)
    }, [props.userLoadAttempt])

    useEffect(() => {
        console.log(window.history);
        if(window.history?.state?.usr?.from_page)
        {
            setGridAnim(false)
        }
        const paramsAux = Object.fromEntries([...searchParams])
        paramsAux.region&&setLocationActive(paramsAux.region)
        paramsAux.work&&setWorkerActive(paramsAux.work)
        let page = parseInt(paramsAux.p)
        if(allItems!==null){
            if(allItems.length >= page*24 && page>1){
                setCurrPage(page)
                if(allItems.length > (page*24 + 24)) setItems(allItems.slice((page-1)*24,(page-1)*24+24))
                else setItems(allItems.slice((page-1)*24, (page)*24 + 24 - (page-1)*24 + 24 - allItems.length))
                setCurrDisplay("middle")
            }
            else if(allItems.length < page*24 && page>1){
                setCurrPage(page)
                setItems(allItems.slice((page-1)*24))
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
        
    }, [allItems, searchParams])

    useEffect(() => {
        if(locationActive||workerActive){
            fetchWorkersByFilter()
        }
    }, [locationActive, workerActive])

    const fetchWorkersByFilter = () => {
            setLoading(true)
            if(searchVal===""&&!workerActive&&!locationActive)
            {
                limparPesquisa()
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
                axios.post(`${props.api_url}/worker/get_workers_by_filter`, {
                    region: locationActive,
                    trabalho: workerActive,
                    search: searchValFinal
                }).then(res => {
                    if(res.data!=='non_existing'){
                        let arr = res.data
                        arr = fisher_yates_shuffle(arr)
                        setAllItems(arr)
                    }
                    setLoading(false)
                }).catch(err => console.log(err))
            }

    }

    const fetchWorkers = () => {
        setLoading(true)
        axios.get(`${props.api_url}/workers`).then(res => {
            if(res.data!==null){
                let arr = res.data
                arr = fisher_yates_shuffle(arr)
                setAllItems(arr)
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

    const getSearchParams = worker_id => {
        if(workerActive&&locationActive){
            return `?id=${worker_id}&page=${currPage}&work=${workerActive}&region=${locationActive}`
        }
        else if(workerActive){
            return `?id=${worker_id}&page=${currPage}&work=${workerActive}`
        }
        else if(locationActive){
            return `?id=${worker_id}&page=${currPage}&region=${locationActive}`
        }
        else{
            return `?id=${worker_id}&page=${currPage}`
        }
    }

    const mapBoxesToDisplay = () => {
        return items?.map((worker, i) => {
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
        fetchWorkers()
    }

    return (
        <div className={styles.servicos}>
            <Loader loading={loading}/>
            <div className={styles.main} onScroll={handleScroll}>
                <div className={styles.search_div} ref={myRef}>
                    <div className={styles.search_input_div}>
                        <input onKeyDown={handleKeyDown} value={searchVal} onChange={val => handleSearchVal(val)} spellCheck={false} className={!scrollPosition?styles.searchTop:styles.search} placeholder={`Eletricista, Porto...`}></input>
                        {/* <PersonSearchIcon className={styles.search_input_div_icon}/> */}
                        <SearchIcon className={styles.search_final_icon} onClick={() => fetchWorkersByFilter()}/>
                    </div>
                    <div className={styles.search_filter_div_wrapper}>
                        <div className={styles.search_filter_div}>
                            <FilterSelect 
                                    type="zona" 
                                    clear={clear}
                                    urlVal={locationActive}
                                    valueChanged={val => {
                                        workerActive&&setSearchParams({'work': workerActive, 'region': val})
                                        !workerActive&&setSearchParams({'region': val})
                                        setLocationActive(val)}}/>
                            <div style={{marginLeft:"10px"}}>
                                <FilterSelect 
                                    type="worker" 
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
                            <span className={styles.top_info_numbers}>1 TRABALHADOR</span>
                            :<span className={styles.top_info_numbers}>{allItems.length} trabalhadores</span>
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
                                <span  className={styles.top_info_filter_text}>Tipo de Trabalhador</span>
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
                        {
                            !loading?
                            <div style={{gridTemplateRows: `repeat(${Math.ceil(items.length/2+1)}, 250px)`}} className={gridAnim?styles.animGrid:styles.grid}
                            onAnimationEnd={() =>{
                                setGridAnim(false)
                            }}>
                                {mapBoxesToDisplay()}
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
                        <div className={styles.num}>
                            {
                                currDisplay === "solo"?
                                <span></span>
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

export default Servicos;
