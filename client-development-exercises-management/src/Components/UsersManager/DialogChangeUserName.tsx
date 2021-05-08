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
import User from "../../Classes/User";

const useStyles = makeStyles({
    root: {
        marginTop: "10px"
    },
    informationText: {
        marginTop: "30px",
        marginBottom: "10px"
    },
    startIcon: {
        margin: 0
    }
})

interface Props {
    selectedUser : User;
    disabled : boolean;
}

export function DialogChangeUserName(props : Props) {
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
        socket.emit("changeUserName",{userId:props.selectedUser.getId(), newName:newName});
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
                variant="contained"
                onClick={handleChangeNameDialogOpen}
                disabled={props.disabled}
                color="secondary"
            >
            </Button>
            <Dialog open={isDialogOpen} onClose={handleChangeNameClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Change Username</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Set a new name for the User "{props.selectedUser != null ? props.selectedUser.getName() : ""}"
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newUsername"
                        label={"New Username"}
                        type="name"
                        onChange={handleChangeNameText}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleChangeNameClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={isNewNameSet} onClick={handleChangeNameSubmit} color="primary">
                        Change Username
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}