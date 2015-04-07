var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var GamePlayerModel = mongoose.model('GamePlayer');
var GameHelper = require('./gameHelper');

router.post('/', function (req, res, next){
	if(!req.body || req.body.length == 0) {
		return next(new Error("No game data and scores to save."));
	}
	
	var gamePlayers = req.body;
	// First save the game object.
	GameHelper.saveGame(null, gamePlayers[0].game, next, function (game) {
		// Make sure all games players have the game id (in case the game is new).
		for (var i=0; i<gamePlayers.length; i++) {
			gamePlayers[i].game._id = game._id;
		}
		// insert
		GamePlayerModel.create(gamePlayers, function (err, docs) {
			if (err) return next(err);
			res.end();
		});
	});
});

router.get('/:gameId', function (req, res, next) {
	GamePlayerModel.find(
			{'game':{'_id':req.params.gameId}},
			function (err, gamePlayers) {
		if (err) return next(err);
		res.json(gamePlayers);
	})
	.populate('game')
	.populate('player')
	.exec();
});

router.get('/', function (req, res, next) {
	//GamePlayerModel.find(function (err, gamePlayers) {
	//	if (err) return next(err);
	//	res.json(gamePlayers);
	//})
	//.select('game player points place')
	//.populate('game')
	//.populate('player')
	//.exec();

	GamePlayerModel
		.find()
		.populate({
			path: 'game player'
		})
		.exec(function (err, gamePlayers) {
			if (err) return next(err);
			res.json(gamePlayers);
		})
});

module.exports = router;