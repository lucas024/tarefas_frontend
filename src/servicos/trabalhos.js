import React, { useEffect, useState, useRef } from 'react';
import styles from './servicos.module.css'
import { useParams, useSearchParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FilterSelect from './filterSelect';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import Row from './row';
import Loader from './../general/loader';

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
    const [locationActive, setLocationActive] = useState(false)
    const [locationDisplayActive, setLocationDisplayActive] = useState(false)
    const [workerActive, setWorkerActive] = useState(false)
    const [workerDisplayActive, setWorkerDisplayActive] = useState(false)
    const [listAnim, setListAnim] = useState(true)


    const myRef = useRef(null)

    
    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    useEffect(() => {
        fetchPublications()
        setClear(!clear)
        setLocationActive(false)
        setLocationDisplayActive(false)
        setWorkerActive(false)
        setWorkerDisplayActive(false)
            
    //eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])
    

    useEffect(() => {
        let page = parseInt(Object.fromEntries([...searchParams]).p)
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

    const fetchPublications = () => {
        setLoading(true)
        axios.get(`${props.api_url}/reservations`).then(res => {
            if(res.data!==null){
                let arr = res.data
                setAllItems(arr)
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        if(locationActive||workerActive){
            fetchJobsByFilter()
        }
    }, [locationActive, workerActive])

    const fetchJobsByFilter = () => {
            setListAnim(true)
            setLoading(true)
            axios.post(`${props.api_url}/reservations/get_reservations_by_filter`, {
                region: locationActive,
                trabalho: workerActive,
                search: searchVal
            }).then(res => {
                console.log(res.data);
                if(res.data!=='non_existing'){
                    let arr = res.data
                    setAllItems(arr)
                }
                setLoading(false)
            }).catch(err => console.log(err))
    }
    
    const navigatePubHandler = (id) => {
        navigate(`/main/publications/publication?id=${id}&prevpage=${currPage}`, 
                {
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
                <div key={i} className={styles.row} onClick={() => navigatePubHandler(item._id)}>
                    {
                        i>0&&getDiffDate(items[i-1].timestamp, item.timestamp)?
                        <div className={styles.day_splitter}>
                            <span className={styles.day_value}>{extenseDate(item.timestamp)}</span>
                        </div>
                        :null
                    }
                    <Row
                        id={id}
                        item={item}
                        locationActive={locationActive}
                        workerActive={workerActive}
                        user={props.user}
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
        setWorkerDisplayActive(false)
        setLocationDisplayActive(false)
        setClear(!clear)
        setSearchVal("")
        fetchPublications()
    }

    return (
        <div className={styles.servicos}>
            <div className={styles.main} onScroll={handleScroll}>
                <div className={styles.search_div} ref={myRef}>
                    <div className={styles.search_input_div}>
                        <input value={searchVal} onKeyDown={handleKeyDown} onChange={val => handleSearchVal(val)} spellCheck={false} className={!scrollPosition?styles.searchTop:styles.search} placeholder={`Pesquisar trabalhos...`}></input>
                        <PersonSearchIcon className={styles.search_input_div_icon}/>
                        <SearchIcon className={styles.search_final_icon} onClick={() => fetchJobsByFilter()}/>
                    </div>
                    <div className={styles.search_filter_div_wrapper}>
                        <div className={styles.search_filter_div}>
                            <FilterSelect 
                                type="zona" 
                                clear={clear} 
                                valueChanged={bool => setLocationActive(bool)}
                                valueDisplayChanged={val => setLocationDisplayActive(val)}/>
                            <div style={{marginLeft:"10px"}}>
                                <FilterSelect 
                                    type="worker" 
                                    clear={clear} 
                                    valueChanged={bool => setWorkerActive(bool)}
                                    valueDisplayChanged={val => setWorkerDisplayActive(val)}/>
                            </div>
                        </div>
                        <span className={styles.search_clear} onClick={() => limparPesquisa()}>
                            Limpar Pesquisa
                        </span>
                    </div>
                </div>
                <div className={styles.divider}></div>
                {
                    items.length>0?
                    <div>
                        <Loader loading={loading}/>
                        <div className={styles.top_info}>
                            
                            {
                                allItems.length===1?
                                <span className={styles.top_info_numbers}>1 TRABALHO</span>
                                :<span className={styles.top_info_numbers}>{allItems.length} trabalhos</span>
                            }
                            <div className={styles.top_info_filter}>
                                <div className={styles.top_info_filter_flex}>
                                    <LocationOnIcon className={styles.top_info_filter_icon}/>
                                    <span  className={styles.top_info_filter_text}>região:</span>
                                </div>
                                {
                                    locationDisplayActive?
                                    <span  className={styles.top_info_filter_value_on}>
                                        {locationDisplayActive}
                                    </span>
                                    :
                                    <span  className={styles.top_info_filter_value}>
                                        Todas
                                    </span>
                                }
                            </div>
                            <div className={styles.top_info_filter}>
                                <div className={styles.top_info_filter_flex}>
                                    <PersonIcon className={styles.top_info_filter_icon}/>
                                    <span  className={styles.top_info_filter_text}>Tipo de Trabalhador:</span>
                                </div>
                                {
                                    workerDisplayActive?
                                    <span  className={styles.top_info_filter_value_on}>
                                        {workerDisplayActive}
                                    </span>
                                    :
                                    <span  className={styles.top_info_filter_value}>
                                        Todos
                                    </span>
                                }
                            </div>
                    </div>
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
                    :null //nopage
                }
            </div>
        </div>
    )
}

export default Trabalhos;
