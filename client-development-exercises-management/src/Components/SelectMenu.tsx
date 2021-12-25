import { makeStyles } from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ChangeEvent } from 'react';
import { ReactNode } from 'react';

const useStyles = makeStyles({
    formControl: (props: Props) => ({
        minWidth: props.minWidth || 200,
        padding: 0,
        height: 34,
        marginLeft: props.marginSide || 0,
        marginRight: props.marginSide || 0
    }),
})

interface Props {
    minWidth?: number;
    marginSide?: number;
    disabled?: boolean;
    label: string;
    value: any;
    menuItems: any[];
    onChange: Function;
}

export function SelectMenu(props: Props) {
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
                onChange={(e: any) => { props.onChange(e) }}
                label={props.label}
            >
                {
                    props.menuItems.map((menuItem: any) => {
                        let value = menuItem.value != null ? menuItem.value : menuItem;
                        let label = menuItem.label != null ? menuItem.label : menuItem;
                        return (
                            <MenuItem value={value}>{label}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
}