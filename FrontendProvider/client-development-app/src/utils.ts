const MAX_SATURATION = 100;
const MAX_HUE = 360;

function getHslList(length: number, lightness: number, meanSaturation: number) {
    let hslList: string[] = [];
    for (let i = 0; i < length; i++) {
        let hue = (i / length) * MAX_HUE;
        let saturation = meanSaturation + Math.sin(i * 1.5) * (MAX_SATURATION - meanSaturation);
        hslList.push(getHsl(hue, saturation, lightness));
    }
    deterministicShuffle(hslList);
    return hslList;
}

function getHsl(hue: number, saturation: number, lightness: number): string {
    return `hsla(${hue},${saturation}%,${lightness}%,1)`;
}

function deterministicShuffle(list: any[]) {
    deterministicShuffleIteration(list, 2);
    deterministicShuffleIteration(list, 3);
}

function deterministicShuffleIteration(list: any[], distFactor: number) {
    let dif = Math.max(Math.floor(list.length / distFactor), 1);
    for (let i = list.length - 1; i > 0; i--) {
        const j = i % 2 === 0 ? mod(i - dif, list.length) : mod(i + dif, list.length);
        [list[i], list[j]] = [list[j], list[i]];
    }
}

function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

export function getDayName(dayNum: number) {
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

export function round2Digits(num: number): number {
    return Math.round(num * 100) / 100;
}

const taskColors = getHslList(30, 80, 93);
const userColors = getHslList(10, 50, 85);
export { taskColors, userColors }
