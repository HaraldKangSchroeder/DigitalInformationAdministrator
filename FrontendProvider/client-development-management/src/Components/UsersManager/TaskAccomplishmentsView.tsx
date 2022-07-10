import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import { socketTasks as socket } from "../../socket";
import TaskAccomplishments from "../../Classes/TaskAccomplishments";
import Tasks from "../../Classes/Tasks";
import Users from "../../Classes/Users";
import User from "../../Classes/User";

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

interface Props {
    selectedUsers: Users;
}

export function TaskAccomplishmentsView(props: Props) {
    const [taskAccomplishments, setTaskAccomplishments] = useState(new TaskAccomplishments(null));
    const [tasks, setTasks] = useState(new Tasks(null));
    const [selectedTasks, setSelectedTasks] = useState(new Tasks(null));
    const [year, setYear] = useState(0);
    const [years, setYears] = useState<number[]>([]);
    const [calendarWeekRange, setCalendarWeekRange] = useState({ start: 1, end: 1 });
    const [visualizationData, setVisualizationData] = useState({});
    const [visualizationMode, setVisualizationMode] = useState<string>(VISUALIZATION_MODES[0]);

    useEffect(() => {
        socket.on("taskAccomplishmentYears", (years) => {
            setYears(years);
        });

        socket.on("taskAccomplishments", (taskAccomplishmentEntries) => {
            if (taskAccomplishmentEntries.length == 0) return;
            let newTaskAccomplishments = new TaskAccomplishments(taskAccomplishmentEntries);
            setTaskAccomplishments(newTaskAccomplishments);
        });

        socket.on("tasks", (taskEntries) => {
            if (taskEntries.length == 0) return;
            let newTasks = new Tasks(taskEntries);
            setTasks(newTasks);
        });

        socket.emit("getTasks");
        socket.emit("getTaskAccomplishmentYears");

        return () => {
            socket.off("taskAccomplishmentYears");
            socket.off("taskAccomplishments");
            socket.off("tasks");
        }
    }, [])

    useEffect(() => {
        let noYearsAvailable = years.length == 0;
        if (noYearsAvailable) return;
        let latestYear = years[years.length - 1];
        setYear(latestYear);
    }, [years])

    useEffect(() => {
        let isYearSet = year !== 0;
        if (!isYearSet) return;
        socket.emit("getTaskAccomplishments", { year: year, userIds: props.selectedUsers.getUserIds() });
    }, [year])

    useEffect(() => {
        setCalendarWeekRange({
            start: taskAccomplishments.getEarliestCalendarWeek(),
            end: taskAccomplishments.getLatestCalendarWeek(),
        });
    }, [taskAccomplishments]);

    useEffect(() => {
        let visualizationData = createVisualizationData(props.selectedUsers, tasks, selectedTasks, taskAccomplishments, calendarWeekRange.start, calendarWeekRange.end, visualizationMode);
        setVisualizationData(visualizationData);
    }, [calendarWeekRange, props.selectedUsers, selectedTasks, visualizationMode]);



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
        let newSelectedTasks = new Tasks(null);
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
        <React.Fragment>
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
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Score'
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Calendar Week'
                                }
                            }],
                        }
                    }}
                />
            </div>
        </React.Fragment>
    )
}

function createListWithRange(upperLimit: number) {
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
        let userVisualizationData = createUserVisualizationData(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd, visualizationMode);
        visualizationData.datasets.push(userVisualizationData);
    }
    return visualizationData;
}

function createUserVisualizationData(
    user: User,
    tasks: Tasks,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number,
    visualizationMode: string
) {
    let data: any[] = [];
    if (visualizationMode === VISUALIZATION_MODE_NORMAL) {
        data = computeWeeklyScore(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd);
    }
    else if (visualizationMode === VISUALIZATION_MODE_ACCUMULATED) {
        data = computeAccumulatedScore(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd);
    }
    return createChartjsData(user, data);
}


function computeWeeklyScore(
    user: User,
    tasks: Tasks,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number
) {
    let data = [];
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        let score = getSummedScoreInCalendarWeekByUserId(user.getId(), tasks, selectedTasks, taskAccomplishments, calendarWeek);
        data.push(score);
    }
    return data;
}

function computeAccumulatedScore(
    user: User,
    tasks: Tasks,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeekStart: number,
    calendarWeekEnd: number
) {
    let data = [];
    let previousScore = 0;
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        let score = previousScore + getSummedScoreInCalendarWeekByUserId(user.getId(), tasks, selectedTasks, taskAccomplishments, calendarWeek);
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
    tasks: Tasks,
    selectedTasks: Tasks,
    taskAccomplishments: TaskAccomplishments,
    calendarWeek: number
) {
    let score_sum = 0;
    for (let taskAccomplishment of taskAccomplishments.getTaskAccomplishmentList()) {
        let isEntryInCalendarWeek = taskAccomplishment.getCalendarWeek() === calendarWeek;
        let isEntryOfUser = userId === taskAccomplishment.getUserId();
        let isSelectedTask = selectedTasks.getList().length == 0 ? true : selectedTasks.containsTask(taskAccomplishment.getTaskId());
        if (isEntryInCalendarWeek && isEntryOfUser && isSelectedTask) {
            score_sum += tasks.getTask(taskAccomplishment.getTaskId()).getScore();
        }
    }
    return score_sum;
}




