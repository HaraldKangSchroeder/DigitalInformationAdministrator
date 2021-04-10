import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from 'react';


const useStyles = makeStyles({
    root: {
        marginTop: "10px"
    },
    startIcon: {
        margin: 0
    }
})

export function DialogEntityDeletion(props) {
    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleDeleteEntity = () => {
        setOpenDialog(false);
        props.deleteEntity();
    }


    const classes = useStyles();
    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                classes={{ startIcon: classes.startIcon }}
                className={classes.root}
                startIcon={<DeleteIcon />}
                disabled={props.disabled}
                onClick={handleOpenDialog}
            >
            </Button>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {
                            !props.disabled ?
                                `Are you sure that you want to delete the ${props.entityType} "${props.entityLabel}" ?` :
                                `You must select a ${props.entityType} in order to make a deletion`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteEntity} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}