import { makeStyles } from "@material-ui/core";
import { useState } from "react";

var a = ["hey","you","are","cool"];

export function TaskSelection(props){
    return (
        <div>
            {
                a.map(el => {
                    return (
                        <TaskListElement
                            value = {el}
                        />
                    )
                })
            }
        </div>
    );
}



const useStyles = makeStyles({
    root : {
        padding:"10px",
        background:"red",
        margin:"5px"
    }
})

function TaskListElement(props){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {props.value}
        </div>
    )
}