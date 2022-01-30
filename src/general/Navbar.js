import React, { useEffect } from 'react'
import styles from './navbar.module.css'
import FaceIcon from '@mui/icons-material/Face';
import { grey } from '@mui/material/colors';
import { FacebookProvider, Initialize } from 'react-facebook';


const Navbar = () => {

    useEffect(() => {
        console.log("oioi");
        console.log(process.env.REACT_APP_FACEBOOK_APP_ID);
    })

    return (
        <div className={styles.navbar}>
            <FacebookProvider appId={process.env.REACT_APP_FACEBOOK_APP_ID}>
                <Initialize>
                {({ isReady, api }) => {
                    console.log(process.env.REACT_APP_FACEBOOK_APP_ID);
                    console.log(isReady)
                    console.log(api)
                    if(isReady){
                        console.log(api.getLoginStatus())
                    }
                    return null
                }}
                </Initialize>
            </FacebookProvider>
            <div className='wid-main'>
                <div className={styles.flex}>
                    <div className={styles.flex_end}>
                        <p className={styles.title}>Vender</p>
                    </div>
                    <div className={styles.flex_right}>
                        <div className={styles.flex_end}>
                            <FaceIcon className={styles.avatar} sx={{color: grey[900], fontSize: 40}} />
                        </div>
                        <div className={styles.flex_end_publicar}>
                            <p className={styles.publicar}>PUBLICAR</p>
                        </div>
                    </div>               
                </div>
            </div>
        </div>
    )
}

export default Navbar;