import WeatherElement from "./WeatherElement";

let weatherElement = new WeatherElement("2020-08-04 18:00:00", 300, 0.5);

test("Get Date", () => {
    let date = new Date("2020-08-04 18:00:00");
    expect(weatherElement.getDate()).toEqual(date);
});

test("Get Day Name", () => {
    expect(weatherElement.getDayName()).toBe("Tuesday")
});

test("Get Day Short Name", () => {
    expect(weatherElement.getDayShortName()).toBe("Tu")
});

test("Get Hour", () => {
    expect(weatherElement.getHour()).toBe(18)
});

test("Get Temperature", () => {
    expect(parseFloat(weatherElement.getTemperature().toFixed(2))).toBe(26.85)
});

test("Get Label Presentation", () => {
    expect(weatherElement.getLabelPresentation()).toBe("18 Tu")
});

test("Get Precipitation Probability", () => {
    expect(weatherElement.getPrecipitationProbability()).toBe(0.5)
});