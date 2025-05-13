import React, { useState, useEffect } from 'react';
import styles from './home.module.css'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SelectHomeMain from '../selects/selectHomeMain';
import SelectHomeOther from '../selects/selectHomeOther';
import { profissoesGrouped, regioes, regioesOptions, profissoesMap } from './util'

import icon_1 from '../assets/new_assets/icon_1.png'
import icon_2 from '../assets/new_assets/icon_2.png'

const firstOptions = [
    { value: 'trabalhos', label: 'Tarefas', img: icon_1, desc: 'Ver tarefas para realizar' },
    { value: 'profissionais', label: 'Profissionais', img: icon_2, desc: 'Ver e contratar profissionais' },
]

const SearchBar = (props) => {
    const navigate = useNavigate()
    const [first, setFirst] = useState(firstOptions[0]);
    const [second, setSecond] = useState(null);
    const [third, setThird] = useState(null);
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const searchHandler = () => {
        if (second && third) {
            navigate(`/main/publications/${first?.value}?work=${second?.value}&region=${third.value}`)
        }
        else if (second) {
            navigate(`/main/publications/${first?.value}?work=${second?.value}`)
        }
        else if (third) {
            navigate(`/main/publications/${first?.value}?region=${third.value}`)
        }
        else {
            navigate(`/main/publications/${first?.value}`)
        }

        window.localStorage.setItem('last_search_timestamp', new Date())
        window.localStorage.setItem('last_search_type', first?.value)
    }

    return (
        <div className={`${styles.main} ${styles.main_navbar}`}>
            <div className={styles.zone_wrapper}>
                <div className={styles.zone} style={{width:'25%'}}>
                    <div className={styles.zone_select} style={{ width: '100%' }}>
                        <SelectHomeMain
                            searchBar={true}
                            menuOpen={() => { }}
                            menuClose={() => { }}
                            options={firstOptions}
                            option={first}
                            smallWindow={windowDimensions.width <= 1024}
                            mediumWindow={windowDimensions.width <= 1440}
                            changeOption={val => {
                                setFirst(val)
                            }} />
                    </div>
                </div>
                <span className={styles.zone_seperator}></span>
                <div className={styles.zone} style={{width:'45%'}}>
                    <div className={`${styles.zone_select} ${styles.zone_select_navbar}`}>
                        {/* <div className={styles.placeholder_title_wrapper}>
                            <span className={styles.placeholder_title}>Tipo de serviço</span>
                        </div> */}
                        <SelectHomeOther
                            menuOpen={() => { }}
                            menuClose={() => { }}
                            searchBar={true}
                            professions={true}
                            options={profissoesGrouped}
                            optionFirst={first}
                            option={second}
                            smallWindow={windowDimensions.width <= 1024}
                            mediumWindow={windowDimensions.width <= 1440}
                            changeOption={val => setSecond(val)}
                            placeholder={'Tipo de serviço'}
                            placeholder_desc={'Tipo de serviço'} />
                    </div>
                </div>
                <span className={styles.zone_seperator}></span>
                <div className={styles.zone}>
                    <div className={`${styles.zone_select} ${styles.zone_select_navbar}`}>
                        {/* <div className={styles.placeholder_title_wrapper}>
                            <span className={styles.placeholder_title}>Região</span>
                        </div> */}
                        <SelectHomeOther
                            menuOpen={() => { }}
                            menuClose={() => { }}
                            searchBar={true}
                            regioes={true}
                            options={regioes}
                            optionFirst={first}
                            option={third}
                            second={second}
                            smallWindow={windowDimensions.width <= 1024}
                            mediumWindow={windowDimensions.width <= 1440}
                            changeOption={val => setThird(val)}
                            placeholder={'Região'}
                            placeholder_desc={'Região'} />
                    </div>
                </div>
                <div onClick={() => {
                    searchHandler()
                }} className={styles.search_wrapper}
                    style={{
                        backgroundColor: first?.value === "profissionais" ? "#E56144" : "#0358e5",
                        borderColor: first?.value === "profissionais" ? "#E56144" : "#0358e5"
                    }}>
                    <SearchIcon className={styles.zone_search_icon} style={{ color: "#ffffff" }} />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;