import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from "@material-ui/core";
import Grocery from "../Classes/Grocery";
import socket from "../socket";

const useStyles = makeStyles({
    root: (props: Props) => ({
        display: "inline-block",
        paddingRight: "10px",
        margin: "10px",
        background: props.backgroundColor,
        borderRadius: "10px",
        justifyContent: "center",
        fontFamily: "Calibri"
    }),
    avatar: (props: Props) => ({
        float: "left",
        marginRight: "20px",
        height: "40px",
        width: "40px",
        fontSize: "1.2em",
        backgroundImage: props.isInGroceryCart ? "url('./GroceryCart.png')" : "",
        backgroundSize: "cover",
        backgroundColor: props.isInGroceryCart ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
    })
})

interface Props {
    grocery: Grocery,
    isInGroceryCart: boolean,
    backgroundColor: string,
}

export default function GroceryPresentation(props: Props) {

    const handleSubmit = (e : any) => {
        if(props.isInGroceryCart){
            socket.emit("deleteGroceryCartEntry", {name : props.grocery.getName()});
            return;
        }
        socket.emit("createGroceryCartEntry", {name : props.grocery.getName(), type : props.grocery.getType()});
    }

    const classes = useStyles(props);
    return (
        <div className={classes.root}>
            <div>
                <ListItem>
                    <div onClick={handleSubmit}>
                        <ListItemAvatar>
                            <Avatar variant="rounded" className={classes.avatar}> </Avatar>
                        </ListItemAvatar>
                    </div>
                    <ListItemText primary={props.grocery.getName()} />
                </ListItem>
            </div>
        </div>
    )
}