import TaskPresentation from "./TaskPresentation";
import { makeStyles } from "@material-ui/core"
import React from "react";
import Tasks from "../../Classes/Tasks";
import { classicNameResolver } from "typescript";
import Users from "../../Classes/Users";
import User from "../../Classes/User";

const useStyles = makeStyles({
    root : {
        paddingLeft : "1vw",
        height: "100vh",
        overflowY: "auto",
    }
})

interface Props {
    tasks : Tasks;
    users : Users;
    selectedUser : User;
}

export default function TasksPresentation(props : Props){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                props.tasks.getTaskList().map((task) => {
                    return <TaskPresentation selectedUser={props.selectedUser} users={props.users} task={task}/>
                })
            }
        </div>
    )
}
