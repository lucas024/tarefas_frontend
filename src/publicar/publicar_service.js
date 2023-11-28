import React, {useState} from 'react'
import styles from '../user/publicar.module.css'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {profissoesPngs} from '../general/util'
import TopSelect from '../selects/selectStyling';
import TextareaAutosize from 'react-textarea-autosize';
import { useNavigate } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';

const PublicarService = props => {
    const navigate = useNavigate()

    return (
        <div className={styles.top}>
        <div className={styles.top_check} style={{backgroundColor:props.correct?'#0358e5':""}}>
            <DoneIcon className={styles.top_check_element}/>
        </div>
        <div>
            <div className={styles.diff_right_title_container}>
                <span className={styles.diff_right_title}>
                    Serviço<span className={styles.action}>*</span>
                </span>
            </div>
            <div className={styles.top_left}>
                <span className={styles.left_image_border} style={{borderColor:props.selectedWorker?"#0358e5":"#161F28"}}>
                    {
                        props.selectedWorker?
                        <img src={profissoesPngs[props.selectedWorker]} className={styles.left_img}></img>
                        :
                        <QuestionMarkOutlinedIcon className={styles.left_img_qm}/>
                    }                                    
                </span>
                <span className={props.selectedWorker?styles.left_spacer_complete:styles.left_spacer}/>
                <div className={styles.left_select}>
                    <TopSelect
                        id={props.selectedWorker}
                        changeWorker={val => props.setSelectedWorker(val)}
                    />
                </div>
            </div>
        </div>
        
        <div className={styles.top_right}>
            <div className={styles.diff_right} style={{marginTop:'10px'}}>
                    {
                        props.editReservation?.type===2&&props.getFieldWrong('titulo')?
                        <div className={styles.diff_right_title_container}>
                            <span className={styles.diff_right_title}
                                style={{marginBottom:0}}>Título<span className={styles.action}>sdasdasd</span>
                            </span>
                            <span className={styles.diff_right_title_wrong_div}>
                                <span className={styles.editar_tit}>editar</span> {props.getFieldWrongText('titulo')}
                            </span>
                        </div>
                        :
                        <span className={styles.diff_right_title}>Título<span className={styles.action}>*</span>
                        </span>
                    }
                
                <input placeholder="Título do trabalho..." 
                    tabindex={props.selectedTab===0?'1':'-1'}
                    maxLength={40} 
                    onChange={e => props.setTitulo(e.target.value)} 
                    value={props.titulo} 
                    className={styles.top_input_short} 
                    style={{borderColor:props.titulo.length>5?"#0358e5":""}}></input>
            </div>
            <div className={styles.diff_right}>
                    {
                        props.editReservation?.type===2&&props.getFieldWrong('description')?
                        <div style={{marginTop:"10px"}} className={styles.diff_right_title_container}>
                            <span className={styles.diff_right_title} 
                                style={{ marginBottom:0}}>Descrição <span className={styles.opcional}> opcional</span>
                                
                            </span>
                            <span className={styles.diff_right_title_wrong_div}>
                            <span className={styles.editar_tit}>editar</span> {props.getFieldWrongText('description')}
                            </span>
                        </div>
                        :
                        <span style={{marginTop:"10px"}} className={styles.diff_right_title}>Descrição
                        <span className={styles.opcional}> (opcional)</span>
                        </span>
                    }
                <div className={styles.top_desc}>
                    <TextareaAutosize
                        onKeyDown={(e) => { if (e.key === 9) e.preventDefault() }}
                        tabindex={props.selectedTab===0?'1':'-1'}
                        maxRows={20}
                        minRows={8}
                        maxLength={400}
                        className={styles.top_desc_area} 
                        placeholder="Descrição do trabalho..."
                        value={props.description} onChange={e => {
                        props.setDescription(e.target.value)}}>
                    
                    </TextareaAutosize>
                </div>
            </div>
            
        </div>
    </div>
    )
}

export default PublicarService