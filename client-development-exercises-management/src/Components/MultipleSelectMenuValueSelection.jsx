import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { ControlPointSharp, PinDropSharp } from '@material-ui/icons';
import {getTaskLabelById, getTaskLabelsByIds} from "../utils";
import socket from "../socket";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        maxWidth: 250,
        height:34,
    }
}));

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 410,
            width: 350,
        },
    },
};


export default function MutlipleSelectMenuValueSelection(props) {
    const [tasks,setTasks] = useState([])
    
    useEffect(() => {
        socket.on("AllTasks", ({tasks}) => {
            console.log(tasks);
            setTasks(tasks);
        });
        socket.emit("GetAllTasks");
    },[])

    const classes = useStyles();

    const handleChange = (event) => {
        props.changeSelectedTaskIds(event.target.value)
    };
    console.log(props);
    let label = props.selectedTaskIds.length > 0 ? "Selected Tasks" : "All Tasks in year";
    return (
            <FormControl
                size="small"
                variant="outlined"
                className={classes.formControl}
            >
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={props.selectedTaskIds}
                    label={label}
                    onChange={handleChange}
                    renderValue={(selected) => getTaskLabelsByIds(tasks,selected).join(', ')}
                    // renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {props.taskIds.map((taskId) => (
                        <MenuItem key={taskId} value={taskId}>
                            <Checkbox checked={props.selectedTaskIds.includes(taskId)} />
                            {getTaskLabelById(tasks,taskId)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    );
}
