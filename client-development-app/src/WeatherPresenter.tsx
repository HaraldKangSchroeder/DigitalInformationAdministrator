import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import Weather from "./Classes/Weather";
import NavBar from "./Components/NavBar";
import socket from "./socket";


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
    },[]);

    return (
        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                <Grid item xs={11}>
                
                </Grid>
            </Grid>
        </div>
    )
}