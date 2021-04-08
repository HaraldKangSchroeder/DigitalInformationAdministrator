import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


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
                    let isTaskSelected = task.id == props.selectedTaskId;
                    return (
                        <ListItem
                            button
                            onClick={() => { props.changeSelectedTaskId(task.id) }}
                            selected={isTaskSelected}
                        >

                            <ListItemText primary={task.label} />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
