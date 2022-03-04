import React, { useEffect, useRef, useState } from 'react'
import styles from './dados.module.css'
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


const Dados = (props) => {

    const [worker, setWorker] = useState(null)
    const [workerOriginal, setWorkerOriginal] = useState(null)
    const [editName, setEditName] = useState('disabled')
    const [editNumber, setEditNumber] = useState('disabled')
    const [editAddress, setEditAddress] = useState('disabled')
    const [editIBAN, setEditIBAN] = useState('disabled')

    const refName = useRef(null)
    const refNumber = useRef(null)
    const refAddress = useRef(null)
    const refIBAN = useRef(null)

    const [value, setValue] = useState()

    useEffect(() => {
        setWorker(props.worker)
    }, [props.worker])

    useEffect(() => {
        if(editName!=='disabled') refName.current.focus()
    }, [editName])
    useEffect(() => {
        if(editNumber!=='disabled') refNumber.current.focus()
    }, [editNumber])
    useEffect(() => {
        if(editAddress!=='disabled') refAddress.current.focus()
    }, [editAddress])
    useEffect(() => {
        if(editIBAN!=='disabled') refIBAN.current.focus()
    }, [editIBAN])

    const handleChange = (val, type) => {
        if(type === 'name'){
            let wk = worker
            wk.name.first = val
            setWorker(wk)
        }
        else if(type === 'number'){
            console.log(val);
            let wk = worker
            wk.number = val
            setWorker(wk)
        }
    }

    const handleSave = () => {
        setWorkerOriginal(worker)
    }

    const handleCancel = () => {
        setWorker(workerOriginal)
    }

    return (
        <div className={styles.dados}>
            {
                worker?
                    <div className={styles.zona}>
                        <div className={styles.top_flex}>
                            <div className={styles.top_img}>
                                <img src={worker.img} className={styles.top_img_img}/>
                                <span className={styles.edit}>
                                    <EditIcon className={styles.edit_img_img}/>
                                </span>
                            </div>
                            <div className={styles.zona_right}>
                                <div className={styles.input_flex}>
                                    <input defaultValue={worker.name.first} onChange={(e) => handleChange(e.target.value, 'name')} disabled={editName} ref={refName} className={styles.input}></input>
                                    <span className={styles.edit_area}>
                                        {
                                            editName?
                                            <EditIcon 
                                                    onClick={() => {
                                                        setEditName(!editName)
                                                    }} 
                                                    className={styles.edit_img}/>
                                            :<CheckIcon onClick={() => { 
                                                handleSave()
                                                setEditName(!editName)
                                            }} className={styles.edit_img}/>
                                        }
                                    </span>
                                </div>
                                <div className={styles.input_flex}>
                                    <span className={styles.helper}>
                                        <PhoneInput
                                            country={'pt'}
                                            value={value}
                                            onChange={phone => setValue(phone)}
                                            countryCodeEditable={false}
                                            onlyCountries={['pt','es','fr','gb']}
                                            />
                                    </span>
                                    

                                    <span className={styles.edit_area}>
                                        {
                                            editNumber?
                                            <EditIcon 
                                                    onClick={() => {
                                                        setEditNumber(!editNumber)
                                                    }} 
                                                    className={styles.edit_img}/>
                                            :<CheckIcon onClick={() => { 
                                                handleSave()
                                                setEditNumber(!editNumber)
                                            }} className={styles.edit_img}/>
                                        }
                                    </span>
                                </div>
                                <input disabled={'disabled'} className={styles.input_noedit}></input>
                            </div>
                        </div>
                        <div className={styles.zona_bottom}>
                            <div className={styles.input_flex}>
                                <input disabled={editAddress} ref={refAddress} className={styles.input}></input>
                                <span className={styles.edit_area}>
                                {
                                    editAddress?
                                    <EditIcon 
                                            onClick={() => {
                                                setEditAddress(!editAddress)
                                            }} 
                                            className={styles.edit_img}/>
                                    :<CheckIcon onClick={() => { 
                                        handleSave()
                                        setEditAddress(!editAddress)
                                    }} className={styles.edit_img}/>
                                }
                                </span>
                            </div>
                            <div className={styles.input_flex}>
                                <input disabled={editIBAN} ref={refIBAN} className={styles.input}></input>
                                <span className={styles.edit_area}>
                                {
                                    editIBAN?
                                    <EditIcon 
                                            onClick={() => {
                                                setEditIBAN(!editIBAN)
                                            }} 
                                            className={styles.edit_img}/>
                                    :<CheckIcon onClick={() => { 
                                        handleSave()
                                        setEditIBAN(!editIBAN)
                                    }} className={styles.edit_img}/>
                                }
                                </span>
                            </div>
                        </div>
                        <div className={styles.top_flex}>
                        </div>
                    </div>
                :null
            }
        </div>
    )
}

export default Dados