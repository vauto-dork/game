var express = require('express');
var router = express.Router();

/* GET admin page. */
router.get('/Admin', function(req, res, next) {
  res.render('admin', { title: 'Admin' });
});

/* GET add new player. */
router.get('/AddPlayer', function(req, res, next) {
  res.render('addPlayer', { title: 'New Player' });
});

/* GET players list page. */
router.get('/PlayersList', function(req, res, next) {
  res.render('playersList', { title: 'Players List' });
});

module.exports = router;
