import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
    root : {
        margin:"10px"
    }
})

export function TaskDeletion(props){
    const classes = useStyles();
    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                className={classes.root}
                startIcon={<DeleteIcon />}
            >
                Delete Task
            </Button>
        </div>
    )
}