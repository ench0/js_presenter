/**
 *     @file Prayer Timetable
 *     @author Ensar ensar@farend.net
 *     @copyright Ensar ensar@farend.net
 *     @license Used momentjs library for time manipulation, rest of code free for distribution provided this info is included.
 */

(function(){

var tomorrow;
var simulate = 2*60+3;

// --------- TIME CONSTRUCTOR --------- //
var Time = function(num) {

  // this.tomorrow = tomorrow;
  this.num = num;

  // this.tomorrow = 0;
  // console.log("Time",this.tomorrow);
  // console.log("num",this.num);


  // this.now = moment().tz("Europe/Dublin").add(tomorrow, 'd');
  this.now = moment().add(simulate, 'm');//.add(this.tomorrow, 'd');
  this.daybegin = moment().add(simulate, 'm').add(this.tomorrow, 'd').startOf('day');
  this.dayend = moment().add(simulate, 'm').add(this.tomorrow, 'd').endOf('day');
  // console.log("NOW",this.now,"BEGIN",this.daybegin,"END",this.dayend)

  // if (this.prayer == "isha") this.adj = this.adj+1;
  this.year = moment().add(simulate, 'm').add(this.tomorrow, 'd').format("YYYY");
  this.month = moment().add(simulate, 'm').add(this.tomorrow, 'd').format("MM");//.toLowerCase();
  // console.log(this.month)
  if ((this.now.isDST()) && this.month == "03") this.dst = 1;
  else if (!(this.now.isDST()) && this.month == "10") this.dst = -1;
  else this.dst = 0;

  if (this.num > 0 && this.num <7) {
  this.day = moment().add(simulate, 'm').add(this.tomorrow, 'd').format("D");
  this.string = this.year+'-'+this.month+'-'+this.day+' '+timetable[this.month][this.day][this.num-1];
  this.full = moment(this.string).add(this.dst, 'h');
  }
  else if (this.num > 6) {
    this.full = this.dayend//.add(this.tomorrow, 'd');//for end
  }
  else {
    this.full = this.daybegin//.add(this.tomorrow, 'd');//for layl
    // console.log("!!",this.tomorrow,this.full,this.now)

  }

  this.disp = (this.full).format("D HH:mm");

}


// --------- PRAYER CONSTRUCTOR --------- //
var Prayer = function(num) {
  this.num = num;

  if (this.num > 5) this.numnext = 0; else this.numnext = this.num + 1; 

  switch (this.num) {
    case 0: this.name = "layl"; this.namenext = "fajr"; break;
    case 1: this.name = "fajr"; this.namenext = "dhuhr"; break;
    case 2: this.name = "shurooq"; this.namenext = "dhuhr"; break;
    case 3: this.name = "dhuhr"; this.namenext = "asr"; break;
    case 4: this.name = "asr"; this.namenext = "maghrib"; break;
    case 5: this.name = "maghrib"; this.namenext = "isha"; break;
    case 6: this.name = "isha"; this.namenext = "end"; break;
    case 7: this.name = "end"; this.namenext = "layl"; break;
  }
  // define prayer time
  this.time = new Time(this.num);
  this.timenext = new Time(this.numnext);

  // console.log(this.time.full,this.time.now);
  // define if pending
  if (this.time.full.isAfter(this.time.now)) {
    this.pending = true;
  }
  else this.pending = false;

  // console.log(this.num,this.name,this.pending,this.time.disp)

}



// --------- PRAYERS DEF --------- //
var prayers = function(tomorrow) {

  var tomorrow = tomorrow;
  // console.log(tomorrow)
  var layl = new Prayer(0), fajr = new Prayer(1), shurooq = new Prayer(2), dhuhr = new Prayer(3)
  var asr = new Prayer(4), maghrib = new Prayer(5), isha = new Prayer(6), end = new Prayer(7)

  // console.log(isha.pending)

  // pending/current calc
  var list = [layl, fajr, shurooq, dhuhr, asr, maghrib, isha, end]
  var pendingcalc = function() {
    for (i in list) {
      // console.log(list[i]);
      if (list[i].pending == true) {
        var next = list[i];
        console.log(i)
        if (i>0 && i<7) {var current = list[i-1]; var tomorrow = 0;console.log("1st"); return [current, next,tomorrow];
}
        else if (i <1) {var current = list[0]; var tomorrow = 0;console.log("2nd"); return [current, next,tomorrow];
}//layl
        else  if (i >6) {var current = list[6]; var tomorrow = 1;console.log("3rd"); return [current, next,tomorrow];
}//isha
      }
      if (list[i] == 7) {
        console.log("4th");
        return [list[6], list[7], 1]//if current is isha, the above if loop would never run
      }
    }
  } 
  var pendingcalc = pendingcalc();
  var current = pendingcalc[0];
  var pending = pendingcalc[1];
  tomorrow = pendingcalc[2];


  // console.log(current.name);
  // console.log(pending.name);
  // console.log(tomorrow);
  Time.prototype.tomorrow = tomorrow;
  
  // console.log("pending:", layl.name, layl.pending);
  // console.log("pending:", fajr.name, fajr.pending);
  // console.log("pending:", shurooq.name, shurooq.pending);
  // console.log("pending:", dhuhr.name, dhuhr.pending);
  // console.log("pending:", asr.name, asr.pending);
  // console.log("pending:", maghrib.name, maghrib.pending);
  // console.log("pending:", isha.name, isha.pending);
  // console.log("pending:", end.name, end.pending);
  // console.log("-------");
  // console.log("passed:", fajr.name, fajr.passed);
  // console.log("passed:", shurooq.name, shurooq.passed);
  // console.log("passed:", dhuhr.name, dhuhr.passed);
  // console.log("passed:", asr.name, asr.passed);
  // console.log("passed:", maghrib.name, maghrib.passed);
  // console.log("passed:", isha.name, isha.passed);

  // current - next
  // if (tomorrow == 1) {var current = isha; var next = fajr}
  // else {
  //   if (now.isAfter(isha.time)) {var current = isha; var next = fajr} else if (now.isAfter(maghrib.time)) {var current = maghrib; var next = isha}
  //   else if (now.isAfter(asr.time)) {var current = asr; var next = maghrib} else if (now.isAfter(dhuhr.time)) {var current = dhuhr; var next = asr}
  //   else if (now.isAfter(fajr.time)) {var current = fajr; var next = dhuhr} else {var current = isha; next = fajr}
  // }
  // console.log(pending)

  def = {fajr: fajr, shurooq: shurooq, dhuhr: dhuhr, asr: asr, maghrib: maghrib, isha: isha
    , current: current, pending: pending, tomorrow: tomorrow
  }

  return {def: def};

};


// console.log(prayers.def.tomorrow)
// prayers = prayers(prayers.def.tomorrow)

// --------- JAMAAH DEF --------- //
var jamaah = function() {

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






// --------- TIME DISP --------- //
var timeDisp = (function() {
  var tomorrow = prayers().def.tomorrow;
//   var now = moment().tz("Europe/Dublin");
//   var pray = prayers();
//   var current = pray.def.current;
//   var night = now<current.time;
  // var prayers = prayers();
  var def = prayers(tomorrow).def;
  var now = moment().add(simulate, 'm');
  var pending = def.pending;
  if (pending.num == 7) pending = def.fajr;

  console.log(tomorrow);
  // console.log(def.current.time.now);
  // console.log(now);
  


//   if(current.name == "isha" && !night) {
//     tomorrow = 1;
//     var countcurr = current.time.from(now);
//   }
//   else if(current.name == "isha" && night){
//     tomorrow = 0;
//     var countcurr = (current.time).subtract(1,'d').from(now);
//   }
//   else {
//     tomorrow = 0;
//     var countcurr = current.time.from(now);
//   }
//   var pray = prayers(tomorrow);

//   var next = prayers(tomorrow).def.next;
  
  var diffnext = (def.pending.time.full).add(1, 's').diff(now, 'seconds');//add 1 s
  var countnext = moment.duration(diffnext, 'seconds');
//   now = moment().tz("Europe/Dublin").add(tomorrow,'d');

//   // console.log(now.isDST());
// console.log(def.pending.time.full);

// console.log(diffnext, countnext);
  if (def.current.name == "layl") tomorrow = 0;
  console.log("current",def.current.name);
  console.log("pending",def.pending.name)


  var gregorian = now.format("dddd, D MMMM YYYY");
  var hijri = now.add(settings.hijrioffset, 'd').format("iD iMMMM iYYYY");

  document.getElementById("time").innerHTML = now.format("HH:mm:ss");
  document.getElementById("date").innerHTML = gregorian + "<br />" + hijri;

//   // // if Ramadan
//   // // if (def.now.format('iMMMM') == "Ramadan") {
//   // //   var iftar = true;
//   // // }
//   // // else {var iftar = false}

//   // // if Friday do Jummuah
//   // // if (def.now.format('dddd') == "Friday") {calcDhuhr = def.jummuahTime.format('HH:mm')}
//   // // else {calcDhuhr =  def.dhuhrJamaah.format('HH:mm')}


  // Prayer time display
  for(i=0,list=["fajr","shurooq","dhuhr","asr","maghrib","isha"];i<6;i++){
    document.getElementById("prayer-time-"+def[list[i]].name).innerHTML = def[list[i]].time.disp;
    document.getElementById("row-"+def[list[i]].name).className = "row prayers";//reset
    // document.getElementById("row-"+pending.name).className = "row prayers warning";
  }

//    // //document.getElementById("days-year").innerHTML = def.dayOfYear + "/" + def.daysInYear;

   document.getElementById("pending-name").innerHTML = "curr: "+def.current.time.disp + "<br/>pend: " + def.pending.time.disp + "<br/>" + def.pending.name;
   document.getElementById("timetoprayer").innerHTML = countnext.hours()+':'+prepend(countnext.minutes())+':'+prepend(countnext.seconds());

//   // console.reset = function () {
//   //   return process.stdout.write('\033c');
//   // }();

//   // if countnext < 60

  setTimeout(function(){timeDisp()}, 1000);
});
timeDisp();

function prepend(num) {
  if (num < 10) var num = '0'+num; else var num = num;
  return num;
}

}());