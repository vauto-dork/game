var express = require('express');
var router = express.Router();
var bundler = require('./_bundler.js');

/* GET game history page. */
router.get('/', function(req, res, next) {
  res.render('gameHistory', { title: 'Game History', scripts: bundler.scripts('gameHistory')});
});

/* GET game history page. */
router.get('/edit', function(req, res, next) {
  res.render('editFinalizedGame', { title: 'Edit Finalized Game', scripts: bundler.scripts('editGame')});
});

module.exports = router;
