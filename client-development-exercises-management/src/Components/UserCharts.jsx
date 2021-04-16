import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import socket from "../socket";
import TaskAccomplishments from "../Classes/TaskAccomplishments";
import Tasks from "../Classes/Tasks";

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

export function UserCharts(props) {
    const [taskAccomplishments,setTaskAccomplishments] = useState(new TaskAccomplishments());
    const [tasks, setTasks] = useState(new Tasks());
    const [selectedTasks, setSelectedTasks] = useState(new Tasks());
    const [year, setYear] = useState(0);
    const [years, setYears] = useState([]);
    const [calendarWeekRange,setCalendarWeekRange] = useState({start:0,end:0});
    const [visualizationData, setVisualizationData] = useState({});
    const [visualizationMode, setVisualizationMode] = useState(VISUALIZATION_MODES[0]);

    useEffect(() => {
        socket.on("taskAccomplishmentsYears", ({ years }) => {
            let yearsArray = [];
            for (let element of years) yearsArray.push(element.year);
            setYears(yearsArray);
        });

        socket.on("taskAccomplishmentsInYear", ({data}) => {
            if(data.length == 0) return;
            let newTaskAccomplishments = new TaskAccomplishments(data);
            setTaskAccomplishments(newTaskAccomplishments);
        });

        socket.on("allTasks", ({tasks}) => {
            if(tasks.length == 0) return;
            let newTasks = new Tasks(tasks);
            setTasks(newTasks);
        });

        socket.emit("getAllTasks");
        socket.emit("getTaskAccomplishmentsYears");

        return () => {
            socket.off("taskAccomplishmentsYears");
            socket.off("taskAccomplishmentsInYearOfUsers");
            socket.off("allTasks");
        }
    },[])

    useEffect(() => {
        let noYearsAvailable = years.length == 0;
        if(noYearsAvailable) return;
        let latestYear = years[years.length - 1];
        setYear(latestYear);
    }, [years])

    useEffect(() => {
        let isYearSet = year !== 0;
        if(!isYearSet) return;
        socket.emit("getTaskAccomplishmentsInYear", {year:year, userIds:props.selectedUsers.getUserIds()});
    }, [year])

    useEffect(() => {
        let latestCalendarWeek = taskAccomplishments.getLatestCalendarWeek();
        let isCalendarWeekEndSet = calendarWeekRange.end !== 0;
        let isCalendarWeekEndWithingNewRange = calendarWeekRange.end <= latestCalendarWeek;
        setCalendarWeekRange({
            ...calendarWeekRange,
            end : !isCalendarWeekEndSet || !isCalendarWeekEndWithingNewRange ? latestCalendarWeek : calendarWeekRange.end,
        });
    }, [taskAccomplishments]);

    useEffect(() => {
        let visualizationData = getVisualizationData(props.selectedUsers, tasks, selectedTasks, taskAccomplishments, calendarWeekRange.start, calendarWeekRange.end, visualizationMode);
        setVisualizationData(visualizationData);
    }, [calendarWeekRange,props.selectedUsers, selectedTasks, visualizationMode]);



    const handleChangeCalendarWeekStart = (e) => {
        setCalendarWeekRange({
            ...calendarWeekRange,
            start : e.target.value
        });
    }

    const handleChangeCalendarWeekEnd = (e) => {
        setCalendarWeekRange({
            ...calendarWeekRange,
            end : e.target.value
        });
    }

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    }

    const handleChangeSelectedTasksByIds = (taskIds) => {
        let newSelectedTasks = new Tasks();
        for(let taskId of taskIds){
            newSelectedTasks.addTask(tasks.getTaskById(taskId));
        }
        setSelectedTasks(newSelectedTasks);
    }

    const handleChangeVisualizationMode = (e) => {
        console.log(e.target.value);
        setVisualizationMode(e.target.value);
    }
    

    const classes = useStyles();
    let tasksInCalendarWeekRange = tasks.getTasksByIds(taskAccomplishments.getTaskIdsInCalendarWeekRange(calendarWeekRange.start,calendarWeekRange.end));
    return (
        <React.Fragment>
            <ChartHeader 
                calendarWeekStart={calendarWeekRange.start}
                calendarWeekEnd={calendarWeekRange.end}
                calendarWeeks={Array(taskAccomplishments.getLatestCalendarWeek() + 1).fill().map((x,i)=>i)}
                changeCalendarWeekStart={handleChangeCalendarWeekStart} 
                changeCalendarWeekEnd={handleChangeCalendarWeekEnd} 
                changeYear={handleChangeYear}
                year={year}
                years={years}
                tasks={tasksInCalendarWeekRange}
                selectedTasks={selectedTasks}
                changeSelectedTasksByIds={handleChangeSelectedTasksByIds}
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

function getVisualizationData(users, tasks, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd, visualizationMode){
    let visualizationData = {}
    visualizationData.labels = [];
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        visualizationData.labels.push(calendarWeek);
    }
    visualizationData.datasets = [];
    for (let user of users.getUserList()) {
        let userVisualizationData = getVisualizationDatasetOfUser(user,tasks, selectedTasks,taskAccomplishments,calendarWeekStart,calendarWeekEnd,visualizationMode);
        visualizationData.datasets.push(userVisualizationData);
    }
    return visualizationData;
}

function getVisualizationDatasetOfUser(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart,calendarWeekEnd,visualizationMode){
    let data = [];
    if(visualizationMode === VISUALIZATION_MODE_NORMAL){
        data = getVisualizationDataOfUserNormal(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart,calendarWeekEnd);
    }
    else if(visualizationMode === VISUALIZATION_MODE_ACCUMULATED){
        data =  getVisualizationDataOfUserAccumulated(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart,calendarWeekEnd);
    }
    return getVisualizationDataset(user,data);
}
function getVisualizationDataOfUserNormal(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart,calendarWeekEnd){
    let data = [];
    for(let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++){
        let score = getSummedScoreInCalendarWeekByUserId(user.getId(),tasks, selectedTasks,taskAccomplishments,calendarWeek);
        data.push(score);
    }
    return data;
}

function getVisualizationDataOfUserAccumulated(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart,calendarWeekEnd){
    let data = [];
    let previousScore = 0;
    for(let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++){
        let score = previousScore + getSummedScoreInCalendarWeekByUserId(user.getId(),tasks, selectedTasks,taskAccomplishments,calendarWeek);
        previousScore = score;
        data.push(score);
    }
    return data;
}

function getVisualizationDataset(user,data){
    let color = COLORS[user.getId() % COLORS.length];
    return (
        {
            label: user.getName(),
            data: data,
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

function getSummedScoreInCalendarWeekByUserId(userId,tasks, selectedTasks,taskAccomplishments,calendarWeek){
    let score_sum = 0;
    for(let taskAccomplishment of taskAccomplishments.getTaskAccomplishmentList()){
        let isEntryInCalendarWeek = taskAccomplishment.getCalendarWeek() === calendarWeek;
        let isEntryOfUser = userId === taskAccomplishment.getUserId();
        let isSelectedTask = selectedTasks.getTaskList().length == 0 ? true : selectedTasks.containsTaskById(taskAccomplishment.getTaskId());
        if(isEntryInCalendarWeek && isEntryOfUser && isSelectedTask){
            score_sum += tasks.getTaskById(taskAccomplishment.getTaskId()).getScore();
        }
    }
    return score_sum;
}




