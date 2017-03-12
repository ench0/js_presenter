var express = require('express');
var router = express.Router();
var settings = require('../controllers/settings');
var jamaah = require('../controllers/jamaah');
var edit = require('../controllers/edit');
var present = require('../controllers/present');
var timedef = "var settings="+JSON.stringify(settings);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/timetable', function(req, res, next) {
  res.render('timetable', { title: 'Timetable', settings: settings, timedef: timedef });
});
router.get('/mobile', function(req, res, next) {
  res.render('mobile', { title: 'Timetable', settings: settings, timedef: timedef });
});

/* GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id) */
router.get('/edit', edit.edit_get);

/* POST request for creating Genre. */
router.post('/edit', edit.edit_post);

router.get('/view', edit.view);

router.get('/present', present.view);

module.exports = router;
