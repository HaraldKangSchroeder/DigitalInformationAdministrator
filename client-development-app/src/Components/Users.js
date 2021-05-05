import User from "./User";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core"

export default function Users(props){
    return (
        props.users.getUserList().map(user => 
            <Grid item xs={12}>
                <User user={user}/>
            </Grid>
        )
    )
}