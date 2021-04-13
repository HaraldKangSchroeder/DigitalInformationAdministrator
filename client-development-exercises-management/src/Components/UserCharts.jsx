import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import { getUserById ,getIntersection} from "../utils";
import socket from "../socket";


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
    const [dataset, setDataset] = useState([]);
    const [visualizationData, setVisualizationData] = useState({});
    const [calendarWeekData,setCalendarWeekData] = useState({start:0, end:0, latest:0})
    const [year, setYear] = useState(0);
    const [years, setYears] = useState([]);
    const [taskIdsInYear, setTaskIdsInYear] = useState([]);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);


    useEffect(() => {
        socket.on("TaskAccomplishmentsYears", ({ years }) => {
            let yearsArr = [];
            for (let element of years) yearsArr.push(element.year);
            console.log("all years are:");
            console.log(yearsArr);
            setYears(yearsArr);
        });
        
        socket.on("TaskAccomplishmentsEntriesInYear", ({data}) => {
            if(data.length == 0) return;
            console.log("data:");
            console.log(data);
            setDataset(data);
        })

        socket.on("TaskAccomplishmentsIdsInYear", ({ids}) => {
            console.log(ids);
            let idsArray = [];
            for(let idElement of ids){
                idsArray.push(idElement.task_id);
            }
            console.log(idsArray);
            setTaskIdsInYear(idsArray);
        })
        


        socket.emit("GetTaskAccomplishmentsYears");
        //setData(getDatasets(props.selectedUserIds, props.users,null, calendarWeekStart, calendarWeekEnd))

        return () => {
            socket.off("TaskAccomplishmentsYears");
            socket.off("TaskAccomplishmentsEntriesInYear");
        }
        //}, [calendarWeekStart,calendarWeekEnd,props.selectedUserIds, props.users]);
    }, []);

    useEffect(() => {
        let noYearsAvailable = years.length == 0;
        if(noYearsAvailable) return;
        let latestYear = years[years.length - 1];
        console.log("latest year is " + latestYear);
        setYear(latestYear);
    }, [years])

    useEffect(() => {
        if(year === 0) return;
        socket.emit("GetTaskAccomplishmentsIdsInYear", {year:year});
        // socket.emit("GetTaskAccomplishmentsEntriesInYear", {year:year});
    }, [year])

    useEffect(() => {
        let taskIdsIntersection = getIntersection(selectedTaskIds,taskIdsInYear);
        console.log("ITERNSECTION");
        console.log(selectedTaskIds);
        console.log(taskIdsInYear);
        console.log(taskIdsIntersection);
        setSelectedTaskIds(taskIdsIntersection);
    }, [taskIdsInYear])

    useEffect(() => {
        console.log(selectedTaskIds);
        socket.emit("GetTaskAccomplishmentsEntriesInYear", {year:year, taskIds:selectedTaskIds});
    }, [selectedTaskIds])

    useEffect(() => {
        if(dataset.length === 0) return;
        console.log(dataset);
        let latestCalendarWeek = dataset[dataset.length - 1].calendar_week;
        console.log(latestCalendarWeek);
        setCalendarWeekData({
            ...calendarWeekData,
            end: calendarWeekData.end === 0 || calendarWeekData.end >= latestCalendarWeek ? latestCalendarWeek : calendarWeekData.end,
            latest:latestCalendarWeek
        });
    }, [dataset])

    useEffect(() => {
        console.log(calendarWeekData);
        setVisualizationData(getVisualizationData(props.selectedUserIds,props.users,dataset,calendarWeekData.start,calendarWeekData.end));
    }, [calendarWeekData,props.selectedUserIds]);

    useEffect(() => {
        console.log(visualizationData);
    },[visualizationData])


    const handleChangeCalendarWeekStart = (e) => {
        setCalendarWeekData({
            ...calendarWeekData,
            start : e.target.value
        });
    }

    const handleChangeCalendarWeekEnd = (e) => {
        setCalendarWeekData({
            ...calendarWeekData,
            end : e.target.value
        });
    }

    const handleChangeYear = (e) => {
        setYear(e.target.value);
    }

    const handleChangeSelectedTaskids = (e) => {
        console.log("HANDLE CHANGE SELECTED TASK IDS");
        console.log(e)
        setSelectedTaskIds(e);
    }
    

    const classes = useStyles();
    return (
        <React.Fragment>
            <ChartHeader 
                calendarWeekStart={calendarWeekData.start}
                calendarWeekEnd={calendarWeekData.end}
                calendarWeeks={Array(calendarWeekData.latest + 1).fill().map((x,i)=>i)}
                changeCalendarWeekStart={handleChangeCalendarWeekStart} 
                changeCalendarWeekEnd={handleChangeCalendarWeekEnd} 
                changeYear={handleChangeYear}
                year={year}
                years={years}
                taskIdsInYear={taskIdsInYear}
                selectedTaskIds={selectedTaskIds}
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

function getVisualizationData(selectedUserIds, users, globalDataset, calendarWeekStart, calendarWeekEnd){
    let visualizationData = {}
    visualizationData.labels = [];
    for (let calendarWeek = calendarWeekStart; calendarWeek <= calendarWeekEnd; calendarWeek++) {
        visualizationData.labels.push(calendarWeek);
    }
    visualizationData.datasets = [];
    for (var userId of selectedUserIds) {
        let userVisualizationData = getUserVisualizationData(getUserById(users,userId),globalDataset,calendarWeekStart,calendarWeekEnd);
        visualizationData.datasets.push(userVisualizationData);
    }
    return visualizationData;
}

function getUserVisualizationData(user, globalDataset, calendarWeekStart,calendarWeekEnd){
    let data = [];
    for(let i = 0; i < globalDataset.length; i++){
        if(!(globalDataset[i].calendar_week >= calendarWeekStart && globalDataset[i].calendar_week <= calendarWeekEnd && user.id === globalDataset[i].user_id)) continue;
        data.push(globalDataset[i].score_sum);
    }
    let color = "rgba(255,0,0,1)";
    return (
        {
            label: user.name,
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


