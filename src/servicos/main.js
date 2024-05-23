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
import {regioesMap, profissoesMap} from '../general/util'
import SelectPosts from '../selects/selectPosts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Carta from './carta'
import { useSelector, useDispatch } from 'react-redux'
import { search_save, search_scroll_save } from '../store';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ConstructionIcon from '@mui/icons-material/Construction';


require('dayjs/locale/pt')

const Main = (props) => {
    const api_url = useSelector(state => {return state.api_url})
    const search_context = useSelector(state => {return state.search_context})
    const search_scroll = useSelector(state => {return state.search_scroll})
    const user = useSelector(state => {return state.user})
    
    const dispatch = useDispatch()

    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [params, setParams] = useState({work: false, region: false})
    const [currPage, setCurrPage] = useState(1)
    const [currDisplay, setCurrDisplay] = useState("solo")
    const [items, setItems] = useState(null)
    const navigate = useNavigate()
    const [scrollPosition, setScrollPosition] = useState(0)
    const [loading, setLoading] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    dayjs.locale('pt')
    const [allItemsLength, setAllItemsLength] = useState(0)
    const [listAnim, setListAnim] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [trabalhosVistos, setTrabalhosVistos] = useState([])

    const [selectedType, setSelectedType] = useState(null)
    const [visualSelected, setVisualSelected] = useState(null)


    const myRef = useRef(null)
    const postRef = useRef(null)
    
    const location = useLocation()
    
    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const limit = 10

    useEffect(() => {
        let arr_pathname = location.pathname.split('/')
        const paramsAux = Object.fromEntries([...searchParams])
        if(!paramsAux.work && !paramsAux.region)
            setParams({work: false, region: false})
        else
            setParams(paramsAux)
        setSelectedType(arr_pathname[3])

        if(arr_pathname[3]==="trabalhos") setVisualSelected("tarefas")
        else setVisualSelected("profissionais")

        if(search_context?.list == null 
            || ((search_context?.work !== paramsAux.work) && paramsAux.work != undefined)
            || ((search_context?.region !== paramsAux.region) && paramsAux.region != undefined
            || search_context?.type !== arr_pathname[3]
            || (paramsAux.region == null && paramsAux.work == null)))
        {
            dispatch(search_scroll_save(null))
            if(paramsAux.region||paramsAux.work){
                if(arr_pathname[3]==="trabalhos")
                    fetchJobsByFilter(paramsAux)
                else
                    fetchWorkersByFilter(paramsAux)
            }
            else{
                if(arr_pathname[3]==="trabalhos")
                {
                    fetchJobs(paramsAux)
                }
                else{
                    fetchWorkers(paramsAux)
                }
            }
            if(arr_pathname[3]==="trabalhos")
            {
                let listaTrabalhosVistos = JSON.parse(window.localStorage.getItem('listaTrabalhosVistos'))
                if(listaTrabalhosVistos?.length>0)
                {
                    setTrabalhosVistos(listaTrabalhosVistos) 
                }
            }
            else
            {
                if(window.history?.state?.usr?.from_page) setListAnim(false)
                else setListAnim(true)
            }
        }
        else
        {
            setItems(search_context.list)
            setAllItemsLength(search_context.list.data.length)            
        }
    }, [location, searchParams])

    useEffect(() => {
        setLoaded(props.userLoadAttempt)

        return () => setLoaded(false)
    }, [props.userLoadAttempt])

    useEffect(() => {
        if(items?.data?.length>0)
        {
            postRef?.current?.scrollIntoView()
        }
    }, [items])

    const setItemsAux = (items, size, currPage) => {
        if(items!==null){
            let items_aux = {data: items.data, type: items.type}

            if(size >= currPage*limit && currPage>1){
                setCurrDisplay("middle")
            }
            else if(size < currPage*limit && currPage>1){
                setCurrDisplay("last")
            }
            else{
                if(size > limit){
                    setCurrDisplay("init")
                }
                else{
                    setCurrDisplay("solo")
                }
            }
            setItems(items_aux)
            let arr_pathname = location.pathname.split('/')
            let paramsAux = Object.fromEntries([...searchParams])
            setCurrPage(currPage)
            dispatch(search_save({
                list: items,
                work: paramsAux.work,
                region: paramsAux.region,
                type: arr_pathname[3],
                items_length: allItemsLength
            }))
        }
    }

    const fetchJobs = (params_aux) => {
        //passing params.p for page cause setting state takes too long
        setLoading(true)
        axios.get(`${api_url}/reservations`).then(res => {
            if(res.data!==null){
                let all_items = {data: res.data.data, type: 'trabalhos'}
                setListAnim(true)
                setAllItemsLength(res.data.size)
                setItemsAux(all_items, res.data.size, params_aux?.p?parseInt(params_aux?.p):1)
            }
            setLoading(false)
        })
    }


    const fetchJobsByFilter = (params_aux) => {
        setLoading(true)
        if(searchVal===""&&!params_aux.work&&!params_aux.region)
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
            axios.post(`${api_url}/reservations/get_reservations_by_filter`, {
                region: ((params_aux.region==null) || (params_aux.region===undefined))?false:params_aux.region!=='none'?params_aux.region:false,
                trabalho: ((params_aux.work==null) || (params_aux.work===undefined))?false:params_aux.work!=='none'?params_aux.work:false,
                search: searchValFinal
            }).then(res => {
                if(res.data!=='non_existing'){
                    let arr = res.data.data
                    let all_items = {data: res.data.data, type: 'trabalhos'}
                    setListAnim(true)
                    setAllItemsLength(res.data.size)
                    setItemsAux(all_items, res.data.size, params_aux?.p?parseInt(params_aux?.p):1)
                }
                setLoading(false)
            }).catch(err => {})
        }
    }

    const fetchWorkersByFilter = (params_aux) => {
        setLoading(true)
        var searchValFinal = ""
        if(searchVal!=="")
        {
            for(let el of searchVal.split(' '))
            {
                searchValFinal += `\"${el}\" `
            }
        }
        axios.post(`${api_url}/worker/get_workers_by_filter`, {
            region: ((params_aux.region==null) || (params_aux.region===undefined))?false:params_aux.region!=='none'?params_aux.region:false,
            trabalho: ((params_aux.work==null) || (params_aux.work===undefined))?false:params_aux.work!=='none'?params_aux.work:false,
            search: searchValFinal,
            limit: limit,
            skip: (currPage-1)*limit 
        }).then(res => {
            if(res.data!=='non_existing'){
                // let arr = res.data.data
                // arr = fisher_yates_shuffle(arr)
                let all_items = {data: res.data.data, type: 'profissionais'}
                setAllItemsLength(res.data.size)
                setItemsAux(all_items, res.data.size, params_aux?.p?parseInt(params_aux?.p):1)
            }
            setLoading(false)
        }).catch(err => {})

    }

    const fetchWorkers = (params_aux) => {
        setLoading(true)
        axios.get(`${api_url}/workers`, { params: {limit: limit, skip: (parseInt(params_aux?.p)-1)*limit } }).then(res => {
            if(res.data!==null){
                // let arr = res.data.data
                // arr = fisher_yates_shuffle(arr)
                let all_items = {data: res.data.data, type: 'profissionais'}
                setAllItemsLength(res.data.size)
                setItemsAux(all_items, res.data.size, params_aux?.p?parseInt(params_aux?.p):1)
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
        if(params.work&&params.region){
            return `?id=${id}&page=${currPage}&work=${params.work}&region=${params.region}`
        }
        else if(params.work){
            return `?id=${id}&page=${currPage}&work=${params.work}`
        }
        else if(params.region){
            return `?id=${id}&page=${currPage}&region=${params.region}`
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
                        i>0&&getDiffDate(items[i-1]?.timestamp, item?.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(item.timestamp)}</span>
                        </div>
                        :null
                    }
                    <div ref={i===search_scroll?postRef:null} onClick={() => {
                            dispatch(search_scroll_save(i))
                            navigate(`/main/publications/publication${getSearchParams(item._id)}`, {
                                    state: {
                                        fromUserPage: false,
                                    }
                                }
                            )}
                        }>
                        <Row
                            item={item}
                            locationActive={params.region}
                            workerActive={params.work}
                            user_id={user?._id}
                            trabalhoVisto={trabalhosVistos.includes(item._id)}
                        />
                    </div>
                    
                </div>
            )
        })
    }

    const mapBoxesToDisplay = () => {
        return items?.data.map((worker, i) => {
            return(
                <div key={i} ref={i===search_scroll?postRef:null} className={styles.box_case} onClick={() => {
                                                                    dispatch(search_scroll_save(i))
                                                                    navigate({
                                                                        pathname: `/main/publications/profissional`,
                                                                        search: getSearchParams(worker._id)
                                                                    })}
                                                                }>
                    <Carta
                        user_id={user?._id}
                        id={id}
                        worker={worker}
                        locationActive={params.region}
                        workerActive={params.work}
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
                fetchWorkersByFilter(params)
        }
    }

    const limparPesquisa = () => {
        setParams({work: false, region: false})
        searchParams.delete("work")
        searchParams.delete("region")
        setSearchParams(searchParams)
        setSearchVal("")
        dispatch(search_scroll_save(null))
        if(selectedType==="trabalhos")
            fetchJobs()
        else
            fetchWorkers()
    }

    const options = [
        { value: 'profissionais', label: 'profissionais' },
        { value: 'trabalhos', label: 'tarefas' },
    ]


    return (        
        <div className={styles.servicos}>
            <Loader loading={loading}/>
            <div className={styles.main}>
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
                                onClick={() => searchVal.length>0?selectedType==="trabalhos"?fetchJobsByFilter():fetchWorkersByFilter(params):{}}/>
                        </div>
                        <div className={styles.search_filter_div_wrapper}>
                            <div className={styles.search_filter_div}>
                                <div className={styles.search_filter_div_right}>
                                    <SelectPublications
                                            type="worker"
                                            trabalho={true}
                                            option={params.work}
                                            selected={selectedType}
                                            valueChanged={val => {
                                                params.region&&setSearchParams({'work': val, 'region': params.region})
                                                !params.region&&setSearchParams({'work': val})
                                                setParams({work: val, region: params.region})}}/>
                                </div>
                                
                                
                                <div className={styles.search_filter_div_left}>
                                    <SelectPublications 
                                        type="zona"
                                        regioes={true}
                                        option={params.region}
                                        selected={selectedType}
                                        valueChanged={val => {
                                            params.work&&setSearchParams({'work': params.work, 'region': val})
                                            !params.work&&setSearchParams({'region': val})
                                            setParams({work: params.work, region: val})}}/>
                                </div>
                            </div>
                            <div className={styles.search_clear_wrapper} onClick={() => limparPesquisa()}>
                                <span className={styles.search_clear}>
                                    Limpar Pesquisa
                                </span>
                                <HighlightOffIcon className={styles.search_clear_icon}/>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.divider}></div>          
                    <div className={styles.top_info}>
                        
                        {
                            allItemsLength===1?
                            <span className={styles.top_info_numbers}>1 {selectedType==="trabalhos"?"trabalho":"profissional"}</span>
                            :<span className={styles.top_info_numbers}>{allItemsLength} {visualSelected}</span>
                        }
                        <div className={styles.top_info_filter}>
                            <div className={styles.top_info_filter_flex}>
                                {
                                    params.work?
                                    <ConstructionIcon className={styles.top_info_filter_icon}/>
                                    :
                                    <ConstructionIcon className={styles.top_info_filter_icon}/>
                                }
                            </div>
                            {
                                params.work?
                                <span className={styles.top_info_filter_value_on}>
                                    {profissoesMap[params.work]?.label}
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
                                    params.region?
                                    <LocationOnIcon className={styles.top_info_filter_icon}/>
                                    :
                                    <LocationOnOutlinedIcon className={styles.top_info_filter_icon}/>
                                }
                            </div>
                            {
                                params.region?
                                <span  className={styles.top_info_filter_value_on}>
                                    {regioesMap[params.region].label}
                                </span>
                                :
                                <span  className={styles.top_info_filter_value}>
                                    Todos
                                </span>
                            }
                        </div>
                    </div>
                    {
                    items?.data?.length>0||loading?
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
                                <div style={{gridTemplateRows: `repeat(${Math.ceil(items?.data?.length/2+1)})`}} 
                                        className={styles.grid}>
                                    {
                                        items?.type==="profissionais"?
                                        mapBoxesToDisplay()
                                        :null
                                    }
                                </div>
                                :
                                <div className={styles.grid}>
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
                    </div>
                    :loaded?
                        <NoPage type={selectedType} object="no_search" limparPesquisa={() => limparPesquisa()}/>
                    :null
                }
            </div>
            <div className={styles.num_wrapper} style={{borderTopColor:selectedType==="trabalhos"?'#0358e580':'#FF785A80'}}>
                <div className={styles.num}>
                    {
                        currDisplay === "solo"?
                        <div className={styles.num_flex}>
                            <div className={styles.num_flex_content} style={{borderTopColor:selectedType==="trabalhos"?'#0358e5':'#FF785A'}}>
                                <span style={{color:"white"}}>_</span>
                                <span style={{color:"white"}}>_</span>
                                <span className={styles.num_style} style={{textDecoration:"underline"}}>{currPage}</span>
                                <span style={{color:"white"}}>_</span>
                                <ArrowForwardIosIcon className={styles.arrow_disabled}/>
                            </div>
                        </div>
                        :currDisplay === "init"?
                        <div className={styles.num_flex}>
                            <div className={styles.num_flex_content} style={{borderTopColor:selectedType==="trabalhos"?'#0358e5':'#FF785A'}}>
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
                            <div className={styles.num_flex_content} style={{borderTopColor:selectedType==="trabalhos"?'#0358e5':'#FF785A'}}>
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
        </div>
    )
}

export default Main;
