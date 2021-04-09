import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        color: "rgb(80,80,80)",
        height:"100%"
    },
}));

export function TaskSelection(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.root} elevation={1}>
            <List subheader={<ListSubheader>Tasks</ListSubheader>} component="nav" aria-label="main mailbox folders">
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
        </Paper>
    );
}
