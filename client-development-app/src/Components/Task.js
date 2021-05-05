import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    root : {
        display:"inline-block",
        padding:"10px",
        margin:"10px",
        background:"green"
    }
})

export default function Task(props){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {props.task.getLabel()}
        </div>
    )
}