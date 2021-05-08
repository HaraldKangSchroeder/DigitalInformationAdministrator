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
import { SelectMenu} from '../SelectMenu';
import { MENU_ITEMS_SCORES, MENU_ITEMS_IMPORTANCES, MENU_ITEMS_WEEKLY_RYTHMS, MENU_ITEMS_DAYS, MENU_ITEMS_WEEKLY_OCCURENCES} from '../../constants';
import socket from "../../socket";



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


export function DialogCreateTask() {
    const classes = useStyles();

    const [openAddTask, setOpenAddTask] = useState(false);
    const [state, setState] = useState({
        name: "",
        score: "",
        importance: "",
        weeklyRythm: "",
        dayOfWeek: "",
        weeklyOccurences: "1"
    });

    const handleOpenAddTask = () => {
        setOpenAddTask(true);
    };

    const handleCloseAddTask = () => {
        setState({
            name: "",
            score: "",
            importance: "",
            weeklyRythm: "",
            dayOfWeek: "",
            weeklyOccurences: "1"
        })
        setOpenAddTask(false);
    };

    const handleChangeScore = (e : any) => {
        setState({
            ...state,
            score: e.target.value
        });
    }

    const handleChangeImportance = (e : any) => {
        setState({
            ...state,
            importance: e.target.value
        })
    }

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

    const handleChangeText = (e : any) => {
        setState({
            ...state,
            name: e.target.value
        })
    }

    const handleChangeWeeklyOccurences = (e : any) => {
        setState({
            ...state,
            weeklyOccurences: e.target.value
        })
    }

    const handleSubmit = () => {
        socket.emit("createTaskEntry", state);
        setState({
            name: "",
            score: "",
            importance: "",
            weeklyRythm: "",
            dayOfWeek: "",
            weeklyOccurences: "1"
        })
        setOpenAddTask(false);
    }

    let isNameSet = state.name === "";
    let isImportanceSet = state.score === "";
    let isScoreSet = state.importance === "";
    let isWeeklyRythmSet = state.weeklyRythm === "";

    return (
        <div>
            <Button
                classes={{ startIcon: classes.startIcon }}
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<AddIcon />}
                onClick={handleOpenAddTask}
            >
            </Button>
            <Dialog open={openAddTask} onClose={handleCloseAddTask} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="taskname"
                        label="Name of the Task"
                        type="name"
                        onChange={handleChangeText}
                    />

                    <DialogContentText className={classes.informationText}>
                        Choose an importance value. A high value ensure that this Task rather occurs at the top in the presentation view
                    </DialogContentText>
                    <SelectMenu
                        value={state.score}
                        label={"Score"}
                        menuItems={MENU_ITEMS_SCORES}
                        handleChange={handleChangeScore}
                    />

                    <DialogContentText className={classes.informationText}>
                        Choose a Score value which is obtained after solving this Task
                    </DialogContentText>
                    <SelectMenu
                        value={state.importance}
                        label={"Importance"}
                        menuItems={MENU_ITEMS_IMPORTANCES}
                        handleChange={handleChangeImportance}
                    />

                    <DialogContentText className={classes.informationText}>
                        Optional : If you want the Task to occur more than once for each week, you can adjust the value here respectively
                    </DialogContentText>
                    <SelectMenu
                        value={state.weeklyOccurences}
                        label={"Weekly Occurences"}
                        menuItems={MENU_ITEMS_WEEKLY_OCCURENCES}
                        handleChange={handleChangeWeeklyOccurences}
                        noNone={true}
                    />

                    <DialogContentText className={classes.informationText}>
                        Optional : Select a rythm indicating on which weeks this Task should appear (starting from current week)
                    </DialogContentText>
                    <SelectMenu
                        value={state.weeklyRythm}
                        label={"Weekly Rythm"}
                        menuItems={MENU_ITEMS_WEEKLY_RYTHMS}
                        handleChange={handleChangeWeeklyRythm}
                    />

                    <DialogContentText className={classes.informationText}>
                        Optional : If the Task is dayOfWeek dependant, you can select the respective dayOfWeek which gets attached to the Task name in the presentation view
                    </DialogContentText>
                    <SelectMenu
                        value={state.dayOfWeek}
                        label={"Day"}
                        menuItems={MENU_ITEMS_DAYS}
                        handleChange={handleChangeDay}
                        disabled={isWeeklyRythmSet}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseAddTask} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={isNameSet || isScoreSet || isImportanceSet} onClick={handleSubmit} color="primary">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
