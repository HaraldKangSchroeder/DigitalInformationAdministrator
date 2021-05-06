import { makeStyles } from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
    formControl: (props : any) => ({
        minWidth: props.minWidth || 200,
        padding:0,
        height:34,
        marginLeft: props.marginSide || 0,
        marginRight: props.marginSide || 0
    }),
})


export function SelectMenu(props : any) {
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
                {props.noNone ? <div></div> : 
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                }
                {
                    props.menuItems.map((menuItem : any) => {
                        return (
                            <MenuItem value={menuItem.value || menuItem}>{menuItem.label || menuItem}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
}