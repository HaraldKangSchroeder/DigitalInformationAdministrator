import TaskPresentation from "./TaskPresentation";
import { makeStyles } from "@material-ui/core"
import React from "react";
import Tasks from "../Classes/Tasks";

const useStyles = makeStyles({
    
})

interface Props {
    tasks : Tasks;
}

export default function TasksPresentation(props : Props){
    return (
        <React.Fragment>
            {
                props.tasks.getTaskList().map((task) => {
                    return <TaskPresentation task={task}/>
                })
            }
        </React.Fragment>
    )
}
