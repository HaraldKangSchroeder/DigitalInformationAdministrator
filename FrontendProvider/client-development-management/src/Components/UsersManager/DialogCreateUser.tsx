import React, { useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { socketTasks as socket } from "../../socket";

const useStyles = makeStyles({
    root: {
        marginTop: "10px"
    },
    informationText: {
        marginTop: "20px",
        marginBottom: "20px"
    },
    startIcon: {
        margin: 0
    }
})

export function DialogCreateUser() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [name, setName] = useState("");

    const handleDialogClose = () => {
        setName("");
        setDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

    const handleCreateUserSubmit = () => {
        socket.emit("createUser", { name: name });
        setName("");
        setDialogOpen(false);
    }

    const handleChangeNameText = (e: any) => {
        setName(e.target.value);
    }

    let isNameSet = name.length !== 0;

    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                classes={{ startIcon: classes.startIcon }}
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<AddIcon />}
                onClick={handleDialogOpen}
            >
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Create User</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Enter a name for the new User
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newUsername"
                        label="Username"
                        type="name"
                        onChange={handleChangeNameText}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!isNameSet} onClick={handleCreateUserSubmit} color="primary">
                        Create User
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}