exports.getWeekNumberByDate = (d) => {
    var copiedDate = new Date(d.getTime());
    // set hours to 6 to prevent having 00:00 which is ambigious
    copiedDate.setHours(6);
    var onejan = new Date(copiedDate.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((copiedDate.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay()) / 7);
};

exports.getMillisecondsByMinute = (min) => {
    return min * 60000;
}

exports.logDivider = () => {
    console.log("------------------------");
}