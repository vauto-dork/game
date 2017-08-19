var express = require('express');
var router = express.Router();
var bundler = require('./_bundler.js');

/* GET game history page. */
router.get('/', function(req, res, next) {
  res.render('gameHistory', {
    title: 'Game History',
    scripts: bundler.scripts('gameHistory'),
    pageModule: 'GameHistoryModule'
  });
});

/* GET game history page. */
router.get('/edit', function(req, res, next) {
  res.render('editFinalizedGame', {
    title: 'Edit Finalized Game',
    scripts: bundler.scripts('editGame'),
    pageModule: 'EditGameModule'
  });
});

/* GET game history admin page. */
router.get('/admin', function(req, res, next) {
  res.render('gameHistoryAdmin', {
    title: 'Game History (Admin)',
    scripts: bundler.scripts('gameHistory'),
    pageModule: 'GameHistoryModule'
  });
});

module.exports = router;
