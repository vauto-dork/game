var express = require('express');
var mongoose = require('mongoose');
var ActiveGameModel = mongoose.model('ActiveGame');

module.exports = 
{
	saveGame: function (id, game, next, onSuccess) {
		
		if(!game || !game.players || game.players.length <3) {
			return next(new Error("Cannot save game with fewer than three players"));
		}
		
		var resultFunction = function (err, game) {
				if (err) return next(err);
				if(onSuccess) {
					var opts = [{ path: 'players.player', model: 'Player' }];
					ActiveGameModel.populate(game, opts, function(err, game){
						if(err) return next(err);
						onSuccess(game);
					});
				}
			};
		if(id) {
			// update existing game
			console.info("Saving game: ", id, ": ", game);
			ActiveGameModel.findByIdAndUpdate(id, game, resultFunction);
		}
		else {
			//create new game
			console.info("Creating game: ", game);
			ActiveGameModel.create(game, resultFunction);
		}
	}
}