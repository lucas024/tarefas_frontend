import React, { useEffect, useRef, useState } from 'react'
import styles from './dados.module.css'
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import validator from 'validator'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const Dados = (props) => {

    const [worker, setWorker] = useState(null)
    const [workerOriginal, setWorkerOriginal] = useState(null)
    const [editNumber, setEditNumber] = useState('disabled')
    const [editAddress, setEditAddress] = useState('disabled')
    const [editCP, setEditCP] = useState('disabled')
    const [editIBAN, setEditIBAN] = useState('disabled')
    const [wrongInputNumber, setWrongInputNumber] = useState(false)
    const [wrongIban, setWrongIban] = useState(false)
    const [wrongCP, setWrongCP] = useState(false)

    const refNumber = useRef(null)
    const refAddress = useRef(null)
    const refIBAN = useRef(null)
    const refCP = useRef(null)

    const [value, setValue] = useState()

    useEffect(() => {
        setWorker(props.worker)
        setWorkerOriginal(props.worker)
        setValue(`351${props.worker.number}`)
    }, [props.worker])

    useEffect(() => {
        if(value!==undefined){
            if(validator.isMobilePhone(value, 'pt-PT')) setWrongInputNumber(false)
            else setWrongInputNumber(true)
        }
    }, [value])
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

    const handleSaveNumber = () => {
        if(validator.isMobilePhone(value, 'pt-PT')){
            let wk = worker
            wk.number = value
            setWorker(wk)
            setWorkerOriginal(wk)
            setEditNumber("disabled")
        }
        else{

        }
    }

    const ibanChangeHandler = () => {
        setWrongIban(false)
    }

    const handleSaveAddy = () => {
        let wk = worker
        wk.address = refAddress.current.value
        setWorker(wk)
        setWorkerOriginal(wk)
        setEditAddress("disabled")
    }

    const handleSaveCP = () => {
        if(validator.isPostalCode(refCP.current.value, 'PT')){
            let wk = worker
            wk.cp = refCP.current.value
            setWorker(wk)
            setWorkerOriginal(wk)
            setEditCP("disabled")
            setWrongCP(false)
            console.log(validator.isPostalCodeLocales);

        }
        else{
            setWrongCP(true)
            console.log("yoyo");
        }
    }

    const handleSaveIban = () => {
        if(validator.isIBAN(refIBAN.current.value)){
            let wk = worker
            wk.IBAN = refIBAN.current.value
            setWorker(wk)
            setWorkerOriginal(wk)
            setEditIBAN("disabled")
            setWrongIban(false)
        }
        else{
            setWrongIban(true)
        }
        
    }

    const handleCancel = () => {
        setWorker(workerOriginal)
        setValue(workerOriginal.number)
        refAddress.current.value = workerOriginal.address
        refIBAN.current.value = workerOriginal.iban
        refCP.current.value = workerOriginal.cp
        setWrongIban(false)
        setWrongCP(false)
    }

    return (
        <div className={styles.dados}>
            {
                worker?
                    <div className={styles.zona}>
                        <span className={styles.tituloZona}>Fotografia e Dados</span>
                        <div className={styles.top_flex}>
                            <div className={styles.top_img}>
                                <img src={worker.img} className={styles.top_img_img}/>
                                <span className={styles.edit}>
                                    <EditIcon className={styles.edit_img_img}/>
                                </span>
                            </div>
                            <div className={styles.zona_right}>
                                <div className={styles.input_flex}>
                                    <PermIdentityOutlinedIcon sx={{fontSize:18, marginTop:"1px", color:"#808080"}}/>
                                    <span className={styles.input_noedit}>{worker.name.first}</span>
                                </div>
                                <div className={styles.input_flex} style={{marginTop:"10px"}}>
                                    <EmailOutlinedIcon sx={{fontSize:18, marginTop:"1px", color:"#808080"}}/>
                                    <span className={styles.input_noedit}>lucas.a.perry98@gmail.com</span>
                                </div>
                                <div className={styles.input_flex} style={{marginTop:"10px"}}>
                                    <span className={styles.helper}>
                                        <PhoneInput
                                            country={'pt'}
                                            value={value}
                                            onChange={phone => setValue(phone)}
                                            countryCodeEditable={false}
                                            onlyCountries={['pt','es','fr','gb']}
                                            className={wrongInputNumber?styles.numberInputWrong:styles.numberInput}
                                            disabled={editNumber==="disabled"}
                                            ref={refNumber}
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
                                            :
                                            <div className={styles.edit_area_flex}>
                                                <CheckIcon 
                                                    onClick={() => { 
                                                        handleSaveNumber()
                                                    }} className={styles.edit_img}/>
                                                <CloseOutlinedIcon 
                                                    onClick={() => {
                                                        setEditNumber('disabled')
                                                        handleCancel()
                                                    }} 
                                                    className={styles.edit_img}/>
                                            </div>
                                            
                                        }
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.zona_bottom}>
                        {/* <GooglePlacesAutocomplete
                            apiKey="AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk"
                            autocompletionRequest={{
                                bounds: [
                                  { lat: 38.74, lng: -9.27 },
                                  { lat: 38.83, lng: -9.17 },
                                  { lat: 38.79, lng: -9.09 },
                                  { lat: 38.69, lng: -9.21 },
                                ],
                                componentRestrictions: {
                                country: ['pt'],
                                }
                              }}
                            /> */}

                            <span className={styles.tituloZona}>Morada e IBAN</span>
                            <div className={styles.input_flex}>
                                <div className={styles.form_group}>
                                    <span className={styles.leftThing}>

                                        <BusinessIcon/>
                                    </span>
                                    <input placeholder='Rua Numero 1, Andar 2'
                                        
                                        defaultValue={worker.address} 
                                        disabled={editAddress} ref={refAddress} 
                                        className={styles.inputLong}></input>

                                </div>
                                <span className={styles.edit_area}>
                                {
                                    editAddress?
                                    <EditIcon 
                                            onClick={() => {
                                                setEditAddress(!editAddress)
                                            }} 
                                            className={styles.edit_img}/>
                                    :
                                    <div className={styles.edit_area_flex}>
                                            <CheckIcon 
                                                onClick={() => { 
                                                    handleSaveAddy()
                                                }} className={styles.edit_img}/>
                                            <CloseOutlinedIcon 
                                                onClick={() => {
                                                    setEditAddress('disabled')
                                                    handleCancel()
                                                }} 
                                                className={styles.edit_img}/>
                                        </div>
                                }
                                </span>
                            </div>
                            <div className={styles.input_flex}>
                                <div className={wrongCP?styles.wrongIban_form_group:styles.form_group}>
                                    <span className={styles.leftThing}>
                                        <NumbersOutlinedIcon/>
                                    </span>
                                    <input placeholder='1600-123'
                                        defaultValue={worker.cp} 
                                        disabled={editCP} ref={refCP} 
                                        className={styles.inputShort}></input>

                                </div>
                                <span className={styles.edit_area}>
                                {
                                    editCP?
                                    <EditIcon 
                                            onClick={() => {
                                                setEditCP(!editCP)
                                            }} 
                                            className={styles.edit_img}/>
                                    :
                                    <div className={styles.edit_area_flex}>
                                            <CheckIcon 
                                                onClick={() => { 
                                                    handleSaveCP()
                                                }} className={styles.edit_img}/>
                                            <CloseOutlinedIcon 
                                                onClick={() => {
                                                    setEditCP('disabled')
                                                    handleCancel()
                                                }} 
                                                className={styles.edit_img}/>
                                        </div>
                                }
                                </span>
                            </div>
                            <div className={styles.input_flex}>
                                <div className={wrongIban?styles.wrongIban_form_group:styles.form_group}>
                                    <span className={styles.leftThing}>

                                        <AccountBalanceIcon/>
                                    </span>
                                    <input placeholder='PT50 0027 0000 0001 2345 6783 3' 
                                    onChange={() => ibanChangeHandler()} 
                                        defaultValue={worker.iban} 
                                        disabled={editIBAN} ref={refIBAN} 
                                        className={styles.inputLong}></input>

                                </div>
                                <span className={styles.edit_area}>
                                {
                                    editIBAN?
                                    <EditIcon 
                                            onClick={() => {
                                                setEditIBAN(!editIBAN)
                                            }} 
                                            className={styles.edit_img}/>
                                    :
                                    <div className={styles.edit_area_flex}>
                                            <CheckIcon 
                                                onClick={() => { 
                                                    handleSaveIban()
                                                }} className={styles.edit_img}/>
                                            <CloseOutlinedIcon 
                                                onClick={() => {
                                                    setEditIBAN('disabled')
                                                    handleCancel()
                                                }} 
                                                className={styles.edit_img}/>
                                        </div>
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