import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import FaceIcon from '@mui/icons-material/Face';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ObjectID = require("bson-objectid");

const Navbar = () => {

    const navigate = useNavigate()

    useEffect(() => {
        console.log(new Date('2022-02-21 20:20'))
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


    return (
        <div className={styles.navbar}>
            <div className={styles.flex}>
                <div className={styles.flex_end}>
                    <p className={styles.title} 
                        onClick={() => navigate('/')}>Logo</p>
                    {/* <p onClick={() => generateWorker()}>generate</p> */}
                    {/* <p onClick={() => generateReserva()}>reserva</p> */}
                </div>
                    <div className={styles.flex_end}>
                        <div className={styles.flex_right}>
                            <div className={styles.flex_end}>
                                <p className={styles.user_login}>Iniciar Sessão</p>
                            </div>
                            <FaceIcon className={styles.avatar} sx={{color: grey[900], fontSize: 40}} />
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