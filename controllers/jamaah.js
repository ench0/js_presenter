// // Read Synchronously
// var fs = require("fs");

// file = './public/js/db/jamaah.json';

// module.exports = JSON.parse(fs.readFileSync(file, 'utf8'));
var timetable = require('../controllers/timetable');
var time = require('../controllers/time');


jamaah = 
    [
        {   id:                     0,
            name:                   "fajr",
            method:                 "beforenext",
            prayer_hour:            time.fajrTime,
            prayer_minute:          58,
            jamaah_time:            "7:20",
            jamaah_offset_calc:     82,
            jamaah_hour_offset:     0,
            jamaah_minute_offset:   20,
        },
        {   id:                     1,
            name:                   "shurooq",
            method:                 "beforenext",
            prayer_hour:            5,
            prayer_minute:          58,
            jamaah_time:            "7:20",
            jamaah_offset_calc:      82,
            jamaah_hour_offset:     0,
            jamaah_minute_offset:   20,
        },
        {   id:                     2,
            name:                   "dhuhr",
            method:                 "beforenext",
            prayer_hour:            5,
            prayer_minute:          58,
            jamaah_time:            "7:20",
            jamaah_offset_calc:      82,
            jamaah_hour_offset:     0,
            jamaah_minute_offset:   20,
        },
         {   id:                 3,
            name:               "asr",
            method:             "beforenext",
            prayer_hour:        5,
            prayer_minute:      58,
            jamaah_time:        "7:20",
            jamaah_offset_calc:      82,
            jamaah_hour_offset:   0,
            jamaah_minute_offset: 20,
        },
        {   id:                 4,
            name:               "maghrib",
            method:             "beforenext",
            prayer_hour:        5,
            prayer_minute:      58,
            jamaah_time:        "7:20",
            jamaah_offset_calc:      82,
            jamaah_hour_offset:   0,
            jamaah_minute_offset: 20,
        },
        {   id:                 5,
            name:               "isha",
            method:             "beforenext",
            prayer_hour:        5,
            prayer_minute:      58,
            jamaah_time:        "7:20",
            jamaah_offset_calc:      82,
            jamaah_hour_offset:   0,
            jamaah_minute_offset: 20,
        }
    ];

module.exports = jamaah;