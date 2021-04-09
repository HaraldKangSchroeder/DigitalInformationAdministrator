import { makeStyles } from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
    formControl: {
        minWidth: 200,
    }
})


export function ValueMenuSelection(props) {
    const classes = useStyles();

    return (
        <FormControl
            variant="outlined"
            className={classes.formControl}
            disabled={props.disabled}
        >
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={props.value}
                onChange={props.handleChange}
                label={props.label}
            >
                {props.noNone ? "" : 
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                }
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