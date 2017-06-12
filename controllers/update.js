// http://nodejs.org/api.html#_child_processes
var sys = require('sys')
var exec = require('child_process').exec;
var util = require('util')
var child;
var shell = require('shelljs');

exports.github = function(req, res, next) {

  // var message = shell.echo('hello world');
  // var message = shell.exec('/Users/ensar/update-present');
  var message = shell.exec('/home/icci/update-present');
  
  res.render('update', { title: 'Update', message: message });

  // or more concisely
  // var sys = require('sys')
  // var exec = require('child_process').exec;
  // function puts(error, stdout, stderr) { sys.puts(stdout) }
  // exec("ls -la", puts);
}