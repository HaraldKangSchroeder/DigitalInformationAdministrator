import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import Weather from "../../Classes/Weather";
import NavBar from "../Navbar/NavBar";
import WeatherCards from "./WeatherCards";
import WeatherGraph from "./WeatherGraph";
import axios from "axios";

export default function WeatherView() {
    const [weather, setWeather] = useState(new Weather());
    const [selectedDay, setSelectedDay] = useState(0);

    useEffect(() => {
        const getData = async () => {
            try {
                let { data } = await axios.post(process.env.REACT_APP_WEATHER_SERVICE_URL + "/getWeatherData", {
                    token: process.env.REACT_APP_WEATHER_SERVICE_TOKEN
                });
                setWeather(new Weather(data.list));
            }
            catch (e) {
                console.error("Failed to get weather data");
            }
        }

        const interval = setInterval(() => {
            getData();
        }, 10800000);

        getData();

        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (weather.getList().length === 0) return;
        setSelectedDay(weather.getList()[0].getDate().getDay());
    }, [weather]);

    return (
        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                <Grid item xs={11} style={{ padding: "30px" }}>
                    <Grid item container xs={12}>
                        <Grid item xs={12}>
                            <WeatherCards weather={weather} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
                        </Grid>
                        <Grid item xs={12}>
                            <WeatherGraph weather={weather} selectedDay={selectedDay} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

