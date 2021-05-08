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
    avatar: {
        float: "left",
        marginRight: "20px",
        height: "40px",
        widht: "40px",
        fontSize: "1.2em",
    },
    userAvatar: {
        backgroundColor: "green",
    },
})

interface Props {
    user : User;
}

export default function UserPresentation(props : Props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>

            <div>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={`${classes.avatar} ${classes.userAvatar}`}>Ha</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={props.user.getName()} secondary={<div><div>Wp 100</div><div>Op 10000000</div></div>} />
                </ListItem>
            </div>
        </div>
    )
}