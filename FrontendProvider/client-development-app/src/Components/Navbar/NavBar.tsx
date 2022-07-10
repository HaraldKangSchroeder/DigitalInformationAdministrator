import { makeStyles } from "@material-ui/core";
import { Link } from 'react-router-dom';
import Clock from "./Clock";

const useStyles = makeStyles({
    root: {
        width: "100%",
        background: "rgb(30,30,30)",
        boxShadow: "1px 0 5px -2px #000",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        position: "relative"
    },
    image: {
        width: "70px",
        height: "70px",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        marginTop: "5vh",
    },
    clockContainer: {
        fontSize: "1.6em",
        paddingBottom: "20px",
        width: "70px",
        color: "rgb(200,200,200)",
        textAlign: "center",
        position: "absolute",
        bottom: 0
    }
})

/*
in case of deploying the app from a subdir, you have to prepend the public url to the image path.
per default, it is the root path / and thus it is not necessary to prepent the public url.
src how-to: https://www.codegrepper.com/code-examples/javascript/create+react+app+cant+get+image+in+public
*/

export default function NavBar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div style={{ width: "70px", paddingTop: "10px", height: "80vh" }}>
                {process.env.REACT_APP_TASKS_MANAGER_URL ?
                    <Link to='/' >
                        <div style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/tasks.png")` }} className={classes.image} />
                    </Link> : ""
                }
                {process.env.REACT_APP_GROCERY_CART_URL ?
                    <Link to='/Groceries' >
                        <div style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/groceryCartNavbar.png')` }} className={classes.image} />
                    </Link> :
                    ""
                }
                {process.env.REACT_APP_WEATHER_SERVICE_URL ?
                    <Link to='/Weather' >
                        <div style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/weather.png")` }} className={classes.image} />
                    </Link> :
                    ""
                }
                {process.env.REACT_APP_TASKS_MANAGER_URL ?
                    <Link to='/TaskAccomplishmentsOverview' >
                        <div style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/magnifyingGlasses.png")` }} className={classes.image} />
                    </Link> : ""
                }
                <div className={classes.clockContainer}>
                    <Clock />
                </div>
            </div>
        </div>
    );
}