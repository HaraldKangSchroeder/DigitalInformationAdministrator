import Task from "./Task";
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    
})

export default function Tasks(props){
    return (
        props.tasks.getTaskList().map((task) => {
            return <Task task={task}/>
        })
    )
}
