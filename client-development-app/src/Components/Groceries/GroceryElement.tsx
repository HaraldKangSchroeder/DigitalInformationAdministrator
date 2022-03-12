import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from "@material-ui/core";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import Grocery from "../../Classes/Grocery";

const useStyles = makeStyles({
    root: (props: Props) => ({
        display: "inline-block",
        paddingRight: "10px",
        margin: "10px",
        background: props.backgroundColor,
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
        backgroundImage: props.isInGroceryCart ? "url('./GroceryCart.png')" : "",
        backgroundSize: "cover",
        backgroundColor: props.isInGroceryCart ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
    })
})

interface Props {
    grocery: Grocery,
    isInGroceryCart: boolean,
    backgroundColor: string,
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

export default function GroceryElement(props: Props) {

    const handleSubmit = (e: any) => {
        if (props.isInGroceryCart) {
            props.socket?.emit("deleteGroceryCartEntry", { name: props.grocery.getName() });
            return;
        }
        props.socket?.emit("createGroceryCartEntry", { name: props.grocery.getName(), type: props.grocery.getType(), amount: "" });
    }

    const classes = useStyles(props);
    return (
        <div className={classes.root} onClick={handleSubmit}>
            <div>
                <ListItem>
                    <div>
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