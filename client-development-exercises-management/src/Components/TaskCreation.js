import { useState } from "react";
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const scoresMenuItems = [
    {value : 1, label : 1},
    {value : 2, label : 2},
    {value : 3, label : 3},
    {value : 4, label : 4},
    {value : 5, label : 5},
    {value : 6, label : 6},
    {value : 7, label : 7},
    {value : 8, label : 8},
    {value : 9, label : 9},
    {value : 10, label : 10},
];

const importencesMenuItems = [
    {value : 1, label : 1},
    {value : 2, label : 2},
    {value : 3, label : 3},
]

const weeklyRythmsMenuItems = [
    {value : "weekly" , label : "weekly"},
    {value : "bi-weekly" , label : "bi-weekly"},
    {value : "three-week" , label : "three-week"}
]

const daysMenuItems = [
    {value : 0 , label : "Monday"},
    {value : 1 , label : "Tuesday"},
    {value : 2 , label : "Wednesday"},
    {value : 3 , label : "Thursday"},
    {value : 4 , label : "Friday"},
    {value : 5 , label : "Saturday"},
    {value : 6 , label : "Sunday"}
]


const useStyles = makeStyles({
    root: {
        margin: "10px"
    },
    formControl: {
        minWidth: 150,
    },
    informationText : {
        marginTop: "40px",
        marginBottom: "20px"
    }
})


function ValueMenuSelection(props) {
    const classes = useStyles();

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={props.value}
                onChange={props.handleChange}
                label={props.label}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {
                    props.menuItems.map(menuItem => {
                        return (
                            <MenuItem value={menuItem.value}>{menuItem.label}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
}

export function TaskCreation(props) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        name : "",
        score : "",
        importance : "",
        weeklyRythm : "",
        day : ""
    });

    const [age, setAge] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeName = (e) => {
        setState({
            ...state,
            name : e.target.value
        });
    }

    const handleChangeScore = (e) => {
        setState({
            ...state,
            score : e.target.value
        });
    }

    const handleChangeImportance = (e) => {
        setState({
            ...state,
            importance : e.target.value
        })
    }

    const handleChangeWeeklyRythm = (e) => {
        setState({
            ...state, 
            weeklyRythm : e.target.value
        })
    }

    const handleChangeDay = (e) => {
        setState({
            ...state,
            day : e.target.value
        })
    }

    const handleChangeText = (e) => {
        setState({
            ...state,
            name : e.target.value
        })
    }

    const handleSubmit = () => {
        console.log(state);
        let isNameSet = state.name != "";
        let isScoreSet = state.name != "";
        let isImportenceSet = state.name != "";
        
        if(!isNameSet){
            return;
        }
        if(!isScoreSet){
            return;
        }
        if(!isImportenceSet){
            return;
        }
    }

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<DeleteIcon />}
                onClick={handleClickOpen}
            >
                Add Task
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="taskname"
                        label="Name of the Task"
                        type="name"
                        onChange = {handleChangeText}
                    />
                    <DialogContentText className={classes.informationText}>
                        Choose an importance value. A high value ensure that this Task rather occurs at the top in the presentation view
                    </DialogContentText>
                    <ValueMenuSelection 
                        value={state.score}
                        label={"Score"}
                        menuItems={scoresMenuItems}
                        handleChange = {handleChangeScore}
                    />

                    <DialogContentText className={classes.informationText}>
                        Choose a Score value which is obtained after solving this Task
                    </DialogContentText>
                    <ValueMenuSelection 
                        value={state.importance}
                        label={"Importance"}
                        menuItems={importencesMenuItems}
                        handleChange = {handleChangeImportance}
                    />

                    <DialogContentText  className={classes.informationText}>
                        Optional : Select a rythm indicating on which weeks this Task should appear (starting from current week)
                    </DialogContentText>
                    
                    <ValueMenuSelection 
                        value={state.weeklyRythm}
                        label={"Weekly Rythm"}
                        menuItems={weeklyRythmsMenuItems}
                        handleChange = {handleChangeWeeklyRythm}
                    />

                    <DialogContentText  className={classes.informationText}>
                        Optional : If the Task is day dependant, you can select the respective day which gets attached to the Task name in the presentation view
                    </DialogContentText>
                    <ValueMenuSelection 
                        value={state.day}
                        label={"Day"}
                        menuItems={daysMenuItems}
                        handleChange = {handleChangeDay}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}