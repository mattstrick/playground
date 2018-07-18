var request = require('request');
var cheerio = require('cheerio');
var time = require("./time.js");
var Time = time();

var getCalendarUrl = getCalendarUrl;
var init = init;
var playground_calendar_params = {
    url:  getCalendarUrl(Time.getThisMonth(), Time.getThisYear()),
    method: 'GET'
};
var playground_calendar;

function getCalendarUrl(month, year) {
    var url = 'http://theplaygroundtheater.com/calendar/?full=1&ajaxCalendar=1&mo='+ month +'&yr='+ year +'&em_ajax=1'
    return url;
};

function formatDay(element) {
    var items = element.find('li');
    items.each(function (i, elem) {
        console.log(playground_calendar(this).text());
    });
}

function getScheduleByDay(day) {
    console.log('GETTING SHOWS FOR - ' + day);

    var element = getElementForDay(day);
    formatDay(element);
    return day;
};

function getElementForDay(day) {
    // http://theplaygroundtheater.com/2017-08-20/?limit
    var dayElement = playground_calendar('a[href="http://theplaygroundtheater.com/' + day + '/?limit"]').parent();
    // console.log(dayElement.html());
    return dayElement;
};

function getToday () {
    console.log('GETTING TODAY\'S SHOWS')

    getScheduleByDay(Time.convertMomentToDay(Time.getToday()));    
};


function getWeek() {
    var week = Time.getThisWeek();
    for (day in week) {
        getScheduleByDay(week[day]);
    }
};

function init() {
    // Today
    console.log('Today', Time.getToday());
    // This Week
    console.log('This Week', Time.getThisWeek());
    console.log('----------------------');

    console.log('REQUESTING CALENDAR', getCalendarUrl(Time.getThisMonth(), Time.getThisYear()));

    request(playground_calendar_params, function(err, res, body) {  
        if (err) { return console.log("ERROR",err) };

        playground_calendar = cheerio.load(res.body);
        // console.log(playground_calendar.html());
        getToday();
        // getScheduleByDay(Time.convertMomentToDay(Time.getToday()));
        getWeek();
    });
};

init();