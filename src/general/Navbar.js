import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import FaceIcon from '@mui/icons-material/Face';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ObjectID = require("bson-objectid");

const Navbar = () => {

    const navigate = useNavigate()
    


    const generateWorker = () => {

        const workerId = ObjectID()

        let worker = {
            _id: workerId,
            name: {first: "Lucas", last: workerId},
            img: 'https://firebasestorage.googleapis.com/v0/b/hustle-292f2.appspot.com/o/IMG_1538.jpg?alt=media&token=e4014301-2e1a-4347-b7d9-bf76b840f9c8',
            rating: 4,
            description: "Trato de coisas da casa",
        }

        axios.post('http://localhost:5000/workers/add', worker).then(res => {
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