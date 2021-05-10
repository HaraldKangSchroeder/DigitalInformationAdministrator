import { makeStyles } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import User from "../Classes/User";

const useStyles = makeStyles({
    root: {
        display: "inline-block",
        paddingRight: "10px",
        margin: "10px",
        background: "rgb(220,220,220)",
        borderRadius : "10px",
        justifyContent: "center",
        fontFamily: "Calibri"
    },
    avatar: (props : Props) => ({
        float: "left",
        marginRight: "20px",
        height: "40px",
        widht: "40px",
        fontSize: "1.2em",
        borderStyle : "solid",
        borderColor : props.isUserSelected ? "rgba(250,250,250,1)" : "rgba(250,250,250,0)",
        backgroundColor : props.user.getAvatarColor(),
    })
})

interface Props {
    user : User;
    changeSelectedUser : Function;
    isUserSelected : boolean;
}

export default function UserPresentation(props : Props) {
    console.log(props.isUserSelected);
    const classes = useStyles(props);
    return (
        <div className={classes.root}>

            <div>
                <ListItem>
                    <div onClick={(e) => {props.changeSelectedUser(props.user)}}>
                    <ListItemAvatar>
                        <Avatar className={classes.avatar}>{props.user.getNameCode()}</Avatar>
                    </ListItemAvatar>
                    </div>
                    <ListItemText primary={props.user.getName()} secondary={<div><div>Wp: {props.user.getScoreOfWeek()}</div><div>Oyp: {props.user.getScoreOfYear()}</div></div>} />
                </ListItem>
            </div>
        </div>
    )
}