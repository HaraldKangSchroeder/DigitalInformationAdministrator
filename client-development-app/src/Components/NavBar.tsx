import { makeStyles } from "@material-ui/core";
import React from "react";
import NavElement from "./NavElement";

const useStyles = makeStyles({
    root : {
        textAlign: 'center',
        background : "rgb(30,30,30)",
        boxShadow: "1px 0 5px -2px #000",
        height: "99.9vh",
        width:"100%",
        paddingTop: "0.1vh",
    }
})

export default function NavBar(){
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <NavElement
                imagePath={"tasks.png"}
            />
            <NavElement
                imagePath={"tasks.png"}
            />
        </div>
    );
}