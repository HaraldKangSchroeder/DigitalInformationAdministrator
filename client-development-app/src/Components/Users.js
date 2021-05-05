import User from "./User";
import { makeStyles } from "@material-ui/core"

export default function Users(props){
    return (
        props.users.getUserList().map(user => 
            <User user={user}/>
        )
    )
}