/**
 * 		@file Prayer Timetable
 * 		@author Ensar ensar@farend.net
 * 		@copyright Ensar ensar@farend.net
 * 		@license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */

(function(){

var tomorrow = 0;

/* JAMAAH CALC */
var jamaahCalc = function(num, time, timenext){
  var jamaahMethodSetting = (settings.jamaahmethods).split(",")[num];
	var jamaahOffsetSetting = ((settings.jamaahoffsets).split(",")[num]).split(":");

	switch (jamaahMethodSetting) {
		case "afterthis": jamaahOffset = parseInt(jamaahOffsetSetting[0]*60 + jamaahOffsetSetting[1]); break;
		case "fixed": var jamaahOffset = (moment().month(time.get('month')).date(time.get('date')).hour(jamaahOffsetSetting[0]).minute(jamaahOffsetSetting[1])).diff(time, 'minutes'); break;
    case "beforenext": jamaahOffset = (timenext.subtract({minutes: parseInt(jamaahOffsetSetting[0]*60 + jamaahOffsetSetting[1])})).diff(time, 'minutes'); break;
    case "": jamaahOffset = ""; break
	}
  return jamaahOffset;
}

/* PRAYER CONSTRUCTOR */
var Prayer = function(now, num) {

  this.now = moment();

  if (num < 5) this.nextnum = num + 1; else this.nextnum = 0;

  this.month = (moment().add(tomorrow, 'day').month())+1;
  this.date = (moment()).add(tomorrow, 'day').date();

  this.time = moment({hour: timetable[this.month][this.date][num][0], minute: timetable[this.month][this.date][num][1]});
  this.time = this.time.add(tomorrow, 'day');

  this.time2 = moment({hour: timetable[this.month][this.date][num][0], minute: timetable[this.month][this.date][num][1]});
  this.time2 = this.time2.add(tomorrow, 'day');

  this.timenext = moment({month: (this.time).get('month'), date: (this.time).get('date'), hour: timetable[this.month][this.date][this.nextnum][0], minute: timetable[this.month][this.date][this.nextnum][1]});

  this.disp = this.time.format("HH:mm");

  var jamaahOffset = jamaahCalc(num, this.time2, this.timenext);
  this.jamaahtime = this.time2.add(jamaahOffset, 'minutes');

  if (jamaahOffset != "") this.jamaahdisp = this.jamaahtime.format("HH:mm"); else this.jamaahdisp = "";
}

var times = function() {
  var now = moment();//.tz("Europe/Dublin");

  var fajr = new Prayer(now, 0);
  var shurooq = new Prayer(now, 1);
  var dhuhr = new Prayer(now, 2);
  var asr = new Prayer(now, 3);
  var maghrib = new Prayer(now, 4);
  var isha = new Prayer(now, 5);

	var daybegin = moment().startOf('day');
	var dayend = moment().endOf('day');

  if((daybegin).diff(now) > 0) {var next = fajr; next.name = 'fajr';}//console.log("opt1")}
  else if((fajr.time).diff(now) > 0) {var next = fajr; next.name = 'fajr';}//console.log("opt2")}
  else if((dhuhr.time).diff(now) > 0) {var next = dhuhr; next.name = 'dhuhr';}//console.log("opt3")}
  else if((asr.time).diff(now) > 0) {var next = asr; next.name = 'asr';}//console.log("opt4")}
  else if((maghrib.time).diff(now) > 0) {var next = maghrib; next.name = "maghrib";}//console.log("opt5")}
  else if((isha.time).diff(now) > 0) {var next = isha; next.name = 'isha';}//console.log("opt6")}
  else if((dayend).diff(now) > 0) {var next = fajr; next.name = 'fajr'; tomorrow = 1;}//console.log("opt7")}
  else {var next = fajr; next.name = 'fajr'; tomorrow = 1;}//console.log("opt8")}

  output = {
    fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha,
    now: now, next: next
  }
  

  return (output)
}

/* TIME DISPLAY */
var timeDisp = (function() {

  var def = times();

	var gregorian = def.now.format("dddd, D MMMM YYYY");
	var hijri = def.now.add(settings.hijrioffset, 'd').format("iD iMMMM iYYYY");

	document.getElementById("time").innerHTML = def.now.format("H:mm:ss");
	document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

	// Prayer time display
	for(i=0,list=["fajr","shurooq","dhuhr","asr","maghrib","isha"];i<6;i++){
		document.getElementById("prayer-time-"+list[i]).innerHTML = def[list[i]].disp;
		document.getElementById("jamaah-time-"+list[i]).innerHTML = def[list[i]].jamaahdisp;
		document.getElementById("row-"+list[i]).className = "row line";//reset
		document.getElementById("row-"+def.next.name).className = "row line next";
	}

  timeToPrayer = moment.duration((def.next.time).diff(def.now), 'milliseconds').add(1, 's');//.asMinutes();
  timeToPrayer.hours = appendZero(timeToPrayer.hours());
  timeToPrayer.minutes = appendZero(timeToPrayer.minutes());
  timeToPrayer.seconds = appendZero(timeToPrayer.seconds());

  // timeToPrayer = (moment()).diff(def.next.time)

 	document.getElementById("pending-name").innerHTML = def.next.name;
 	document.getElementById("timetoprayer").innerHTML = timeToPrayer.hours + ':' + timeToPrayer.minutes + ':' + timeToPrayer.seconds;

	setTimeout(function(){timeDisp()}, 1000);
});
timeDisp();

function appendZero(unit) {
  if (unit < 10) var unit = '0'+unit;
  else var unit = unit;
  return unit;
}

}());