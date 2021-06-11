import { useEffect, useState } from "react"


export default function Clock(){
    const [time,setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
    },[]);

    let hours = time.getHours() + "";
    let isHoursSingleValue = hours.length === 1;
    if(isHoursSingleValue) hours = prependZero(hours);

    let minutes = time.getMinutes() + "";
    let isMinutesSingleValue = minutes.length === 1;
    if(isMinutesSingleValue) minutes = prependZero(minutes);

    return (
        <div>
            {hours}:{minutes}
        </div>
    );
}

function prependZero(value : string) : string{
    value = "" + value;
    if(value.length === 1) return "0" + value;
    return value;
}