import { makeStyles } from "@material-ui/core"
import { SelectMenu } from "./SelectMenu";
import MultipleSelectTaskMenu from "./MultipleSelectTaskMenu"
import Tasks from "../../Classes/Tasks";


const useStyles = makeStyles({
    root: {
        fontSize: "1.1vw",
        color: "rgb(200,200,200)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3vh",
    }
})


interface Props {
    tasks: Tasks;
    selectedTasks: Tasks;
    year: number;
    years: number[];
    selectedVisualizationMode: string;
    visualizationModes: string[];
    calendarWeekStart: number;
    calendarWeekEnd: number;
    calendarWeeks: number[];
    changeSelectedTasks: Function;
    changeCalendarWeekStart: Function;
    changeCalendarWeekEnd: Function;
    changeYear: Function;
    changeVisualizationMode: Function;
}


export function ChartHeader(props: Props) {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            Scores of
            <MultipleSelectTaskMenu
                tasks={props.tasks}
                selectedTasks={props.selectedTasks}
                changeSelectedTasks={props.changeSelectedTasks}
            />
            per Calender Week from
            <SelectMenu
                value={props.calendarWeekStart}
                label={"CW"}
                minWidth={80}
                marginSide={10}
                handleChange={(e: any) => { props.changeCalendarWeekStart(e) }}
                menuItems={props.calendarWeeks}
            />
            to
            <SelectMenu
                value={props.calendarWeekEnd}
                label={"CW"}
                minWidth={80}
                marginSide={10}
                handleChange={(e: any) => { props.changeCalendarWeekEnd(e) }}
                menuItems={props.calendarWeeks}
            />
            of Year
            <SelectMenu
                value={props.year}
                label={"Year"}
                minWidth={80}
                marginSide={10}
                handleChange={(e: any) => { props.changeYear(e) }}
                menuItems={props.years}
            />
            - Mode :
            <SelectMenu
                value={props.selectedVisualizationMode}
                label={"Mode"}
                minWidth={80}
                marginSide={10}
                handleChange={(e: any) => { props.changeVisualizationMode(e) }}
                menuItems={props.visualizationModes}
            />
        </div>
    )
}