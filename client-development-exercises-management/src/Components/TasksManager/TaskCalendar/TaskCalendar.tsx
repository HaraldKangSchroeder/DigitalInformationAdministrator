import { makeStyles } from "@material-ui/core"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TaskCalendarWeekEntry } from "./TaskCalendarWeekEntry";
import { TaskCalendarDayEntry } from "./TaskCalendarDayEntry";
import { TaskCalendarEmptyEntry } from "./TaskCalendarEmptyEntry";
import TaskOccurences from "../../../Classes/TaskOccurences";
import Task from "../../../Classes/Task";


const useStyle = makeStyles({
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
const NUM_MONTHS = 12;

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

const currentYear: number = (new Date()).getFullYear();
const datesInYearPerMonth: Date[][] = getDatesInYearPerMonth(currentYear);
const calendarWeeksInYearPerMonth: number[][] = getCalendarWeeksInYearPerMonth(currentYear);

interface Props {
    month: number;
    selectedTask: Task;
    taskOccurences: TaskOccurences;
}

export function TaskCalendar(props: Props) {

    let datesInMonth: Date[] = datesInYearPerMonth[props.month];
    let calendarWeeksInMonth: number[] = calendarWeeksInYearPerMonth[props.month];
    let calendarRowsData: CalendarRowData[] = getCalendarRowsData(datesInMonth, calendarWeeksInMonth);

    const classes = useStyle();
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
                                                    selectedTask={props.selectedTask}
                                                    taskOccurences={props.taskOccurences}
                                                    calendarWeek={calendarRow.cw}
                                                />
                                            </TableCell>
                                    }
                                    {calendarRow.dates.map((date: Date) => {
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
                                                    selectedTask={props.selectedTask}
                                                    taskOccurences={props.taskOccurences}
                                                    calendarWeek={calendarRow.cw}
                                                    dayOfMonth={date.getDate()}
                                                    dayOfWeek={date.getDay()}
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

function getCalendarWeeksInYearPerMonth(year: number): number[][] {
    let calendarWeeksInYearPerMonth = [];
    for (let month = 0; month < NUM_MONTHS; month++) {
        let calendarWeeksInMonth: any[] = [];
        let datesInMonth = getDatesInMonth(year, month);
        datesInMonth.forEach(date => {
            let calendarWeek = getWeekNumberByDate(date);
            if (!calendarWeeksInMonth.includes(calendarWeek)) {
                calendarWeeksInMonth.push(calendarWeek);
            }
        })
        calendarWeeksInYearPerMonth[month] = calendarWeeksInMonth;
    }
    return calendarWeeksInYearPerMonth;
}

function getDatesInYearPerMonth(year: number): Date[][] {
    let datesInYearPerMonth = [];
    for (let month = 0; month < 12; month++) {
        datesInYearPerMonth[month] = getDatesInMonth(year, month);
    }
    return datesInYearPerMonth;
}

function getDatesInMonth(year: number, month: number): Date[] {
    var date = new Date(year, month, 1, 6); //set 6 o'clock because 0 seems to be ambigious
    var dates = [];
    while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}


function getWeekNumberByDate(d: Date): number {
    var copiedDate = new Date(d.getTime());
    // set hours to 6 to prevent having 00:00 which is ambigious
    copiedDate.setHours(6);
    var onejan = new Date(copiedDate.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((copiedDate.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay()) / 7);
};


interface CalendarRowData {
    cw: number;
    dates: Date[];
}

function getCalendarRowsData(dates: Date[], calendarWeeks: number[]): CalendarRowData[] {
    let startIndex = dates[0].getDay();
    let calendarRowsData = [];
    for (let i = 0; i < CALENDAR_ROWS; i++) {
        let calendarRowData: CalendarRowData = { cw: i < calendarWeeks.length ? calendarWeeks[i] : null, dates: [] };
        calendarRowsData.push(calendarRowData);
    }

    for (let i = 0; i < CALENDAR_ROWS * CALENDAR_COLUMNS; i++) {
        if (i < startIndex || i - startIndex >= dates.length) {
            calendarRowsData[Math.floor(i / 7)].dates.push(null);
            continue;
        }
        calendarRowsData[Math.floor(i / 7)].dates.push(dates[i - startIndex]);
    }
    return calendarRowsData;
}


