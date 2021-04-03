import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export function TaskSelection(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <List component="nav" aria-label="main mailbox folders">
                {props.tasks.map(task => {
                    let isTaskSelected = props.selectedTask != null && task.id === props.selectedTask.id;
                    return (
                        <ListItem
                            button
                            onClick={() => { props.changeSelectedTask(task) }}
                            selected={isTaskSelected}
                        >
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={task.label} />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}


// export function TaskSelection(props) {
//     console.log(props);
//     return (
//         <div>
//             {
//                 props.tasks.map(task => {
//                     return (
//                         <TaskListElement
//                             value={task.label}
//                         />
//                     )
//                 })
//             }
//         </div>
//     );
// }



// const useStyles = makeStyles({
//     root: {
//         padding: "10px",
//         background: "red",
//         margin: "5px"
//     }
// })

// function TaskListElement(props) {
//     const classes = useStyles();
//     return (
//         <div className={classes.root}>
//             {props.value}
//         </div>
//     )
// }