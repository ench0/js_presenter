/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */

var moment = require('moment');
var hijri = require('moment-hijri');
moment.tz = require('moment-timezone');
var timetable = require('./timetable');
var settings = require('./settings');

console.log("-------------------------------------------------------------------------------------");

// --------- PRAYER CONSTRUCTOR --------- //
var Prayer = function(name, namenext, tomorrow) {
	this.name = name;
	this.namenext = namenext;
	this.tomorrow = tomorrow;

	this.now = moment().tz("Europe/Dublin").add(tomorrow, 'd');
	this.adj = 0;
	this.daybegin = this.now.startOf('day');
	this.dayend = this.now.endOf('day');

	switch (this.name) {	case "fajr": this.num = 0; break; case "shurooq": this.num = 1; break; case "dhuhr": this.num = 2; break;
    						case "asr": this.num = 3; break; case "maghrib": this.num = 4; break; case "isha": this.num = 5; }
	if (this.num > 4) this.numnext = 0; else this.numnext = this.num + 1; 


	// if (this.prayer == "isha") this.adj = this.adj+1;
	this.year = moment().add(this.adj+this.tomorrow, 'd').format("YYYY");
	this.month = moment().add(this.adj+this.tomorrow, 'd').format("MMM").toLowerCase();
	this.day = moment().add(this.adj+this.tomorrow, 'd').format("D");
	this.time = moment(this.year+'-'+this.month+'-'+this.day+'T'+timetable[this.month][this.day][this.num], "YYYY-MMM-DTHH:mm");
	this.next = moment(this.year+'-'+this.month+'-'+this.day+'T'+timetable[this.month][this.day][this.numnext], "YYYY-MMM-DTHH:mm");
	this.time2 = moment(this.year+'-'+this.month+'-'+this.day+'T'+timetable[this.month][this.day][this.num], "YYYY-MMM-DTHH:mm");
	this.disp = moment(this.year+'-'+this.month+'-'+this.day+'T'+timetable[this.month][this.day][this.num], "YYYY-MMM-DTHH:mm").format("HH:mm");

	this.jamaahmethod = (settings.jamaahmethods).split(",")[this.num];
	this.jamaahoffset = ((settings.jamaahoffsets).split(",")[this.num]).split(":");
	switch (this.jamaahmethod) {
		case "afterthis": this.jamaahtime = (this.time2).add(this.jamaahoffset[0], 'H').add(this.jamaahoffset[1], 'm'); break;
		case "fixed": this.jamaahtime = moment(this.year+'-'+this.month+'-'+this.day+'T'+this.jamaahoffset[0]+":"+this.jamaahoffset[1], "YYYY-MMM-DTH:mm"); break;
		case "beforenext": this.jamaahtime = (this.next).subtract(this.jamaahoffset[0], 'HH').subtract(this.jamaahoffset[1], 'm'); break;
		case "": this.jamaahtime = "";
	}

	if (this.jamaahmethod != "") this.jamaahdisp = moment(this.jamaahtime).format("HH:mm"); else this.jamaahdisp = "";
}


// --------- PRAYERS --------- //
var prayers = function(tomorrow) {

	this.tomorrow = tomorrow;
	var now = moment().tz("Europe/Dublin").add(tomorrow, 'd');

	var fajr = new Prayer("fajr", "shurooq", tomorrow)
	var shurooq = new Prayer("shurooq", "dhuhr", tomorrow)
	var dhuhr = new Prayer("dhuhr", "asr", tomorrow)
	var asr = new Prayer("asr", "maghrib", tomorrow)
	var maghrib = new Prayer("maghrib", "isha", tomorrow)
	var isha = new Prayer("isha", "fajr", tomorrow)

	// current - next
	if (tomorrow == 1) {var current = isha; var next = fajr}
	else {
		if (now.isAfter(isha.time)) {var current = isha; var next = fajr} else if (now.isAfter(maghrib.time)) {var current = maghrib; var next = isha}
		else if (now.isAfter(asr.time)) {var current = asr; var next = maghrib} else if (now.isAfter(dhuhr.time)) {var current = dhuhr; var next = asr}
		else if (now.isAfter(fajr.time)) {var current = fajr; var next = dhuhr} else {var current = isha; next = fajr}
	}

	def = {fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha, current: current, next: next}

	return {def: def};

};

// var current = prayers().def.current
// var next = prayers().def.next;

// if(current.name == "isha") {nextDay = 1;var next = prayers(nextDay).def.next} else nextDay = 0;

// var prayers = prayers(nextDay);

// --------- TIME DISP --------- //
var timeDisp = (function() {
	var now = moment().tz("Europe/Dublin");
	var pray = prayers();
	var current = pray.def.current;
	
	var night = now<current.time;



	if(current.name == "isha" && !night) {
		tomorrow = 1;
		// var countcurr = current.time.from(now);
	}
	else if(current.name == "isha" && night){
		tomorrow = 0;
		// var countcurr = (current.time).subtract(1,'d').from(now);
	}
	else {
		tomorrow = 0;
		// var countcurr = current.time.from(now);
	}
	var pray = prayers(tomorrow);

	var next = prayers(tomorrow).def.next;
	
	var diffnext = (next.time).add(1, 's').diff(now, 'seconds');//add 1 s
	var countnext = moment.duration(diffnext, 'seconds');
	now = moment().tz("Europe/Dublin").add(tomorrow,'d');

	var gregorian = now.format("dddd, D MMMM YYYY");
	var hijri = now.add(settings.hijrioffset, 'd').format("iD iMMMM iYYYY");

	// document.getElementById("time").innerHTML = now.format("H:mm:ss");
	// document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

	// // // if Ramadan
	// // // if (def.now.format('iMMMM') == "Ramadan") {
	// // // 	var iftar = true;
	// // // }
	// // // else {var iftar = false}

	// // // if Friday do Jummuah
	// // // if (def.now.format('dddd') == "Friday") {calcDhuhr = def.jummuahTime.format('HH:mm')}
	// // // else {calcDhuhr =  def.dhuhrJamaah.format('HH:mm')}


	// // Prayer time display
	// for(i=0,list=["fajr","shurooq","dhuhr","asr","maghrib","isha"];i<6;i++){
	// 	document.getElementById("prayer-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].disp;
	// 	document.getElementById("jamaah-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].jamaahdisp;
	// 	// document.getElementById("jamaah-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].jamaahtime.disp;
	// 	document.getElementById("row-"+pray.def[list[i]].name).className = "row prayers";//reset
	// 	document.getElementById("row-"+next.name).className = "row prayers warning";
	// }

 	// // //document.getElementById("days-year").innerHTML = def.dayOfYear + "/" + def.daysInYear;

 	// document.getElementById("pending-name").innerHTML = next.name;
 	// document.getElementById("timetoprayer").innerHTML = countnext.hours()+':'+prepend(countnext.minutes())+':'+prepend(countnext.seconds()) + ' ' + countcurr;

	// console.reset = function () {
	// 	return process.stdout.write('\033c');
	// }();

	// if countnext < 60

	setTimeout(function(){timeDisp()}, 1000);
});
timeDisp();

function prepend(num) {
	if (num < 10) var num = '0'+num; else var num = num;
	return num;
}

var timeDef = function() {

	// now
	// leap
	if (now.year()%4 == 0) var leap = true; else var leap = false;

	// dayOfYear
	var dayOfYear = now.dayOfYear();
	if (leap == true) daysInYear = 366; else daysInYear = 365;
	if (leap == false & dayOfYear > 59) dayOfYear += 1;

}





// test
// for (i=0, list=["fajr","shurooq","dhuhr","asr","maghrib","isha"]; i<6; i++) {
// 	if (list[i] == "fajr" || list[i] == "dhuhr" || list[i] == "isha" || list[i] == "asr") var tab = '\t'; else var tab = '';
// 	var tab2 = '\t';
	
// 	// if(prayers.def[list[i]].time.passed == "passed") {var currentname = prayers.def[list[i]].name;var currenttime = prayers.def[list[i]].time.disp}

// 	console.log	(prayers.def[list[i]].name, tab, prayers.def[list[i]].time.day, prayers.def[list[i]].time.full,tab2
// 				,'\tNEXT' ,prayers.def[list[i]].timenext.day, prayers.def[list[i]].timenext.full,tab2
// 				,'\tTMRW', prayers.def[list[i]].timetomorrow.day, prayers.def[list[i]].timetomorrow.full
// 				);
// }

// console.log('\nCURR:', current.name, current.time.day, current.time.full);
// console.log('\nNEXT:', next.name, next.time.day, next.time.full);

console.log("-------------------------------------------------------------------------------------");

var times = function() {
	output = [];
	prayerNames = ["fajr","shurooq","dhuhr","asr","maghrib","isha"];
	prayerTimes = [	prayers().def.fajr.time, prayers().def.shurooq.time, prayers().def.dhuhr.time,
					prayers().def.asr.time, prayers().def.maghrib.time, prayers().def.isha.time];
	prayerTimesDisp = [	prayers().def.fajr.disp, prayers().def.shurooq.disp, prayers().def.dhuhr.disp,
						prayers().def.asr.disp, prayers().def.maghrib.disp, prayers().def.isha.disp];
	jamaahTimes = [	prayers().def.fajr.jamaahtime, prayers().def.shurooq.jamaahtime, prayers().def.dhuhr.jamaahtime,
						prayers().def.asr.jamaahtime, prayers().def.maghrib.jamaahtime, prayers().def.isha.jamaahtime];
	jamaahTimesDisp = [	prayers().def.fajr.jamaahdisp, prayers().def.shurooq.jamaahdisp, prayers().def.dhuhr.jamaahdisp,
						prayers().def.asr.jamaahdisp, prayers().def.maghrib.jamaahdisp, prayers().def.isha.jamaahdisp];
	jamaahMethods = [	prayers().def.fajr.jamaahmethod, prayers().def.shurooq.jamaahmethod, prayers().def.dhuhr.jamaahmethod,
						prayers().def.asr.jamaahmethod, prayers().def.maghrib.jamaahmethod, prayers().def.isha.jamaahmethod];
	jamaahOffsetValues = [	prayers().def.fajr.jamaahoffset, prayers().def.shurooq.jamaahoffset, prayers().def.dhuhr.jamaahoffset,
						prayers().def.asr.jamaahoffset, prayers().def.maghrib.jamaahoffset, prayers().def.isha.jamaahoffset];

	for (i=0, names=prayerNames, prayerTimes=prayerTimes, prayerTimesDisp=prayerTimesDisp, jamaahTimes=jamaahTimes, jamaahTimesDisp=jamaahTimesDisp, jamaahMethods=jamaahMethods,jamaahOffsetValues=jamaahOffsetValues; i<6; i++) {
		// var jamaahOffsetCalc = jamaahOffsetValues[i].split(":");
		output.push(
			{ 	id: i, name: names[i], 
				prayerTime: prayerTimes[i], prayerTimeDisp: prayerTimesDisp[i],
				jamaahTime: jamaahTimes[i], jamaahTimeDisp: jamaahTimesDisp[i],
				jamaahMethod: jamaahMethods[i], jamaahOffsetHour: jamaahOffsetValues[i][0], jamaahOffsetMinute: jamaahOffsetValues[i][1]
				
			}
		)
	}
	// console.log(prayerNames, prayerTimes, prayerTimesDisp, jamaahTimes, jamaahTimesDisp, jamaahMethods, jamaahOffsetValues)
	return output;
}

times = times();
// console.log(times.jamaahOffsetHour)
module.exports = times;
