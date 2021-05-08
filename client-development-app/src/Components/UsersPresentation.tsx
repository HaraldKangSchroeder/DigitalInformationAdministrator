import UserPresentation from "./UserPresentation";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core"
import User from "../Classes/User";
import Users from "../Classes/Users";
import React from "react";

interface Props {
    users: Users;
}

export default function UsersPresentation(props: Props) {
    return (
        <React.Fragment>
            {
                props.users.getUserList().map((user: User) =>
                    <Grid item xs={12}>
                        <UserPresentation user={user} />
                    </Grid>
                )
            }
        </React.Fragment>
    )
}