import { makeStyles } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Task from "../Classes/Task";
import Users from "../Classes/Users";
import User from "../Classes/User";
import socket from "../socket";

const useStyles = makeStyles({
    root: (props: Props) => ({
        display: "inline-block",
        margin: "10px",
        borderRadius: "10px",
        justifyContent: "center",
        fontFamily: "Calibri",
        background: props.task.getColor(),
        boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.4),0 -1px 5px 0 rgba(0, 0, 0, 0.4)",
    }),
    avatar: {
        float: "left",
        marginRight: "10px",
        height: "40px",
        width: "40px",
        fontSize: "1.2em",
    },
    taskPendingAvatar: {
        backgroundColor: "rgba(200,200,200,0)",
        borderStyle: "solid",
        borderColor: "rgba(50,50,50,0.3)",
        borderWidth: "1px",
    },
    userAvatar: (props: Props) => {
        if (props.task.userId == null) return {};
        return {
            backgroundColor: props.users.getUserById(props.task.getUserId()).getAvatarColor(),
        }
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
    task: Task;
    users: Users;
    selectedUser : User;
}

export default function TaskPresentation(props: Props) {

    const handleClick = () => {
        let isUserSelected = props.selectedUser != null;
        if(isUserSelected){
            socket.emit("updateTaskAccomplishment", {id:props.task.getId(), userId:props.selectedUser.getId()});
            return;
        }
        socket.emit("updateTaskAccomplishment", {id:props.task.getId(), userId:null});
    }

    const classes = useStyles(props);
    console.log(props.task.getUserId());
    let hasUserDoneTask = props.task.getUserId() != null;
    const avatarClass = hasUserDoneTask ? `${classes.avatar} ${classes.userAvatar}` : `${classes.avatar} ${classes.taskPendingAvatar}`;
    return (
        <div className={classes.root}>
            <ListItem>
                <div onClick={(e) => {handleClick();}}>
                    <ListItemAvatar>
                        <Avatar className={avatarClass}>{hasUserDoneTask ? props.users.getUserById(props.task.getUserId()).getNameCode() : " "}</Avatar>
                    </ListItemAvatar>
                </div>
                <ListItemText primary={props.task.getLabel()} secondary={"Score: " + props.task.getScore()} />
            </ListItem>
        </div>
    )
}