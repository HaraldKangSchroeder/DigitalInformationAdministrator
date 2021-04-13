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
    

    const classes = useStyles();
    return (
        <div className = {classes.root}>
            Scores of
            <MultipleSelectMenuValueSelection
                taskIds={props.taskIdsInYear}
                selectedTaskIds={props.selectedTaskIds}
                changeSelectedTaskIds={props.changeSelectedTaskIds}
            />
            per Calender Week from
            <SelectMenuValueSelection 
                value={props.calendarWeekStart}
                label={"CW"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeCalendarWeekStart}
                menuItems={props.calendarWeeks}
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
                menuItems={props.calendarWeeks}
                noNone={true}
            />
            of Year
            <SelectMenuValueSelection 
                value={props.year}
                label={"Year"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeYear}
                menuItems={props.years}
                noNone={true}
            />
        </div>
    )
}