import { makeStyles, Paper } from "@material-ui/core";
import { useState, useEffect } from "react";
import TaskOccurences from "../../../Classes/TaskOccurences";
import socket from "../../../socket";

const useStyle = makeStyles({
    calendarEntry: {
        width: "35px",
        height: "35px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        margin: "5px",
        '&:hover': {
            background: "#CAB9D9",
        },
    },
    calendarEntryTaskOccurence: {
        width: "35px",
        height: "35px",
        background: "#8B72BE",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        margin: "5px",
        '&:hover': {
            background: "#B7A9D4",
        },
    },
});

interface Props {
    selectedTaskId: number;
    calendarWeek: number;
    dayOfWeek: number;
    dayOfMonth: number;
    taskOccurences: TaskOccurences;
}

export function TaskCalendarDayEntry(props: Props) {
    const [isTaskDay, setIsTaskDay] = useState(props.calendarWeek != null && props.taskOccurences.containsWeekAndDay(props.calendarWeek, props.dayOfWeek));

    useEffect(() => {
        let isCalendarWeekExistent = props.calendarWeek != null;
        let isTaskOccurentOnCalendarWeekAndDay = props.taskOccurences.containsWeekAndDay(props.calendarWeek, props.dayOfWeek);
        setIsTaskDay(isCalendarWeekExistent && isTaskOccurentOnCalendarWeekAndDay);
    }, [props.calendarWeek, props.taskOccurences, props.dayOfWeek]);

    const handleOnClick = (e: any) => {
        if (isTaskDay) {
            socket.emit("updateTaskOccurenceEntryByRemovingDayOfWeek", { taskId: props.selectedTaskId, calendarWeek: props.calendarWeek });
            return;
        }
        socket.emit("createTaskOccurence", { taskId: props.selectedTaskId, calendarWeek: props.calendarWeek, dayOfWeek: props.dayOfWeek });
    }

    const classes = useStyle();
    let classNames = `${classes.calendarEntry}`;
    if (isTaskDay) {
        classNames += ` ${classes.calendarEntryTaskOccurence}`;
    }
    return (
        <Paper onClick={handleOnClick} className={classNames} elevation={4}>{props.dayOfMonth}</Paper>
    )
}