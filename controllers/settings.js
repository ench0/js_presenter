// Read Synchrously
// var fs = require("fs");
// const path = require('path');

var jsonfile = require('jsonfile')

var file = __dirname+'/settings.json'



// settingsFile = path.join(__dirname, '../public', 'js', 'db', 'settings.json')
// settingsFile = './public/js/db/settings.json';

// settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
// express.static(path.join(__dirname 'public'))

// console.log(settingsFile);
// console.log(settings);

// module.exports = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));

module.exports = jsonfile.readFileSync(file)