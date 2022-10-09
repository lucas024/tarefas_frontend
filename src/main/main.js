import React, {useEffect, useState} from 'react'
import styles from './main.module.css'
import stylesSidebar from '../user/user.module.css'
import { useLocation, useSearchParams } from 'react-router-dom';
import MainSidebar from './mainSidebar'
import Trabalhadores from '../servicos/trabalhadores';
import Trabalhos from '../servicos/trabalhos';

const Main = (props) => {

    const location = useLocation()
    const [arrPathname, setArrPathname] = useState([])

    useEffect(() => {
        let arrPathnameAux = location.pathname.split('/')
        setArrPathname(arrPathnameAux)
    }, [location])    

    return (
        <div className={stylesSidebar.worker}>
            <div className={stylesSidebar.flex}>
                <div className={stylesSidebar.left}>
                    <MainSidebar user={props.user} selected={arrPathname[3]}/>
                </div>
                <div className={stylesSidebar.right}>
                    <div className={stylesSidebar.worker_area}>
                        <div className={styles.area}>
                            {
                                arrPathname[3]==="trabalhos"?
                                <Trabalhos api_url={props.api_url} user={props.user} userLoadAttempt={props.userLoadAttempt}/>
                                :<Trabalhadores api_url={props.api_url} user={props.user} userLoadAttempt={props.userLoadAttempt}/>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main