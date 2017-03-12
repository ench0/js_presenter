/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */

(function(){
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

// --------- TIME DISP --------- //
var timeDisp = (function() {
	now = moment();
	var pray = prayers();
	var current = prayers().def.current;
	
	var night = now<current.time.full;

	if(current.name == "isha" && !night) {
		nextDay = 1;
		var countcurr = current.time.full.from(now);
	}
	else if(current.name == "isha" && night){
		nextDay = 0;
		var countcurr = (current.time.full).subtract(1,'d').from(now);
	}
	else {
		nextDay = 0;
		var countcurr = current.time.full.from(now);
	}

	var pray = prayers(nextDay);

	var next = prayers(nextDay).def.next;
	var diffnext = (next.time.full).add(1, 's').diff(now, 'seconds');//add 1 s
	var countnext = moment.duration(diffnext, 'seconds');
	now = moment().add(nextDay,'d');


	document.getElementById("time").innerHTML = now.format("H:mm:ss");
	// //document.getElementById("date").innerHTML = def.now.format('[<div>]dddd [</div><div>] D MMMM YYYY [</div>]');//without hijri
	// // document.getElementById("date").innerHTML = def.now.format('[<span>]dddd [</span> &middot; <span>] iD iMMMM iYYYY [</span> &middot; <span>] D MMMM YYYY [</span>]');
	document.getElementById("date").innerHTML = now.format("dddd, D MMMM YYYY") + "<br />" + now.format("iD iMMMM iYYYY");

	// // if Ramadan
	// // if (def.now.format('iMMMM') == "Ramadan") {
	// // 	var iftar = true;
	// // }
	// // else {var iftar = false}

	// // if Friday do Jummuah
	// // if (def.now.format('dddd') == "Friday") {calcDhuhr = def.jummuahTime.format('HH:mm')}
	// // else {calcDhuhr =  def.dhuhrJamaah.format('HH:mm')}


	// Prayer time display
	for(i=0,list=["fajr","shurooq","dhuhr","asr","maghrib","isha"];i<6;i++){
		document.getElementById("prayer-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].time.disp;
		document.getElementById("jamaah-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].jamaahtime.disp;
		document.getElementById("row-"+pray.def[list[i]].name).className = "row prayers";//reset
		document.getElementById("row-"+next.name).className = "row prayers warning";
	}
		// document.getElementById("prayer-time-fajr").innerHTML = pray.def.fajr.time.disp;
	// document.getElementById("prayer-time-shurooq").innerHTML = prayers[1].prayerTimeDisp;
	// document.getElementById("prayer-time-dhuhr").innerHTML = prayers[2].prayerTimeDisp;
	// document.getElementById("prayer-time-asr").innerHTML = prayers[3].prayerTimeDisp;
	// document.getElementById("prayer-time-maghrib").innerHTML = prayers[4].prayerTimeDisp;
	// document.getElementById("prayer-time-isha").innerHTML = prayers[5].prayerTimeDisp;

	// Jamaah time display
	
	// document.getElementById("jamaah-time-fajr").innerHTML = prayers[0].jamaahTimeDisp;
	// document.getElementById("jamaah-time-dhuhr").innerHTML = prayers[2].jamaahTimeDisp;
	// document.getElementById("jamaah-time-asr").innerHTML = prayers[3].jamaahTimeDisp;
	// document.getElementById("jamaah-time-maghrib").innerHTML =prayers[4].jamaahTimeDisp;
	// document.getElementById("jamaah-time-isha").innerHTML = prayers[5].jamaahTimeDisp;

	// //pending
	// document.getElementById("row-fajr").className = "row prayers";//reset
	// document.getElementById("row-dhuhr").className = "row prayers";
	// document.getElementById("row-asr").className = "row prayers";
	// document.getElementById("row-maghrib").className = "row prayers";
	// document.getElementById("row-isha").className = "row prayers";
	// document.getElementById("row-"+nextPrayerName).className = "row prayers warning";

	// console.log('nextprayer: '+nextPrayerName);
	// console.log('nextday: '+nextDay);

 	// //document.getElementById("days-year").innerHTML = def.dayOfYear + "/" + def.daysInYear;

 	document.getElementById("pending-name").innerHTML = next.name;
 	document.getElementById("timetoprayer").innerHTML = countnext.hours()+':'+prepend(countnext.minutes())+':'+prepend(countnext.seconds());

	// console.reset = function () {
	// 	return process.stdout.write('\033c');
	// }();

	// if countnext < 60
	// console.log(now, current.name, current.time.full, next.name, next.time.full, countcurr, diffnext, countnext.hours()+':'+prepend(countnext.minutes())+':'+prepend(countnext.seconds()))
	// console.log(pray.def.isha.time.disp, nextDay, next, pray)


	setTimeout(function(){timeDisp()}, 1000);
});
timeDisp();

function prepend(num) {
	if (num < 10) var num = '0'+num; else var num = num;
	return num;
}

}());