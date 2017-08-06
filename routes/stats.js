var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');
var GameModel = mongoose.model('Game');
var GameHelper = require('./gameHelper');
var DateHelper = require('./dateHelper');

var statsHelper = {
    hasPlayedGame: function(playerId, game) {
        return game.players.some(function(p) {
            return p.player._id == playerId;
        });
    },
    getGamesPlayed: function(playerId, res) {
        var dateRange = DateHelper.getCurrentMonthRange();
        var startDateRange = dateRange[0];
        var endDateRange = dateRange[1];
    
        GameModel.find()
        .where('datePlayed').gte(startDateRange).lt(endDateRange)
        .populate('winner')
        .populate('players.player')
        .sort({ datePlayed: -1 })
        .exec(function (err, games) {
            if (err) return next(err);
            
            var result = [];
    
            games.forEach(function(game) {
                result.push({
                    gameDate: game.datePlayed,
                    played: statsHelper.hasPlayedGame(playerId, game)
                });
            });
    
            res.json(result);
        });
    }
}

router.get('/json/:id', function (req, res, next) {
    var playerId = req.params.id;
    statsHelper.getGamesPlayed(playerId, res);
});

module.exports = router;