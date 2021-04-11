import React, { useState } from "react";
import { Line } from 'react-chartjs-2';

export function UserCharts(props) {
    const [data, setData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep' , 'Oct', 'Nov', 'Dec'],
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
            pointBorderWidth:3,
            pointBackgroundColor:'rgba(0, 0, 255, 1)',
            pointBorderColor:'rgba(0, 0, 255, 1)',
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
            pointBorderWidth:3,
            pointBackgroundColor:'rgba(255, 0, 255, 1)',
            pointBorderColor:'rgba(255, 0, 255, 1)',
        }]
    });
    return (
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
    )
}