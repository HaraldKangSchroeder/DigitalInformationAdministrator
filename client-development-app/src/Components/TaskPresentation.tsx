import { makeStyles } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Task from "../Classes/Task";

const useStyles = makeStyles({
    root: {
        display: "inline-block",
        margin: "10px",
        borderRadius : "10px",
        justifyContent: "center",
        fontFamily: "Calibri"
    },
    avatar: {
        float: "left",
        marginRight: "10px",
        height: "40px",
        width: "40px",
        fontSize: "1.2em",
    },
    taskPendingAvatar: {
        backgroundColor: "rgba(200,200,200,0)",
        borderStyle : "solid",
        borderColor : "rgba(50,50,50,0.3)",
        borderWidth: "1px",
    },
    userAvatar: {
        backgroundColor: "green",
    },
    text: {
        height: "40px",
        float: "left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.2em",
        color: "rgb(50,50,50)"
    }
})

interface Props {
    task : Task;
}

export default function TaskPresentation(props : Props) {
    const classes = useStyles();
    const c = 120;
    return (
        <div className={classes.root} style={{background:`rgba(${c + Math.random() * (255-c)},${c + Math.random() * (255-c)},${c + Math.random() * (255-c)},1)`}}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar className={`${classes.avatar} ${classes.taskPendingAvatar}`}> </Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.task.getLabel()} secondary={"Score " + props.task.getScore()}/>
            </ListItem>
        </div>
    )
}