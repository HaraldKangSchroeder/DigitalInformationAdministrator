const axios = require('axios');
const { getMillisecondsByMinute } = require("./utils");

const UPDATE_TIME_STEP_MIN = 60;
let interval = null;

exports.startUpdateWeatherData = async (io) => {
    await updateWeatherData(io);
    interval = setInterval(async () => {
        await updateWeatherData(io);
    }, getMillisecondsByMinute(UPDATE_TIME_STEP_MIN));
}

async function updateWeatherData(io) {
    try {
        let data = await getWeatherData();
        if(!data) return;
        io.emit("weatherData", data);
    }
    catch (e) {
        console.error(e);
        console.error("updateWeatherData failed");
    }
}

async function getWeatherData() {
    try {
        let uri = `http://api.openweathermap.org/data/2.5/forecast?lat=${process.env.WEATHER_LOCATION_LAT}&lon=${process.env.WEATHER_LOCATION_LON}&appid=${process.env.WEATHER_API_KEY}`;
        let {data} = await axios.get(uri);
        return data;
    }
    catch (e) {
        console.error(e);
        console.error("getWeatherData failed");
        return null;
    }
}

exports.setupSocketListeners = (socket) => {
    socket.on("getWeatherData", async () => {
        let data = await getWeatherData();
        socket.emit("weatherData", data);
    });
}