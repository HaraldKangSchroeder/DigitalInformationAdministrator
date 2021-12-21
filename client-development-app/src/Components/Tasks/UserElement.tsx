import { makeStyles } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import User from "../../Classes/User";

const useStyles = makeStyles({
    root: (props: Props) => ({
        display: "inline-block",
        paddingRight: "10px",
        margin: "10px",
        background: props.isUserSelected ? "rgba(255,255,255,1)" : "rgb(185,185,185)",
        borderRadius: "10px",
        justifyContent: "center",
        fontFamily: "Calibri",
        cursor: "pointer",
    }),
    avatar: (props: Props) => ({
        float: "left",
        marginRight: "20px",
        height: "40px",
        width: "40px",
        fontSize: "1.2em",
        backgroundColor: props.user.getAvatarColor(),
    })
})

interface Props {
    user: User;
    changeSelectedUser: Function;
    isUserSelected: boolean;
}

export default function UserElement(props: Props) {
    const classes = useStyles(props);
    return (
        <div className={classes.root} onClick={(e) => { props.changeSelectedUser(props.user) }}>
            <div>
                <ListItem>
                    <div>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>{props.user.getNameCode()}</Avatar>
                        </ListItemAvatar>
                    </div>
                    <ListItemText
                        primary={props.user.getName()}
                        secondary={
                            <div>
                                <div>Wp {props.user.getScoreOfWeek()}</div>
                                <div>Oyp {props.user.getScoreOfYear()}</div>
                            </div>
                        }
                    />
                </ListItem>
            </div>
        </div>
    )
}