import React from 'react'
import ClipLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  z-index: 11;
  left: calc(50% - 75px);
  top: calc(50% - 75px);
`;

const small_override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  z-index: 11;
  left: calc(50% - 10px);
  top: calc(50% - 15px);
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
        <div>
            <ClipLoader color={"#FF785A"} css={props.small?small_override:override} loading={props.loading} size={props.small?20:150} />
                {
                    props.loading?
                    <div className="frontdrop" style={{borderRadius:props.radius?"10px":""}}></div>
                    :null
                }
        </div>
        
    )
}

export default Loader