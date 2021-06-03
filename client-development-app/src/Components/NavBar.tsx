import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Link } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
    root: {
        width: "100%",
        background: "rgb(30,30,30)",
        // background: "red",
        boxShadow: "1px 0 5px -2px #000",
        height: "100vh",
        display: "flex",
        justifyContent: "center"
    },
    image: {
        width: "70px",
        height: "70px",
        backgroundSize: "contain",
        backgroundRepeat : "no-repeat",
        // background: "green",
        marginTop: "5vh",
    }
})

export default function NavBar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div style={{ width: "70px", height: "100vh", paddingTop: "10px" }}>
                <Link to='/' >
                <div style={{ backgroundImage: `url("tasks.png")` }} className={classes.image}/>                
                </Link>
                <Link to='/Groceries' >
                <div style={{ backgroundImage: `url("groceryCartNavbar.png")` }} className={classes.image}/>
                </Link>
                <Link to='/Weather' >
                <div style={{ backgroundImage: `url("weather.png")` }} className={classes.image}/>
                </Link>
            </div>
        </div>
    );
}