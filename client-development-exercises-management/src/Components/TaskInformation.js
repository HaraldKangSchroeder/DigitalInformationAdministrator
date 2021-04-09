import { TaskCalendar } from "./TaskCalendar";
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from "react";
import socket from "../socket.js";
import { DialogChangeName } from "./DialogChangeName";
import { DialogChangeValue } from "./DialogChangeValue";
import { MENU_ITEMS_SCORES, MENU_ITEMS_IMPORTANCES, MENU_ITEMS_WEEKLY_RYHTMS, MENU_ITEMS_DAYS, MENU_ITEMS_WEEKLY_OCCURENCES } from '../constants';
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
    text: {
        fontSize : "1.1em",
        display: "flex",
        alignItems: "center"
    },
    textSelectTaskRequest : {
        display: "flex",
        alignItems: "center",
        height:"80vh",
        fontSize : "2em",
    }
})


export function TaskInformation(props) {
    const [taskOccurences, setTaskOccurences] = useState([]);

    useEffect(() => {
        socket.on("taskOccurences", (res) => {
            setTaskOccurences(res);
        })
    }, [])

    useEffect(() => {
        if (props.selectedTask != null) {
            socket.emit("getTaskOccurences", { taskId: props.selectedTask.id });
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
                Task : {props.selectedTask.label} <DialogChangeName selectedTaskId={props.selectedTask.id} selectedTaskLabel={props.selectedTask.label} />
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className={classes.text}>
                    Weekly Occurences : {props.selectedTask.weekly_occurences}
                <DialogChangeValue
                    menuItems={MENU_ITEMS_WEEKLY_OCCURENCES}
                    type="Weekly Occurence"
                    messageId="changeTaskWeeklyOccurences"
                    selectedTaskId={props.selectedTask.id}
                    selectedTaskLabel={props.selectedTask.label}
                />
                </div>
            </Grid>
            <Grid item xs={3}>
            <div className={classes.text}>
                Score : {props.selectedTask.score}
                <DialogChangeValue
                    menuItems={MENU_ITEMS_SCORES}
                    type="Score"
                    messageId="changeTaskScore"
                    selectedTaskId={props.selectedTask.id}
                    selectedTaskLabel={props.selectedTask.label}
                />
                </div>
            </Grid>
            <Grid item xs={3}>
            <div className={classes.text}>
                Importance : {props.selectedTask.importance}
                <DialogChangeValue
                    menuItems={MENU_ITEMS_IMPORTANCES}
                    type="Importance"
                    messageId="changeTaskImportance"
                    selectedTaskId={props.selectedTask.id}
                    selectedTaskLabel={props.selectedTask.label}
                />
                </div>
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