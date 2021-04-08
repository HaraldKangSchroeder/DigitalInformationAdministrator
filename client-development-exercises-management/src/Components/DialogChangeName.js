import React ,{ useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../socket";

const useStyles = makeStyles({
    root: {
        maxHeight:"50px",
        maxWidth:"50px"
    },
    formControl: {
        
    },
    informationText: {
        marginBottom: "20px"
    },
    startIcon: {
        margin: 0
    }
})

export function DialogChangeName(props) {
    const [isDialogOpen,setIsDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");

    const handleChangeNameClose = () => {
        setNewName("");
        setIsDialogOpen(false); 
    }

    const handleChangeNameDialogOpen = () => {
        setIsDialogOpen(true);
    }

    const handleChangeNameSubmit = () => {
        socket.emit("changeTaskName",{taskId:props.selectedTaskId, newName:newName});
        setNewName("");
        setIsDialogOpen(false);
    }

    const handleChangeNameText = (e) => {
        setNewName(e.target.value);
    }

    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                classes={{ startIcon: classes.startIcon }}
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<AddIcon />}
                onClick={handleChangeNameDialogOpen}
                style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
            >
            </Button>
            <Dialog open={isDialogOpen} onClose={handleChangeNameClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Set a new name for the Task "{props.selectedTaskLabel}"
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newTaskname"
                        label={"New task name"}
                        type="name"
                        onChange={handleChangeNameText}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleChangeNameClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={newName.length == 0} onClick={handleChangeNameSubmit} color="primary">
                        Change Taskname
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}