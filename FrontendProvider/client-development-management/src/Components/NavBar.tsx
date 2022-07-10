import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        background: "rgb(100,100,100)",
    },
    text: {
        color: "rgb(230,230,230)"
    },
    indicator: {
        background: "rgb(230,230,230)"
    }
});

export default function NavBar() {
    const classes = useStyles();
    const [value, setValue] = React.useState<number>(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Paper className={classes.root} elevation={3}>
            <Tabs
                value={value}
                onChange={handleChange}
                classes={{ indicator: classes.indicator }}
                centered
            >
                {
                    process.env.REACT_APP_TASKS_MANAGER_URL ? <Tab className={classes.text} to='/' component={Link} label="Tasks" /> : ""
                }
                {
                    process.env.REACT_APP_TASKS_MANAGER_URL ? <Tab className={classes.text} to='/users' component={Link} label="Users" /> : ""
                }
                {
                    process.env.REACT_APP_GROCERY_CART_URL ? <Tab className={classes.text} to='/groceries' component={Link} label="Groceries" /> : ""
                }
            </Tabs>
        </Paper>
    );
}
