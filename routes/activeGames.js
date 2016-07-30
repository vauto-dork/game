var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var ActiveGameModel = mongoose.model('ActiveGame');
var ActiveGameHelper = require('./activeGameHelper');
var bundles = require('../bundle.result.json');

/* GET active game page. */
router.get('/', function(req, res, next) {
  res.render('activeGames', { title: 'Active Games', bundle: bundles});
});

/* GET edit active game page. */
router.get('/edit', function(req, res, next) {
  res.render('editActiveGame', { title: 'Edit Game', bundle: bundles});
});

/* GET games listing. */
router.get('/json', function (req, res, next) {

	ActiveGameModel.find(function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('players.player')
	.sort({ datePlayed: -1 })
	.exec();
});

/* POST save game. */
router.post('/save', function (req, res, next) {
	ActiveGameHelper.saveGame(null, req.body, next, function(game) {
		res.json(game);
	});
});

router.get('/json/:id', function (req, res, next) {
	ActiveGameModel.findById(req.params.id, function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('players.player')
	.exec();
});

router.put('/json/:id', function (req, res, next) {
	ActiveGameHelper.saveGame(req.params.id, req.body, next, function(game) {
		res.end();
	});
});

router.delete('/json/:id', function (req, res, next) {
	ActiveGameModel.findByIdAndRemove(req.params.id, function (err, game) {
		if (err) return next(err);
		res.end();
	});
});

module.exports = router;
