import { makeStyles } from "@material-ui/core"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyle = makeStyles({
    dayEntry: {
        width: "40px",
        height: "40px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        margin: "5px",
        '&:hover': {
            background: "#f00",
        },
    },
    table: {
        width:0,
        height:0,
        // background:"red"
    },
    tableContainer : {
        // background:"green",
        display:"table-cell",
        textAlign:"center",
        padding:"10px",
        borderRadius:"10px",
        background:"rgb(249,228,183)"
    },
    tableTitle : {
        marginBottom:"10px",
        color:"rgb(100,100,100)",
        fontWeight:"bold",
        fontSize:"1.3em"
    },
    tableCellDefault: {
        padding:0,
        borderBottom:"none"
    },
    tableCellCalendarWeek : {
        padding:0,
        borderBottom:"none",
        borderWidth:"1px",
        borderColor:"rgba(0,0,0,0.2)"
    }
})

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

export function TaskCalendar() {
    const classes = useStyle();
    return (
        <Paper className={classes.tableContainer} elevation={10}>
            <div className={classes.tableTitle}>JANUARY</div>
            <TableContainer>
            <Table style={{width: "80%"}} className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCellCalendarWeek} align="center">CW</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Mon</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Tue</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Wed</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Thu</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Fri</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Sat</TableCell>
                        <TableCell className={classes.tableCellDefault} align="center">Sun</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell className={classes.tableCellCalendarWeek} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                            <TableCell className={classes.tableCellDefault} align="center"><TaskCalendarDayEntry></TaskCalendarDayEntry></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            </Paper>
    );
}

export function TaskCalendarDayEntry(props) {
    const classes = useStyle();
    return (
        <Paper className={classes.dayEntry} elevation={4}>10</Paper>
    )
}