import React, {useEffect, useState} from 'react'
import styles from './personal.module.css'
import FaceIcon from '@mui/icons-material/Face';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EditIcon from '@mui/icons-material/Edit';

const Personal = (props) => {
    
    const [temporaryName, setTemporaryName] = useState("")
    const [temporaryNumber, setTemporaryNumber] = useState("")
    const [email, setEmail] = useState("")
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        if(props.user){
            setTemporaryName(props.user.name)
            setTemporaryNumber(props.user.phone)
            setEmail(props.user.email)
        }
    }, [props.user])

    const changeNameHandler = (val) => {

    }

    const changeNumberHandler = (val) => {

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
                    <EditIcon className={styles.edit_icon}/>
                </div>
                <div className={edit?styles.input_flex_edit:styles.input_flex}>
                    <div className={styles.input_edit_wrapper}>
                        <EditIcon className={styles.edit_icon} onClick={() => setEdit(true)}/>
                    </div>
                    <div className={styles.input_div}>
                        <span className={styles.input_title}>Nome</span>
                        <div className={styles.input_div_wrapper}>
                            <FaceIcon className={styles.input_icon}/>
                            <input className={styles.input_input} 
                                    value={temporaryName}
                                    onChange={e => changeNameHandler(e)}
                                    disabled={true}></input>
                        </div>
                    </div>
                    <div className={styles.input_div}>
                        <span className={styles.input_title}>Telefone</span>
                        <div className={styles.input_div_wrapper}>
                            <PhoneIphoneIcon className={styles.input_icon}/>
                            <input className={styles.input_input}
                                    value={temporaryNumber}
                                    onChange={e => changeNumberHandler(e)}
                                    disabled={true}></input>
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