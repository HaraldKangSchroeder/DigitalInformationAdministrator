import { makeStyles } from "@material-ui/core"
import {SelectMenu} from "./SelectMenu";
import React from "react";
import MultipleSelectTaskMenu from "./MultipleSelectTaskMenu";


const useStyles = makeStyles({
    root : {
        fontSize : "1.4em",
        color:"rgb(100,100,100)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginTop:"2vh",
    }
})


export function ChartHeader(props){
    

    const classes = useStyles();
    return (
        <div className = {classes.root}>
            Scores of
            <MultipleSelectTaskMenu
                tasks={props.tasks}
                selectedTasks={props.selectedTasks}
                changeSelectedTasksByIds={props.changeSelectedTasksByIds}
            />
            per Calender Week from
            <SelectMenu 
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
            <SelectMenu 
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
            <SelectMenu 
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