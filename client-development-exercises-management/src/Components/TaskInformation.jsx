import { TaskCalendar } from "./TaskCalendar";
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from "react";
import socket from "../socket.js";
import { DialogChangeName } from "./DialogChangeName";
import { DialogChangeValue } from "./DialogChangeValue";
import { MENU_ITEMS_SCORES, MENU_ITEMS_IMPORTANCES, MENU_ITEMS_WEEKLY_OCCURENCES } from '../constants';
import { makeStyles } from "@material-ui/core";
import TaskOccurences from "../Classes/TaskOccurences";


const useStyles = makeStyles({
    text: {
        fontSize: "1.1em",
        display: "flex",
        alignItems: "center"
    },
    textSelectTaskRequest: {
        display: "flex",
        alignItems: "center",
        height: "80vh",
        fontSize: "2em",
    }
})


export function TaskInformation(props) {
    const [taskOccurences, setTaskOccurences] = useState(new TaskOccurences());

    useEffect(() => {
        socket.on("taskOccurences", (res) => {
            let newTaskOccurences = new TaskOccurences(res);
            console.log(newTaskOccurences);
            setTaskOccurences(newTaskOccurences);
        })
        return () => {
            socket.off("taskOccurences");
        }
    }, [])

    useEffect(() => {
        if (props.selectedTask != null) {
            socket.emit("getTaskOccurences", { taskId: props.selectedTask.getId() });
        }
    }, [props.selectedTask]);

    const classes = useStyles();

    if (props.selectedTask == null) {
        return <div className={classes.textSelectTaskRequest}>Select a task on the left side</div>
    }
    return (
        <React.Fragment>
            <Grid item xs={3}>
                <div className={classes.text}>
                    Task : {props.selectedTask.getLabel()}
                    <DialogChangeName
                        selectedTaskId={props.selectedTask.getId()}
                        selectedTaskLabel={props.selectedTask.getLabel()}
                    />
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className={classes.text}>
                    Weekly Occurences : {props.selectedTask.getWeeklyOccurences()}
                    <DialogChangeValue
                        menuItems={MENU_ITEMS_WEEKLY_OCCURENCES}
                        type="Weekly Occurence"
                        messageId="changeTaskWeeklyOccurences"
                        selectedTaskId={props.selectedTask.getId()}
                        selectedTaskLabel={props.selectedTask.getLabel()}
                    />
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className={classes.text}>
                    Score : {props.selectedTask.getScore()}
                    <DialogChangeValue
                        menuItems={MENU_ITEMS_SCORES}
                        type="Score"
                        messageId="changeTaskScore"
                        selectedTaskId={props.selectedTask.getId()}
                        selectedTaskLabel={props.selectedTask.getLabel()}
                    />
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className={classes.text}>
                    Importance : {props.selectedTask.getImportance()}
                    <DialogChangeValue
                        menuItems={MENU_ITEMS_IMPORTANCES}
                        type="Importance"
                        messageId="changeTaskImportance"
                        selectedTaskId={props.selectedTask.getId()}
                        selectedTaskLabel={props.selectedTask.getLabel()}
                    />
                </div>
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={0} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={1} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={2} />
            </Grid>


            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={3} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={4} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={5} />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={6} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={7} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={8} />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={9} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={10} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTaskId={props.selectedTask.getId()} taskOccurences={taskOccurences} month={11} />
            </Grid>
        </React.Fragment>
    )
}