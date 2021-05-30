import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import Weather from "./Classes/Weather";
import NavBar from "./Components/NavBar";
import socket from "./socket";
import { Line } from 'react-chartjs-2';


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
                <Grid item xs={11} style={{padding:"20px"}}>
                    <Line
                        data={{ labels: getWeatherLabels(weather), datasets: getWeatherDatasets(weather)}}
                        type="line"
                        options={{
                            // maintainAspectRatio: false,
                            scales: {
                                xAxis: {
                                    title: {
                                        color: 'red',
                                        display: true,
                                        text: 'Time'
                                    },
                                    id: "xAxis",
                                },
                                Temperature: {
                                    title: {
                                        color: 'green',
                                        display: true,
                                        text: 'Temperature'
                                    },
                                    position:"left",
                                    id: "Temperature",
                                    suggestedMin: 0,
                                    suggestedMax: 30
                                },
                                PrecipitationProbability: {
                                    title: {
                                        color: 'red',
                                        display: true,
                                        text: 'Precipitation Probability'
                                    },
                                    position: "right",
                                    id: "PrecipitationProbability",
                                    suggestedMin: 0,
                                    suggestedMax: 1
                                },
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

function getWeatherLabels(weather : Weather){
    if(weather == null) return [];
    let labels : string[] = [];
    for(let weatherElement of weather.getList()){
        labels.push(weatherElement.getLabelPresentation());
    }
    return labels;
}

function getWeatherDatasets(weather : Weather){
    if(weather == null) return [];
    console.log(getWeatherTemperatureDatasets(weather));
    console.log(getWeatherPrecipitationProbabilityDatasets(weather));
    return [
        ...getWeatherTemperatureDatasets(weather), 
        ...getWeatherPrecipitationProbabilityDatasets(weather)
    ];
}

function getWeatherTemperatureDatasets(weather : Weather) : any[][]{
    let datasets : any[][] = [];
    let days = weather.getDays();
    for(let i = 0; i < days.length; i++){
        let weatherOnDay = weather.getWeatherOnDay(days[i]);
        let temperatureData = weatherOnDay.getTemperatureData();
        let color = `rgba(0,${255 - i * 50},0,1)`;
        let dataset = getDataset(days[i].toString(),"Temperature", temperatureData, "temperature", color);
        datasets.push(dataset);
    }
    return datasets;
}

function getWeatherPrecipitationProbabilityDatasets(weather: Weather) : any[][]{
    let datasets : any[][] = [];
    let days = weather.getDays();
    for(let i = 0; i < days.length; i++){
        let weatherOnDay = weather.getWeatherOnDay(days[i]);
        let precipitationProbabilityData = weatherOnDay.getPrecipitationProbabilityData();
        let color = `rgba(${255 - i * 30},0,0,1)`;
        let dataset = getDataset(days[i].toString(),"PrecipitationProbability", precipitationProbabilityData, "precipitationProbability", color);
        datasets.push(dataset);
    }
    return datasets;
}

function getDataset(label : string, yAxisID : string, data : any[], yAxisKey : string, color : string) : any{
    return ({
        label: label,
        yAxisID: yAxisID,
        data: data,
        parsing: {
            yAxisKey: yAxisKey
        },
        lineTension: 0.5,
        // backgroundColor: [
        //     'rgba(255, 0, 255, 0)',
        // ],
        borderColor: [
            color
        ],
        borderWidth: 12,
        // pointHoverRadius: 5,
        // pointBorderWidth: 1,
        // pointBackgroundColor: 'rgba(255, 0, 255, 1)',
        // pointBorderColor: 'rgba(255, 0, 255, 1)',
    })
}
