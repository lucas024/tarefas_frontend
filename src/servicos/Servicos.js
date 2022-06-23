import React, { useEffect, useState, useRef } from 'react';
import styles from './servicos.module.css'
import { useParams, useSearchParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import Carta from './carta';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FilterSelect from './filterSelect';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

require('dayjs/locale/pt')


const Servicos = () => {

    const {id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currPage, setCurrPage] = useState(0)
    const [currDisplay, setCurrDisplay] = useState("solo")
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    const [scrollPosition, setScrollPosition] = useState(0)
    const [mainRef, setMainRef] = useState(null)
    const [clear, setClear] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
    "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    dayjs.locale('pt')
    // const delay = [0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.8,
    //                 0.88, 0.96, 1.04, 1.12, 1.20, 1.28, 1.36, 1.44, 1.52, 1.60,
    //                 1.68, 1.76, 1.84, 1.92, 2]
    const [workers, setWorkers] = useState([])
    const [gridAnim, setGridAnim] = useState(true)
    const [locationActive, setLocationActive] = useState(false)
    const [workerActive, setWorkerActive] = useState(false)

    const myRef = useRef(null)

    useEffect(() => {
        fetchWorkers()
    //eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])
    

    useEffect(() => {
        let page = parseInt(Object.fromEntries([...searchParams]).p)
        if(workers!==null){
            if(workers.length >= page*24 && page>1){
                setCurrPage(page)
                if(workers.length > (page*24 + 24)) setItems(workers.slice((page-1)*24,(page-1)*24+24))
                else setItems(workers.slice((page-1)*24, (page)*24 + 24 - (page-1)*24 + 24 - workers.length))
                setCurrDisplay("middle")
            }
            else if(workers.length < page*24 && page>1){
                setCurrPage(page)
                setItems(workers.slice((page-1)*24))
                setCurrDisplay("last")
            }
            else{
                setCurrPage(1)
                if(workers.length > 24){
                    setItems(workers.slice(0,24))
                    setCurrDisplay("init")
                }
                else{
                    setItems(workers)
                    setCurrDisplay("solo")
                }
            }
        }
        
    }, [workers, searchParams])

    const fetchWorkers = () => {
        axios.get(`http://localhost:5000/workers`).then(res => {
            if(res.data!==null){
                let arr = res.data
                arr = fisher_yates_shuffle(arr)
                setWorkers(arr)
            }
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

    const mapBoxesToDisplay = () => {
        let delay = 0
        return items.map((worker, i) => {
            return(
                <div key={i} className={styles.box_case} onClick={() => navigate({
                                                                    pathname: `/reserva`,
                                                                    search: `?worker=worker_id`
                                                                })}> 
                    <Carta
                        id={id}
                        worker={worker}
                        delay={delay[i]}
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
    return (
        <div className={styles.servicos}>
            <div className={styles.main} onScroll={handleScroll}>
                <div className={styles.search_div} ref={myRef}>
                    <div className={styles.search_input_div}>
                        <input onChange={val => handleSearchVal(val)} spellCheck={false} className={!scrollPosition?styles.searchTop:styles.search} placeholder="Pesquisar trabalhadores..."></input>
                        <PersonSearchIcon className={styles.search_input_div_icon}/>
                        <SearchIcon className={styles.search_final_icon}/>
                    </div>
                    <div className={styles.search_filter_div_wrapper}>
                        <div className={styles.search_filter_div}>
                            <FilterSelect type="zona" clear={clear} valueChanged={bool => setLocationActive(bool)}/>
                            <div style={{marginLeft:"10px"}}>
                                <FilterSelect type="worker" clear={clear} valueChanged={bool => setWorkerActive(bool)}/>
                            </div>
                        </div>
                        <span className={styles.search_clear} onClick={() =>{
                            setLocationActive(false)
                            setWorkerActive(false)
                            setClear(!clear)}}>
                            Limpar Pesquisa
                        </span>
                    </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.top_info}>
                    <span className={styles.top_info_numbers}>
                        {workers.length} Trabalhadores
                    </span>
                    <div className={styles.top_info_filter}>
                        <div className={styles.top_info_filter_flex}>
                            <LocationOnIcon className={styles.top_info_filter_icon}/>
                            <span  className={styles.top_info_filter_text}>região:</span>
                        </div>
                        {
                            locationActive?
                            <span  className={styles.top_info_filter_value_on}>
                                {locationActive}
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
                            workerActive?
                            <span  className={styles.top_info_filter_value_on}>
                                {workerActive}
                            </span>
                            :
                            <span  className={styles.top_info_filter_value}>
                                Todos
                            </span>
                        }
                    </div>
                </div>
                
                <div className={gridAnim?styles.animGrid:styles.grid}
                    onAnimationEnd={() =>{
                        setGridAnim(false)
                    }}
                    // onClick={() =>{
                    //     setGridAnim(true)
                    // } }
                >
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
        </div>
    )
}

export default Servicos;
