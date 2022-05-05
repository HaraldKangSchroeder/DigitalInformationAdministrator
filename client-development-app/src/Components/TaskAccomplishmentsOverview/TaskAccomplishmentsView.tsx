import { Grid, makeStyles } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import TaskAccomplishments from "../../Classes/TaskAccomplishments";
import Tasks from "../../Classes/Tasks";
import Users from "../../Classes/Users";
import User from "../../Classes/User";
import NavBar from "../Navbar/NavBar";
import { io } from "socket.io-client";

const COLORS = [
    'rgba(0, 0, 255,1)',
    'rgba(0, 255, 0,1)',
    'rgba(255, 0, 0,1)',
    'rgba(0, 255, 255,1)',
    'rgba(155, 155, 0,1)',
    'rgba(255, 0, 255,1)',
    'rgba(0, 0, 55,1)',
    'rgba(0, 155, 0,1)',
    'rgba(100, 0, 0,1)',
]

const VISUALIZATION_MODE_NORMAL = "normal";
const VISUALIZATION_MODE_ACCUMULATED = "accumulated";

const VISUALIZATION_MODES = [
    VISUALIZATION_MODE_NORMAL,
    VISUALIZATION_MODE_ACCUMULATED
];

const useStyles = makeStyles({
    graph: {
        marginTop: "3vh",
        height: "84vh",
        background: "",
        maxHeight: "84vh",
        overflowY: "auto"
    }
})


export function TaskAccomplishmentsView() {
    const [taskAccomplishments, setTaskAccomplishments] = useState(new TaskAccomplishments(null));
    const [users, setUsers] = useState(new Users(null));
    const [tasks, setTasks] = useState(new Tasks());
    const [selectedTasks, setSelectedTasks] = useState(new Tasks());
    const [year, setYear] = useState(0);
    const [years, setYears] = useState<number[]>([]);
    const [calendarWeekRange, setCalendarWeekRange] = useState({ start: 1, end: 1 });
    const [visualizationData, setVisualizationData] = useState({});
    const [visualizationMode, setVisualizationMode] = useState<string>(VISUALIZATION_MODES[0]);

    let socket = useRef(null);

    useEffect(() => {
        // socket must be created here (instead of globally). Else, there will be a persistent connection which might need to many ressources from official cloud services (e.g. heroku only provides 500 hours/month usage)
        socket.current = process.env.REACT_APP_TASKS_URL ? io(process.env.REACT_APP_TASKS_URL, {
            auth: {
                token: process.env.REACT_APP_TASKS_TOKEN
            }
        }) : null;

        if (socket.current == null) return;

        socket.current.on("users", (userEntries : Object[]) => {
            if (userEntries.length === 0) return;
            let newUsers = new Users(userEntries);
            setUsers(newUsers);
        })
        socket.current.on("taskAccomplishmentYears", (years : number[]) => {
            setYears(years);
        });

        socket.current.on("taskAccomplishments", (taskAccomplishmentEntries : Object[]) => {
            if (taskAccomplishmentEntries.length === 0) return;
            let newTaskAccomplishments = new TaskAccomplishments(taskAccomplishmentEntries);
            setTaskAccomplishments(newTaskAccomplishments);
        });

        socket.current.emit("getUsers");

        return () => {
            socket.current.off("taskAccomplishmentYears");
            socket.current.off("taskAccomplishments");
            socket.current.off("users");
        }
    }, [])

    useEffect(() => {
        socket.current.emit("getTaskAccomplishmentYears");
    }, [users])

    useEffect(() => {
        let noYearsAvailable = years.length == 0;
        if (noYearsAvailable) return;
        let latestYear = years[years.length - 1];
        setYear(latestYear);
    }, [years])

    useEffect(() => {
        let isYearSet = year !== 0;
        if (!isYearSet) return;
        socket.current.emit("getTaskAccomplishments", { year: year });
    }, [year])

    useEffect(() => {
        setTasks(taskAccomplishments.extractTasks());
    }, [taskAccomplishments]);

    useEffect(() => {
        setCalendarWeekRange({
            start: taskAccomplishments.getEarliestCalendarWeek(),
            end: taskAccomplishments.getLatestCalendarWeek(),
        });
    }, [tasks])

    useEffect(() => {
        let visualizationData = createVisualizationData(users, tasks, selectedTasks, taskAccomplishments, calendarWeekRange.start, calendarWeekRange.end, visualizationMode);
        setVisualizationData(visualizationData);
    }, [calendarWeekRange, users, selectedTasks, visualizationMode]);



    const handleChangeCalendarWeekStart = (e: any) => {
        setCalendarWeekRange({
            ...calendarWeekRange,
            start: e.target.value
        });
    }

    const handleChangeCalendarWeekEnd = (e: any) => {
        setCalendarWeekRange({
            ...calendarWeekRange,
            end: e.target.value
        });
    }

    const handleChangeYear = (e: any) => {
        setYear(e.target.value);
    }

    const handleChangeSelectedTasks = (taskIds: number[]) => {
        let newSelectedTasks = new Tasks();
        for (let taskId of taskIds) {
            newSelectedTasks.addTask(tasks.getTask(taskId));
        }
        setSelectedTasks(newSelectedTasks);
    }

    const handleChangeVisualizationMode = (e: any) => {
        setVisualizationMode(e.target.value);
    }


    const classes = useStyles();
    let tasksInCalendarWeekRange = tasks.getTasks(taskAccomplishments.getTaskIdsInWeekRange(calendarWeekRange.start, calendarWeekRange.end));
    return (

        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                <Grid item xs={11} style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                    <ChartHeader
                        calendarWeekStart={calendarWeekRange.start}
                        calendarWeekEnd={calendarWeekRange.end}
                        calendarWeeks={createListWithRange(taskAccomplishments.getLatestCalendarWeek())}
                        changeCalendarWeekStart={handleChangeCalendarWeekStart}
                        changeCalendarWeekEnd={handleChangeCalendarWeekEnd}
                        changeYear={handleChangeYear}
                        year={year}
                        years={years}
                        tasks={tasksInCalendarWeekRange}
                        selectedTasks={selectedTasks}
                        changeSelectedTasks={handleChangeSelectedTasks}
                        selectedVisualizationMode={visualizationMode}
                        visualizationModes={VISUALIZATION_MODES}
                        changeVisualizationMode={handleChangeVisualizationMode}
                    />
                    <div className={classes.graph}>
                        <Line
                            data={visualizationData}
                            type={null}
                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: "rgb(200,200,200)",
                                        }
                                    }
                                },
                                maintainAspectRatio: false,
                                scales: {
                                    yAxis: {
                                        title: {
                                            color: 'rgb(200,200,200)',
                                            display: true,
                                            text: 'Score'
                                        },
                                        ticks: {
                                            color: 'rgb(200,200,200)',
                                        },
                                        id: "yAxis",
                                    },
                                    xAxis: {
                                        title: {
                                            color: 'rgb(200,200,200)',
                                            display: true,
                                            text: 'Calendar Week'
                                        },
                                        ticks: {
                                            color: 'rgb(200,200,200)',
                                        },
                                        id: "xAxis",
                                    },
                                }
                            }
                            }
                        />
                    </div>
                </Grid>
            </Grid>
        </div>

    )
}

/**
 * Returns a list starting from 1 up to the given limit
 * @param upperLimit number representing the upper bound
 */
function createListWithRange(upperLimit: number): number[] {
    let values: number[] = [];
    for (let i = 1; i <= upperLimit; i++) {
        values.push(i);
    }
    return values;
}

function createVisualizationData(
    users: Users,
    tasks: Tasks,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number,
    visualizationMode: string
) {
    let visualizationData: any = {}
    visualizationData.labels = [];
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        visualizationData.labels.push(calendarWeek);
    }
    visualizationData.datasets = [];
    for (let user of users.getList()) {
        let userVisualizationData = createUserVisualizationData(user, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd, visualizationMode);
        visualizationData.datasets.push(userVisualizationData);
    }
    return visualizationData;
}

function createUserVisualizationData(
    user: User,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number,
    visualizationMode: string
) {
    let data: any[] = [];
    if (visualizationMode === VISUALIZATION_MODE_NORMAL) {
        data = computeWeeklyScore(user, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd);
    }
    else if (visualizationMode === VISUALIZATION_MODE_ACCUMULATED) {
        data = computeAccumulatedScore(user, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd);
    }
    return createChartjsData(user, data);
}


function computeWeeklyScore(
    user: User,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number
) {
    let data = [];
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        let score = getSummedScoreInCalendarWeekByUserId(user.getId(), selectedTasks, taskAccomplishments, calendarWeek);
        data.push(score);
    }
    return data;
}

function computeAccumulatedScore(
    user: User,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number
) {
    let data = [];
    let previousScore = 0;
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        let score = previousScore + getSummedScoreInCalendarWeekByUserId(user.getId(), selectedTasks, taskAccomplishments, calendarWeek);
        previousScore = score;
        data.push(score);
    }
    return data;
}

function createChartjsData(user: User, data: any) {
    let color = COLORS[user.getId() % COLORS.length];
    return (
        {
            label: user.getName(),
            data: data,
            lineTension: 0,
            backgroundColor: [
                'rgba(255, 255, 255, 0)',
            ],
            borderColor: [
                color
            ],
            borderWidth: 2,
            pointHoverRadius: 5,
            pointBorderWidth: 1,
            pointBackgroundColor: color,
            pointBorderColor: color,
        }
    )
}

function getSummedScoreInCalendarWeekByUserId(
    userId: number,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeek: number
) {
    let score_sum = 0;
    for (let taskAccomplishment of taskAccomplishments.getTaskAccomplishmentList()) {
        let isEntryInCalendarWeek = taskAccomplishment.getCalendarWeek() === calendarWeek;
        let isEntryOfUser = userId === taskAccomplishment.getUserId();
        let isSelectedTask = selectedTasks.getList().length === 0 ? true : selectedTasks.containsTask(taskAccomplishment.getTaskId());
        if (isEntryInCalendarWeek && isEntryOfUser && isSelectedTask) {
            score_sum += taskAccomplishment.getScore();
        }
    }
    return score_sum;
}




