import { makeStyles } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import { getUserById ,getIntersection} from "../utils";
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

    useEffect(() => {
        socket.on("TaskAccomplishmentsYears", ({ years }) => {
            let yearsArr = [];
            for (let element of years) yearsArr.push(element.year);
            console.log(yearsArr);
            setYears(yearsArr);
        });

        socket.on("TaskAccomplishmentsInYear", ({data}) => {
            console.log(data);
            if(data.length == 0) return;
            let taskAccomplishments = new TaskAccomplishments(data);
            console.log(taskAccomplishments);
            setTaskAccomplishments(taskAccomplishments);
        });

        socket.on("AllTasks", ({tasks}) => {
            if(tasks.length == 0) return;
            let tasksObject = new Tasks(tasks);
            console.log(tasksObject);
            setTasks(tasksObject);
        });

        socket.emit("GetAllTasks");
        socket.emit("GetTaskAccomplishmentsYears");

        return () => {
            socket.off("TaskAccomplishmentsYears");
            socket.off("TaskAccomplishmentsInYearOfUsers");
            socket.off("AllTasks");
        }
    },[])

    useEffect(() => {
        let noYearsAvailable = years.length == 0;
        if(noYearsAvailable) return;
        let latestYear = years[years.length - 1];
        setYear(latestYear);
    }, [years])

    useEffect(() => {
        if(year === 0) return;
        socket.emit("GetTaskAccomplishmentsInYear", {year:year, userIds:props.selectedUsers.getUserIds()});
    }, [year])

    useEffect(() => {
        let latestCalendarWeek = taskAccomplishments.getLatestCalendarWeek();
        setCalendarWeekRange({
            ...calendarWeekRange,
            end : calendarWeekRange.end === 0 || calendarWeekRange.end >= latestCalendarWeek ? latestCalendarWeek : calendarWeekRange.end,
        });
    }, [taskAccomplishments]);

    useEffect(() => {
        let visualizationData = getVisualizationData(props.selectedUsers, tasks, selectedTasks, taskAccomplishments, calendarWeekRange.start, calendarWeekRange.end);
        setVisualizationData(visualizationData);
    }, [calendarWeekRange,props.selectedUsers, selectedTasks]);



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

    const handleChangeSelectedTaskids = (e) => {
        let selectedTasksTemp = new Tasks();
        for(let taskId of e){
            selectedTasksTemp.addTask(tasks.getTaskById(taskId));
        }
        setSelectedTasks(selectedTasksTemp);
    }
    

    const classes = useStyles();
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
                // taskIdsInYear={taskIdsInYear}
                taskIdsInYear={taskAccomplishments.getTaskIdsInCalendarWeekRange(calendarWeekRange.start,calendarWeekRange.end)}
                selectedTaskIds={selectedTasks.getTaskIds()}
                changeSelectedTaskIds={handleChangeSelectedTaskids}
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

function getVisualizationData(users, tasks, selectedTasks, taskAccomplishments, calendarWeekStart, calendarWeekEnd){
    let visualizationData = {}
    visualizationData.labels = [];
    console.log(selectedTasks);
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        visualizationData.labels.push(calendarWeek);
    }
    visualizationData.datasets = [];
    for (let user of users.getUserList()) {
        let userVisualizationData = getVisualizationDatasetOfUser(user,tasks, selectedTasks,taskAccomplishments,calendarWeekStart,calendarWeekEnd);
        visualizationData.datasets.push(userVisualizationData);
    }
    return visualizationData;
}

function getVisualizationDatasetOfUser(user, tasks, selectedTasks, taskAccomplishments, calendarWeekStart,calendarWeekEnd){
    let data = [];
    for(let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++){
        let score = getSummedScoreOfUserIdInCalendarWeek(user.getId(),tasks, selectedTasks,taskAccomplishments,calendarWeek);
        data.push(score);
    }
    let color = "rgba(255,0,0,1)";
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

function getSummedScoreOfUserIdInCalendarWeek(userId,tasks, selectedTasks,taskAccomplishments,calendarWeek){
    let score_sum = 0;
    for(let taskAccomplishment of taskAccomplishments.getTaskAccomplishmentList()){
        let isEntryInCalendarWeek = taskAccomplishment.getCalendarWeek() === calendarWeek;
        let isEntryOfUser = userId === taskAccomplishment.getUserId();
        let isSelectedTask = selectedTasks.getTaskList().length == 0 ? true : selectedTasks.containsTaskById(taskAccomplishment.getTaskId());
        //console.log(selectedTasks);
        if(isEntryInCalendarWeek && isEntryOfUser && isSelectedTask){
            score_sum += tasks.getTaskById(taskAccomplishment.getTaskId()).getScore();
        }
    }
    return score_sum;
}



