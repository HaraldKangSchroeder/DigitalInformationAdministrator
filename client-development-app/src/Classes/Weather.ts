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
    
    addWeatherElement(weatherElement : WeatherElement){
        this.weatherData.push(weatherElement);
    }

    getList(){
        return this.weatherData;
    }

    getDays(){
        let days : number[] = [];
        for(let weatherElement of this.weatherData){
            let day = weatherElement.getDate().getDay();
            if(!days.includes(day)){
                days.push(day);
            }
        }
        return days;
    }

    getWeatherOnDay(day : number) : Weather{
        let weather = new Weather(null);
        for(let weatherElement of this.weatherData){
            if(day === weatherElement.getDate().getDay()){
                weather.addWeatherElement(weatherElement);
            }
        }
        let weatherElementAtMidnight = this.getWeatherElementOnDayAndHour((day + 1) % 7, 0);
        if(weatherElementAtMidnight != null) weather.addWeatherElement(weatherElementAtMidnight);
        return weather;
    }

    getWeatherElementOnDayAndHour(day : number, hour : number){
        for(let weatherElement of this.weatherData){
            if(weatherElement.getDate().getDay() === day && weatherElement.getDate().getHours() == hour){
                return weatherElement;
            }
        }
        return null;
    }

    getTemperatureData() : any[]{
        let temperatureData = [];
        for(let weatherElement of this.weatherData){
            temperatureData.push({"x":weatherElement.getLabelPresentation(), temperature : weatherElement.getTemperature()})
        }
        return temperatureData;
    }

    getPrecipitationProbabilityData() : any[]{
        let precipitationProbabilityData = [];
        for(let weatherElement of this.weatherData){
            precipitationProbabilityData.push({"x":weatherElement.getLabelPresentation(), precipitationProbability : weatherElement.getPrecipitationProbability()})
        }
        return precipitationProbabilityData;
    }

    readDataset(dataEntries : any){
        for(let dataEntry of dataEntries){
            let weatherElement = new WeatherElement(dataEntry.dt_txt, dataEntry.main.feels_like, dataEntry.pop);
            this.weatherData.push(weatherElement);
        }
    }
}