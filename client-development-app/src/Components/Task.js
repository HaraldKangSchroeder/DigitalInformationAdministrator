import { makeStyles } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
    root : {
        display:"inline-block",
        padding:"5px",
        paddingRight:"10px",
        margin:"10px",
        background:"rgb(125,125,125)",
        borderRadius: "100px",
        justifyContent:"center",
        fontFamily : "Calibri"
    },
    avatar : {
        float:"left",
        marginRight: "10px",
        height:"40px",
        widht:"40px",
        fontSize:"1.3em",
    },
    taskPendingAvatar : {
        backgroundColor : "rgb(200,200,200)",
    },
    userAvatar : {
        backgroundColor : "green",
    },
    text : {
        height:"40px",
        float: "left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize:"1.3em",
        color:"rgb(50,50,50)"
    }
})

export default function Task(props){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Avatar className={`${classes.avatar} ${classes.taskPendingAvatar}`}> </Avatar>
            <div className={classes.text}>{props.task.getLabel()}</div>
        </div>
    )
}