export default class WeatherElement {
    date: Date;
    temperature: number;
    precipitationProbability: number;

    constructor(dateText: string, temperatureCelvin: number, precipitationProbability: number) {
        this.date = new Date(dateText);
        this.temperature = temperatureCelvin - 273.15;
        this.precipitationProbability = precipitationProbability;
    }

    getDate(): Date {
        return this.date;
    }

    getDayName(): string {
        let dayNum = this.date.getDay();
        switch (dayNum) {
            case 0:
                return "Sunday"
            case 1:
                return "Monday"
            case 2:
                return "Tuesday"
            case 3:
                return "Wednesday"
            case 4:
                return "Thursday"
            case 5:
                return "Friday"
            default:
                return "Saturday"
        }
    }

    getDayShortName() : string {
        let dayName = this.getDayName();
        return dayName.substring(0,2);
    }

    getHour() : number {
        return this.date.getHours();
    }

    getTemperature(): number {
        return this.temperature;
    }

    getLabelPresentation() : string {
        return `${this.getHour()} ${this.getDayShortName()}`;
        // return [this.getHour(), this.getDayShortName()]
    }

    getPrecipitationProbability(): number {
        return this.precipitationProbability;
    }
}