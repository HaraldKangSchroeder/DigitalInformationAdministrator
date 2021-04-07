import { TaskCalendar } from "./TaskCalendar";
import Grid from '@material-ui/core/Grid';
import React, { useEffect ,useState} from "react";
import socket from "../socket.js";

export function TaskInformation(props) {
    const [taskOccurences, setTaskOccurences] = useState([]);

    useEffect(() => {
        socket.on("taskOccurences", (res) => {
            console.log(res);
            setTaskOccurences(res);
        })
    }, [])

    useEffect(() => {
        if (props.selectedTask != null) {
            socket.emit("getTaskOccurences", { taskId: props.selectedTask.id});
        }
    }, [props.selectedTask]);


    if(props.selectedTask == null){
        return "Select a task on the left side";
    }

    return (
        <React.Fragment>
            <Grid item xs={3}>
                Weekly Occurences : -1
            </Grid>
            <Grid item xs={3}>
                Score : {props.selectedTask.score}
            </Grid>
            <Grid item xs={3}>
                Importance : {props.selectedTask.importance}
            </Grid>
            <Grid item xs={3}>

            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={0} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={1} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={2} />
            </Grid>


            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={3} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={4} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={5} />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={6} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={7} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={8} />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={9} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={10} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.id} taskOccurences={taskOccurences} month={11} />
            </Grid>
        </React.Fragment>
    )
}