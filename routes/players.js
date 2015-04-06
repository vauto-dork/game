var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');

/* GET players listing. */
router.get('/', function (req, res, next) {
	PlayerModel.find(function (err, players) {
		if(err) return next(err);
		res.json(players);
	})
});

/* POST save a player. */
router.post('/', function (req, res, next) {
	console.info("saving player: ", req.body);
	if(!req.body) {
		return next(new Error("Cannot save a player without data!"));
	}
	if(!req.body.firstName) {
		return next(new Error("Cannot save a player without a first name!"));
	}
	if(!req.body.lastName) {
		return next(new Error("Cannot save a player without a last name!"));
	}
	PlayerModel.create(req.body, function (err, player){
		if(err) return next(err);
		res.json(player);
	})
});

/* GET player. */
router.get('/:id', function (req, res, next) {
	PlayerModel.findById(req.params.id, function (err, player){
		if(err) return next(err);
		res.json(player);
	})
});

/* PUT update a player. */
router.put('/:id', function (req, res, next) {
	PlayerModel.findByIdAndUpdate(req.params.id, req.body, function (err, player) {
		if(err) return next(err);
		res.end();
		// res.json(player);
	})
});

router.delete('/:id', function (req, res, next) {
	PlayerModel.findByIdAndRemove(req.params.id, function (err, player){
		if (err) return next(err);
		res.end();
		// res.json(player);
	})
})

module.exports = router;
