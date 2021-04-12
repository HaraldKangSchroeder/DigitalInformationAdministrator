import { makeStyles, useScrollTrigger } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import { getUserById } from "../utils";
import socket from "../socket";
import { CompassCalibrationOutlined, SettingsInputAntennaTwoTone } from "@material-ui/icons";


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
    const [dataset, setDataset] = useState(null);
    const [visualizationData, setVisualizationData] = useState({});
    const [calendarWeekData,setCalendarWeekData] = useState({start:0, end:0, latest:0})
    const [year, setYear] = useState(null);
    const [years, setYears] = useState([]);


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
        if(year == null) return;
        socket.emit("GetTaskAccomplishmentsEntriesInYear", {year:year});
    }, [year])

    useEffect(() => {
        if(dataset == null) return;
        console.log(dataset);
        let latestCalendarWeek = dataset[dataset.length - 1].calendar_week;
        console.log(latestCalendarWeek);
        setCalendarWeekData({
            ...calendarWeekData,
            end:latestCalendarWeek,
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
    

    const classes = useStyles();
    return (
        <React.Fragment>
            <ChartHeader 
                calendarWeekStart={calendarWeekData.start}
                calendarWeekEnd={calendarWeekData.end}
                calendarWeeks={Array(calendarWeekData.latest).fill().map((x,i)=>i)}
                changeCalendarWeekStart={handleChangeCalendarWeekStart} 
                changeCalendarWeekEnd={handleChangeCalendarWeekEnd} 
                year={year}
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


