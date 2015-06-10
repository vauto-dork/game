var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Leaderboard' });
});

/* GET playlist page. */
router.get('/Playlist', function(req, res, next) {
  res.render('createGame', { title: 'Create Game' });
});

/* GET new game page. */
router.get('/CreateGame', function(req, res, next) {
  res.render('createGame', { title: 'Create Game' });
});

/* GET active game page. */
router.get('/ActiveGames', function(req, res, next) {
  res.render('activeGames', { title: 'Active Games' });
});

module.exports = router;
