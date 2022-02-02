import React, { useEffect } from 'react'
import styles from './navbar.module.css'
import FaceIcon from '@mui/icons-material/Face';
import { grey } from '@mui/material/colors';

const Navbar = () => {

    return (
        <div className={styles.navbar}>
            <div className={styles.flex}>
                <div className={styles.flex_end}>
                    <p className={styles.title}>Logo</p>
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