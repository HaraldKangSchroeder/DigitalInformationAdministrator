import {getTimeRepresentation} from "./Clock";

test('Navbar : Test time representation', () => {
    let year = 2016;
    let month = 11; //december
    let day = 17;
    let hours = 20;
    let minutes = 16;
    const date = new Date(year, month, day, hours, minutes, 0, 0);
    let timeRepresentation = getTimeRepresentation(date);
    expect(timeRepresentation).toBe(`${hours}:${minutes}`);
});