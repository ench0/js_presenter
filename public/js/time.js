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

	var daybegin = moment().startOf('day').add(tomorrow, 'day');
	var dayend = moment().endOf('day').add(tomorrow, 'day');

//   console.log(moment().add(1, 'day').isBetween(isha.time, dayend))

// console.log(moment().add(1, 'day'))


  if (isha.jamaahtime.isBefore(moment()) && tomorrow == 0) {
    var next = fajr; next.name = 'fajr'; var current = isha; current.name = 'isha'; tomorrow = 1;
    // console.log("opt00");
  }
  else if (isha.time.isBefore(moment())) {
    var next = fajr; next.name = 'fajr'; var current = isha; current.name = 'isha'; tomorrow = 0;
    // console.log("opt01");
  }
  else if (maghrib.time.isBefore(moment())) {
    var next = isha; next.name = 'isha'; var current = maghrib; current.name = 'maghrib'; tomorrow = 0;
    // console.log("opt02", current);
  }
  else if (asr.time.isBefore(moment())) {
    var next = maghrib; next.name = 'maghrib'; var current = asr; current.name = 'asr'; tomorrow = 0;
    // console.log("opt03");
  }
  else if (dhuhr.time.isBefore(moment())) {
    var next = asr; next.name = 'asr'; var current = dhuhr; current.name = 'dhuhr'; tomorrow = 0;
    // console.log("opt04");
  }
  else if (fajr.time.isBefore(moment())) {
    var next = dhuhr; next.name = 'dhuhr'; var current = fajr; current.name = 'fajr'; tomorrow = 0;
    // console.log("opt05");
  }
  // after midnight, before fajr
  else if (moment().add(tomorrow, 'day').isBefore(fajr.time)) {
    var next = fajr; next.name = 'fajr'; var current = isha; current.name = 'isha'; tomorrow = 0;
    // console.log("opt06");
  }
  // after isha, before midnight
  else if (moment().isBefore(moment().endOf('day').add(tomorrow, 'day')) &&  moment().add(tomorrow, 'day').isAfter(isha.time)) {
    var next = fajr; next.name = 'fajr'; var current = isha; current.name = 'isha'; tomorrow = 1;
    // console.log("opt07");
  }
  else {
    var next = fajr; next.name = 'fajr'; var current = isha; current.name = 'isha'; tomorrow = 1;
    // console.log("opt09");
  }


  output = {
    fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha,
    now: now, next: next, current: current
  }
  

  return (output)
}
times();

/* TIME DISPLAY */
var timeDisp = (function() {

  var def = times();

	var gregorian = moment().add(tomorrow, 'day').format("dddd, D MMMM YYYY");
	var hijri = moment().add((settings.hijrioffset + tomorrow), 'day').format("iD iMMMM iYYYY");

	document.getElementById("time").innerHTML = moment().format("H:mm:ss");
	document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

  // Countdown
  timeToPrayer = moment.duration((def.next.time).diff(moment()), 'milliseconds').add(1, 's');//.asMinutes();
  timeToPrayer.hours = appendZero(timeToPrayer.hours());
  timeToPrayer.minutes = appendZero(timeToPrayer.minutes());
  timeToPrayer.seconds = appendZero(timeToPrayer.seconds());
  if (timeToPrayer.hours.length > 2) {var countdowndisp = "0:00:00"; var nextname = "isha"} else {var countdowndisp = timeToPrayer.hours + ':' + timeToPrayer.minutes + ':' + timeToPrayer.seconds;var nextname = def.next.name;}
 	document.getElementById("pending-name").innerHTML = nextname;
 	document.getElementById("timetoprayer").innerHTML = countdowndisp;



	// Prayer time display
	for(i=0,list=["fajr","shurooq","dhuhr","asr","maghrib","isha"];i<6;i++){
    timeToJamaah = moment.duration((def.current.jamaahtime).diff(moment()), 'milliseconds').add(1, 's');//.asMinutes();
    timeToJamaah.hours = appendZero(timeToJamaah.hours());
    timeToJamaah.minutes = appendZero(timeToJamaah.minutes());
    timeToJamaah.seconds = appendZero(timeToJamaah.seconds());

		document.getElementById("prayer-time-"+list[i]).innerHTML = def[list[i]].disp;
		document.getElementById("jamaah-time-"+list[i]).innerHTML = def[list[i]].jamaahdisp;
		document.getElementById("row-"+list[i]).className = "row line";//reset
		document.getElementById("row-"+def.next.name).className = "row line next";

    if (def.current.name == "isha" && tomorrow == 1) var starttime = moment(); else if (def.current.name == "isha" && tomorrow == 0) var starttime = def.current.time; else var starttime = def.current.time;
    // console.log(def.current.name, tomorrow)
    if ((moment().add(tomorrow, 'day')).isBetween(starttime, def.current.jamaahtime))
    {
      document.getElementById("pending-name").innerHTML = "Prepare for "+ def.current.name + " Jamaah";
 	    document.getElementById("timetoprayer").innerHTML = timeToJamaah.hours + ':' + timeToJamaah.minutes + ':' + timeToJamaah.seconds;
    }
    if ((moment().add(tomorrow, 'day')).isBetween(moment().startOf('day'), moment().startOf('day').add(5, 's')))
    {
      document.getElementById("pending-name").innerHTML = "Midnight";
 	    document.getElementById("timetoprayer").innerHTML = "Time";
    }
	}

  // Friday Prayer
  if ( 
       (moment().isBetween(moment({day: '5', hour: '13', minute: '10'}), moment({day: '5', hour: '14', minute: '5'})))
      //  ||
      //  (moment().isBetween(moment({day: '1', hour: '22', minute: '03'}), moment({day: '1', hour: '22', minute: '04'})))
  ) {
	  document.getElementById("overlay").style = "background:rgba(0,0,0,.85);z-index:1000;";
	  document.getElementById("overlay").textContent = "Jummuah Prayer";
  }
  else {
    document.getElementById("overlay").style = "background: rgba(0,0,0,0);z-index:-9";
	  document.getElementById("overlay").textContent = "";
  }
  
  var hijriMonth = moment().format("iM");
  // console.log(hijriMonth);
  // Ramadan countdown
  if (hijriMonth == "8")
  {
    document.getElementById("ramadan").style = "display: table-row;";
    document.getElementById("ramadan").innerHTML = "<div class='content'>"+moment.duration(moment().endOf('imonth').diff(moment())).humanize()+" until Ramadan</div>";
  }


	setTimeout(function(){timeDisp()}, 1000);
});
timeDisp();

function appendZero(unit) {
  if (unit < 10) var unit = '0'+unit;
  else var unit = unit;
  return unit;
}

}());