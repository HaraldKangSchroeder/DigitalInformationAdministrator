import { makeStyles, Paper } from "@material-ui/core";
import { useState, useEffect } from "react";
import Task from "../../../Classes/Task";
import TaskOccurences from "../../../Classes/TaskOccurences";
import { socketTasks as socket } from "../../../socket";

const useStyle = makeStyles({
    calendarEntry: ({ isTaskSelected }: { isTaskSelected: boolean }) => ({
        width: "35px",
        height: "35px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: isTaskSelected ? "pointer" : "default",
        margin: "5px",
        '&:hover': {
            background: isTaskSelected ? "#CAB9D9" : "white",
        },
    }),
    calendarEntryTaskOccurence: ({ isTaskSelected }: { isTaskSelected: boolean }) => ({
        width: "35px",
        height: "35px",
        background: "#8B72BE",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: isTaskSelected ? "pointer" : "default",
        margin: "5px",
        '&:hover': {
            background: isTaskSelected ? "#B7A9D4" : "#8B72BE",
        },
    }),
});

interface Props {
    selectedTask: Task;
    calendarWeek: number;
    dayOfWeek: number;
    dayOfMonth: number;
    taskOccurences: TaskOccurences;
}

export function TaskCalendarDayEntry(props: Props) {
    const [isTaskDay, setIsTaskDay] = useState(props.calendarWeek != null && props.taskOccurences !== null && props.taskOccurences.containsWeekAndDay(props.calendarWeek, props.dayOfWeek));
    const [isTaskWeek, setIsTaskWeek] = useState(props.taskOccurences != null && props.taskOccurences.containsWeek(props.calendarWeek));

    useEffect(() => {
        let isCalendarWeekExistent = props.calendarWeek != null;
        let isTaskOccurentOnCalendarWeek = props.taskOccurences != null && props.taskOccurences.containsWeek(props.calendarWeek);
        setIsTaskWeek(isTaskOccurentOnCalendarWeek);
        let isTaskOccurentOnCalendarWeekAndDay = props.taskOccurences != null && props.taskOccurences.containsWeekAndDay(props.calendarWeek, props.dayOfWeek);
        setIsTaskDay(isCalendarWeekExistent && isTaskOccurentOnCalendarWeekAndDay);
    }, [props.calendarWeek, props.taskOccurences, props.dayOfWeek]);

    const handleOnClick = (e: any) => {
        if (props.selectedTask === null) return;

        if (isTaskWeek) {
            socket.emit("updateTaskOccurence", { taskId: props.selectedTask.getId(), calendarWeek: props.calendarWeek, dayOfWeek: isTaskDay ? null : props.dayOfWeek });
            return;
        }
        socket.emit("createTaskOccurence", { taskId: props.selectedTask.getId(), calendarWeek: props.calendarWeek, dayOfWeek: props.dayOfWeek });
    }

    const classes = useStyle({ isTaskSelected: props.selectedTask !== null });
    let classNames = `${classes.calendarEntry}`;
    if (isTaskDay) {
        classNames += ` ${classes.calendarEntryTaskOccurence}`;
    }
    return (
        <Paper onClick={handleOnClick} className={classNames} elevation={4}>{props.dayOfMonth}</Paper>
    )
}