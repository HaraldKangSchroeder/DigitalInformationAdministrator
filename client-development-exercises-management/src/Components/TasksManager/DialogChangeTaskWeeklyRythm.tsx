import { useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SelectMenu } from '../SelectMenu';
import { MENU_ITEMS_WEEKLY_RYTHMS, MENU_ITEMS_DAYS} from '../../constants';
import socket from "../../socket";
import Task from "../../Classes/Task";



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
    disabled : boolean;
    selectedTask : Task;
}

export function DialogChangeTaskWeeklyRythm(props : Props) {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [state, setState] = useState({
        weeklyRythm: "",
        dayOfWeek: ""
    });

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setState({
            weeklyRythm: "",
            dayOfWeek: "",
        })
        setOpenDialog(false);
    };

    const handleChangeWeeklyRythm = (e : any) => {
        setState({
            ...state,
            weeklyRythm: e.target.value
        })
    }

    const handleChangeDay = (e : any) => {
        setState({
            ...state,
            dayOfWeek: e.target.value
        })
    }

    const handleSubmit = () => {
        socket.emit("updateTaskWeeklyRythm", {taskId: props.selectedTask.getId() , ...state});
        setState({
            weeklyRythm: "",
            dayOfWeek: "",
        })
        setOpenDialog(false);
    }

    return (
        <div>
            <Button
                classes={{ startIcon: classes.startIcon }}
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<EditIcon />}
                onClick={handleOpenDialog}
                disabled={props.disabled}
            >
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Change Weekly Rythm of Task "{props.selectedTask != null ? props.selectedTask.getLabel() : ""}"</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Be careful, changes here will reset the current settings when the task appears. If you dont set anything and press change, all weeks will get removed.
                    </DialogContentText>
                    <DialogContentText className={classes.informationText}>
                        Select a rythm indicating on which weeks this Task should appear (starting from current week)
                    </DialogContentText>
                    <SelectMenu
                        value={state.weeklyRythm}
                        label={"Weekly Rythm"}
                        menuItems={MENU_ITEMS_WEEKLY_RYTHMS}
                        handleChange={handleChangeWeeklyRythm}
                    />

                    <DialogContentText className={classes.informationText}>
                        If the Task is dayOfWeek dependant, you can select the respective dayOfWeek which gets attached to the Task name in the presentation view
                    </DialogContentText>
                    <SelectMenu
                        value={state.dayOfWeek}
                        label={"Day"}
                        menuItems={MENU_ITEMS_DAYS}
                        handleChange={handleChangeDay}
                        disabled={state.weeklyRythm === ""}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}