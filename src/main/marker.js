import React from 'react'

const Marker = (props) => {

    const mystyle = {
        height: "80px",
        width: "80px",
        marginLeft: "-40px",
        marginTop: "-40px",
        borderRadius: "50%",
        border: "4px solid var(--action)",
        backgroundColor: "#FF785A50"
        
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