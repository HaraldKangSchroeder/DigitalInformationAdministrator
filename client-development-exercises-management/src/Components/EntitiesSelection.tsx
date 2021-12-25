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

interface Props {
    entities: any;
    entityType: string;
    selectedEntities: any;
    changeSelectedEntities: Function;
}

export function EntitiesSelection(props: Props) {
    const classes = useStyles();

    return (
        <Paper className={classes.root} elevation={1}>
            <List subheader={<ListSubheader disableSticky={true}>{props.entityType}</ListSubheader>}>
                {props.entities.getList().map((entity: any) => {
                    let isEntitySelected = props.selectedEntities.contains(entity);
                    return (
                        <ListItem
                            button
                            // key={`${entity.getLabel() || entity.getName()}${entity.getId() || entity.getName()}`}
                            onClick={() => { props.changeSelectedEntities(entity) }}
                            selected={isEntitySelected}
                        >

                            <ListItemText
                                primary={
                                    typeof entity.getLabel != 'undefined' ? entity.getLabel() : entity.getName()
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
}
