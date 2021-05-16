import { useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../../socket";
import { SketchPicker } from 'react-color';



const useStyles = makeStyles({
    root: {
        marginTop: "10px",
    },
    dialog: {
        height: "30vh"
    },
    informationText: {
        marginTop: "40px",
        marginBottom: "20px"
    },
    startIcon: {
        margin: 0
    }
})


export default function DialogCreateGroceryType() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        type: "",
        color: "#ff0000",
    });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setState({
            type: "",
            color: "#ff0000",
        })
        setOpen(false);
    };

    const handleChangeType = (e: any) => {
        setState({
            ...state,
            type: e.target.value
        })
    }

    const handleChangeColor = (e: any) => {
        setState({
            ...state,
            color: e.target.value,
        })
    }

    const handleSubmit = () => {
        socket.emit("createGroceryTypeEntry", { type: state.type, color: state.color });
        setState({
            type: "",
            color: "#ff0000",
        })
        setOpen(false);
    }

    let isTypeSet = state.type !== "";
    let isColorSet = state.color !== "";

    return (
        <div>
            <Button
                classes={{ startIcon: classes.startIcon }}
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<AddIcon />}
                onClick={handleOpen}
            >
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add Grocery Type</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="groceryname"
                        label="Name of the Grocery Type"
                        type="name"
                        onChange={handleChangeType}
                    />

                    <DialogContentText className={classes.informationText}>
                        Choose a color which identifies the respective grocery type
                    </DialogContentText>
                    <SketchPicker
                        color={state.color}
                        onChange={(color : any) => {console.log(state.color); setState({...state, color:color.hex})}}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!isTypeSet || !isColorSet} onClick={handleSubmit} color="primary">
                        Add Grocery Type
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
