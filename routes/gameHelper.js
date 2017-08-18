var express = require('express');
var mongoose = require('mongoose');
var GameModel = mongoose.model('Game');

var assignRanks = function(playerArray, aboveTenGamesOnly) {
	var previousRatingValue = 0;
	var currentRankValue = 0;
	playerArray.forEach(function(player) {
		if(aboveTenGamesOnly && player.gamesPlayed < 10) {
			player.rank = 0;
			return;
		}
		
		currentRankValue = currentRankValue + (player.rating !== previousRatingValue ? 1 : 0);
		player.rank = currentRankValue;
		previousRatingValue = player.rating;
	});
};

module.exports = 
{
	getPlayerPointsFromGame: function(playerId, game) {
		var player = game.players.filter(function(p) {
			return p.player._id == playerId;
		})[0];

		return player.points;
	},
    hasPlayedGame: function(playerId, game) {
        return game.players.some(function(p) {
            return p.player._id == playerId;
        });
    },
	getLeaderboardSnapshot: function(games, aboveTenGamesOnly) {
		var playerArray = [];

		games.forEach(function(game) {
			game.players.forEach(function(gamePlayer) {
				var playerId = gamePlayer.player._id;
				var playerPoints = gamePlayer.points;

				var playerExists = !playerArray.length
					? false
					: playerArray.some(function(playerArrayItem){
						return playerArrayItem.id == playerId;
					});
				
				if(playerExists) {
					playerArray.some(function(playerArrayItem) {
						if(playerArrayItem.id == playerId) {
							playerArrayItem.gamesPlayed++;
							playerArrayItem.points += playerPoints;
							return true;
						} else {
							return false;
						}
					});
				} else {
					playerArray.push({
						id: playerId,
						fullName: gamePlayer.player.getFullName(),
						gamesPlayed: 1,
						points: playerPoints
					});
				}
			});
		});

		var result = playerArray.map(function(player) {
			return {
				id: player.id,
				fullName: player.fullName,
				gamesPlayed: player.gamesPlayed,
				points: player.points,
				rating: player.points / player.gamesPlayed
			}
		}).sort(function(a,b) {
			return b.rating - a.rating;
		});
		
		assignRanks(result, aboveTenGamesOnly);
		return result;
	},
	saveGame: function (id, game, next, onSuccess) {
		
		if(!game || !game.players || game.players.length <3) {
			return next(new Error("Cannot save game with fewer than three players"));
		}
		
		var resultFunction = function (err, game) {
				if (err) return next(err);
				if(onSuccess) {
					var opts = [
					      { path: 'winner', model: 'Player' }
					    , { path: 'players.player', model: 'Player' }
					  ];
					GameModel.populate(game, opts, function(err, game){
						if(err) return next(err);
						onSuccess(game);
					});
				}
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