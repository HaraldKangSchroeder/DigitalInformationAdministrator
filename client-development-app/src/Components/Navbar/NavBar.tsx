import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Link } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Clock from "./Clock";

const useStyles = makeStyles({
    root: {
        width: "100%",
        background: "rgb(30,30,30)",
        boxShadow: "1px 0 5px -2px #000",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        position:"relative"
    },
    image: {
        width: "70px",
        height: "70px",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        marginTop: "5vh",
    },
    clockContainer: {
        fontSize:"1.6em", 
        paddingBottom:"20px",
        width:"70px",
        color:"rgb(200,200,200)", 
        textAlign:"center", 
        position:"absolute", 
        bottom:0
    }
})

export default function NavBar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div style={{ width: "70px", paddingTop: "10px" , height:"80vh"}}>
                <Link to='/' >
                    <div style={{ backgroundImage: `url("tasks.png")` }} className={classes.image} />
                </Link>
                <Link to='/Groceries' >
                    <div style={{ backgroundImage: `url("groceryCartNavbar.png")` }} className={classes.image} />
                </Link>
                <Link to='/Weather' >
                    <div style={{ backgroundImage: `url("weather.png")` }} className={classes.image} />
                </Link>
                <div className={classes.clockContainer}>
                    <Clock />
                </div>
            </div>
        </div>
    );
}