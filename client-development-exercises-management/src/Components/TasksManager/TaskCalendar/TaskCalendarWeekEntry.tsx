import { makeStyles, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
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
    }
});

interface Props {
    selectedTaskId: number;
    calendarWeek: number;
    taskOccurences: TaskOccurences;
}

export function TaskCalendarWeekEntry(props: Props) {
    const [isTaskWeek, setIsTaskWeek] = useState(props.taskOccurences.containsWeek(props.calendarWeek));

    useEffect(() => {
        let isTaskOccurentOnCalendarWeek = props.taskOccurences.containsWeek(props.calendarWeek);
        setIsTaskWeek(isTaskOccurentOnCalendarWeek);
    }, [props.taskOccurences, props.calendarWeek]);

    const handleOnClick = () => {
        if (isTaskWeek) {
            socket.emit("deleteTaskOccurence", { taskId: props.selectedTaskId, calendarWeek: props.calendarWeek });
            return;
        }
        socket.emit("createTaskOccurence", { taskId: props.selectedTaskId, calendarWeek: props.calendarWeek });
    };

    const classes = useStyle();
    let classNames = `${classes.calendarEntry}`;
    if (isTaskWeek) {
        classNames += ` ${classes.calendarEntryTaskOccurence}`;
    }
    return (
        <Paper onClick={handleOnClick} className={classNames} elevation={4}>{props.calendarWeek}</Paper>
    )
}