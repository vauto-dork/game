var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');
var GameModel = mongoose.model('Game');

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

/**
 * Return a list of all players ranked by the current month's games.
 * Alternatively, provide a month and year to get the ranked list of active players in the given time period.
 * The list should be sorted in ascending order by rank.
 * Query params:
 * 	month - integer
 * 	(Optional) year - integer. Default value is the current year.
 *
 * @return A list of ranked players.
 * <pre>
 * 		{
 * 			player: { <see player object> },
 * 			totalPoints: int,
 * 			gamesPlayed: int,
 *	 		rank: int
 *		}
 * 	</pre>
 */
router.get('/ranked/', function (req, res, next) {
	// Get date ranges
	var now = new Date();
	var year = req.query.year ? parseInt(req.query.year) : now.getUTCFullYear();
	var month;
	var endMonth;
	if(req.query.month) {
		month = parseInt(req.query.month);
		endMonth = month+1;
		if(endMonth > 11) endMonth = 0;
	} else {
		if(year) {
			month = 0;
			endMonth = 11;
		}
	}
	var startDateRange = new Date(year, month, 1);
	var endDateRange = new Date(year, endMonth, 1);

	// get all games that happened in the time span
	GameModel.find()
		.select('winner datePlayed players')
		.where('datePlayed').gte(startDateRange).lt(endDateRange)
		.populate('players')
		.populate('players.player')
		.exec(function (err, games) {
			if(err) return next(err);

			var rankedPlayers = [];
			if(games) {
				// loop through all games
				for (var i = 0; i < games.length; i++) {
					var game = games[i];
					// combine each player's stats
					for(var j=0; j < game.players.length; j++) {
						var gamePlayer = game.players[j];
						// TODO There's gotta be a more efficient way to do this...
						rankedPlayers = getRankedPlayerObject(rankedPlayers, gamePlayer);
					} // end loop for players
				} // end loop for game
				//all ranked players are set at this point

				// sort array by rank (points per games played)
				rankedPlayers.sort(function(a,b){
					var aAvg = getPlayerAverage(a);
					var bAvg = getPlayerAverage(b);
					return bAvg - aAvg;
				})
				// add rank value to each player so it is explicit
				for(var i=0; i<rankedPlayers.length; i++) {
					rankedPlayers[i].rank = i+1;
				}
			}

			res.json(rankedPlayers);
		});
});

var getPlayerAverage = function(gamePlayer) {
	return gamePlayer.totalPoints / gamePlayer.gamesPlayed;
}

var getEmptyRankedPlayerObject = function() {
	return {
		player: {},
		totalPoints: 0,
		gamesPlayed: 0,
		rank: 0
	};
}

var getRankedPlayerObject = function(rankedPlayersArr, gamePlayer) {
	// first look for an existing player. If found then update it.
	for(var i=0; i < rankedPlayersArr.length; i++) {
		var rankedPlayer = rankedPlayersArr[i];
		if(rankedPlayer.player._id == gamePlayer.player._id) {
			rankedPlayersArr[i] = addRankedPlayerObjects(rankedPlayer, gamePlayer);
			return rankedPlayersArr;
		}
	}
	// No existing player was found so add a new one.
	var newRankedPlayer = addRankedPlayerObjects(
		getEmptyRankedPlayerObject(), gamePlayer);
	rankedPlayersArr.push(newRankedPlayer);
	return rankedPlayersArr;
}

var addRankedPlayerObjects = function(rp1, rp2) {
	rp1.player = rp2.player;
	rp1.totalPoints += rp2.points;
	rp1.gamesPlayed++;
	return rp1;
}

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
