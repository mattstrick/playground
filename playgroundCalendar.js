const request = require('request-promise-native');
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

    this.displayToday = function (cal) {
        console.log('GETTING TODAY\'S SHOWS')
    
        getScheduleByDay(cal, Time.convertMomentToDay(Time.getToday()));  
        displaySectionBreak();  
    };

    this.displayWeek = function (cal) {
        let week = Time.getThisWeek();
        for (day in week) {
            getScheduleByDay(cal, week[day]);
        }
        displaySectionBreak();
    };

    this.getCalendar = function (month, year) {
        let params = getXHRParams(month, year);
        
        return request(params.url)
        .then(
            function(res) { 
                // console.log(res); 
                calendar = cheerio.load(res);
                
                return calendar;
            }
        )
        .catch(
            function(err) {  
                console.log("ERROR",err);
                return err;
            }
        );
    }

    function getPerformingTeamsByWeek() {
        let week = Time.getThisWeek();

        for (day in week) {
            getPerformingTeamsByDay(week[day]);
        }
        displaySectionBreak();
    }

    function getPerformingTeamsByDay(cal, day) {
        var dayObj;
        var teams;

        console.log('GETTING TEAMS FOR - ' + day);
        dayObj = getScheduleByDay(cal, day);
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

    function formatTeams(text) {
        // return text.split('<br>');
        var lines = text.replace(/<br>/gi, ', ');
        console.log(lines);
    }

    function getScheduleByDay(cal, day) {
        console.log('GETTING SHOWS FOR - ' + day);
    
        var element = getElementForDay(cal, day);
        formatDay(cal, element);
        return element;
    };

    function displaySectionBreak() {
        console.log('---------------------');
    }

    function formatDay(cal, element) {
        var items = element.find('li');
        items.each(function (i, elem) {
            console.log(cal(this).text());
        });
    }

    function getElementForDay(cal, day) {
        // http://theplaygroundtheater.com/2017-08-20/?limit

        var dayElement = cal('a[href="http://theplaygroundtheater.com/' + day + '/?limit"]').parent();
        // console.log(dayElement.html());
        return dayElement;
    };

    return this;
}

module.exports = PlaygroundCalendar;