var shell = require('shelljs');

exports.github = function(req, res, next) {

  // var message = shell.echo('hello world');
  shell.exec('cd /srv/www/islamireland.ie/present');
  var message = shell.exec('git pull');
  shell.exec('pm2 restart www');
  
  res.render('update', { title: 'Update', message: message });
}