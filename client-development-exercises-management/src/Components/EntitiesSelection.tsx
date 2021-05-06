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
        height: "85vh",
        overflowY: "auto"
    },
}));

export function EntitiesSelection(props : any) {
    const classes = useStyles();

    return (
        <Paper className={classes.root} elevation={1}>
            <List subheader={<ListSubheader disableSticky={true}>{props.entityType}</ListSubheader>}>
                {props.entities.map((entity : any) => {
                    let isEntitySelected = props.selectedEntitiesIds.includes(entity.id);
                    return (
                        <ListItem
                            button
                            key={`${entity.label}${entity.id}`}
                            onClick={() => { props.changeSelectedEntitiesIds(entity.id) }}
                            selected={isEntitySelected}
                        >

                            <ListItemText primary={entity.label || entity.name} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}
