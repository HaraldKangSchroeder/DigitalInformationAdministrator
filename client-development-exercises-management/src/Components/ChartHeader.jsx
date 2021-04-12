import { makeStyles } from "@material-ui/core"
import {SelectMenuValueSelection} from "./SelectMenuValueSelection";
import socket from "../socket";
import { useEffect } from "react";
import React, { useState } from "react";
import MultipleSelectMenuValueSelection from "./MultipleSelectMenuValueSelection";


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
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [tasks,setTasks] = useState([]);

    useEffect(() => {
        socket.on("allActiveTasks", (res) => {
            setTasks(res.tasks);
        });
        socket.emit("getAllActiveTasks");

        return () => {
            socket.off("allActiveTasks");
        }
    },[])

    console.log(selectedTaskIds);
    const classes = useStyles();
    return (
        <div className = {classes.root}>
            Scores of
            <MultipleSelectMenuValueSelection
                tasks={tasks}
                selectedTaskIds={selectedTaskIds}
                changeSelectedTaskIds={setSelectedTaskIds}
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
                value={props.year}
                label={"Year"}
                minWidth={100}
                height={10}
                marginSide={10}
                menuItems={[{value:"2021",label:"2021"}]}
                noNone={true}
            />
        </div>
    )
}