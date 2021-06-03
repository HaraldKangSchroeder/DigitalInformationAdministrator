exports.getWeekNumberByDate = (d) => {
    // TODO seems like on saturday a new week begins already
    var onejan = new Date(d.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((d - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
};

exports.getMillisecondsByMinute = (min) => {
    return min * 60000;
}

exports.logDivider = () => {
    console.log("------------------------");
}