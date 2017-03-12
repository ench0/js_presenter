/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */


(function () {

var timeDef = function(nextDay) {

	if (nextDay) var nextDay = nextDay;
	else var nextDay = 0;
	console.log('nextday1: '+nextDay);

	// now
	var now = moment().tz("Europe/Dublin").add(nextDay, 'd');
	// leap
	if (now.year()%4 == 0) var leap = true; else var leap = false;

	// dayOfYear
	var dayOfYear = now.dayOfYear();
	if (leap == true) daysInYear = 366; else daysInYear = 365;
	// console.log(dayOfYear);
	if (leap == false & dayOfYear > 59) dayOfYear += 1;

	// prayerTimes
	var prayerTimes = timetable[dayOfYear];

	// prayerString
	prayerStrings = function(){
		array = [];
		for(i=0;i<6;i++) {
			array.push(now.year()+'-'+(now.month()+1)+'-'+now.date()+' '+prayerTimes[i])
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
	var checkBeforeFajr = moment(now).isBefore(prayerTimes[0]);	var checkAfterFajr = moment(now).isAfter(prayerTimes[0]);
	var checkBeforeShurooq = moment(now).isBefore(prayerTimes[1]);var checkAfterShurooq = moment(now).isAfter(prayerTimes[1]);
	var checkBeforeDhuhr = moment(now).isBefore(prayerTimes[2]);var checkAfterDhuhr = moment(now).isAfter(prayerTimes[2]);
	var checkBeforeAsr = moment(now).isBefore(prayerTimes[3]);var checkAfterAsr = moment(now).isAfter(prayerTimes[3]);
	var checkBeforeMaghrib = moment(now).isBefore(prayerTimes[4]);var checkAfterMaghrib = moment(now).isAfter(prayerTimes[4]);
	var checkBeforeIsha = moment(now).isBefore(prayerTimes[5]);var checkAfterIsha = moment(now).isAfter(prayerTimes[5]);
	var checkBeforeMidnight = moment(now).isBefore(midnightTimeNext);var checkAfterMidnight = moment(now).isAfter(midnightTimePass);

	if (checkBeforeFajr && checkAfterMidnight) {
		var nextPrayerName = "fajr";
		var nextPrayerTime = prayerTimes[0];
		var currentPrayerName = "night prayer";
		nextDay = 0;
	}

	else if (checkBeforeDhuhr && checkAfterFajr) {
		var nextPrayerName = "dhuhr";
		var nextPrayerTime = prayerTimes[2];
		var currentPrayerName = "duha";
		nextDay = 0;
	}

	else if (checkBeforeAsr && checkAfterDhuhr) {
		var nextPrayerName = "asr";
		var nextPrayerTime = prayerTimes[3];
		var currentPrayerName = "dhuhr";
		nextDay = 0;
	}

	else if (checkBeforeMaghrib && checkAfterAsr) {
		var nextPrayerName = "maghrib";
		var nextPrayerTime = prayerTimes[4];
		var currentPrayerName = "asr";
		nextDay = 0;
	}

	else if (checkBeforeIsha && checkAfterMaghrib) {
		var nextPrayerName = "isha";
		var nextPrayerTime = prayerTimes[5];
		var currentPrayerName = "maghrib";
		nextDay = 0;
	}

	else if (checkBeforeMidnight && checkAfterIsha) {
		var nextPrayerName = "fajr";
		var nextPrayerTime = prayerTimes[0];
		var currentPrayerName = "isha";
		nextDay = 1;
		console.log (nextDay)
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
	var refresh = settings.refresh;



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



	// Hijri adjustment
	var hijri = moment(now).add(hijriOffset, 'days').format('iD iMMMM iYYYY');
	var gregorian = now.format('dddd, D MMMM YYYY');

	var timeNow = now.format('HH:mm:ss');

	console.log('nextday2: '+nextDay);

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


	var globals = {hijri: hijri, gregorian: gregorian, nextDay: nextDay, timeNow: timeNow, nextPrayerName: nextPrayerName, 
	countNextPrayerTime: countNextPrayerTime, refresh: refresh}

	return {output: output, globals: globals};

};
	// console.log('nextday3: '+nextDay);

var nextDay = 0;
// if (!nextDay) var nextDay = 0;//if nextDay is not defined


var timeDisplay = function(nextDay) {
	
	var prayers = timeDef(nextDay).output;
	var settings = timeDef(nextDay).globals;

	timeDef();
	var nextDay = settings.nextDay;
	var nextPrayerName = settings.nextPrayerName

	/********** Parse to HTML **********/
	document.getElementById("time").innerHTML = settings.timeNow;
	//document.getElementById("date").innerHTML = def.now.format('[<div>]dddd [</div><div>] D MMMM YYYY [</div>]');//without hijri
	// document.getElementById("date").innerHTML = def.now.format('[<span>]dddd [</span> &middot; <span>] iD iMMMM iYYYY [</span> &middot; <span>] D MMMM YYYY [</span>]');
	document.getElementById("date").innerHTML = settings.gregorian + "<br />" + settings.hijri;

	// if Ramadan
	// if (def.now.format('iMMMM') == "Ramadan") {
	// 	var iftar = true;
	// }
	// else {var iftar = false}

	// if Friday do Jummuah
	// if (def.now.format('dddd') == "Friday") {calcDhuhr = def.jummuahTime.format('HH:mm')}
	// else {calcDhuhr =  def.dhuhrJamaah.format('HH:mm')}


	// Prayer time display
	document.getElementById("prayer-time-fajr").innerHTML = prayers[0].prayerTimeDisp;
	document.getElementById("prayer-time-shurooq").innerHTML = prayers[1].prayerTimeDisp;
	document.getElementById("prayer-time-dhuhr").innerHTML = prayers[2].prayerTimeDisp;
	document.getElementById("prayer-time-asr").innerHTML = prayers[3].prayerTimeDisp;
	document.getElementById("prayer-time-maghrib").innerHTML = prayers[4].prayerTimeDisp;
	document.getElementById("prayer-time-isha").innerHTML = prayers[5].prayerTimeDisp;
	// Jamaah time display
	document.getElementById("jamaah-time-fajr").innerHTML = prayers[0].jamaahTimeDisp;
	document.getElementById("jamaah-time-dhuhr").innerHTML = prayers[2].jamaahTimeDisp;
	document.getElementById("jamaah-time-asr").innerHTML = prayers[3].jamaahTimeDisp;
	document.getElementById("jamaah-time-maghrib").innerHTML =prayers[4].jamaahTimeDisp;
	document.getElementById("jamaah-time-isha").innerHTML = prayers[5].jamaahTimeDisp;

	//pending
	document.getElementById("row-fajr").className = "row prayers";//reset
	document.getElementById("row-dhuhr").className = "row prayers";
	document.getElementById("row-asr").className = "row prayers";
	document.getElementById("row-maghrib").className = "row prayers";
	document.getElementById("row-isha").className = "row prayers";
	document.getElementById("row-"+nextPrayerName).className = "row prayers warning";

	console.log('nextprayer: '+nextPrayerName);
	console.log('nextday: '+nextDay);

 	//document.getElementById("days-year").innerHTML = def.dayOfYear + "/" + def.daysInYear;

 	document.getElementById("pending-name").innerHTML = settings.nextPrayerName;
 	document.getElementById("timetoprayer").innerHTML = settings.countNextPrayerTime;
 	//document.getElementById("timetofast").innerHTML = def.countFastingTime;
 	//document.getElementById("next-fast").innerHTML = def.fastingTimeName;

	setTimeout(function(){timeDisplay(nextDay)}, 1000);

	return nextDay;
};


timeDisplay(nextDay);

})();