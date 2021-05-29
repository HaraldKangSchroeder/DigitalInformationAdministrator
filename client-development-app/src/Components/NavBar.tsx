import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Link } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
    root: {
        background: "rgb(30,30,30)",
        boxShadow: "1px 0 5px -2px #000",
        height: "100vh",
    },
    image: {
        width: "70px",
        height: "70px",
        backgroundSize: "cover",
        // background: "red",
        marginTop: "5vh",
    }
})

export default function NavBar() {
    const classes = useStyles();
    return (
        <Tabs orientation={"vertical"} centered className={classes.root}>
            <Tab to='/' component={Link} label={<div style={{ backgroundImage: `url("tasks.png")` }} className={classes.image} />} />
            <Tab to='/Groceries' component={Link} label={<div style={{ backgroundImage: `url("GroceryCartNavBar.png")` }} className={classes.image} />} />
            <Tab to='/Weather' component={Link} label={<div style={{ backgroundImage: `url("GroceryCartNavBar.png")` }} className={classes.image} />} />
        </Tabs>
    );
}