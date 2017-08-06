var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');
var GameModel = mongoose.model('Game');
var GameHelper = require('./gameHelper');
var DateHelper = require('./dateHelper');

var statsHelper = {
    round: function(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    },
    getPlayerObject: function(playerId, callback) {
        PlayerModel.findById(playerId, function (err, player) {
            if (err) return next(err);
            callback(player);
        });
    },
    hasPlayedGame: function(playerId, game) {
        return game.players.some(function(p) {
            return p.player._id == playerId;
        });
    },
    getPlayerPointsFromGame: function(playerId, game) {
        var player = game.players.filter(function(p) {
            return p.player._id == playerId;
        })[0];

        return player.points;
    },
    getGamesPlayed: function(playerId, callback) {
        var dateRange = DateHelper.getCurrentMonthRange();
        var startDateRange = dateRange[0];
        var endDateRange = dateRange[1];
    
        GameModel.find()
        .where('datePlayed').gte(startDateRange).lt(endDateRange)
        .populate('winner')
        .populate('players.player')
        .exec(function (err, games) {
            if (err) return next(err);
            
            var totalPoints = 0;
            var gamesPlayed = 0;
            var currentRating = 0;

            var result = games.map(function(game) {
                var hasPlayedGame = statsHelper.hasPlayedGame(playerId, game);
                var ratingDiff = 0;
                
                if(hasPlayedGame) {
                    totalPoints += statsHelper.getPlayerPointsFromGame(playerId, game);
                    gamesPlayed++;
                    var tempRating = statsHelper.round(totalPoints / (!gamesPlayed ? 1 : gamesPlayed), 2);
                    ratingDiff = statsHelper.round(tempRating - currentRating, 2);
                    currentRating = tempRating;
                }

                return {
                    gameDate: game.datePlayed,
                    played: hasPlayedGame,
                    rating: currentRating,
                    ratingDiff: ratingDiff
                };
            });
    
            callback(result);
        });
    }
}

router.get('/json/:id', function (req, res, next) {
    var playerId = req.params.id;
    statsHelper.getPlayerObject(playerId, function(player) {
        statsHelper.getGamesPlayed(playerId, function(gameData) {
            res.json({
                player: player,
                games: gameData.reverse()
            });
        });
    });
});

module.exports = router;