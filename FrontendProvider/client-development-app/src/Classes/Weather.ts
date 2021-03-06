import WeatherElement from "./WeatherElement";

export default class Weather {
    weatherData: WeatherElement[];

    constructor(dataEntries?: any) {
        this.weatherData = [];
        if (dataEntries != null) {
            this.readDataset(dataEntries);
        }
    }

    addWeatherElement(weatherElement: WeatherElement) {
        this.weatherData.push(weatherElement);
    }

    getList() {
        return this.weatherData;
    }

    getDays() {
        let days: number[] = [];
        for (let weatherElement of this.weatherData) {
            let day = weatherElement.getDate().getDay();
            if (!days.includes(day)) {
                days.push(day);
            }
        }
        return days;
    }

    getDayName(day: number): string {
        switch (day) {
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

    getAverageTemperature(day: number): number {
        let temperatures: number[] = [];
        for (let weatherElement of this.weatherData) {
            if (day === weatherElement.getDate().getDay()) {
                temperatures.push(weatherElement.getTemperature());
            }
        }
        if (temperatures.length === 0) return 0;

        let sum = 0;
        for (let temperature of temperatures) {
            sum += temperature;
        }
        return sum / temperatures.length;
    }

    getAveragePrecipitationProbabilities(day: number): number {
        let precipitationProbabilities: number[] = [];
        for (let weatherElement of this.weatherData) {
            if (day === weatherElement.getDate().getDay()) {
                precipitationProbabilities.push(weatherElement.getPrecipitationProbability());
            }
        }
        if (precipitationProbabilities.length === 0) return 0;

        let sum = 0;
        for (let precipitationProbabilitiy of precipitationProbabilities) {
            sum += precipitationProbabilitiy;
        }
        return sum / precipitationProbabilities.length;
    }

    getWeather(day: number): Weather {
        let weather = new Weather(null);
        for (let weatherElement of this.weatherData) {
            if (day === weatherElement.getDate().getDay()) {
                weather.addWeatherElement(weatherElement);
            }
        }
        let weatherElementAtMidnight = this.getWeatherElement((day + 1) % 7, 0);
        if (weatherElementAtMidnight != null) weather.addWeatherElement(weatherElementAtMidnight);
        return weather;
    }

    getWeatherElement(day: number, hour: number) {
        for (let weatherElement of this.weatherData) {
            if (weatherElement.getDate().getDay() === day && weatherElement.getDate().getHours() == hour) {
                return weatherElement;
            }
        }
        return null;
    }

    getTemperatureData(): any[] {
        let temperatureData = [];
        for (let weatherElement of this.weatherData) {
            temperatureData.push({ "x": weatherElement.getLabelPresentation(), temperature: weatherElement.getTemperature() })
        }
        return temperatureData;
    }

    getPrecipitationProbabilityData(): any[] {
        let precipitationProbabilityData = [];
        for (let weatherElement of this.weatherData) {
            precipitationProbabilityData.push({ "x": weatherElement.getLabelPresentation(), precipitationProbability: weatherElement.getPrecipitationProbability() })
        }
        return precipitationProbabilityData;
    }

    getLabels(day: number) {
        let labels: any[] = [];
        for (let weatherElement of this.weatherData) {
            if (weatherElement.getDate().getDay() === day) {
                labels.push(weatherElement.getLabelPresentation());
            }
        }
        return labels;
    }

    readDataset(dataEntries: any) {
        for (let dataEntry of dataEntries) {
            let weatherElement = new WeatherElement(dataEntry.dt_txt, dataEntry.main.feels_like, dataEntry.pop);
            this.weatherData.push(weatherElement);
        }
    }
}