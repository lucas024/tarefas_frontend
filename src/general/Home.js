import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {useLocation, useNavigate} from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import WorkerBanner from './workerBanner';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import {CSSTransition}  from 'react-transition-group';
import Sessao from './../transitions/sessao';

const Home = (props) => {

    const [workerBanner, setWorkerBanner] = useState(false)

    const [mensagemPopup, setMensagemPopup] = useState(false)
    const [loginPopup, setLoginPopup] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const location = useLocation()

    useEffect(() => {
        if(props.incompleteUser){
            console.log("yes");
            setMensagemPopup(true)
            setTimeout(() => setMensagemPopup(false), 4000)
        }
        else if(location.state?.carry){
            setLoginPopup(true)
            setTimeout(() => setLoginPopup(false), 4000)
        }
    }, [props.incompleteUser, location])

    useEffect(() => {
        props.userLoadAttempt&&setLoaded(true)
    }, [props.userLoadAttempt])


    const navigate = useNavigate()
    
    return(
        <div className={styles.home}>
            <CSSTransition 
                in={loginPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >
                <Sessao text={"Sessão iniciada com Sucesso!"}/>
            </CSSTransition>
            <CSSTransition 
                in={mensagemPopup}
                timeout={1000}
                classNames="transition"
                unmountOnExit
                >{
                <Sessao text={"Complete o seu perfil!"}/>
                }
            </CSSTransition>
            {
                workerBanner?
                <WorkerBanner cancel={() => setWorkerBanner(false)}/>
                :null
            }
            {
                props.user?.type===0 || props.userLoadAttempt?
                <span className={styles.worker_button} onClick={() => setWorkerBanner(true)}>Tornar-me Trabalhador</span>
                :props.user?.type===1?
                null
                :
                <span className={styles.skeleton_worker_botbanner}></span>
                
            }
            <div className={styles.home_back}>
                <div className={styles.section_one} onClick={() => navigate('/main/publications/trabalhos')}>
                    {
                        props.user || loaded?
                        <div className={styles.section_content}>
                            <div className={styles.section_image_wrapper}>
                                <ManageSearchIcon className={styles.section_img}/>
                            </div>
                            <p className={styles.section_title}>
                                PROCURAR
                            </p>
                            <p className={styles.section_title}>
                                <span>TRABALHOS</span>
                            </p>
                            <a className={styles.link}/>
                        </div> 
                        :
                        <div className={styles.section_content}>
                            <span className={styles.skeleton_content_in_img}></span>
                            <p className={styles.skeleton_content_in}></p>
                            <p className={styles.skeleton_content_in}></p>
                        </div>
                                              
                    }
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
                                <span>PERFIL</span>
                            </p>
                        </div>
                        <a className={styles.link2}/>
                    </div>
                    :
                    props.user?.type===0 || loaded?
                    <div className={styles.section_two} onClick={() => navigate('/main/publications/trabalhadores')}>
                        <div className={styles.section_content}>
                            <div className={styles.section_image_wrapper}>
                                <PersonSearchIcon className={styles.section_img} style={{color:"#161F28"}}/>
                            </div>
                            <p className={styles.section_title}>
                                PROCURAR
                            </p>
                            <p className={styles.section_title}>
                                <span>TRABALHADORES</span>
                            </p>
                        </div>
                        <a className={styles.link2}/>
                    </div>
                    :
                    <div className={styles.section_two}>
                        <div className={styles.section_content}>
                            <span className={styles.skeleton_content_in_img}></span>
                            <p className={styles.skeleton_content_in}></p>
                            <p className={styles.skeleton_content_in}></p>
                        </div>
                    </div>
                    
                    
                }
            </div>
            {               
                props.user?.type===0 || loaded&&!props.user?
                <div className={styles.publish} onClick={() => navigate('/reserva?w=eletricista')}>
                    <span className={styles.publish_or}>OU</span>
                    <div className={styles.publish_main}>
                        <span className={styles.publish_text}>
                            PUBLICAR UM TRABALHO
                        </span>
                        <PostAddIcon className={styles.publish_icon}/>
                    </div>
                </div>
                :props.user?.type===1?
                null                
                :
                <span className={styles.skeleton_publish}></span>
            }
            {
                props.user?.type===0 || loaded&&!props.user?
                <div className={styles.tag}>
                    <p className={styles.tag_text}>
                        Do que precisa hoje?
                    </p>
                </div>
                :
                props.user?.type===1?
                null
                :
                <span className={styles.skeleton_tag}></span>
            }
        </div>
    )
}

export default Home;