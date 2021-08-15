import { makeStyles } from "@material-ui/core";
import Weather from "../../Classes/Weather";
import { round2Digits } from "../../utils";
import WeatherCard from "./WeatherCard";

const useStyles = makeStyles({
    root: {
        display: "flex",
        width: "100%",
        height: "20vh",
        alignItems: "center",
        justifyContent: "space-around"
    }
})

interface Props {
    weather: Weather,
    selectedDay : number,
    setSelectedDay : Function,
}

export default function WeatherCards({ weather ,selectedDay, setSelectedDay}: Props) {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                weather.getDays().map(day =>
                    <WeatherCard
                        dayName={weather.getDayName(day)}
                        averageTemperature={round2Digits(weather.getAverageTemperatureOnDay(day))}
                        averagePrecipitationProbability={round2Digits(weather.getAveragePrecipitationProbabilitiesOnDay(day))}
                        setSelectedDay={() => {setSelectedDay(day)}}
                        isSelectedDay={day === selectedDay}
                    />
                )
            }
        </div>
    );
}