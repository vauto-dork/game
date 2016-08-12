var express = require('express');
var router = express.Router();
var bundler = require('./_bundler.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Leaderboard', scripts: bundler.scripts('index')});
});

/* GET new game page. */
router.get('/CreateGame', function(req, res, next) {
  res.render('createGame', { title: 'Create Game', scripts: bundler.scripts('createGame')});
});

/* GET game history page. */
router.get('/GameHistory', function(req, res, next) {
  res.render('gameHistory', { title: 'Game History', scripts: bundler.scripts('gameHistory')});
});

/* GET ranking history page. */
router.get('/RankingHistory', function(req, res, next) {
  res.render('rankingHistory', { title: 'Ranking History', scripts: bundler.scripts('rankingHistory')});
});

module.exports = router;
