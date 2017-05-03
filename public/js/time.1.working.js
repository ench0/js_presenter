/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */

(function(){

// --------- PRAYER CONSTRUCTOR --------- //
var Prayer = function(name, namenext, tomorrow, dst) {
	this.name = name;
	this.namenext = namenext;
	this.tomorrow = tomorrow;
	this.dst = dst;
  // console.log(this.dst)

	this.now = moment().tz("Europe/Dublin").add(this.tomorrow).add(this.dst, 'h');
	this.adj = 0;
	this.daybegin = this.now.startOf('day');
	this.dayend = this.now.endOf('day');

	switch (this.name) {	case "fajr": this.num = 0; break; case "shurooq": this.num = 1; break; case "dhuhr": this.num = 2; break;
    						case "asr": this.num = 3; break; case "maghrib": this.num = 4; break; case "isha": this.num = 5; }
	if (this.num > 4) this.numnext = 0; else this.numnext = this.num + 1; 


	// if (this.prayer == "isha") this.adj = this.adj+1;
	this.year = moment().add(this.adj+this.tomorrow, 'd').format("YYYY");
	this.month = moment().add(this.adj+this.tomorrow, 'd').format("MM");
	this.day = moment().add(this.adj+this.tomorrow, 'd').format("D");
	this.time = moment(this.year+'-'+this.month+'-'+this.day+' '+timetable[this.month][this.day][this.num]).add(this.dst, 'h');
	this.next = moment(this.year+'-'+this.month+'-'+this.day+' '+timetable[this.month][this.day][this.numnext]).add(this.dst, 'h');
	this.time2 = moment(this.year+'-'+this.month+'-'+this.day+' '+timetable[this.month][this.day][this.num]).add(this.dst, 'h');
	this.disp = moment(this.year+'-'+this.month+'-'+this.day+' '+timetable[this.month][this.day][this.num]).add(this.dst, 'h').format("HH:mm");

	this.jamaahmethod = (settings.jamaahmethods).split(",")[this.num];
	this.jamaahoffset = ((settings.jamaahoffsets).split(",")[this.num]).split(":");
	switch (this.jamaahmethod) {
		case "afterthis": this.jamaahtime = (this.time2).add(this.jamaahoffset[0], 'H').add(this.jamaahoffset[1], 'm'); break;
		case "fixed": this.jamaahtime = moment(this.year+'-'+this.month+'-'+this.day+' '+this.jamaahoffset[0]+":"+this.jamaahoffset[1]); break;
		case "beforenext": this.jamaahtime = (this.next).subtract(this.jamaahoffset[0], 'HH').subtract(this.jamaahoffset[1], 'm'); break;
		case "": this.jamaahtime = "";
	}

	if (this.jamaahmethod != "") this.jamaahdisp = moment(this.jamaahtime).format("HH:mm"); else this.jamaahdisp = "";
}


// --------- PRAYERS --------- //
var prayers = function(tomorrow) {

	this.tomorrow = tomorrow;
	var now = moment().tz("Europe/Dublin").add(tomorrow, 'd');
  if (now.isDST() && moment().format("MM") == "03") var dst = 1;
  else if (now.isDST() && moment().format("MM") == "10") var dst = -1;
  else var dst = 0;

	var fajr = new Prayer("fajr", "shurooq", tomorrow, dst)
	var shurooq = new Prayer("shurooq", "dhuhr", tomorrow, dst)
	var dhuhr = new Prayer("dhuhr", "asr", tomorrow, dst)
	var asr = new Prayer("asr", "maghrib", tomorrow, dst)
	var maghrib = new Prayer("maghrib", "isha", tomorrow, dst)
	var isha = new Prayer("isha", "fajr", tomorrow, dst)

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

// --------- TIME DISP --------- //
var timeDisp = (function() {
	var now = moment().tz("Europe/Dublin");
	var pray = prayers();
	var current = pray.def.current;
	
	var night = now<current.time;



	if(current.name == "isha" && !night) {
		tomorrow = 1;
		var countcurr = current.time.from(now);
	}
	else if(current.name == "isha" && night){
		tomorrow = 0;
		var countcurr = (current.time).subtract(1,'d').from(now);
	}
	else {
		tomorrow = 0;
		var countcurr = current.time.from(now);
	}
	var pray = prayers(tomorrow);

	var next = prayers(tomorrow).def.next;
	
	var diffnext = (next.time).add(1, 's').diff(now, 'seconds');//add 1 s
	var countnext = moment.duration(diffnext, 'seconds');
	now = moment().tz("Europe/Dublin").add(tomorrow,'d');

  // console.log(now.isDST());



	var gregorian = now.format("dddd, D MMMM YYYY");
	var hijri = now.add(settings.hijrioffset, 'd').format("iD iMMMM iYYYY");

	document.getElementById("time").innerHTML = now.format("H:mm:ss");
	document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

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
		document.getElementById("prayer-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].disp;
		document.getElementById("jamaah-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].jamaahdisp;
		// document.getElementById("jamaah-time-"+pray.def[list[i]].name).innerHTML = pray.def[list[i]].jamaahtime.disp;
		document.getElementById("row-"+pray.def[list[i]].name).className = "row prayers";//reset
		document.getElementById("row-"+next.name).className = "row prayers warning";
	}

 	// //document.getElementById("days-year").innerHTML = def.dayOfYear + "/" + def.daysInYear;

 	document.getElementById("pending-name").innerHTML = next.name;
 	document.getElementById("timetoprayer").innerHTML = countnext.hours()+':'+prepend(countnext.minutes())+':'+prepend(countnext.seconds());

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

}());