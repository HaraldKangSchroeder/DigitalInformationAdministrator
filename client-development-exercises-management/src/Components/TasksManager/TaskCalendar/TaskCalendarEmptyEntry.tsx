import { makeStyles, Paper } from "@material-ui/core";

const useStyle = makeStyles({
    calendarEntry: {
        width: "35px",
        height: "35px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        margin: "5px",
        '&:hover': {
            background: "#CAB9D9",
        },
    },
    calendarEntryDeactivated: {
        background: "rgba(255,255,255,0.3)",
        cursor: "default",
        '&:hover': {
            background: "rgba(255,255,255,0.3)",
        },
    },
});

export function TaskCalendarEmptyEntry() {
    const classes = useStyle();
    return (
        <Paper className={`${classes.calendarEntry} ${classes.calendarEntryDeactivated}`} elevation={4}></Paper>
    )
}