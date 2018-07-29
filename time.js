var moment = require('moment');

function Time () {  
    var thisWeek = [];
    var nextWeek = [];
    var today = -1;
    var isSunday = isSunday;
    var getPreviousSunday = getPreviousSunday;

    function getPreviousSunday(day) {
        // TODO
        console.log('WRITE ME');
    };

    function isSunday() {
        return getToday().day() === 0;
    };

    this.getToday = function() {
        if (today === -1) {
            today = moment();
        }

        return today;
    };

    this.getThisWeek = function() {
        var start;
        var offset;
        var weekArr = [];

        if(thisWeek.length != 0) {
            return thisWeek;
        }

        // Roll back to the closest Sunday
        offset = getToday().day();
        start = moment().subtract(offset, 'day');

        // Add days until we hit a Sunday
        weekArr.push(start.add(0, 'day').format('YYYY[-]MM[-]DD'));

        for(i=0; i< 6; i++) {
            weekArr.push(start.add(1, 'day').format('YYYY[-]MM[-]DD'));
        }

        // console.log("day of week for end", start.day());
        thisWeek = weekArr;

        return thisWeek;
    };

    this.getNextWeek = function() {
        // TODO
        console.log('WRITE ME');
    };

    this.getThisMonth = function() {
        return moment().month() + 1;
    };

    this.getThisYear = function() {
        return moment().year();
    };

    this.convertDayToMoment = function(day) {
        return moment(day);
    }

    this.convertMomentToDay = function(_moment) {
        return _moment.format('YYYY[-]MM[-]DD');
    }

    return this;
}

// Testing
var temp = Time();
var _day = temp.getToday();
var _string = temp.convertMomentToDay(_day);
var _moment = temp.convertDayToMoment(_string);
// console.log(_day);
// console.log(_string);
// console.log(_moment);
// console.log(temp.getThisWeek());

module.exports = Time;
