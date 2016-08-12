var express = require('express');
var router = express.Router();
var bundler = require('./_bundler.js');

/* GET admin page. */
router.get('/Admin', function(req, res, next) {
  res.render('admin', { title: 'Admin', scripts: bundler.scripts('admin')});
});

/* GET add new player. */
router.get('/AddPlayer', function(req, res, next) {
  res.render('addPlayer', { title: 'New Player', scripts: bundler.scripts('addPlayer')});
});

/* GET players list page. */
router.get('/PlayersList', function(req, res, next) {
  res.render('playersList', { title: 'Players List', scripts: bundler.scripts('playersList')});
});

module.exports = router;
