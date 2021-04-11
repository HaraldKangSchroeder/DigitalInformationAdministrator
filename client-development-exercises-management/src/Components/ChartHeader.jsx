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

const CALENDAR_WEEKS = [
    
];

for(let i = 0; i<=54; i++){
    CALENDAR_WEEKS.push({value:i,label:i});
}

export function ChartHeader(props){
    const classes = useStyles();
    return (
        <div className = {classes.root}>
            Scores per Calender Week from
            <SelectMenuValueSelection 
                value={props.calendarWeekStart}
                label={"CW"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeCalendarWeekStart}
                menuItems={CALENDAR_WEEKS}
                noNone={true}
            />
            to 
            <SelectMenuValueSelection 
                value={props.calendarWeekEnd}
                label={"CW"}
                minWidth={80}
                height={10}
                marginSide={10}
                handleChange={props.changeCalendarWeekEnd}
                menuItems={CALENDAR_WEEKS}
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