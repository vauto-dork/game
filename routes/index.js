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

/* GET game history page. */
router.get('/GameHistory', function(req, res, next) {
  res.render('gameHistory', { title: 'Game History' });
});

/* GET ranking history page. */
router.get('/RankingHistory', function(req, res, next) {
  res.render('rankingHistory', { title: 'Ranking History' });
});

module.exports = router;
