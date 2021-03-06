import UserElement from "./UserElement";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core"
import User from "../../Classes/User";
import Users from "../../Classes/Users";

interface Props {
    users: Users;
    changeSelectedUser: Function;
    selectedUser: User;
}

const useStyles = makeStyles({
    root: {
        background: "rgb(70,70,70)",
        height: "100vh",
        width: "100%",
        overflowY: "auto",
    }
})

export default function UsersCollection(props: Props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                props.users.getList().map((user: User) =>
                    <Grid item xs={12}>
                        <UserElement
                            selectedUser={props.selectedUser}
                            changeSelectedUser={props.changeSelectedUser}
                            user={user}
                        />
                    </Grid>
                )
            }
        </div>
    )
}