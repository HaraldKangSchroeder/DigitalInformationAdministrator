import TaskPresentation from "./TaskPresentation";
import { makeStyles } from "@material-ui/core"
import React from "react";
import Tasks from "../Classes/Tasks";
import { classicNameResolver } from "typescript";

const useStyles = makeStyles({
    root : {
        paddingLeft : "1vw",
    }
})

interface Props {
    tasks : Tasks;
}

export default function TasksPresentation(props : Props){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                props.tasks.getTaskList().map((task) => {
                    return <TaskPresentation task={task}/>
                })
            }
        </div>
    )
}
