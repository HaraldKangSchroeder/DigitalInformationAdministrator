import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { ChartHeader } from "./ChartHeader";
import {getUserById} from "../utils";


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
    const [data, setData] = useState(null);
    const [range,setRange] = useState({
        start:30,
        end:54
    });
    const [year, setYear] = useState("2021");

    useEffect(() => {
        setData(getDatasets(props.selectedUserIds, props.users,null, range))
    }, [props.selectedUserIds, props.users]);

    const classes = useStyles();
    return (
        <React.Fragment>
            <ChartHeader />
            <div className={classes.graph}>
                <Line
                    data={data}
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
                                    labelString: 'Month'
                                }
                            }],
                        }
                    }}
                />
            </div>
        </React.Fragment>
    )
}

function getDatasets(selectedUserIds, users, socketresponse, range){
    let dataset = {};
    dataset.labels = [];
    for(let i = 0; i < 54; i++){
        if(i >= range.start && i <= range.end){
            dataset.labels.push(i);
        }
    }
    dataset.datasets = [];
    for(let i = 0; i < selectedUserIds.length; i++){
        dataset.datasets.push(getDataset(getUserById(users,selectedUserIds[i]),COLORS[i % COLORS.length], range.end - range.start + 1));
    }
    return dataset;
}

function getDataset(user, color, numDataPoints){
    let data = [];
    for(let i = 0; i < numDataPoints; i++){
        data.push(Math.random() * 30);
    }
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

