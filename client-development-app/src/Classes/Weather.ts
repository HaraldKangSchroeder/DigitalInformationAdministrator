import WeatherElement from "./WeatherElement";

export default class Weather {
    weatherData : WeatherElement[];

    constructor(dataEntries : any){
        this.weatherData = [];
        if(dataEntries != null){
            this.readDataset(dataEntries);
            console.log(this.weatherData);
        }
    }

    getList(){
        return this.weatherData;
    }

    readDataset(dataEntries : any){
        for(let dataEntry of dataEntries){
            let weatherElement = new WeatherElement(dataEntry.dt_txt, dataEntry.main.feels_like, dataEntry.pop);
            this.weatherData.push(weatherElement);
        }
    }
}