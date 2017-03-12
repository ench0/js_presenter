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

var nextDay = 0;
var now = moment().tz("Europe/Dublin").add(nextDay, 'd');;


// --------- PRAYER CONSTRUCTOR --------- //
var Prayer = function(name, nextDay) {
	this.name = name;
	this.now = now;
	this.adj = 0;
	this.daybegin = moment().startOf('day');
	this.dayend = moment().endOf('day');
	this.nextDay = nextDay;

	switch (this.name) {	case "fajr": this.num = 0; break; case "shurooq": this.num = 1; break; case "dhuhr": this.num = 2; break;
    						case "asr": this.num = 3; break; case "maghrib": this.num = 4; break; case "isha": this.num = 5; }
	if (this.num > 4) this.numnext = 0; else this.numnext = this.num + 1; 

	// --------- SEGMENT - current prayer's year/month/day/time --------- //
	Segment = function(adj, num, name, nextDay) {
		this.now = now;
		this.adj = adj;
		this.num = num;
		this.name = name.name;
		this.prayer = name.prayer;
		this.nextDay = nextDay;

		if (this.prayer == "isha" && this.name!="now") this.adj = adj+1;
		this.year = moment().format("YYYY");
		this.month = moment().format("MMM").toLowerCase();
		this.day = moment().add(this.adj+this.nextDay, 'd').format("D");
		this.full = moment(this.year+'-'+this.month+'-'+this.day+'T'+timetable[this.month][this.day][this.num], "YYYY-MMM-DTH:mm");
		this.disp = moment(this.year+'-'+this.month+'-'+this.day+'T'+timetable[this.month][this.day][this.num], "YYYY-MMM-DTH:mm").format("HH:mm");
	}

	this.time = new Segment(this.adj, this.num, {name: "now", prayer: this.name}, nextDay);
	this.timenext = new Segment(this.adj, this.numnext, {name: "next", prayer: this.name}, nextDay);
	this.timetomorrow = new Segment(this.adj+1, this.num, {name: "tomorrow", prayer: this.name}, nextDay);

	this.jamaahmethod = (settings.jamaahmethods).split(",")[this.num];
	this.jamaahoffset = ((settings.jamaahoffsets).split(",")[this.num]).split(":");

	switch (this.jamaahmethod) {
		case "afterthis": this.jamaahtime = (this.time.full).add(this.jamaahoffset[0], 'h').add(this.jamaahoffset[1], 'm'); break;
		case "fixed": this.jamaahtime = moment(this.time.year+'-'+this.time.month+'-'+this.time.day+'T'+this.jamaahoffset[0]+":"+this.jamaahoffset[1], "YYYY-MMM-DTH:mm"); break;
		case "beforenext": this.jamaahtime = (this.timenext.full).subtract(this.jamaahoffset[0], 'h').subtract(this.jamaahoffset[1], 'm'); break;
		default: this.jamaahtime = this.time.full;
	}
	
	this.jamaahtime.disp = this.jamaahtime.format("HH:mm");

}





// --------- PRAYERS --------- //
var prayers = function(nextDay) {

	this.nextDay = nextDay;

	var fajr = new Prayer("fajr", nextDay)
	var shurooq = new Prayer("shurooq", nextDay)
	var dhuhr = new Prayer("dhuhr", nextDay)
	var asr = new Prayer("asr", nextDay)
	var maghrib = new Prayer("maghrib", nextDay)
	var isha = new Prayer("isha", nextDay)

	// current - next
	if (now.isAfter(isha.time.full)) {var current = isha; var next = fajr} else if (now.isAfter(maghrib.time.full)) {var current = maghrib; var next = isha}
		else if (now.isAfter(asr.time.full)) {var current = asr; var next = maghrib} else if (now.isAfter(dhuhr.time.full)) {var current = dhuhr; var next = asr}
		else if (now.isAfter(fajr.time.full)) {var current = fajr; var next = dhuhr} else {var current = isha; next = fajr}


	def = {fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha, current: current, next: next}

	return {def: def};

};

// var current = prayers().def.current
// var next = prayers().def.next;

// if(current.name == "isha") {nextDay = 1;var next = prayers(nextDay).def.next} else nextDay = 0;

// var prayers = prayers(nextDay);

// --------- TIME DISP --------- //
var timeDisp = function() {
	now = moment();
	var current = prayers().def.current;
	
	var night = now<current.time.full;

	if(current.name == "isha" && !night) {
		nextDay = 1;
		// var countcurr = current.time.full.from(now);
	}
	else if(current.name == "isha" && night){
		nextDay = 0;
		// var countcurr = (current.time.full).subtract(1,'d').from(now);
	}
	else {
		nextDay = 0;
		// var countcurr = current.time.full.from(now);
	}

	var next = prayers(nextDay).def.next;
	var diffnext = (next.time.full).diff(now, 'seconds');
	var countnext = moment.duration(diffnext, 'seconds');


	// console.reset = function () {
	// 	return process.stdout.write('\033c');
	// }();

	// // if countnext < 60
	// console.log(now, current.name, current.time.full, next.name, next.time.full, countcurr, diffnext, countnext.hours()+':'+prepend(countnext.minutes())+':'+prepend(countnext.seconds()))
	
	setTimeout(function(){timeDisp()}, 1000);
}
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
	prayerTimes = [	prayers().def.fajr.time.full, prayers().def.shurooq.time.full, prayers().def.dhuhr.time.full,
					prayers().def.asr.time.full, prayers().def.maghrib.time.full, prayers().def.isha.time.full];
	prayerTimesDisp = [	prayers().def.fajr.time.disp, prayers().def.shurooq.time.disp, prayers().def.dhuhr.time.disp,
						prayers().def.asr.time.disp, prayers().def.maghrib.time.disp, prayers().def.isha.time.disp];
	jamaahTimes = [	prayers().def.fajr.jamaahtime, prayers().def.shurooq.jamaahtime, prayers().def.dhuhr.jamaahtime,
						prayers().def.asr.jamaahtime, prayers().def.maghrib.jamaahtime, prayers().def.isha.jamaahtime];
	jamaahTimesDisp = [	prayers().def.fajr.jamaahtime.disp, prayers().def.shurooq.jamaahtime.disp, prayers().def.dhuhr.jamaahtime.disp,
						prayers().def.asr.jamaahtime.disp, prayers().def.maghrib.jamaahtime.disp, prayers().def.isha.jamaahtime.disp];
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
