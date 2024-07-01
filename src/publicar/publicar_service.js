import React from 'react'
import styles from '../user/publicar.module.css'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import {profissoesMap} from '../general/util'
import TopSelect from '../selects/selectStyling';
import TextareaAutosize from 'react-textarea-autosize';
import DoneIcon from '@mui/icons-material/Done';

const PublicarService = props => {

    return (
        <div className={styles.top}>
            <div className={styles.helper_wrap}>
                {/* <span className={styles.helper_divider}>-</span> */}
                <span className={styles.helper_text}>campo obrigatório</span>
                <span className={styles.helper_asterisc}>*</span>
            </div>
        <div className={styles.top_check} style={{backgroundColor:props.correct?'#0358e5':""}}>
            <DoneIcon className={styles.top_check_element}/>
        </div>
        <div>
            <div className={styles.diff_right_title_container}>
                <span className={styles.diff_right_title} style={{marginTop:"-8px"}}>
                    Tipo de Serviço<span className={styles.action}>*</span>
                </span>
            </div>
            <div className={styles.top_left}>
                <span className={styles.left_image_border} style={{borderColor:props.selectedWorker?"#0358e5":"#161F28"}}>
                    {
                        props.selectedWorker?
                        <img src={profissoesMap[props.selectedWorker]?.img} className={styles.left_img}></img>
                        :
                        <QuestionMarkOutlinedIcon className={styles.left_img_qm}/>
                    }                                    
                </span>
                <span className={props.selectedWorker?styles.left_spacer_complete:styles.left_spacer}/>
                <div className={styles.left_select}>
                    <TopSelect
                        worker={props.selectedWorker}
                        // changeWorker={val => props.setSelectedWorker(val.value)}
                        changeWorker={val => {}}
                    />
                    <span className={styles.left_select_fake} onClick={() => props.setBackdrop(true)}/>
                    {/* <div className={styles.teste} onClick={() => props.setBackdrop(true)}>
                        tesste
                    </div> */}
                </div>
            </div>
        </div>
        
        <div className={styles.top_right}>
            <div className={styles.diff_right} style={{marginTop:'10px'}}>
                    {
                        props.editReservation?.type===2&&props.getFieldWrong('titulo')?
                        <div className={styles.diff_right_title_container}>
                            <span className={styles.diff_right_title}
                                style={{marginBottom:0}}>Título da TAREFA</span>
                            <span className={styles.diff_right_title_wrong_div}>
                                <span className={styles.editar_tit}>editar</span> {props.getFieldWrongText('titulo')}
                            </span>
                        </div>
                        :
                        <span className={styles.diff_right_title}>Título DA TAREFA<span className={styles.action}>*</span>
                        </span>
                    }
                
                <input placeholder="Título da tarefa..." 
                    tabindex={props.selectedTab===0?'1':'-1'}
                    maxLength={40} 
                    onChange={e => props.setTitulo(e.target.value)} 
                    value={props.titulo} 
                    className={styles.top_input_short} 
                    style={{borderColor:!props.tituloWrong?"#0358e5":"", width:'100%', maxWidth:'700px'}}></input>
                <span className={styles.title_helper} style={{color:props.titulo.length>0&&props.tituloWrong?"#0358e5":"#fff"}}>Titulo demasiado curto.</span>
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
                        placeholder="Descrição da tarefa..."
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