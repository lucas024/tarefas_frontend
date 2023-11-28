import React from 'react'

const Marker = (props) => {

    const mystyle = {
        height: "80px",
        width: "80px",
        marginLeft: "-40px",
        marginTop: "-40px",
        borderRadius: "50%",
        border: "4px solid var(--job)",
        backgroundColor: "#0358e550"
        
    }
    return (
        <div
            lat={props.lat}
            lng={props.lng}
            style={mystyle}>
        </div>
    )
}

export default Marker