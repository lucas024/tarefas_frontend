import React from "react";
import { useState, useEffect } from 'react';

const Timer = (props) => {

    const [seconds, setSeconds] = useState('_')

    const getTime = () => {
        const time = Date.parse(props.deadline) - Date.now()
        
        if(time > 1) setSeconds(Math.floor((time / 1000) % 60))
        else props.setExp()
    }

    useEffect(() => {
        const interval = setInterval(() => getTime(props.deadline), 1000);
    
        return () => clearInterval(interval);
    }, [])

    return(
        <p>{seconds}</p>
    )
}

export default Timer