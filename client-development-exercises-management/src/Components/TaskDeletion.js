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
        marginTop:"10px"
    },
    startIcon: {
        margin: 0
    }
})

export function TaskDeletion(props){
    const [openSafetyDeletionQuestion, setOpenSafetyDeletionQuestion] = useState(false);

    const handleCloseSafetyDeletionQuestion = () => {
        setOpenSafetyDeletionQuestion(false);
    }

    const handleOpenSafetyDeletionQuestion = () => {
        setOpenSafetyDeletionQuestion(true);
    }

    const handleDeleteTask = () => {
        setOpenSafetyDeletionQuestion(false);
        socket.emit("deleteTask", {id:props.selectedTaskId});
        props.resetSelectedTaskId();
    }

    const classes = useStyles();
    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<DeleteIcon />}
                disabled={props.disabled}
                onClick={handleOpenSafetyDeletionQuestion}
            >
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
                            !props.disabled ? 
                            `Are you sure that you want to delete the Task ${props.taskLabel} ?` : 
                            "You must select a Task in order to delete it"
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSafetyDeletionQuestion} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTask} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}