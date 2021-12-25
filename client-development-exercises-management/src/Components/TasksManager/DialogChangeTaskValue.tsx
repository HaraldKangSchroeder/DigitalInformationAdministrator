import React, { useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../../socket";
import { SelectMenu } from "../SelectMenu";
import Task from "../../Classes/Task";


const useStyles = makeStyles({
    root: {
        marginLeft: '20px',
        maxWidth: '30px',
        maxHeight: '30px',
        minWidth: '30px',
        minHeight: '30px',
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

interface Props {
    k: string;
    selectedTask: Task;
    type: string;
    menuItems: any[];
}

export function DialogChangeTaskValue(props: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newValue, setNewValue] = useState("");

    const handleDialogClose = () => {
        setNewValue("");
        setIsDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    }

    const handleSubmit = () => {
        console.log(props.k);
        socket.emit("updateTask", { id: props.selectedTask.getId(), [props.k]: newValue });
        setNewValue("");
        setIsDialogOpen(false);
    }

    const handleChangeValue = (e: any) => {
        setNewValue(e.target.value);
    }

    let isNewValueSet = newValue.length === 0;

    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<EditIcon />}
                onClick={handleDialogOpen}
            >
            </Button>
            <Dialog open={isDialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Set a new {props.type} value for the Task "{props.selectedTask.getLabel()}"
                    </DialogContentText>
                    <SelectMenu
                        value={newValue}
                        label={props.type}
                        menuItems={props.menuItems}
                        onChange={handleChangeValue}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={isNewValueSet} onClick={handleSubmit} color="primary">
                        Change {props.type}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}