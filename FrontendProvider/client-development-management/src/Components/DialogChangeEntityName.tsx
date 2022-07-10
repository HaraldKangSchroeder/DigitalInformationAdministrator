
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
    entityName : string,
    entityType : string,
    disabled : boolean,
    changeEntityName : Function,
}

export default function DialogChangeEntityName(props : Props) {
    const [open,setOpen] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");

    const handleClose = () => {
        setNewName("");
        setOpen(false); 
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleSubmit = () => {
        props.changeEntityName(newName);
        setNewName("");
        setOpen(false);
    }

    const handleChangeNameText = (e : any) => {
        setNewName(e.target.value);
    }

    let isNewNameSet = newName.length !== 0;
    const classes = useStyles();
    return (
        <React.Fragment>
            <Button
                disabled = {props.disabled}
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<EditIcon />}
                onClick={handleOpen}
                variant="contained"
                color="secondary"
            >
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">{`Change ${props.entityType} Name`}</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        {`Set a new name for the ${props.entityType} ${props.entityName}`}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newGroceryname"
                        label={"New Grocery name"}
                        type="name"
                        onChange={handleChangeNameText}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!isNewNameSet} onClick={handleSubmit} color="primary">
                        {`Change ${props.entityType} Name`}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}