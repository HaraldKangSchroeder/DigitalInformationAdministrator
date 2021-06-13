exports.getWeekNumberByDate = (d) => {
    var copiedDate = new Date(d.getTime());
    // add one day => week will then already start at sunday
    copiedDate.setDate(d.getDate() + 1);
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