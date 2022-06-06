import React, {useEffect, useState} from 'react'
import styles from './personal.module.css'
import FaceIcon from '@mui/icons-material/Face';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EditIcon from '@mui/icons-material/Edit';
import validator from 'validator'
import CheckIcon from '@mui/icons-material/Check';
import { storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from 'axios';

const Personal = (props) => {
    
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [phoneVisual, setPhoneVisual] = useState("")
    const [phoneWrong, setPhoneWrong] = useState(false)
    const [email, setEmail] = useState("")
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        if(props.user){
            setName(props.user.name)
            setPhone(props.user.phone)
            setEmail(props.user.email)
        }
    }, [props.user])

    useEffect(() => {
        if(phone.length>=7) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`)
        else if(phone.length>=4) setPhoneVisual(`${phone.slice(0,3)} ${phone.slice(3)}`)
        else{
            setPhoneVisual(`${phone.slice(0,3)}`)
        }
    }, [phone])

    const setPhoneHandler = (val) => {
        let phone = val.replace(/\s/g, '')
        setPhone(phone)
    }

    const editDoneHandler = () => {
        if(!validator.isMobilePhone(phone, "pt-PT")){
            setPhoneWrong(true)
        }
        else{
            setPhoneWrong(false)
            setEdit(false)
            if(phone!==props.user.phone){
                axios.post(`${props.api_url}/user/update_phone`, {
                    user_id : props.user._id,
                    phone: phone
                }).then(() => {
                    props.refreshUser()
                })
            }
        }
    }

    const userImageHandler = e => {
        let img = e.target.files[0]
        const storageRef = ref(storage, `user_images/${props.user._id}`);

        uploadBytes(storageRef, img).then(() => {
            getDownloadURL(storageRef).then(url => {
                axios.post(`${props.api_url}/user/update_photo`, {
                    user_id : props.user._id,
                    photoUrl: url
                }).then(res => {
                    props.refreshUser()
                })
            })
        })
        .catch()
    }


    return (
        <div className={styles.personal}>
            <div className={styles.personal_title}>
                <span className={styles.top_title}>Dados Pessoais</span>
            </div>
            <div className={styles.flex}>
                <div className={styles.image_wrapper}>
                    {
                        props.user&&props.user.photoUrl?
                        <img className={styles.image} src={props.user.photoUrl}/>
                        :<FaceIcon className={styles.image_tbd}/>
                    }
                    <div className={styles.image_input_wrapper}>
                        <EditIcon className={styles.edit_icon}/>
                        <input type="file" title=" " value="" onChange={(val) => userImageHandler(val)} accept="image/png, image/jpeg"/>
                    </div>
                    
                </div>
                <div className={edit?styles.input_flex_edit:styles.input_flex}>
                    {
                        !edit?
                            <div className={styles.input_edit_wrapper}>
                                <EditIcon className={styles.edit_icon} onClick={() => setEdit(true)}/>
                            </div>
                            :
                            <div className={styles.input_edit_wrapper}>
                                <CheckIcon className={styles.edit_icon} onClick={() => editDoneHandler()}/>
                            </div>
                }
                    <div className={styles.input_div}>
                        <span className={styles.input_title}>Nome</span>
                        <div className={styles.input_div_wrapper}>
                            <FaceIcon className={styles.input_icon}/>
                            <span className={styles.input_email}>{name}</span>
                        </div>
                    </div>
                    <div className={styles.input_div}>
                        <span className={styles.input_title}>Telefone</span>
                        <div className={styles.input_div_wrapper}>
                            <PhoneIphoneIcon className={styles.input_icon}/>
                            <input className={phoneWrong?styles.input_wrong
                                                :edit?styles.input_input_edit
                                                :styles.input_input}
                                    value={phoneVisual}
                                    maxLength={11} 
                                    onChange={e => setPhoneHandler(e.target.value)}
                                    disabled={!edit}></input>
                        </div>
                    </div>
                    <div className={styles.input_div}>
                        <span className={styles.input_title}>E-mail</span>
                        <div className={styles.input_div_wrapper}>
                            <AlternateEmailIcon className={styles.input_icon}/>
                            <span className={styles.input_email}>{email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Personal