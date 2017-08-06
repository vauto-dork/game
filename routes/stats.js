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

            var totalPoints = 0;
            var gamesPlayed = 0;
            var currentRating = 0;
            var previousPosition = 0;

            var currentPositions = GameHelper.getLeaderboardSnapshot(games, false);
            var aboveTenGamesOnly = currentPositions.some(function(player) {
                return player.gamesPlayed >= 10;
            });

            var result = games.map(function(game, index) {
                var hasPlayedGame = GameHelper.hasPlayedGame(playerId, game);
                var ratingDiff = 0;
                
                if(hasPlayedGame) {
                    totalPoints += GameHelper.getPlayerPointsFromGame(playerId, game);
                    gamesPlayed++;
                    var tempRating = statsHelper.round(totalPoints / (!gamesPlayed ? 1 : gamesPlayed), 2);
                    ratingDiff = statsHelper.round(tempRating - currentRating, 2);
                    currentRating = tempRating;
                }

                var leaderboard = GameHelper.getLeaderboardSnapshot(games.slice(0, index + 1), aboveTenGamesOnly);
                var playerPosition = 0;
                leaderboard.some(function(player) {
                    if(player.id == playerId) {
                        playerPosition = player.position;
                        return true;
                    }
                    else {
                        return false;
                    }
                });

                var positionDiff = playerPosition - previousPosition;
                previousPosition = playerPosition || previousPosition;

                return {
                    gameDate: game.datePlayed,
                    played: hasPlayedGame,
                    rating: currentRating,
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