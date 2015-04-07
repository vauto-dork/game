var express = require('express');
var mongoose = require('mongoose');
var GameModel = mongoose.model('Game');

module.exports = 
{
	saveGame: function (id, game, next, onSuccess) {
		var resultFunction = function (err, game) {
				if (err) return next(err);
				if(onSuccess) onSuccess(game);
			};
		if(id) {
			// update existing game
			console.info("Saving game: ", id, ": ", game);
			GameModel.findByIdAndUpdate(id, game, resultFunction);
		}
		else {
			//create new game
			console.info("Creating game: ", game);
			GameModel.create(game, resultFunction);
		}
	}
}