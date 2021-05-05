import { makeStyles } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
    root: {
        display: "inline-block",
        paddingRight: "10px",
        margin: "10px",
        background: "rgb(125,125,125)",
        borderRadius: "100px",
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
    text: {
        float: "left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.2em",
        color: "rgb(50,50,50)"
    }
})

export default function User(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>

            <div className={classes.text}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={`${classes.avatar} ${classes.userAvatar}`}>Ha</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={props.user.getName()} secondary="Wp 100, Op 10000000" />
                </ListItem>
            </div>
        </div>
    )
}