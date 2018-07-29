'use strict'

const request = require('request-promise-native');
const cheerio = require('cheerio');
const time = require("./time.js");
const playgroundCalendar = require('./playgroundCalendar.js');

let PlaygroundCalendar = playgroundCalendar();
let Time = time();

function init() {

    // console.log(process.argv.slice(2));

    if (process.argv.indexOf('calendar') != -1) {
        const calMonth = Time.getThisMonth();
        const calYear = Time.getThisYear();

        PlaygroundCalendar.getCalendar(calMonth, calYear)
        .then(
            function(calendar) {
                if (process.argv.indexOf('--today') != -1) {
                    console.log('Today', Time.getToday());  
                    PlaygroundCalendar.displayToday(calendar);
                } else if (process.argv.indexOf('--week') != -1) {
                    console.log('This Week', Time.getThisWeek());
                    PlaygroundCalendar.displayWeek(calendar);
                } else if (process.argv.indexOf('--url') != -1) {
                    console.log('Url', PlaygroundCalendar.getCalendarUrl(calMonth, calYear));
                }else {
                    console.log('Today', Time.getToday());
                    PlaygroundCalendar.displayToday(calendar);
                }
            }
        )
        .catch(
            function(error) {
                console.log("Error", error);
            }
        )
    }

    if (process.argv.indexOf('help') != -1) {
        console.log(`Operations
        calendar - retrieves the calendar for the playground theater
            Options:
            --today     returns the show information for today
            --week      returns the show information for the entire week. if today is a sunday than today is the beginning of the week.
                        if today is not a sunday it will back track to the previous sunday and start from there.
            --url       returns the url used to get data
        `);
    }

};

init();