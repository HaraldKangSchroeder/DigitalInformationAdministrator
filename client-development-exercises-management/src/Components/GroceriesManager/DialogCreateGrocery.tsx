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
import { SelectMenu } from '../SelectMenu';
import socket from "../../socket";
import GroceryTypes from "../../Classes/GroceryTypes";

const useStyles = makeStyles({
    root: {
        marginTop: "10px"
    },
    informationText: {
        marginTop: "40px",
        marginBottom: "20px"
    },
    startIcon: {
        margin: 0
    }
})

interface Props {
    groceryTypes: GroceryTypes
}

export default function DialogCreateGrocery(props: Props) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        name: "",
        type: null,
    });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setState({
            name: "",
            type: null,
        })
        setOpen(false);
    };

    const handleChangeName = (e: any) => {
        setState({
            ...state,
            name: e.target.value
        })
    }

    const handleChangeType = (e: any) => {
        setState({
            ...state,
            type: e.target.value,
        })
    }

    const handleSubmit = () => {
        socket.emit("createGrocery", { name: state.name, type: state.type });
        setState({
            name: "",
            type: null,
        })
        setOpen(false);
    }

    let isNameSet = state.name !== "";

    console.log(state.type === null);

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
                <DialogTitle id="form-dialog-title">Add Grocery</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="groceryname"
                        label="Name of the Grocery"
                        type="name"
                        onChange={handleChangeName}
                    />

                    <DialogContentText className={classes.informationText}>
                        Choose one of the existing types
                    </DialogContentText>
                    <SelectMenu
                        value={state.type}
                        label={"Grocery Type"}
                        menuItems={props.groceryTypes.getGroceryTypesAsList()}
                        onChange={handleChangeType}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!isNameSet} onClick={handleSubmit} color="primary">
                        Add Grocery
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
