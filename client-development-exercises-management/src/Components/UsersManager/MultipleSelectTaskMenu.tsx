import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Task from '../../Classes/Task';
import { Interface } from 'readline';
import Tasks from '../../Classes/Tasks';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        maxWidth: 250,
        height: 34,
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


interface Props {
    selectedTasks: Tasks;
    tasks: Tasks;
    changeSelectedTasks: Function;
}

export default function MultipleSelectTaskMenu(props: Props) {
    const classes = useStyles();

    const handleChange = (e: any) => {
        let ids = e.target.value;
        props.changeSelectedTasks(ids);
    };
    let label = props.selectedTasks.getList().length > 0 ? "Selected Tasks" : "All Tasks in year";
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
                renderValue={(ids: any) => props.tasks.getTaskLabels(ids).join(', ')}
                MenuProps={MenuProps}
            >
                {props.tasks.getList().map((task: Task) => (
                    <MenuItem key={task.getId()} value={task.getId()}>
                        <Checkbox checked={props.selectedTasks.containsTask(task.getId())} />
                        {task.getLabel()}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
