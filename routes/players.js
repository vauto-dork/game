var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');
var GameModel = mongoose.model('Game');

/**
 * GET players.
 * @queryParam sort - True to sort the result by display name, false to not.
 * @return List of players.
 */
router.get('/', function (req, res, next) {
	// TODO Make this return only Active players. At the time of writing there is no concept of 'Active' players.
	PlayerModel.find(function (err, players) {
		if(err) return next(err);
		//sort
		if(req.query.sort) {
			var stripTheRegex = /^The/;
			if (players) {
				players.sort(function (a, b) {
					var aName = a.getAbbreviatedName().replace(stripTheRegex, "").trim();
					var bName = b.getAbbreviatedName().replace(stripTheRegex, "").trim();
					return aName.localeCompare(bName);
				});
			}
		}
		res.json(players);
	})
});

/**
 * Get a list of players that are sorted by data from a time span.
 * This is defined as "/players/sort/" because there is already a POST for "/players/"
 * @query (Optional) month - Sort players by data from this month. Default is all year.
 * @query (Optional) year - Sort players by data from this year. Default is current year.
 * @body List of players to sort
 */
router.post('/sort/', function (req, res, next) {
	var rankedPlayers = getRankedPlayers(req, next, function(rankedPlayers) {
		var players = [];
		for(var i=0; i<rankedPlayers.length; i++) {
			players.push(rankedPlayers[i].player);
		}
		res.json(players);
	});
});

/* POST save a player. */
router.post('/', function (req, res, next) {
	if(!req.body) {
		return next(new Error("Cannot save a player without data!"));
	}
	if (req.body && req.body.constructor === Array) {
		PlayerModel.create(req.body, function(err, player) {
			if(err) return next(err);
			res.json();
		});
	} else {
		if(!req.body.firstName) {
			return next(new Error("Cannot save a player without a first name!"));
		}
		if(!req.body.lastName) {
			return next(new Error("Cannot save a player without a last name!"));
		}
		PlayerModel.create(req.body, function (err, player){
			if(err) return next(err);
			res.json(player);
		});
	}
});

/**
 * Return a list of all players ranked by the current month's games.
 * Alternatively, provide a month and year to get the ranked list of active players in the given time period.
 * The list should be sorted in ascending order by rank.
 * Query params:
 * 	month - integer
 * 	(Optional) year - integer. Default value is the current year.
 * 	sort - Type of sort to do. Default is by rank.
 * 		- 0: rank - Sort by rank ascending.
 * 		- 1: game - Game order. Example 1,3,5,7,9,10,8,6,4,2
 * Post params:
 *  playerArray - array of players. Get the ranks for only these players
 *  sortType
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
router.post('/ranked/sort/', function(req, res, next) {
	var rankedPlayers = getRankedPlayers(req, next, function(rankedPlayers) {
		res.json(rankedPlayers);
	});
});
router.get('/ranked/', function(req, res, next) {
	var rankedPlayers = getRankedPlayers(req, next, function(rankedPlayers) {
		res.json(rankedPlayers);
	});
});

function getRankedPlayers(req, next, success) {
	// Get date ranges
	var dateRange = getDateRange(req);
	var startDateRange = dateRange[0];
	var endDateRange = dateRange[1];

	// validate sort type
	var sortType = req.query.sortType;
	if(!sortType) {
		sortType = PlayerModel.SortTypes.Rating;
	}
	if(!PlayerModel.isSortTypeValid(sortType)) {
		return next(new Error("Invalid sort type \"" + sortType + "\"."));
	}

	// get all games that happened in the time span

	var returnAllPlayers = true;
	if (req.body && req.body.constructor === Array) {
		returnAllPlayers = false;
	}
	query = GameModel.find()
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
						rankedPlayers = pushGamePlayerToRankedArray(rankedPlayers, gamePlayer);
					} // end loop for players
				} // end loop for game
				//all ranked players are set at this point

				if(!returnAllPlayers) {
					// remove players not in the request body
					for(var k=0; k<rankedPlayers.length; k++) {
						if(!PlayerModel.arrContains(req.body, rankedPlayers[k].player)) {
							// Not interested in this player, remove it from the array
							rankedPlayers.splice(k--, 1);
						}
					}
				}

				// sort array by rank (points per games played)
				PlayerModel.rankedPlayerSort(rankedPlayers, PlayerModel.SortTypes.Rating);
				// add rank value to each player so it is explicit
				for(var i=0; i<rankedPlayers.length; i++) {
					rankedPlayers[i].rank = i+1;
				}
			}

			// Get array of all requested player ids
			var requestedPlayerIds = null;
			if(!returnAllPlayers) {
				requestedPlayerIds = [];
				for(var p=0; p<req.body.length; p++) {
					requestedPlayerIds.push(req.body[p]._id);
				}
			}

			// Now fetch the complete list of players and append any
			// of them to the list if need be. These are the "un-ranked" players.
			var where = returnAllPlayers ? {} : {'_id': {$in: requestedPlayerIds}};
			PlayerModel.find(where, function (err, players) {
				if (err) return next(err);

				for (var i = 0; i < players.length; i++) {
					var player = players[i];
					// If the player is not ranked then add it as an unranked player.
					if (!PlayerModel.rankedArrContains(rankedPlayers, player)) {
						rankedPlayers.push(PlayerModel.getEmptyRankedPlayerObject(player));
					}
				}

				// rating sort is already done so don't redo that work.
				if(sortType != PlayerModel.SortTypes.Rating) {
					PlayerModel.rankedPlayerSort(rankedPlayers, sortType);
				}
				success(rankedPlayers);
			})
		});
}

/**
 * Get date ranges from a request object.
 * @param req Should contain a month and optionally a year. Default is current year.
 * @returns {*[]} Array containing the start date and end date.
 */
function getDateRange(req) {
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
	return [startDateRange, endDateRange];
}

function pushGamePlayerToRankedArray(rankedPlayersArr, gamePlayer) {
	// first look for an existing player. If found then update it.
	for(var i=0; i < rankedPlayersArr.length; i++) {
		var rankedPlayer = rankedPlayersArr[i];
		if(rankedPlayer.player._id == gamePlayer.player._id) {
			rankedPlayersArr[i] = mergeRankedPlayerObjects(rankedPlayer, gamePlayer);
			return rankedPlayersArr;
		}
	}
	// No existing player was found so add a new one.
	var newRankedPlayer = mergeRankedPlayerObjects(
		PlayerModel.getEmptyRankedPlayerObject(), gamePlayer);
	rankedPlayersArr.push(newRankedPlayer);
	return rankedPlayersArr;
}

function mergeRankedPlayerObjects(rp1, rp2) {
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
});

module.exports = router;
