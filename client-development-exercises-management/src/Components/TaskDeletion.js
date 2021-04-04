import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from 'react';

import socket from "../socket.js";


const useStyles = makeStyles({
    root : {
        margin:"10px"
    }
})

export function TaskDeletion(props){
    const [openSafetyDeletionQuestion, setOpenSafetyDeletionQuestion] = useState(false);

    let isTaskSelected = props.selectedTask != null;

    const handleCloseSafetyDeletionQuestion = () => {
        setOpenSafetyDeletionQuestion(false);
    }

    const handleOpenSafetyDeletionQuestion = () => {
        setOpenSafetyDeletionQuestion(true);
    }

    const handleDeleteTask = () => {
        setOpenSafetyDeletionQuestion(false);
        if(!isTaskSelected) return;
        socket.emit("deleteTask", props.selectedTask);
        props.changeSelectedTask(null);
    }

    const classes = useStyles();
    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<DeleteIcon />}
                onClick={handleOpenSafetyDeletionQuestion}
            >
                Delete Task
            </Button>
            <Dialog
                open={openSafetyDeletionQuestion}
                onClose={handleCloseSafetyDeletionQuestion}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Task</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {
                            isTaskSelected ? 
                            `Are you sure that you want to delete the Task ${props.selectedTask.label} ?` : 
                            "You must select a Task in order to delete it"
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSafetyDeletionQuestion} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button disabled={!isTaskSelected} onClick={handleDeleteTask} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}