import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FaceIcon from '@mui/icons-material/Face';
import {logout} from '../firebase/firebase'


const ObjectID = require("bson-objectid");

const Navbar = (props) => {

    const navigate = useNavigate()
    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
    }, [])

    const generateWorker = () => {

        const workerId = ObjectID()

        let worker = {
            _id: workerId,
            name: {first: "Lucas", last: workerId},
            img: 'https://firebasestorage.googleapis.com/v0/b/hustle-292f2.appspot.com/o/IMG_1538.jpg?alt=media&token=e4014301-2e1a-4347-b7d9-bf76b840f9c8',
            rating: 4,
            description: "Trato de coisas da casa",
            weekends: false,
        }

        axios.post('http://localhost:5000/workers/add', worker).then(res => {
            console.log(res.data)
        })
    }

    const generateReserva = () => {

        const reservaID = ObjectID()

        let reserva = {
            _id: reservaID,
            worker_id: "620a9935dd773b6c652adf99",
            user_id: "12345",
            startDate: new Date('2022-02-23 14:20'),
            endDate: new Date('2022-02-23 17:20'),
            notas: "Notas sobre a cena",
            title: `${reservaID}`,
            localizacao: "R. Conselheiro Jose Silvestre Ribeiro, n16 7E",
            type:0,
        }

        axios.post('http://localhost:5000/reservations/add', reserva).then(res => {
            console.log(res.data)
        })
    }

    const logoutHandler = () => {
        setDropdown(false)
        logout()
        navigate('/authentication')
    }


    return (
        <div className={styles.navbar}>
            <div className={styles.flex}>
                <div className={styles.flex_end}>
                    <p className={styles.title} 
                        onClick={() => navigate('/')}>Logo</p>
                </div>
                    <div className={styles.flex_end}>
                        <div className={styles.flex_right}>
                            <div className={styles.flex_end}>
                                {
                                    props.user?
                                    <div className={styles.user_main} 
                                            onMouseEnter={() => setDropdown(true)} 
                                            onMouseOut={() => setDropdown(false)}
                                            onMouseMove={() => setDropdown(true)} 
                                            >
                                        <div className={styles.user} >
                                            <p className={styles.user_text}>Àrea Pessoal</p>
                                            <KeyboardArrowDownIcon sx={{fontSize: "30px"}} className={styles.user_arrow}/>
                                        </div>
                                        <div className={styles.user_dropdown} hidden={!dropdown}>
                                            <div className={styles.drop_user}>
                                                <FaceIcon sx={{fontSize: "30px"}} className={styles.user_icon}/>
                                                <span className={styles.drop_user_text}>{props.user.name}</span>
                                            </div>
                                            <div className={styles.drop_div_main} onClick={() => setDropdown(false)}>
                                                <div className={styles.drop_div}>
                                                    <div className={styles.drop_div_special}>
                                                        <div style={{display:"flex"}}>
                                                            <span className={styles.drop_div_text}>Reservas</span>
                                                            <span className={styles.drop_div_number}>
                                                                <span className={styles.drop_div_number_text}>1</span>
                                                            </span>
                                                        </div>
                                                        <span className={styles.drop_div_notification}>

                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={() => logoutHandler()} className={styles.drop_div_main} style={{borderTop:"1px solid #ccc", borderBottomLeftRadius:"5px", borderBottomRightRadius:"5px"}}>
                                                <div className={styles.drop_div}>
                                                    <span className={styles.drop_div_text}>Logout</span>
                                                </div>
                                            </div>
                                            

                                        </div>
                    
                                    </div>
                                    :
                                    <p className={styles.user_login} 
                                        onClick={() => navigate('/authentication')}>
                                        Iniciar Sessão</p>
                                }
                            </div>
                            
                    </div>
                </div>               
            </div>
        </div>
    )
}

export default Navbar;



const fbLogin = (fbApi) => {
    fbApi.login(function(response) {
    })
}