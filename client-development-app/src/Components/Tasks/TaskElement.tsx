import { makeStyles } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Users from "../../Classes/Users";
import User from "../../Classes/User";
import TaskAccomplishment from "../../Classes/TaskAccomplishment";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

const useStyles = makeStyles({
    root: (props: Props) => ({
        display: "inline-block",
        margin: "10px",
        borderRadius: "10px",
        justifyContent: "center",
        fontFamily: "Calibri",
        background: props.taskAccomplishment.getColor(),
        boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.4),0 -1px 5px 0 rgba(0, 0, 0, 0.4)",
        cursor: "pointer",
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
        if (props.taskAccomplishment.getUserId() == null) return {};
        return {
            backgroundColor: props.users.getUser(props.taskAccomplishment.getUserId()).getAvatarColor(),
            borderStyle: "solid",
            borderColor: "rgba(0,0,0,0)",
            borderWidth: "1px",
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
    taskAccomplishment: TaskAccomplishment;
    users: Users;
    selectedUser: User;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export default function TaskElement(props: Props) {

    const handleClick = () => {
        let isUserSelected = props.selectedUser != null;

        if (isUserSelected) {
            let isTaskAlreadyAssignedToUser = props.taskAccomplishment.getUserId() != null;
            if (isTaskAlreadyAssignedToUser) {
                if (props.taskAccomplishment.getUserId() === props.selectedUser.getId()) {
                    return props.socket.emit("updateTaskAccomplishment",
                        {
                            taskAccomplishmentId: props.taskAccomplishment.getId(),
                            newUserId: null,
                            oldUserId: props.taskAccomplishment.getUserId()
                        });
                }
                return props.socket.emit("updateTaskAccomplishment",
                    {
                        taskAccomplishmentId: props.taskAccomplishment.getId(),
                        newUserId: props.selectedUser.getId(),
                        oldUserId: props.taskAccomplishment.getUserId()
                    });
            }
            return props.socket.emit("updateTaskAccomplishment",
                {
                    taskAccomplishmentId: props.taskAccomplishment.getId(),
                    newUserId: props.selectedUser.getId(),
                    oldUserId: null
                });

        }
        props.socket.emit("updateTaskAccomplishment",
            {
                taskAccomplishmentId: props.taskAccomplishment.getId(),
                newUserId: null,
                oldUserId: props.taskAccomplishment.getUserId()
            });
    }

    const classes = useStyles(props);
    let text = `${props.taskAccomplishment.getLabel()} ${props.taskAccomplishment.getDayOfWeekText()}`;
    let hasUserDoneTask = props.taskAccomplishment.getUserId() != null;
    const avatarClass = hasUserDoneTask ? `${classes.avatar} ${classes.userAvatar}` : `${classes.avatar} ${classes.taskPendingAvatar}`;
    return (
        <div className={classes.root} onClick={(e) => { handleClick(); }}>
            <ListItem>
                <div>
                    <ListItemAvatar>
                        <Avatar className={avatarClass}>{hasUserDoneTask ? props.users.getUser(props.taskAccomplishment.getUserId()).getNameCode() : " "}</Avatar>
                    </ListItemAvatar>
                </div>
                <ListItemText primary={text} secondary={"Score: " + props.taskAccomplishment.getScore()} />
            </ListItem>
        </div>
    )
}