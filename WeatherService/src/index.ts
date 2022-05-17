import express from 'express';
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
    res.send('WEATHER PROVIDER');
});

app.post("/getWeatherData", async (req, res) => {
    if (!(process.env.KEY === req.body.token)) return res.status(401).send("Unauthorized");
    let uri = `http://api.openweathermap.org/data/2.5/forecast?lat=${process.env.LOCATION_LAT}&lon=${process.env.LOCATION_LON}&appid=${process.env.API_KEY}`;
    let { data } = await axios.get(uri);
    res.send(data);
});

app.listen(port, () => {
    return console.log(`server is listening at port ${port}`);
});