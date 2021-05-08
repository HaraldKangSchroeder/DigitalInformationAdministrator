import { makeStyles } from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ChangeEvent } from 'react';
import { ReactNode } from 'react';

const useStyles = makeStyles({
    formControl: (props : Props) => ({
        minWidth: props.minWidth || 200,
        padding:0,
        height:34,
        marginLeft: props.marginSide || 0,
        marginRight: props.marginSide || 0
    }),
})

interface Props {
    minWidth? : number;
    marginSide ?: number;
    disabled? : boolean;
    label : string;
    value : any;
    noNone? : boolean;
    menuItems : any[];
    handleChange : Function;
}

export function SelectMenu(props : Props) {
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
                onChange={(e : any) => {props.handleChange(e)}}
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