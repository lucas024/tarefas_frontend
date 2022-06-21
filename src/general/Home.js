import React, { useEffect } from 'react'
import styles from './home.module.css'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {useNavigate} from 'react-router-dom'

const Home = () => {
        
    useEffect(() => {
        
    })

    const navigate = useNavigate()
    
    return(
        <div className={styles.home}>
            <div className={styles.home_back}>
                <div className={styles.section_one} onClick={() => navigate('/main/publications')}>
                    <div className={styles.section_content}>
                        <PersonSearchIcon className={styles.section_img}/>
                        <p className={styles.section_title}>
                            PROCURAR
                        </p>
                        <p className={styles.section_title}>
                            <span style={{textDecoration:"underline"}}>TRABALHADORES</span>
                        </p>
                        <p className={styles.section_title}>
                            E <span style={{textDecoration:"underline"}}>TRABALHO</span>
                        </p>
                    </div>
                    
                    <a className={styles.link}/>
                </div>
                <div className={styles.section_two} onClick={() => navigate('/reserva?w=eletricista')}>
                    <div className={styles.section_content}>
                        <PostAddIcon className={styles.section_img} style={{color:"#161F28"}}/>
                        <p className={styles.section_title}>
                            <span style={{textDecoration:"underline"}}>PUBLICAR</span>
                        </p>
                        <p className={styles.section_title}>
                            UM TRABALHO
                        </p>
                    </div>
                    <a className={styles.link2}/>
                </div>
            </div>
            <div className={styles.tag}>
                <p className={styles.tag_text}>
                    Do que precisas hoje?
                </p>
            </div>
        </div>
    )
}

export default Home;