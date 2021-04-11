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
    const [data, setData] = useState(dataset);

    useEffect(() => {
        setData(getDatasets(props.selectedUserIds, props.users,null))
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

function getDatasets(selectedUserIds, users, socketresponse){
    let dataset = {};
    dataset.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dataset.datasets = [];
    for(let i = 0; i < selectedUserIds.length; i++){
        dataset.datasets.push(getDataset(getUserById(users,selectedUserIds[i]),COLORS[i % COLORS.length]));
    }
    return dataset;
}

function getDataset(user, color){
    let data = [];
    for(let i = 0; i < 12; i++){
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
            borderWidth: 3,
            pointHoverRadius: 10,
            pointBorderWidth: 3,
            pointBackgroundColor: color,
            pointBorderColor: color,
        }
    )
}


const dataset = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Inge',
        data: [10, 30, 3, 5, 2, 3, 7, 1, 20, 13, 6, 3],
        backgroundColor: [
            'rgba(255, 255, 255, 0)',
        ],
        borderColor: [
            'rgba(0, 0, 255, 1)'
        ],
        borderWidth: 3,
        pointHoverRadius: 10,
        pointBorderWidth: 3,
        pointBackgroundColor: 'rgba(0, 0, 255, 1)',
        pointBorderColor: 'rgba(0, 0, 255, 1)',
    }, {
        label: 'Harald',
        data: [20, 15, 13, 15, 12, 13, 3, 5, 2, 3, 7, 1],
        backgroundColor: [
            'rgba(255, 0, 255, 0)'
        ],
        borderColor: [
            'rgba(255, 0, 255, 1)'
        ],
        borderWidth: 3,
        pointHoverRadius: 10,
        pointBorderWidth: 3,
        pointBackgroundColor: 'rgba(255, 0, 255, 1)',
        pointBorderColor: 'rgba(255, 0, 255, 1)',
    }]
};