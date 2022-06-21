import React, {useEffect, useState} from 'react'
import styles from './main.module.css'
import stylesSidebar from '../user/user.module.css'
import { useLocation, useSearchParams } from 'react-router-dom';
import MainSidebar from './mainSidebar'
import Servicos from '../servicos/servicos';

const Main = (props) => {

    const location = useLocation()
    const [arrPathname, setArrPathname] = useState([])

    useEffect(() => {
        let arrPathnameAux = location.pathname.split('/')
        setArrPathname(arrPathnameAux)
        console.log(arrPathnameAux);
    }, [location])
    

    return (
        <div className={stylesSidebar.worker}>
            <div className={stylesSidebar.flex}>
                <div className={stylesSidebar.left}>
                    <MainSidebar user={props.user}/>
                </div>
                <div className={stylesSidebar.right}>
                    <div className={stylesSidebar.worker_area}>
                        <div className={styles.area}>
                            <Servicos />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main