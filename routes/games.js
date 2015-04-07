var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var GameModel = mongoose.model('Game');
var GameHelper = require('./gameHelper');

/* GET games listing. */
router.get('/', function (req, res, next) {

	GameModel.find(function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('winner')
	.exec();
});

/* POST save game. */
router.post('/', function (req, res, next) {
	GameHelper.saveGame(null, req.body, next, function(game) {
		game.populate("winner", function (err) {
			if (err) return next(err);
			res.json(game);
		});
	});
});

router.get('/:id', function (req, res, next) {
	GameModel.findById(req.params.id, function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('winner')
	.exec();
})

router.put('/:id', function (req, res, next) {
	GameHelper.saveGame(req.params.id, req.body, next, function(game) {
		res.end();
	});
})

router.delete('/:id', function (req, res, next) {
	GameModel.findByIdAndRemove(req.params.id, function (err, game) {
		if (err) return next(err);
		res.end();
	});
})

module.exports = router;
