import { makeStyles, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
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
        }
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
            background: isTaskSelected ? "#B7A9D4" : "8B72BE",
        },
    })
});

interface Props {
    selectedTask: Task;
    calendarWeek: number;
    taskOccurences: TaskOccurences;
}

export function TaskCalendarWeekEntry(props: Props) {
    const [isTaskWeek, setIsTaskWeek] = useState(props.taskOccurences !== null && props.taskOccurences.containsWeek(props.calendarWeek));

    useEffect(() => {
        let isTaskOccurentOnCalendarWeek = props.taskOccurences !== null && props.taskOccurences.containsWeek(props.calendarWeek);
        setIsTaskWeek(isTaskOccurentOnCalendarWeek);
    }, [props.taskOccurences, props.calendarWeek]);

    const handleOnClick = () => {
        if (props.selectedTask === null) return;

        if (isTaskWeek) {
            socket.emit("deleteTaskOccurence", { taskId: props.selectedTask.getId(), calendarWeek: props.calendarWeek });
            return;
        }
        socket.emit("createTaskOccurence", { taskId: props.selectedTask.getId(), calendarWeek: props.calendarWeek });
    };

    const classes = useStyle({ isTaskSelected: props.selectedTask !== null });
    let classNames = `${classes.calendarEntry}`;

    if (isTaskWeek) {
        classNames += ` ${classes.calendarEntryTaskOccurence}`;
    }
    return (
        <Paper onClick={handleOnClick} className={classNames} elevation={4}>{props.calendarWeek}</Paper>
    )
}