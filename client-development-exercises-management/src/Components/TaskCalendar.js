import { makeStyles } from "@material-ui/core"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from "react";
import socket from "../socket";


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
    calendarEntryTaskOccurence: {
        width: "35px",
        height: "35px",
        background: "#8B72BE",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        margin: "5px",
        '&:hover': {
            background: "#B7A9D4",
        },
    },

    table: {
        width: 0,
        height: 0,
    },
    tableContainer: {
        display: "table-cell",
        textAlign: "center",
        padding: "10px",
        borderRadius: "10px",
        background: "rgb(249,228,183)"
    },
    tableTitle: {
        marginBottom: "10px",
        color: "rgb(100,100,100)",
        fontWeight: "bold",
        fontSize: "1.3em"
    },
    tableCellDefault: {
        padding: 0,
        borderBottom: "none",
        color: "rgb(100,100,100)",
    },
    tableCellCalendarWeek: {
        padding: 0,
        borderRightStyle: "solid",
        borderBottom: "none",
        borderWidth: "1px",
        color: "rgb(100,100,100)",
        borderColor: "rgba(0,0,0,0.3)",
    }
});

const CALENDAR_ROWS = 6;
const CALENDAR_COLUMNS = 7;

const MONTHS = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
];

const currentYear = (new Date()).getFullYear();
const daysInYear = getDaysInYearPerMonth(currentYear);
const calendarWeeksInYear = getCalendarWeeksInYearPerMonth(currentYear);


function getCalendarWeeksInYearPerMonth(year) {
    let calendarWeeksInYear = [];
    for (let month = 0; month < 12; month++) {
        let calendarWeeksInMonth = [];
        let daysInMonth = getDaysInMonth(year, month);
        daysInMonth.forEach(day => {
            let calendarWeek = getWeekNumber(day);
            if (!calendarWeeksInMonth.includes(calendarWeek)) {
                calendarWeeksInMonth.push(calendarWeek);
            }
        })
        calendarWeeksInYear[month] = calendarWeeksInMonth;
    }
    return calendarWeeksInYear;
}

function getDaysInYearPerMonth(year) {
    let daysInYear = [];
    for (let month = 0; month < 12; month++) {
        daysInYear[month] = getDaysInMonth(year, month);
    }
    return daysInYear;
}

function getDaysInMonth(year, month) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}


function getWeekNumber(d) {
    var onejan = new Date(d.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((d - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
};

function getCalendarRowsData(days, calendarWeeks) {
    let startIndex = days[0].getDay();
    let rows = [];
    for (let i = 0; i < CALENDAR_ROWS; i++) {
        rows.push({ cw: i < calendarWeeks.length ? calendarWeeks[i] : null, days: [] });
    }

    for (let i = 0; i < CALENDAR_ROWS * CALENDAR_COLUMNS; i++) {
        if (i < startIndex || i - startIndex >= days.length) {
            rows[Math.floor(i / 7)].days.push(null);
            continue;
        }
        rows[Math.floor(i / 7)].days.push(days[i - startIndex]);
    }
    return rows;
}

function doesTaskOccurOnCalendarWeekAndDay(taskOccurences, week, day) {
    for (let i = 0; i < taskOccurences.length; i++) {
        if (taskOccurences[i].calendar_week == week && taskOccurences[i].day == day) {
            return true;
        }
    }
    return false;
}

function doesTaskOccurOnCalendarWeek(taskOccurences, week) {
    for (let i = 0; i < taskOccurences.length; i++) {
        if (taskOccurences[i].calendar_week == week) {
            return true;
        }
    }
    return false;
}

export function TaskCalendar(props) {

    const classes = useStyle();
    let daysInMonth = daysInYear[props.month];
    let calendarWeeksInMonth = calendarWeeksInYear[props.month];
    let calendarRowsData = getCalendarRowsData(daysInMonth, calendarWeeksInMonth);

    return (
        <Paper className={classes.tableContainer} elevation={10}>
            <div className={classes.tableTitle}>{MONTHS[props.month]}</div>
            <TableContainer>
                <Table style={{ width: "80%" }} className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableCellCalendarWeek} align="center">CW</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Sun</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Mon</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Tue</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Wed</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Thu</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Fri</TableCell>
                            <TableCell className={classes.tableCellDefault} align="center">Sat</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            calendarRowsData.map((calendarRow) => (
                                <TableRow>
                                    {
                                        calendarRow.cw == null ?
                                            <TableCell className={classes.tableCellCalendarWeek} align="center">
                                                <TaskCalendarEmptyEntry />
                                            </TableCell>
                                            :
                                            <TableCell className={classes.tableCellCalendarWeek} align="center">
                                                <TaskCalendarWeekEntry
                                                    selectedTaskId={props.selectedTaskId}
                                                    taskOccurences={props.taskOccurences}
                                                    calendarWeek={calendarRow.cw}
                                                />
                                            </TableCell>
                                    }
                                    {calendarRow.days.map(date => {
                                        if (date == null) {
                                            return (
                                                <TableCell className={classes.tableCellDefault} align="center">
                                                    <TaskCalendarEmptyEntry />
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <TableCell className={classes.tableCellDefault} align="center">
                                                <TaskCalendarDayEntry
                                                    selectedTaskId={props.selectedTaskId}
                                                    taskOccurences={props.taskOccurences}
                                                    calendarWeek={calendarRow.cw}
                                                    date={date.getDate()}
                                                    day={date.getDay()}
                                                />
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper >
    );
}

export function TaskCalendarDayEntry(props) {
    const [isTaskDay, setIsTaskDay] = useState(props.calendarWeek != null && doesTaskOccurOnCalendarWeekAndDay(props.taskOccurences, props.calendarWeek, props.day));

    useEffect(() => {
        setIsTaskDay(props.calendarWeek != null && doesTaskOccurOnCalendarWeekAndDay(props.taskOccurences, props.calendarWeek, props.day));
    })

    const handleOnClick = (e) => {
        if (isTaskDay) {
            socket.emit("removeDayOfWeek", { taskId: props.selectedTaskId, calendarWeek: props.calendarWeek });
            return;
        }
        socket.emit("addWeekAndDay", { taskId: props.selectedTaskId, calendarWeek: props.calendarWeek, day: props.day });
    }

    const classes = useStyle();
    let classNames = `${classes.calendarEntry}`;
    if (isTaskDay) {
        classNames += ` ${classes.calendarEntryTaskOccurence}`;
    }
    return (
        <Paper onClick={handleOnClick} className={classNames} elevation={4}>{props.date}</Paper>
    )
}

export function TaskCalendarEmptyEntry() {
    const classes = useStyle();
    return (
        <Paper className={`${classes.calendarEntry} ${classes.calendarEntryDeactivated}`} elevation={4}></Paper>
    )
}


export function TaskCalendarWeekEntry(props) {
    const [isTaskWeek, setIsTaskWeek] = useState(doesTaskOccurOnCalendarWeek(props.taskOccurences, props.calendarWeek));

    useEffect(() => {
        setIsTaskWeek(doesTaskOccurOnCalendarWeek(props.taskOccurences, props.calendarWeek));
    });

    const handleOnClick = () => {
        if (isTaskWeek) {
            socket.emit("removeTaskWeek",{taskId: props.selectedTaskId, calendarWeek:props.calendarWeek});
            return;
        }
        socket.emit("addTaskWeek",{taskId: props.selectedTaskId, calendarWeek:props.calendarWeek});
    };

    const classes = useStyle();
    let classNames = `${classes.calendarEntry}`;
    if (isTaskWeek) {
        classNames += ` ${classes.calendarEntryTaskOccurence}`;
    }
    return (
        <Paper onClick={handleOnClick} className={classNames} elevation={4}>{props.calendarWeek}</Paper>
    )
}
