
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
import GroceryType from "../../Classes/GroceryType";

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
    selectedGroceryType : GroceryType;
}

export function DialogChangeGroceryTypeName(props : Props) {
    const [open,setOpen] = useState<boolean>(false);
    const [newType, setNewType] = useState<string>("");

    const handleClose = () => {
        setNewType("");
        setOpen(false); 
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleSubmit = () => {
        socket.emit("updateGroceryTypeEntryWithType",{type:props.selectedGroceryType.getType(), newType: newType});
        setNewType("");
        setOpen(false);
    }

    const handleChangeNameText = (e : any) => {
        setNewType(e.target.value);
    }

    let isGrocerySelected = props.selectedGroceryType != null;
    let isNewNameSet = newType.length !== 0;

    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                disabled = {!isGrocerySelected}
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<EditIcon />}
                onClick={handleOpen}
                variant="contained"
                color="secondary"
            >
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Change Grocery Name</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Set a new name for the Grocery Type "{props.selectedGroceryType != null ? props.selectedGroceryType.getType() : ""}"
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newGroceryTypename"
                        label={"New Grocery Type name"}
                        type="name"
                        onChange={handleChangeNameText}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!isNewNameSet} onClick={handleSubmit} color="primary">
                        Change Grocery Type Name
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}