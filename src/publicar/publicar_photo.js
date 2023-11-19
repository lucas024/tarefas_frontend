import React, {useEffect, useState} from 'react'
import styles from '../user/publicar.module.css'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HideImageIcon from '@mui/icons-material/HideImage';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import DoneIcon from '@mui/icons-material/Done';

const PublicarPhoto = props => {

    const [selectedImage, setSelectedImage] = useState(null)

    const displayImages = () => {
        let arr = [...props.images]
        if(arr.length<6) arr.push({blank:true})
        return arr.map((img_obj, i) => {
            if(!img_obj.blank){
                return (
                    <div key={i} className={styles.helper_img_div}>
                        <div className={styles.foto_img_wrapper} 
                            style={{border:props.photoPrincipal===img_obj.id?"2px solid #FF785A":""}}
                            onClick={() => setSelectedImage(img_obj.id)}>
                            <span className={styles.frontdrop_helper}></span>
                            <MoreVertIcon className={styles.foto_img_delete}/>
                            <img key={i} src={img_obj.url} className={styles.foto_img}></img>
                            {
                                props.photoPrincipal===img_obj.id?
                                <StarIcon className={styles.image_number}/>
                                :
                                <span className={styles.image_number}>{i+1}</span>
                            }
                        </div>
                    </div>
                    
                    
                )
            }
            else {
                return (
                    <div key={i} className={styles.helper_img_div}>
                        <div className={styles.foto_img_wrapper} onClick={() => props.handleClick()}>
                            <AddAPhotoIcon className={styles.foto_symbol_add}/>
                        </div>
                    </div>
                    
                )
            }
            
        })        
    }


    return (
        <div>
            <div className={styles.top}>
                {
                    props.edit?
                    <BorderColorIcon className={styles.top_abs_edit}/>
                    :null
                }
                {/* <div className={styles.top_check} style={{backgroundColor:'#0358e5'}}>
                    <DoneIcon className={styles.top_check_element}/>
                </div> */}
                {
                    props.editReservation?.type===2&&props.getFieldWrong('photos')?
                    <div className={styles.diff_right_title_container}>
                        <span className={styles.diff_right_title} 
                            style={{ marginBottom:0}}>Adicionar Fotografias <span className={styles.opcional}>(opcional)</span>
                        </span>
                        <span className={styles.diff_right_title_wrong_div}>
                        <span className={styles.editar_tit}>editar</span> {props.getFieldWrongText('photos')}
                        </span>
                    </div>
                    :
                    <span className={styles.diff_right_title}>Adicionar Fotografias <span className={styles.opcional}> (opcional)</span>
                    </span>
                }
                <input
                    style={{display: 'none'}}
                    ref={props.inputRef}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={props.handleFileChange}
                />
                <div className={styles.foto_area}>
                    {
                        selectedImage!==null?
                        <div className={styles.options} onClick={() => setSelectedImage(null)}>
                            <div className={styles.options_title}>
                                <p className={styles.options_title_text}>Fotografia {selectedImage+1}</p>
                            </div>
                            <div className={styles.options_main}>
                                <div className={styles.options_side} onClick={() => {
                                    props.setPhotoPrincipal(selectedImage)
                                    setSelectedImage(null)
                                }}>
                                    <StarIcon className={styles.options_icon}/>
                                    <span className={styles.options_text}>PRINCIPAL</span>
                                </div>
                                {/* <div className={styles.options_divider}/> */}
                                <div className={styles.options_side} onClick={() => {
                                    props.deleteImageHandler(selectedImage)
                                    setSelectedImage(null)
                                }}>
                                    <HideImageIcon className={styles.options_icon}/>
                                    <span className={styles.options_text}>REMOVER</span>
                                </div>
                            </div>
                        </div>
                        :null
                    }
                    {
                        props.images.length>0?
                        <div className={styles.foto_img_div}>
                            {displayImages()}
                        </div>
                        :
                        <div className={styles.foto_area_div} onClick={props.handleClick}>
                            <AddAPhotoIcon className={styles.foto_symbol}/>
                            {/* <span className={styles.foto_text}>adicionar</span> */}
                        </div>
                    }
                        
                    
                    <span className={styles.foto_number}>({props.images.length}/{props.maxFiles})</span>
                </div>
            </div>
        </div>
    )
}

export default PublicarPhoto