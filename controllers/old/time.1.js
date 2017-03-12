var moment = require('moment');
moment.tz = require('moment-timezone');
var timetable = require('../controllers/timetable');
var jamaah = require('../controllers/jamaah');
var settings = require('../controllers/settings');

// settings = JSON.stringify(settings);
// settings = JSON.parse(settings);

times = function() {

	// var nextDay = nextDay;

	// now
	var now = moment().tz("Europe/Dublin").add(nextDay, 'd');;
	// leap
	if (now.year()%4 == 0) var leap = true; else var leap = false;
	// console.log(leap);

	// dayOfYear
	var dayOfYear = now.dayOfYear();
	if (leap == true) daysInYear = 366; else daysInYear = 365;
	// console.log(dayOfYear);
	if (leap == false & dayOfYear > 59) dayOfYear += 1;


	// prayerTimes
	var prayerTimes = timetable[dayOfYear];
	// console.log(timetable);


	// prayerString
	prayerStrings = function(){
		array = [];
		for(i=0;i<6;i++) {
			// array.push(now.year()+'-'+(now.month()+1)+'-'+now.date()+' '+prayerTimes[i])
		}
		return array;
	}
	prayerStrings = prayerStrings();


	// prayerTimes
	prayerTimes = function(){
		var array = [];
		for(i=0;i<6;i++) {
			time = moment(prayerStrings[i],"YYYY-M-D hh:mm");
			// time = moment(time).format("HH:mm");
			array.push(time)
		}
		return array;
	}
	prayerTimes = prayerTimes();

			// console.log(prayerTimes[0])

	// jummuahTimeStr
	var jummuahTimeStr = now.year()+'-'+(now.month()+1)+'-'+now.date()+' '+settings.jummuahtime;
	// jummuahTime
	var jummuahTime = moment(jummuahTimeStr,"YYYY-M-D hh:mm");


	// midnightTimePass
	// var midnightTimePass = moment(now.clone().startOf('day'));
	var midnightTimePass = moment().startOf('day');
	// midnightTimeNext
	// var midnightTimeNext = now.clone().endOf('day');
	var midnightTimeNext = moment().endOf('day');








	/********** Next Prayer **********/
	var checkBeforeFajr = moment(now).isBefore(prayerTimes[0]);
	var checkBeforeShurooq = moment(now).isBefore(prayerTimes[1]);
	var checkBeforeDhuhr = moment(now).isBefore(prayerTimes[2]);
	var checkBeforeAsr = moment(now).isBefore(prayerTimes[3]);
	var checkBeforeMaghrib = moment(now).isBefore(prayerTimes[4]);
	var checkBeforeIsha = moment(now).isBefore(prayerTimes[5]);
	var checkBeforeMidnight = moment(now).isBefore(midnightTimeNext);
	
	if (checkBeforeMidnight == true) {
		var nextPrayerName = "fajr";
		var nextPrayerTime = prayerTimes[0];
		var currentPrayerName = "isha";
		var currentPrayerTime = prayerTimes[5];
		var nextDay = 1;
	}
	if (checkBeforeIsha == true) {
		var nextPrayerName = "isha";
		var nextPrayerTime = prayerTimes[5];
		var currentPrayerName = "maghrib";
		var currentPrayerTime = prayerTimes[4];
		var nextDay = 0;
	}
	if (checkBeforeMaghrib == true) {
		var nextPrayerName = "maghrib";
		var nextPrayerTime = prayerTimes[4];
		var currentPrayerName = "asr";
		var currentPrayerTime = prayerTimes[3];
		var nextDay = 0;
	}
	if (checkBeforeAsr == true) {
		var nextPrayerName = "asr";
		var nextPrayerTime = prayerTimes[3];
		var currentPrayerName = "dhuhr";
		var currentPrayerTime = prayerTimes[2];
		var nextDay = 0;
	}
	if (checkBeforeDhuhr == true) {
		var nextPrayerName = "dhuhr";
		var nextPrayerTime = prayerTimes[2];
		var currentPrayerName = "duha";
		var currentPrayerTime = prayerTimes[0];
		var nextDay = 0;
	}
	if (checkBeforeShurooq == true) {
		var nextPrayerName = "dhuhr";
		var nextPrayerTime = prayerTimes[2];
		var nextPrayerTime2 = prayerTimes[1];
		var currentPrayerName = "fajr";
		var currentPrayerTime = prayerTimes[0];
		var nextDay = 0;
	}
	if (checkBeforeFajr == true) {
		var nextPrayerName = "fajr";
		var nextPrayerTime = prayerTimes[0];
		var currentPrayerName = "night prayer";
		var currentPrayerTime = midnightTimePass;
		var nextDay = 0;
	}
	
	/********** Ramadan **********/
	if (checkBeforeFajr == true) {
		var fastingTime = moment(prayerTimes[0]);
		var fastingTimeName = "fasting";
	}
	else if (checkBeforeMaghrib == true) {
		var fastingTime = moment(prayerTimes[4]);
		var fastingTimeName = "iftar";
	}
	else {
		var fastingTime = moment(prayerTimes[0]).add(1, 'd');
		var fastingTimeName = "fasting";
	}
	
	
	/********** Countdown **********/
	var countNextPrayerTime = moment.utc(moment(nextPrayerTime).diff(moment(now))).endOf('second').add(1, 's').format("HH:mm:ss");
	var countFastingTime = moment.utc(moment(fastingTime).diff(moment(now))).add(1, 's').format("HH:mm:ss");
	






	// jamaahTimes
	var jamaahMethods = (settings.jamaahmethods).split(",");
	var jamaahOffsetValues = (settings.jamaahoffsets).split(",");
	jamaahTimes = function(){
		var array = [];
		var jamaahOffsetCalc = null;

		for(i=0;i<6;i++) {
			// console.log("method: "+jamaahMethods[i]+" offset: "+jamaahOffset[i]);
			// console.log("prayerTimes: "+(moment(prayerTimes[i])).format("HH:mm"));
			var jamaahOffsetCalc = jamaahOffsetValues[i].split(":");
			jamaahOffsetCalc = Number(jamaahOffsetCalc[0]*60) + Number(jamaahOffsetCalc[1])

			if (jamaahMethods[i] == "afterthis") {
				jamaahOffsetCalc = (moment(prayerTimes[i])).add(jamaahOffsetCalc, 'minutes');
			}
			else if (jamaahMethods[i] == "beforenext") {
				jamaahOffsetCalc = (moment(prayerTimes[i+1])).subtract(jamaahOffsetCalc, 'minutes')
			}
			else if (jamaahMethods[i] == "fixed") {
				var fixedTimestr = now.year()+'-'+(now.month()+1)+'-'+now.date()+' '+jamaahOffsetValues[i];
				jamaahOffsetCalc = moment(fixedTimestr,"YYYY-M-D hh:mm");
			}
			else jamaahOffsetCalc = null;//for shurooq

			array.push(jamaahOffsetCalc)
		}
		return array;
	}
	jamaahTimes = jamaahTimes();



	var hijriOffset = settings.hijrioffset;



	// prayerTimesDisp
	prayerTimesDisp = function(){
		var array = [];
		for(i=0;i<6;i++) {
			array.push(prayerTimes[i].format("HH:mm"))
		}
		return array;
	}
	prayerTimesDisp = prayerTimesDisp();

	// jamaahTimesDisp
	jamaahTimesDisp = function(){
		var array = [];
		for(i=0;i<6;i++) {
			if (jamaahTimes[i]) {
				array.push(jamaahTimes[i].format("HH:mm"))
			}
			else array.push(null);// for shurooq
		}
		return array;
	}
	jamaahTimesDisp = jamaahTimesDisp();


	output = [];
	prayerNames = ["fajr","shurooq","dhuhr","asr","maghrib","isha"]
	for (i=0, names=prayerNames, prayerTimes=prayerTimes, prayerTimesDisp=prayerTimesDisp, jamaahTimes=jamaahTimes, jamaahTimesDisp=jamaahTimesDisp, jamaahMethods=jamaahMethods,jamaahOffsetValues=jamaahOffsetValues; i<6; i++) {
		var jamaahOffsetCalc = jamaahOffsetValues[i].split(":");
		output.push(
			{ 	id: i, name: names[i], 
				prayerTime: prayerTimes[i], prayerTimeDisp: prayerTimesDisp[i],
				jamaahTime: jamaahTimes[i], jamaahTimeDisp: jamaahTimesDisp[i],
				jamaahMethod: jamaahMethods[i], jamaahOffsetHour: jamaahOffsetCalc[0], jamaahOffsetMinute: jamaahOffsetCalc[1]
				
			}
		)
	}

	// console.log(output)


		
	return output;

};

// times();
times = times();

// console.log(times().countNextPrayerTime)
// console.log ("now: "+times.now+"\n"
// 			+"leap: "+times.leap+"\n"
// 			+"dayOfYear: "+times.dayOfYear+"\n"
// 			+"prayerStrings: "+times.prayerStrings+"\n"
// 			+"prayerTimes: "+times.prayerTimes+"\n"

// 			+"jummuahTimeStr: "+times.jummuahTimeStr+"\n"
// 			+"jummuahTime: "+times.jummuahTime+"\n"
// 			+"midnightTimePass: "+times.midnightTimePass+"\n"
// 			+"midnightTimeNext: "+times.midnightTimeNext+"\n"

// 			// +"jamaahOffsets: "+times.jamaahOffsets+"\n"
// 			+"jamaahTimes: "+times.jamaahTimes+"\n"
// 			+"hijriOffset: "+times.hijriOffset+"\n"

// 			+"prayerTimesDisp: "+times.prayerTimesDisp+"\n"
// 			+"jamaahTimesDisp: "+times.jamaahTimesDisp+"\n"
			// )


module.exports = times;