import { makeStyles } from "@material-ui/core"
import {SelectMenuValueSelection} from "./SelectMenuValueSelection";
import {X_AXIS_LABEL_DATA} from "../constants";


const useStyles = makeStyles({
    root : {
        fontSize : "1.4em",
        color:"rgb(100,100,100)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginTop:"1vh",
        
        // background:"red"
    }
})

export function ChartHeader(props){
    const classes = useStyles();
    return (
        <div className = {classes.root}>
            Scores per 
            <SelectMenuValueSelection 
                value={""}
                label={"Calendar Week"}
                minWidth={200}
                height={10}
                marginSide={10}
                menuItems={X_AXIS_LABEL_DATA}
                noNone={true}
            />
            of Year
            <SelectMenuValueSelection 
                value={""}
                label={"Year"}
                minWidth={100}
                height={10}
                marginSide={10}
                menuItems={X_AXIS_LABEL_DATA}
                noNone={true}
            />
        </div>
    )
}