import { Line } from "react-chartjs-2";
import Weather from "../../Classes/Weather";
import { getDayName } from "../../utils";

const CHART_BACKGROUND_COLOR1 = "rgba(130,130,130,0.35)";
const CHART_BACKGROUND_COLOR2 = "rgba(100,100,100,0.35)";
const CHART_BACKGROUND_COLORS = [CHART_BACKGROUND_COLOR1, CHART_BACKGROUND_COLOR2, CHART_BACKGROUND_COLOR1, CHART_BACKGROUND_COLOR2, CHART_BACKGROUND_COLOR1, CHART_BACKGROUND_COLOR2];

interface Props {
    weather: Weather
    selectedDay: number
}

export default function WeatherGraph({ weather, selectedDay }: Props) {

    return (
        <div style={{ width: "100%", height: "70vh" }}>
            <Line
                data={{ labels: weather.getLabels(selectedDay), datasets: getWeatherDatasets(weather, selectedDay) }}
                type="line"
                options={{
                    maintainAspectRatio: false,
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
                                stepSize: 3,
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
        </div>
    )
}

function getWeatherDatasets(weather: Weather, selectedDay: number) {
    if (weather == null) return [];
    return [
        ...getWeatherPrecipitationProbabilityDatasets(weather, selectedDay),
        ...getWeatherTemperatureDatasets(weather, selectedDay, { value: 100 }),
    ];
}

function getWeatherTemperatureDatasets(weather: Weather, selectedDay: number, fill: any): any[][] {
    let datasets: any[][] = [];
    let weatherOnDay = weather.getWeather(selectedDay);
    let temperatureData = weatherOnDay.getTemperatureData();
    let dataset = getDataset("Temp in Celsius", "Temperature", temperatureData, "temperature", "rgb(0,255,0)", CHART_BACKGROUND_COLORS[0], fill, 13);
    datasets.push(dataset);
    return datasets;
}

function getWeatherPrecipitationProbabilityDatasets(weather: Weather, selectedDay: number): any[][] {
    let datasets: any[][] = [];
    let weatherOnDay = weather.getWeather(selectedDay);
    let precipitationProbabilityData = weatherOnDay.getPrecipitationProbabilityData();
    let dataset = getDataset(" " + getDayName(selectedDay) + " PrecProb", "PrecipitationProbability", precipitationProbabilityData, "precipitationProbability", "rgb(255,0,0)", null, false, 0);
    datasets.push(dataset);
    return datasets;
}

function getDataset(label: string, yAxisID: string, data: any[], yAxisKey: string, color: string, backgroundColor: string, fill: any, pointRadius: number): any {
    return ({
        label: label,
        yAxisID: yAxisID,
        data: data,
        parsing: {
            yAxisKey: yAxisKey
        },
        lineTension: 0.5,
        borderColor: color,
        borderWidth: 2,
        pointRadius: pointRadius,
        pointHoverRadius: pointRadius * 2,
        pointBackgroundColor: color,
        fill: fill,
        backgroundColor: "rgba(0,0,0,0)",
    })
}