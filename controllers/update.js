// http://nodejs.org/api.html#_child_processes
var sys = require('sys')
var exec = require('child_process').exec;
var util = require('util')
var child;


exports.github = function(req, res, next) {
  // executes `pwd`
  child = exec("/usr/bin/update-present", function (error, stdout, stderr) {
    var message = "Updating!";
    var stdout = stdout;
    // sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    
    }
  });
  console.log('stdout: ' + child.stdout);
  var message = "Done! "+"<code>"+util.inspect(child.stdout)+"</code>";
  res.render('update', { title: 'Update', message: message });

  // or more concisely
  // var sys = require('sys')
  // var exec = require('child_process').exec;
  // function puts(error, stdout, stderr) { sys.puts(stdout) }
  // exec("ls -la", puts);
}