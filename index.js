const request = require('request');
const cheerio = require('cheerio');
const time = require("./time.js");
const playgroundCalendar = require('./playgroundCalendar.js');

var PlaygroundCalendar = playgroundCalendar();
var Time = time();

function init() {
    console.log('Today', Time.getToday());
    console.log('This Week', Time.getThisWeek());
    console.log('----------------------');

    console.log('REQUESTING CALENDAR', PlaygroundCalendar.getCalendarUrl(Time.getThisMonth(), Time.getThisYear()));

    var calendar = PlaygroundCalendar.getCalendar(Time.getThisMonth(), Time.getThisYear());
};

init();