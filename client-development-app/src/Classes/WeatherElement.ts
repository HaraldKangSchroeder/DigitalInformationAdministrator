export default class WeatherElement {
    date : Date;
    temperature : number;
    precipitationProbability : number;

    constructor(dateText : string, temperature : number, precipitationProbability : number){
        this.date = new Date(dateText);
        this.temperature = temperature;
        this.precipitationProbability = precipitationProbability;
    }

    getDate() : Date {
        return this.date;
    }

    getTemperature() : number {
        return this.temperature;
    }

    getPrecipitationProbability() : number {
        return this.precipitationProbability;
    }
}