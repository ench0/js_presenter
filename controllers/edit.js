var settings = require('./settings');
// var jamaah = require('./jamaah');
var time = require('./time');
// var fs = require('fs');
// var zlib = require('zlib');
var jsonfile = require('jsonfile')
var S = require('string');



// Edit form on GET
exports.edit_get = function(req, res, next) {
    // var message = null;   
    // console.log(req.query.message);

    var message = req.query.message;
    res.render('edit', { title: 'Edit Timetable', settings: settings, time: time, body: req.body, message: message });
};




// View on GET
exports.view = function(req, res, next) {
    // var message = null;   
    // console.log(req.query.message);

    // console.log("!!!!!"+time.fajr.disp)

    var message = req.query.message;
    res.render('view', { title: 'View Timetable', settings: settings, time: time, message: message });
};




// Handle Genre create on POST 
exports.edit_post = function(req, res, next) {
    
    //Check that the name field is not empty
    req.checkBody('title', 'Title required').notEmpty(); 
    
    //Trim and escape the name field. 
    // req.sanitize('body').escape();
    var body = S(req.body.body).stripTags().s
    // req.sanitize('body').trim();
    
    //Run the validators
    var errors = req.validationErrors();

    //Create a title object with escaped and trimmed data.
    // var title = new Title(
    //   { textTitle: req.body.text-title }
    // );
    
    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        console.log("Error!", settings)
        res.render('edit', { title: 'Edit Timetable', errors: errors, settings: settings, time: time, body: req.body, message: message });
    return;
    } 
    // else {
    //     // Data from form is valid.
    //     //Check if Genre with same name already exists
    //     Genre.findOne({ 'name': req.body.name })
    //         .exec( function(err, found_genre) {
    //              console.log('found_genre: ' + found_genre);
    //              if (err) { return next(err); }
                 
    //              if (found_genre) { 
    //                  //Genre exists, redirect to its detail page
    //                  res.redirect(found_genre.url);
    //              }
    //              else {
                     
    //                  genre.save(function (err) {
    //                    if (err) { return next(err); }
    //                    //Genre saved. Redirect to genre detail page
    //                    res.redirect(genre.url);
    //                  });
                     
    //              }
                 
    //          });
    // }

    else {
        var message = "Sucess!";
        // res.redirect("/edit");
        // console.log(req.body);

        var title = req.body.title;

        console.error("req.body.jamaahmethodfajr")

        console.log(req.body.jamaahmethodfajr);
        // jamaahmethods = (req.body.jamaahmethods).split(",");

        var settingsnew = {
                "title":req.body.title,
                "refresh":req.body.refresh,
                "hijrioffset":req.body.hijrioffset,
                "body":body,
                "announcement":req.body.announcement,
                "jummuahtime": req.body.jummuahtimehour+':'+req.body.jummuahtimeminute,
                "join": req.body.join,
                "jamaahmethods":req.body.jamaahmethodfajr+",,"+req.body.jamaahmethoddhuhr+","+req.body.jamaahmethodasr+","+req.body.jamaahmethodmaghrib+","+req.body.jamaahmethodisha,
                "jamaahoffsets":req.body.jamaahoffsetfajrhour+":"+req.body.jamaahoffsetfajrminute+",,"+req.body.jamaahoffsetdhuhrhour+":"+req.body.jamaahoffsetdhuhrminute+","+req.body.jamaahoffsetasrhour+":"+req.body.jamaahoffsetasrminute+","+req.body.jamaahoffsetmaghribhour+":"+req.body.jamaahoffsetmaghribminute+","+req.body.jamaahoffsetishahour+":"+req.body.jamaahoffsetishaminute,
                "refreshmessage":req.body.refreshmessage
        };




        // var readable = fs.createReadStream(__dirname + '/greet.txt');
        // var writable = fs.createWriteStream(__dirname + '/greetcopy.txt');
        // var compressed = fs.createWriteStream(__dirname + '/greet.txt.gz');
        // var gzip = zlib.createGzip();
        // readable.pipe(writable);
        // readable.pipe(gzip).pipe(compressed);


        
        var file = __dirname+'/settings.json'
        
        jsonfile.writeFile(file, settingsnew, {spaces: 2}, function(err) {
            console.error("errors")
            console.error(err)
            console.error("file")
            console.error(file)
            console.error("settings")
            console.error(settingsnew)
        })


        //restart
        var sys = require('sys')
        var exec = require('child_process').exec;
        var child;
        var sys = require('sys')
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) { sys.puts(stdout) }
        exec("pm2 reload www", puts);




        res.redirect("/view/?message=Sucess!");
        // res.render('view', { title: 'View Timetable', settingsnew: settingsnew   , time: time, message: message });

        // console.log(settings);

        // res.render('edit', { title: 'Edit Timetable', settings: settings, message: message, time: time, body: req.body });
    }

};