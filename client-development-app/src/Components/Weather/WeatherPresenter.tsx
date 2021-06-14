import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import Weather from "../../Classes/Weather";
import NavBar from "../Navbar/NavBar";
import socket from "../../socket";
import { Line } from 'react-chartjs-2';
import { getDayName } from "../../utils";

const CHART_BACKGROUND_COLOR1 = "rgba(130,130,130,0.35)";
const CHART_BACKGROUND_COLOR2 = "rgba(100,100,100,0.35)";
const CHART_BACKGROUND_COLORS = [CHART_BACKGROUND_COLOR1,CHART_BACKGROUND_COLOR2,CHART_BACKGROUND_COLOR1,CHART_BACKGROUND_COLOR2,CHART_BACKGROUND_COLOR1,CHART_BACKGROUND_COLOR2];

export default function WeatherPresenter() {
    const [weather, setWeather] = useState(new Weather(null));

    useEffect(() => {
        socket.on("weatherData", data => {
            setWeather(new Weather(data.list));
        });

        socket.emit("getWeatherData");

        return () => {
            socket.off("weatherData");
        }
    }, []);

    return (
        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                {/* <Grid item xs={1} /> */}
                <Grid item xs={11} style={{ padding: "20px" }}>
                    <Line
                        data={{ labels: getWeatherLabels(weather), datasets: getWeatherDatasets(weather) }}
                        type="line"
                        options={{
                            // maintainAspectRatio: false,
                            plugins: { //https://github.com/reactchartjs/react-chartjs-2/issues/86
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                xAxis: {
                                    title: {
                                        color: 'rgb(200,200,200)',
                                        display: true,
                                        text: 'Time'
                                    },
                                    ticks: {
                                        color: 'rgb(200,200,200)',
                                    },
                                    id: "xAxis",
                                },
                                Temperature: {
                                    title: {
                                        color: 'rgb(0,255,0)',
                                        display: true,
                                        text: 'Temperature Celsius'
                                    },
                                    ticks: {
                                        color: 'rgb(200,200,200)',
                                        stepSize : 3,
                                    },
                                    position: "left",
                                    id: "Temperature",
                                    suggestedMin: 0,
                                    suggestedMax: 30
                                },
                                PrecipitationProbability: {
                                    title: {
                                        color: 'rgb(255,0,0)',
                                        display: true,
                                        text: 'Precipitation Probability'
                                    },
                                    ticks: {
                                        color: 'rgb(200,200,200)',
                                    },
                                    position: "right",
                                    id: "PrecipitationProbability",
                                    suggestedMin: 0,
                                    suggestedMax: 1
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

function getWeatherLabels(weather: Weather) {
    if (weather == null) return [];
    let labels: any[] = [];
    for (let weatherElement of weather.getList()) {
        labels.push(weatherElement.getLabelPresentation());
    }
    return labels;
}

function getWeatherDatasets(weather: Weather) {
    if (weather == null) return [];
    console.log(getWeatherTemperatureDatasets(weather, { value: 100 }));
    console.log(getWeatherPrecipitationProbabilityDatasets(weather));
    return [
        ...getWeatherPrecipitationProbabilityDatasets(weather),
        ...getWeatherTemperatureDatasets(weather, { value: 100 }),
        //...getWeatherTemperatureDatasetsDummy(weather, { value: -100 }),
    ];
}

function getWeatherTemperatureDatasets(weather: Weather, fill: any): any[][] {
    let datasets: any[][] = [];
    let days = weather.getDays();
    for (let i = 0; i < days.length; i++) {
        let weatherOnDay = weather.getWeatherOnDay(days[i]);
        let temperatureData = weatherOnDay.getTemperatureData();
        let dataset = getDataset(" " + getDayName(days[i]) + " Temperature", "Temperature", temperatureData, "temperature", "rgb(0,255,0)", CHART_BACKGROUND_COLORS[i], fill,8);
        datasets.push(dataset);
    }
    return datasets;
}

function getWeatherTemperatureDatasetsDummy(weather: Weather, fill: any): any[][] {
    let datasets: any[][] = [];
    let days = weather.getDays();
    for (let i = 0; i < days.length; i++) {
        let weatherOnDay = weather.getWeatherOnDay(days[i]);
        let temperatureData = weatherOnDay.getTemperatureData();
        let dataset = getDatasetDummy("Temperature", temperatureData, "temperature", CHART_BACKGROUND_COLORS[i]);
        datasets.push(dataset);
    }
    return datasets;
}

function getWeatherPrecipitationProbabilityDatasets(weather: Weather): any[][] {
    let datasets: any[][] = [];
    let days = weather.getDays();
    for (let i = 0; i < days.length; i++) {
        let weatherOnDay = weather.getWeatherOnDay(days[i]);
        let precipitationProbabilityData = weatherOnDay.getPrecipitationProbabilityData();
        let dataset = getDataset(" " + getDayName(days[i]) + " PrecProb", "PrecipitationProbability", precipitationProbabilityData, "precipitationProbability", "rgb(255,0,0)", null, false,0);
        datasets.push(dataset);
    }
    return datasets;
}

function getDataset(label: string, yAxisID: string, data: any[], yAxisKey: string, color: string, backgroundColor : string, fill: any, pointRadius : number): any {
    return ({
        label: label,
        yAxisID: yAxisID,
        data: data,
        parsing: {
            yAxisKey: yAxisKey
        },
        lineTension: 0.5,
        borderColor: color,
        borderWidth: 8,
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius * 2,
        pointBackgroundColor: color,
        fill: fill,
        backgroundColor: backgroundColor != null ? backgroundColor : "",
    })
}

function getDatasetDummy(yAxisID: string, data: any[], yAxisKey: string, backgroundColor: string): any {
    return ({
        label: "",
        yAxisID: yAxisID,
        data: data,
        parsing: {
            yAxisKey: yAxisKey
        },
        lineTension: 0.5,
        borderWidth: 0.1,
        fill: true,
        backgroundColor: backgroundColor,
        pointRadius: 0,
    })
}
