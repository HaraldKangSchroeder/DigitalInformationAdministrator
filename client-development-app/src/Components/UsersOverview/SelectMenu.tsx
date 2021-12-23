import { makeStyles } from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
            <InputLabel style={{ color: "rgb(200,200,200)" }}>{props.label}</InputLabel>
            <Select
                style={{ color: "rgb(200,200,200)" }}
                value={props.value}
                onChange={(e: any) => { props.onChange(e) }}
                label={props.label}
            >
                {
                    props.menuItems.map((menuItem: any) => {
                        let value = menuItem.value != null ? menuItem.value : menuItem;
                        let label = menuItem.label != null ? menuItem.label : menuItem;
                        return (
                            <MenuItem style={{ padding: 13 }} value={value}>{label}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
}