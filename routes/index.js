var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Leaderboard' });
});

/* GET home page. */
router.get('/Playlist', function(req, res, next) {
  res.render('playlist', { title: 'Playlist Maker' });
});

module.exports = router;
