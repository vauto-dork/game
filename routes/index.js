var express = require('express');
var router = express.Router();
var bundler = require('./_bundler.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Leaderboard',
    scripts: bundler.scripts('index'),
    pageModule: 'LeaderboardModule'
  });
});

/* GET new game page. */
router.get('/CreateGame', function(req, res, next) {
  res.render('createGame', {
    title: 'Create Game',
    scripts: bundler.scripts('createGame'),
    pageModule: 'CreateGameModule'
  });
});

/* GET ranking history page. */
router.get('/RankingHistory', function(req, res, next) {
  res.render('rankingHistory', {
    title: 'Ranking History',
    scripts: bundler.scripts('rankingHistory'),
    pageModule: 'RankingHistoryModule'
  });
});

/* GET Dork of the Year page. */
router.get('/DorkOfTheYear', function(req, res, next) {
  res.render('dorkOfTheYear', {
    title: 'Dork of the Year',
    scripts: bundler.scripts('dorkOfTheYear'),
    pageModule: 'DotyModule'
  });
});

module.exports = router;
