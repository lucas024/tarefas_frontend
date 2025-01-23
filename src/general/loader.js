import React, {CSSProperties} from 'react'
import ClipLoader from "react-spinners/BounceLoader";
import BarLoader from "react-spinners/BarLoader";
import { css } from "@emotion/react";
import logo from '../assets/logo_circular.png'
import styles from './loader.module.css'


const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  position: "absolute",
  zIndex: 11,
  left: "calc(50% - 75px)",
  top: "calc(50% - 75px)",
};

const small_override = css`
  display: block,
  margin: 0 auto,
  border-color: red,
  position: absolute,
  z-index: 11,
  left: calc(50% - 10px),
  top: calc(50% - 15px),
`;

const border_override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  z-index: 11;
  left: calc(50% - 75px);
  top: calc(50% - 75px);
  border-radius: 10px;
`;



const Loader = (props) => {
    return(
        <div className={styles.loader}>
            {/* <ClipLoader color={"#FFFFFF"} cssOverride={props.small?small_override:override} loading={props.loading} size={props.small?20:150} /> */}
            {
              props.loading?
              <div className={styles.logo_wrapper}>
                <div className={styles.img_wrapper}>
                  <img className={styles.img} src={logo}/>
                </div>
                <div className={styles.bar_wrapper}>
                  <BarLoader color='#ffffff' loading={true}/>
                </div>
                
              </div>
              :null
            }
            
            {
                props.loading?
                <div css={props.nofrontdrop===true?"":"frontdrop"} style={{borderRadius:props.radius?"10px":""}}></div>
                :null
            }
            
        </div>
        
    )
}

export default Loader