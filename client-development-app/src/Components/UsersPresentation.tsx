import UserPresentation from "./UserPresentation";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core"
import User from "../Classes/User";
import Users from "../Classes/Users";
import React from "react";

interface Props {
    users: Users;
}

const useStyles = makeStyles({
    root : {
        background:"rgb(70,70,70)",
        height:"99.9vh",
        width:"100%",
        overflowY: "auto",
    }
})

export default function UsersPresentation(props: Props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                props.users.getUserList().map((user: User) =>
                    <Grid item xs={12}>
                        <UserPresentation user={user} />
                    </Grid>
                )
            }
        </div>
    )
}