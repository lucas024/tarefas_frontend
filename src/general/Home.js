import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {useNavigate} from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import WorkerBanner from './workerBanner';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

const Home = (props) => {

    const [workerBanner, setWorkerBanner] = useState(false)
        
    useEffect(() => {
        
    })

    const navigate = useNavigate()
    
    return(
        <div className={styles.home}>
            {
                workerBanner?
                <WorkerBanner cancel={() => setWorkerBanner(false)}/>
                :null
            }
            {
                props.user?.type===1?
                null
                :
                <span className={styles.worker_button} onClick={() => setWorkerBanner(true)}>Tornar-me Trabalhador</span>
            }
            <div className={styles.home_back}>
                <div className={styles.section_one} onClick={() => navigate('/main/publications/trabalhos')}>
                    <div className={styles.section_content}>
                        <div className={styles.section_image_wrapper}>
                            <ManageSearchIcon className={styles.section_img}/>
                        </div>
                        <p className={styles.section_title}>
                            PROCURAR
                        </p>
                        <p className={styles.section_title}>
                            <span style={{textDecoration:"underline"}}>TRABALHOS</span>
                        </p>
                    </div>
                    <a className={styles.link}/>
                </div>
                {
                    props.user?.type===1?
                    <div className={styles.section_two} onClick={() => navigate('/user?t=personal')}>
                        <div className={styles.section_content}>
                            <div className={styles.section_image_wrapper}>
                                <AccessibilityIcon className={styles.section_img} style={{color:"#161F28"}}/>
                            </div>
                            <p className={styles.section_title}>
                                EDITAR
                            </p>
                            <p className={styles.section_title}>
                                <span style={{textDecoration:"underline"}}>PERFIL</span>
                            </p>
                        </div>
                        <a className={styles.link2}/>
                    </div>
                    :
                    <div className={styles.section_two} onClick={() => navigate('/main/publications/trabalhadores')}>
                        <div className={styles.section_content}>
                            <div className={styles.section_image_wrapper}>
                                <PersonSearchIcon className={styles.section_img} style={{color:"#161F28"}}/>
                            </div>
                            <p className={styles.section_title}>
                                PROCURAR
                            </p>
                            <p className={styles.section_title}>
                                <span style={{textDecoration:"underline"}}>TRABALHADORES</span>
                            </p>
                        </div>
                        <a className={styles.link2}/>
                    </div>
                }
            </div>
            {
                props.user?.type===1?
                null
                :
                <div className={styles.publish} onClick={() => navigate('/reserva?w=eletricista')}>
                    <span className={styles.publish_or}>OU</span>
                    <div className={styles.publish_main}>
                        <span className={styles.publish_text}>
                            PUBLICAR UM TRABALHO
                        </span>
                        <PostAddIcon className={styles.publish_icon}/>
                    </div>
                </div>
            }
            {
                props.user?.type===1?
                null
                :
                <div className={styles.tag}>
                    <p className={styles.tag_text}>
                        Do que precisas hoje?
                    </p>
                </div>
            }
        </div>
    )
}

export default Home;