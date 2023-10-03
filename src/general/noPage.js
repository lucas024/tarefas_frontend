import React from 'react'
import styles from './noPage.module.css'
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

const NoPage = (props) => {

    const navigate = useNavigate()

    return (
        <div className={styles.blank} style={{borderTop:props.object==="no_search"?"none":""}}>
            {
                props.object==="mensagens"?
                <div className={styles.blank_flex}>
                    <span className={styles.blank_text}>Ainda não tens mensagens</span>
                    <ChatIcon className={styles.blank_face}/>
                    <span className={styles.blank_request}>
                        Procurar <span className={styles.blank_request_click} onClick={() => navigate('/main/publications/trabalhos')}>trabalhos</span>
                    </span>
                </div>
                :props.object==="mensagens_user"?
                <div className={styles.blank_flex}>
                    <span className={styles.blank_text}>Ainda não tens mensagens</span>
                    <ChatIcon className={styles.blank_face}/>
                    <span className={styles.blank_request}>
                        Procurar <span className={styles.blank_request_click} onClick={() => navigate('/main/publications/trabalhadores')}>trabalhadores</span>
                    </span>
                </div>
                :props.object==="no_subscritption"?
                <div className={styles.blank_flex} style={{marginTop:"20px"}}>
                    <span className={styles.blank_text}>Não tens uma subscrição ativa</span>
                    <Sad className={styles.blank_face_small}/>
                    <span className={styles.button} onClick={() => props.activateSub()}>
                        Ativar Subscrição
                    </span>
                </div>
                :props.object==="re_subscritption"?
                <div className={styles.blank_flex} style={{marginTop:"20px"}}>
                    <span className={styles.blank_text}>Desativaste a tua subscrição</span>
                    <Sad className={styles.blank_face_small}/>
                    <span className={styles.button} onClick={() => props.activateSub()}>
                        Re-ativar Subscrição
                    </span>
                </div>
                :props.object==="no_search"?
                <div className={styles.blank_flex} style={{marginTop:"100px"}}>
                    <span className={styles.blank_text} style={{color:"#ffffff"}}>Sem resultados para esta pesquisa</span>
                    <Sad className={styles.blank_face_small} style={{color:"white"}}/>
                    <span className={styles.button} style={{backgroundColor:props.type==="trabalhos"?"#0358e5":"#FF785A"}} onClick={() => props.limparPesquisa()}>
                        Limpar Pesquisa
                    </span>
                </div>
                :props.object==="select_message"?
                <div className={styles.blank_flex} style={{marginTop:"100px"}}>
                    <span className={styles.blank_text} style={{color:"#ffffff"}}>Selecione uma mensagem</span>
                    <ChatIcon className={styles.blank_face_small} style={{color:"white"}}/>
                    {/* <span className={styles.button} style={{backgroundColor:props.type==="trabalhos"?"#0358e5":"#FF785A"}} onClick={() => props.limparPesquisa()}>
                        Limpar Pesquisa
                    </span> */}
                </div>
                :
                <div className={styles.blank_flex}>
                    <span className={styles.blank_text}>Esta {props.object} não existe</span>
                    <Sad className={styles.blank_face}/>
                    <span className={styles.blank_request}>
                        Voltar à <span className={styles.blank_request_click} onClick={() => navigate('/')}>página inícial</span>
                    </span>
                </div>
            }
            
        </div>
    )
}

export default NoPage