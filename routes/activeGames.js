var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var ActiveGameModel = mongoose.model('ActiveGame');
var ActiveGameHelper = require('./activeGameHelper');

/* GET games listing. */
router.get('/json', function (req, res, next) {

	ActiveGameModel.find(function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('players.player')
	.exec();
});

/* POST save game. */
router.post('/save', function (req, res, next) {
	ActiveGameHelper.saveGame(null, req.body, next, function(game) {
		res.json(game);
	});
});

router.get('/:id', function (req, res, next) {
	ActiveGameModel.findById(req.params.id, function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('winner')
	.populate('players.player')
	.exec();
});

router.put('/:id', function (req, res, next) {
	ActiveGameHelper.saveGame(req.params.id, req.body, next, function(game) {
		res.end();
	});
});

router.delete('/:id', function (req, res, next) {
	ActiveGameModel.findByIdAndRemove(req.params.id, function (err, game) {
		if (err) return next(err);
		res.end();
	});
});

module.exports = router;
