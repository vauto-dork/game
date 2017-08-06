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
    getGamesPlayed: function(playerId, callback) {
        var dateRange = DateHelper.getCurrentMonthRange();
        var startDateRange = dateRange[0];
        var endDateRange = dateRange[1];
    
        GameModel.find()
        .where('datePlayed').gte(startDateRange).lt(endDateRange)
        .populate('players.player')
        .exec(function (err, games) {
            if (err) return next(err);

            var previousRating = 0;
            var previousPosition = 0;

            var currentPositions = GameHelper.getLeaderboardSnapshot(games, false);
            var aboveTenGamesOnly = currentPositions.some(function(player) {
                return player.gamesPlayed >= 10;
            });

            var result = games.map(function(game, index) {
                var playerPosition = previousPosition;
                var playerRating = previousRating;
                var ratingDiff = 0;
                var positionDiff = 0;

                var leaderboard = GameHelper.getLeaderboardSnapshot(games.slice(0, index + 1), aboveTenGamesOnly);

                leaderboard.some(function(player) {
                    if(player.id == playerId) {
                        playerRating = statsHelper.round(player.rating, 2);
                        ratingDiff = statsHelper.round(playerRating - previousRating, 2);
                        previousRating = playerRating;

                        playerPosition = player.position;
                        positionDiff = playerPosition - previousPosition;
                        previousPosition = playerPosition;
                        return true;
                    }
                    else {
                        return false;
                    }
                });

                return {
                    gameDate: game.datePlayed,
                    played: GameHelper.hasPlayedGame(playerId, game),
                    rating: playerRating,
                    ratingDiff: ratingDiff,
                    position: playerPosition,
                    positionDiff: positionDiff
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
                gamesPlayed: gameData.filter(function(game) { return game.played; }).length,
                games: gameData.reverse()
            });
        });
    });
});

module.exports = router;