import { makeStyles } from "@material-ui/core"
import {SelectMenuValueSelection} from "./SelectMenuValueSelection";
import {X_AXIS_LABEL_DATA} from "../constants";
import socket from "../socket";
import { useEffect } from "react";
import React, { useState } from "react";


const useStyles = makeStyles({
    root : {
        fontSize : "1.4em",
        color:"rgb(100,100,100)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginTop:"2vh",
        
        // background:"red"
    }
})

const CALENDAR_WEEKS = [
    
];

for(let i = 0; i<=54; i++){
    CALENDAR_WEEKS.push({value:i,label:i});
}

export function ChartHeader(props){
    const classes = useStyles();
    const [tasks,setTasks] = useState([]);

    useEffect(() => {
        socket.on("allTasks", (res) => {
            let tasksTemp = [{id:-1,label:"All"}].concat(res.tasks);
            setTasks(tasksTemp);
        });
        socket.emit("getAllTasks");

        return () => {
            socket.off("allTasks");
        }
    },[])

    return (
        <div className = {classes.root}>
            Scores of
            <SelectMenuValueSelection 
                value={props.calendarWeekStart}
                label={"Tasks"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeCalendarWeekStart}
                menuItems={CALENDAR_WEEKS}
                noNone={true}
            />
            per Calender Week from
            <SelectMenuValueSelection 
                value={props.calendarWeekStart}
                label={"CW"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeCalendarWeekStart}
                menuItems={CALENDAR_WEEKS}
                noNone={true}
            />
            to 
            <SelectMenuValueSelection 
                value={props.calendarWeekEnd}
                label={"CW"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeCalendarWeekEnd}
                menuItems={CALENDAR_WEEKS}
                noNone={true}
            />
            of Year
            <SelectMenuValueSelection 
                value={""}
                label={"Year"}
                minWidth={100}
                height={10}
                marginSide={10}
                menuItems={X_AXIS_LABEL_DATA}
                noNone={true}
            />
        </div>
    )
}