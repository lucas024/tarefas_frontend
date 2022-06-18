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


const Loader = (props) => {
    return(
        <div>
            <ClipLoader color={"#FF785A"} css={override} loading={props.loading} size={150} />
                {
                    props.loading?
                    <div className="frontdrop"></div>
                    :null
                }
        </div>
        
    )
}

export default Loader