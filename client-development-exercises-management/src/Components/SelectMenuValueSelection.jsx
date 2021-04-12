import { makeStyles } from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ControlPointSharp } from '@material-ui/icons';

const useStyles = makeStyles({
    formControl: props => ({
        minWidth: props.minWidth || 200,
        padding:0,
        height:34,
        marginLeft: props.marginSide || 0,
        marginRight: props.marginSide || 0
    }),
})


export function SelectMenuValueSelection(props) {
    const classes = useStyles(props);

    return (
        <FormControl
            variant="outlined"
            className={classes.formControl}
            disabled={props.disabled}
            size="small"
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