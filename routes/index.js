var express = require('express');
var router = express.Router();
var settings = require('../controllers/settings');
var edit = require('../controllers/edit');
var update = require('../controllers/update');
var present = require('../controllers/present');
var timedef = "var settings="+JSON.stringify(settings);


var auth = require('http-auth');
var basic = auth.basic({
    realm: "Admin Area",
    file: __dirname + "/user.pass"
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ICCI Timetable' });
});
router.get('/timetable', function(req, res, next) {
  res.render('timetable', { title: 'Timetable', settings: settings, timedef: timedef });
});
router.get('/mobile', function(req, res, next) {
  res.render('mobile', { title: 'Timetable', settings: settings, timedef: timedef });
});


/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/edit', auth.connect(basic), edit.edit_get);

/* POST request for creating Genre. */
router.post('/edit', auth.connect(basic), edit.edit_post);

router.get('/update', auth.connect(basic), update.github);

router.get('/view', edit.view);

router.get('/present', present.view);

module.exports = router;



// app.get('/admin', auth.connect(basic), (req, res) => {
//     res.send(`Hello from admin area - ${req.user}!`);
// });