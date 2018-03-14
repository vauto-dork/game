var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var PlayerModel = mongoose.model('Player');
var GameModel = mongoose.model('Game');
var DateHelper = require('./dateHelper');

/**
 * GET players.
 * @queryParam sort - True to sort the result by display name, false to not.
 * @return List of players.
 */
router.get('/', function (req, res, next) {
	PlayerModel.find(function (err, players) {
		if (err) return next(err);
		//sort
		if (req.query.sort) {
			sortPlayersAlphabetically(players);
		}
		res.json(players);
	});
});

function sortPlayersAlphabetically(players) {
	var stripTheRegex = /^The/;
	if (players) {
		players.sort(function (a, b) {
			var aName = a.getAbbreviatedName().replace(stripTheRegex, "").trim();
			var bName = b.getAbbreviatedName().replace(stripTheRegex, "").trim();
			return aName.localeCompare(bName);
		});
	}
};

/**
 * GET players for new game creation.
 * @return List of players sorted by number of games played and whether it's the first game of the month.
 */
router.get('/newgame', function (req, res, next) {
	var dateRange = DateHelper.getCurrentMonthRange();
	var startDateRange = dateRange[0];
	var endDateRange = dateRange[1];

	GameModel.find(function (err, games) {
		if (err) return next(err);
		getAllPlayersForNewGame(games, res, next);
	})
		.where('datePlayed').gte(startDateRange).lt(endDateRange)
		.exec();
});

function getAllPlayersForNewGame(games, res, next) {

	var isFirstGameOfMonth = !games || games.length === 0;
	var playerPoints = {};
	var playerGames = {};

	if (games) {
		games.forEach(function (game) {
			game.players.forEach(function (player) {
				// Force it to be a string
				var playerId = player.player + '';

				if (!playerGames[playerId]) {
					playerGames[playerId] = 1;
				} else {
					playerGames[playerId]++;
				}

				if (!playerPoints[playerId]) {
					playerPoints[playerId] = player.points;
				} else {
					playerPoints[playerId] += player.points;
				}
			});
		});
	}
	
	PlayerModel.find(function (err, players) {
		if (err) return next(err);

		players = players.filter(function(player) {
			return !player.duplicate;
		});

		sortPlayersAlphabetically(players);

		var orderNumber = 0;

		var playersList = [];
		for (var i = 0; i < players.length; i++) {
			// Force it to be a string
			var playerId = players[i]._id + '';

			var gamesPlayed = playerGames[playerId] || 0;
			var rating = gamesPlayed === 0 ? 0 : (playerPoints[playerId] || 0) / gamesPlayed;

			var playerOrderNumber = gamesPlayed > 0 ? -gamesPlayed : orderNumber++;
			playersList.push({ player: players[i], /*gamesPlayed: gamesPlayed,*/ orderNumber: playerOrderNumber, rating: rating });
		}

		playersList.sort(function (a, b) {
			return a.orderNumber - b.orderNumber;
		});

		res.json({ firstGameOfMonth: isFirstGameOfMonth, players: playersList });
	});
};

function getDotm(req, next, callback) {
	getRankedPlayers(req, next, function (rankedPlayers) {
		rankedPlayers = rankedPlayers.filter(function (element) {
			return element.gamesPlayed >= 10;
		});

		var uberdorks = rankedPlayers.filter(function (element) {
			return element.rating === rankedPlayers[0].rating;
		});

		var negativePoints = rankedPlayers.filter(function (element) {
			return element.totalPoints < 0;
		});

		var negadorks;
		if (negativePoints.length > 1) {
			var found = negativePoints[0];

			for (var i = 0; i < negativePoints.length; i++) {
				if (PlayerModel.getRankedPlayerAverage(negativePoints[i]) < PlayerModel.getRankedPlayerAverage(found)) {
					found = negativePoints[i];
				}
			}

			negadorks = negativePoints.filter(function (element) {
				return PlayerModel.getRankedPlayerAverage(element) === PlayerModel.getRankedPlayerAverage(found);
			});
		} else {
			negadorks = negativePoints;
		}

		callback({ uberdorks: uberdorks, negadorks: negadorks })
	});
};

/**
 * Return a list of uberdorks and negadorks by the month's games.
 * You must provide a month and optionally a year to get the list of uberdorks and negadorks in the given time period.
 * Query params:
 * 	month - integer
 * 	year - integer. Default value is the current year.
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

router.get('/dotm/', function (req, res, next) {
	getDotm(req, next, function(data) {
		res.json(data);
	});
});

router.get('/doty/', function(req, res, next) {
	var step = function(index, monthlyDorks) {
		req.query.month = index;
		var nextIndex = index + 1;
		getDotm(req, next, function(data) {
			monthlyDorks.push({month: index, uberdorks: data.uberdorks});
			if(nextIndex < 12) {
				step(nextIndex, monthlyDorks);
			} else {
				var flattenedPlayers = [];
				monthlyDorks.forEach(function(month) {
					month.uberdorks.forEach(function(winner) {
						flattenedPlayers.push(winner);
					});
				});

				var winnerCache = [];
				flattenedPlayers.forEach(function(winner){
					var currentWinnerId = winner.player.id;
					var winnerIds = winnerCache.map(function(w) { return w.playerId; });
					
					if(winnerIds.indexOf(currentWinnerId) === -1) {
						var winningGames = flattenedPlayers.filter(function(p) {
							return currentWinnerId === p.player.id;
						});

						var totalPoints = 0;
						var gamesPlayed = 0;
						winningGames.forEach(function(game) {
							totalPoints += game.totalPoints;
							gamesPlayed += game.gamesPlayed;
						});

						winnerCache.push({
							playerId: currentWinnerId,
							player: winner.player, // for output, but clutters debug
							//playerName: winner.player.firstName + " " + winner.player.lastName, // used for debug only
							//winningGames: winningGames, // used for debug only
							numWins: winningGames.length,
							totalPoints: totalPoints,
							gamesPlayed: gamesPlayed,
							finalRating: (totalPoints / gamesPlayed) + Math.pow(2, winningGames.length)
						});
					}
				});

				var maxRating = Math.max(...winnerCache.map(function(winner) {
					return winner.finalRating;
				}));

				var winners = winnerCache.filter(function(winner) {
					return winner.finalRating >= maxRating;
				});

				var now = new Date();
				var yearDefined = req.query.year !== undefined && req.query.year !== null;
				var year = yearDefined ? parseInt(req.query.year) : now.getFullYear();
				var isCurrentYear = year === now.getFullYear();

				var doty = isCurrentYear ? [] : winners.map(function(winner) {
					return {
						player: winner.player,
						totalPoints: winner.totalPoints,
						gamesPlayed: winner.gamesPlayed,
						rating: winner.finalRating
					};
				});

				res.json({ year: year, doty: doty, monthlyRankings: monthlyDorks });
			}
		});
	};

	var monthlyDorks = [];
	step(0, monthlyDorks);
});

/**
 * Get a list of players that are sorted by data from a time span.
 * This is defined as "/players/sort/" because there is already a POST for "/players/"
 * @query (Optional) month - Sort players by data from this month. Default is all year.
 * @query (Optional) year - Sort players by data from this year. Default is current year.
 * @body List of players to sort
 */
router.post('/sort/', function (req, res, next) {
	getRankedPlayers(req, next, function (rankedPlayers) {
		var players = [];
		for (var i = 0; i < rankedPlayers.length; i++) {
			players.push(rankedPlayers[i].player);
		}
		res.json(players);
	});
});

/* POST save a player. */
router.post('/', function (req, res, next) {
	if (!req.body) {
		return next(new Error("Cannot save a player without data!"));
	}
	if (req.body && req.body.constructor === Array) {
		PlayerModel.create(req.body, function (err, player) {
			if (err) return next(err);
			res.json();
		});
	} else {
		if (!req.body.firstName) {
			return next(new Error("Cannot save a player without a first name!"));
		}
		if (!req.body.lastName) {
			return next(new Error("Cannot save a player without a last name!"));
		}
		PlayerModel.create(req.body, function (err, player) {
			if (err) return next(err);
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
router.post('/ranked/sort/', function (req, res, next) {
	getRanked(req, res, next);
});

router.get('/ranked/', function (req, res, next) {
	getRanked(req, res, next);
});

function getRanked(req, res, next) {
	getRankedPlayers(req, next, function (rankedPlayers) {
		if (!!req.query.hideUnranked && req.query.hideUnranked.toLowerCase() === 'true') {
			rankedPlayers = rankedPlayers.filter(
				function (element) {
					return element.gamesPlayed > 0;
				}
		    );
		}
		res.json(rankedPlayers);
	});
};

function getRankedPlayers(req, next, success) {
	// Get date ranges
	var dateRange = DateHelper.getDateRange(req);
	var startDateRange = dateRange[0];
	var endDateRange = dateRange[1];

	// validate sort type
	var sortType = req.query.sortType;
	if (!sortType) {
		sortType = PlayerModel.SortTypes.Rating;
	}
	if (!PlayerModel.isSortTypeValid(sortType)) {
		return next(new Error("Invalid sort type \"" + sortType + "\"."));
	}

	// get all games that happened in the time span

	var returnAllPlayers = true;
	if (req.body && req.body.constructor === Array) {
		returnAllPlayers = false;
	}
	GameModel.find()
		.select('winner datePlayed players')
		.where('datePlayed').gte(startDateRange).lt(endDateRange)
		.populate('players')
		.populate('players.player')
		.exec(function (err, games) {
			if (err) return next(err);

			var rankedPlayers = [];
			if (games) {
				// loop through all games
				for (var i = 0; i < games.length; i++) {
					var game = games[i];
					// combine each player's stats
					for (var j = 0; j < game.players.length; j++) {
						var gamePlayer = game.players[j];
						// TODO There's gotta be a more efficient way to do this...
						rankedPlayers = pushGamePlayerToRankedArray(rankedPlayers, gamePlayer);
					} // end loop for players
				} // end loop for game
				//all ranked players are set at this point

				if (!returnAllPlayers) {
					// remove players not in the request body
					for (var k = 0; k < rankedPlayers.length; k++) {
						if (!PlayerModel.arrContains(req.body, rankedPlayers[k].player)) {
							// Not interested in this player, remove it from the array
							rankedPlayers.splice(k--, 1);
						}
					}
				}

				// sort array by rank (points per games played)
				PlayerModel.rankedPlayerSort(rankedPlayers, PlayerModel.SortTypes.Rating);
				
				// assign the player's rating
				rankedPlayers.forEach(function (player) {
					player.rating = PlayerModel.getRankedPlayerAverage(player);
				});
			}

			// Get array of all requested player ids
			var requestedPlayerIds = null;
			if (!returnAllPlayers) {
				requestedPlayerIds = [];
				for (var p = 0; p < req.body.length; p++) {
					requestedPlayerIds.push(req.body[p]._id);
				}
			}

			// Now fetch the complete list of players and append any
			// of them to the list if need be. These are the "un-ranked" players.
			var where = returnAllPlayers ? {} : { '_id': { $in: requestedPlayerIds } };
			PlayerModel.find(where, function (err, players) {
				if (err) return next(err);

				// Remove inactive players
				players = players.filter(function(player) {
					return !player.inactive;
				});

				// Remove duplicate players
				players = players.filter(function(player) {
					return !player.duplicate;
				});

				for (var i = 0; i < players.length; i++) {
					var player = players[i];
					// If the player is not ranked then add it as an unranked player.
					if (!PlayerModel.rankedArrContains(rankedPlayers, player)) {
						rankedPlayers.push(PlayerModel.getEmptyRankedPlayerObject(player));
					}
				}

				// rating sort is already done so don't redo that work.
				if (sortType != PlayerModel.SortTypes.Rating) {
					PlayerModel.rankedPlayerSort(rankedPlayers, sortType);
				}
				success(rankedPlayers);
			});
		});
}

function pushGamePlayerToRankedArray(rankedPlayersArr, gamePlayer) {
	// first look for an existing player. If found then update it.
	for (var i = 0; i < rankedPlayersArr.length; i++) {
		var rankedPlayer = rankedPlayersArr[i];
		if (rankedPlayer.player._id == gamePlayer.player._id) {
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
	PlayerModel.findById(req.params.id, function (err, player) {
		if (err) return next(err);
		res.json(player);
	});
});

/* PUT update a player. */
router.put('/:id', function (req, res, next) {
	PlayerModel.findByIdAndUpdate(req.params.id, req.body, function (err, player) {
		if (err) return next(err);
		res.end();
		// res.json(player);
	});
});

router.delete('/:id', function (req, res, next) {
	PlayerModel.findByIdAndRemove(req.params.id, function (err, player) {
		if (err) return next(err);
		res.end();
		// res.json(player);
	});
});

module.exports = router;
