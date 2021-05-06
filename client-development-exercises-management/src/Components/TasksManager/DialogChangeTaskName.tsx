import React ,{ useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../../socket";

const useStyles = makeStyles({
    root: {
        marginLeft:'20px',
        maxWidth: '30px', 
        maxHeight: '30px', 
        minWidth: '30px', 
        minHeight: '30px',
        color:"grey",
    },
    informationText: {
        marginBottom: "20px"
    },
    startIcon: {
        margin: 0
    }
})

export function DialogChangeTaskName(props : any) {
    const [isDialogOpen,setIsDialogOpen] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");

    const handleChangeNameClose = () => {
        setNewName("");
        setIsDialogOpen(false); 
    }

    const handleChangeNameDialogOpen = () => {
        setIsDialogOpen(true);
    }

    const handleChangeNameSubmit = () => {
        socket.emit("changeTaskName",{taskId:props.selectedTask.getId(), newName:newName});
        setNewName("");
        setIsDialogOpen(false);
    }

    const handleChangeNameText = (e : any) => {
        setNewName(e.target.value);
    }

    let isNewNameSet = newName.length === 0;

    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<EditIcon />}
                onClick={handleChangeNameDialogOpen}
            >
            </Button>
            <Dialog open={isDialogOpen} onClose={handleChangeNameClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Set a new name for the Task "{props.selectedTask.getLabel()}"
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
                    <Button disabled={isNewNameSet} onClick={handleChangeNameSubmit} color="primary">
                        Change Taskname
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}