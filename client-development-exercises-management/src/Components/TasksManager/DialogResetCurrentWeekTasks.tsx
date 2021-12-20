import React, { useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import UpdateIcon from '@material-ui/icons/Update';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../../socket";


const useStyles = makeStyles({
    root: {
        minWidth: "30px",
        maxWidth: "30px",
        minHeight: "30px",
        maxHeight: "30px",
        color: "grey",
    },
    informationText: {
        marginBottom: "20px"
    },
    startIcon: {
        margin: 0
    },
    size: {

    }
});


export function DialogResetCurrentWeekTasks() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    }

    const handleSubmit = () => {
        socket.emit("resetCurrentWeekTasks", {});
        setIsDialogOpen(false);
    }

    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<UpdateIcon />}
                onClick={handleDialogOpen}
            >
            </Button>
            <Dialog open={isDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Reset current week tasks</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        This will reset the current week tasks and should be only done if you did some changes regarding the weekly occurences, score, name or the importance
                        of a task. Keep in mind that this will reset the current state of the week, i.e. resolved tasks by any user will be reset as well.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Reset current week tasks
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}