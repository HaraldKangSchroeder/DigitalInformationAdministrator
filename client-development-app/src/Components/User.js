import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    root : {
        padding:"10px",
        margin:"10px",
        background:"blue"
    }
})

export default function User(props){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {props.user.getName()}
        </div>
    )
}