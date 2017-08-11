var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');
var GameModel = mongoose.model('Game');
var GameHelper = require('./gameHelper');
var DateHelper = require('./dateHelper');
var bundler = require('./_bundler.js');

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
    getGamesPlayed: function(playerId, dateRange, callback) {
        var startDateRange = dateRange[0];
        var endDateRange = dateRange[1];
    
        GameModel.find()
        .where('datePlayed').gte(startDateRange).lt(endDateRange)
        .populate('players.player')
        .sort({ datePlayed: 1 })
        .exec(function (err, games) {
            if (err) return next(err);

            var aboveTenGamesOnly = true;
            // This leads to weird user expectations if the ranks suddenly disappear
            // and re-arrange in the middle of the month.
            //
            // var currentRanks = GameHelper.getLeaderboardSnapshot(games, false);
            // var aboveTenGamesOnly = currentRanks.some(function(player) {
            //     return player.gamesPlayed >= 10;
            // });

            var previousRating = 0;
            var previousRank = 0;
            var totalPoints = 0;

            var result = games.map(function(game, index) {
                var playerRank = previousRank;
                var playerRating = previousRating;
                var ratingDiff = 0;
                var rankDiff = 0;

                var leaderboard = GameHelper.getLeaderboardSnapshot(games.slice(0, index + 1), aboveTenGamesOnly);

                leaderboard.some(function(player) {
                    if(player.id == playerId) {
                        playerRating = statsHelper.round(player.rating, 2);
                        ratingDiff = statsHelper.round(playerRating - previousRating, 2);
                        previousRating = playerRating;

                        playerRank = player.rank;
                        rankDiff = previousRank === 0 ? playerRank : previousRank - playerRank;
                        previousRank = playerRank;

                        // Really only care to assign this on the last iteration of the loop (points after last game)
                        totalPoints = player.points;
                        return true;
                    }
                    else {
                        return false;
                    }
                });

                return {
                    gameId: game._id,
                    gameDate: game.datePlayed,
                    played: GameHelper.hasPlayedGame(playerId, game),
                    rating: playerRating,
                    ratingDiff: ratingDiff,
                    rank: playerRank,
                    rankDiff: rankDiff
                };
            });
    
            callback(result, totalPoints);
        });
    }
}

/* GET page. */
router.get('/', function(req, res, next) {
    res.render('playerStats', {
        title: 'Player Stats',
        scripts: bundler.scripts('playerStats')
    });
  });

router.get('/:id', function(req, res, next) {
    var playerId = req.params.id;
    res.render('playerStats', {
        title: 'Player Stats',
        scripts: bundler.scripts('playerStats'),
        playerId: playerId
    });
  });

/* GET player's game history.
 * @query (Optional) month - Get all games for this month. Default is current month.
 * @query (Optional) year - Get all games for this year. Default is current year.
 */
router.get('/json/:id', function (req, res, next) {
    var playerId = req.params.id;
    var dateRange = DateHelper.monthDefined(req) && DateHelper.yearDefined(req)
        ? DateHelper.getDateRange(req)
        : DateHelper.getCurrentMonthRange();
    
    statsHelper.getPlayerObject(playerId, function(player) {
        statsHelper.getGamesPlayed(playerId, dateRange, function(gameData, totalPoints) {
            res.json({
                player: player,
                dateRange: dateRange,
                totalPoints: totalPoints,
                gamesPlayed: gameData.filter(function(game) { return game.played; }).length,
                games: gameData.reverse()
            });
        });
    });
});

module.exports = router;