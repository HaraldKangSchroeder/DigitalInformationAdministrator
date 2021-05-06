import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Task from '../../Classes/Task';

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


export default function MultipleSelectTaskMenu(props : any) {
    const classes = useStyles();

    const handleChange = (e : any) => {
        let ids = e.target.value;
        props.changeSelectedTasksByIds(ids);
    };
    let label = props.selectedTasks.getTaskList().length > 0 ? "Selected Tasks" : "All Tasks in year";
    return (
            <FormControl
                size="small"
                variant="outlined"
                className={classes.formControl}
            >
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={props.selectedTasks.getTaskIds()}
                    label={label}
                    onChange={handleChange}
                    renderValue={(ids) => props.tasks.getTaskLabelsByIds(ids).join(', ')}
                    MenuProps={MenuProps}
                >
                    {props.tasks.getTaskList().map((task : Task) => (
                        <MenuItem key={task.getId()} value={task.getId()}>
                            <Checkbox checked={props.selectedTasks.containsTaskById(task.getId())} />
                            {task.getLabel()}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    );
}
