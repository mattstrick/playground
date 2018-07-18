const request = require('request');
const cheerio = require('cheerio');
const time = require("./time.js");

var Time = time();

var PlaygroundCalendar = function() {
    var calendar;

    this.getXHRParams = function (month, year) {
        return {
            url:  getCalendarUrl(month, year),
            method: 'GET'
        }
    };

    this.getCalendarUrl = function (month, year) {
        var url = 'http://theplaygroundtheater.com/calendar/?full=1&ajaxCalendar=1&mo='+ month +'&yr='+ year +'&em_ajax=1'
        return url;
    };

    this.displayToday = function () {
        console.log('GETTING TODAY\'S SHOWS')
    
        getScheduleByDay(Time.convertMomentToDay(Time.getToday()));  
        displaySectionBreak();  
    };

    this.displayWeek = function () {
        var week = Time.getThisWeek();
        for (day in week) {
            getScheduleByDay(week[day]);
        }
        displaySectionBreak();
    };

    this.getCalendar = function (month, year) {
        return request(getXHRParams(month, year), 
            function(err, res, body) {  
                if (err) { return console.log("ERROR",err) };

                calendar = cheerio.load(res.body);
                displayToday();
                getPerformingTeamsByDay(Time.convertMomentToDay(Time.getToday()));
                displaySectionBreak();
                displayWeek();
                getPerformingTeamsByWeek();

                return calendar;
            }
        );
    }

    function getPerformingTeamsByWeek() {
        var week = Time.getThisWeek();

        for (day in week) {
            getPerformingTeamsByDay(week[day]);
        }
        displaySectionBreak();
    }

    function getPerformingTeamsByDay(day) {
        var dayObj;
        var teams;

        console.log('GETTING TEAMS FOR - ' + day);
        dayObj = getScheduleByDay(day);
        teams = dayObj.find('.opening-teams');

        console.log('TEAMS GO HERE');
        teams.each(function (i, elem) {
            // console.log(calendar(this).text());
            if (hasPerformingTeams(teams)) {
                formatTeams(calendar(this).html());
            } else {
                console.log('NO TEAMS HERE');
            }
        });
    }

    function hasPerformingTeams(show) {
        return calendar(show).text() != '';
    }

    function formatTeams (text) {
        // return text.split('<br>');
        var lines = text.replace(/<br>/gi, ', ');
        console.log(lines);
    }

    function getScheduleByDay(day) {
        console.log('GETTING SHOWS FOR - ' + day);
    
        var element = getElementForDay(day);
        formatDay(element);
        return element;
    };

    function displaySectionBreak() {
        console.log('---------------------');
    }

    function formatDay(element) {
        var items = element.find('li');
        items.each(function (i, elem) {
            console.log(calendar(this).text());
        });
    }

    function getElementForDay(day) {
        // http://theplaygroundtheater.com/2017-08-20/?limit

        var dayElement = calendar('a[href="http://theplaygroundtheater.com/' + day + '/?limit"]').parent();
        // // console.log(dayElement.html());
        return dayElement;
    };

    return this;
}

module.exports = PlaygroundCalendar;