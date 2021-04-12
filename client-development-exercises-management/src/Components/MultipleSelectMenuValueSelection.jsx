import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { ControlPointSharp, PinDropSharp } from '@material-ui/icons';
import {getTaskLabelsByIds} from "../utils";

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
    const classes = useStyles();

    const handleChange = (event) => {
        props.changeSelectedTaskIds(event.target.value)
    };
    return (
            <FormControl
                size="small"
                variant="outlined"
                className={classes.formControl}
            >
                <InputLabel>Tasks</InputLabel>
                <Select
                    multiple
                    value={props.selectedTaskIds}
                    label={"Tasks"}
                    onChange={handleChange}
                    renderValue={(selected) => getTaskLabelsByIds(props.tasks,selected).join(', ')}
                    MenuProps={MenuProps}
                >
                    {props.tasks.map((task) => (
                        <MenuItem key={task.id} value={task.id}>
                            <Checkbox checked={props.selectedTaskIds.includes(task.id)} />
                            {task.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    );
}
