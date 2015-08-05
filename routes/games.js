var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var GameModel = mongoose.model('Game');
var GameHelper = require('./gameHelper');
var DateHelper = require('./dateHelper');

/* GET games listing.
 * @query (Optional) month - Sort players by data from this month. Default is all year.
 * @query (Optional) year - Sort players by data from this year. Default is current year.
 */
router.get('/', function (req, res, next) {
	// Get date ranges
	var dateRange = DateHelper.getDateRange(req);
	var startDateRange = dateRange[0];
	var endDateRange = dateRange[1];

	GameModel.find(function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.where('datePlayed').gte(startDateRange).lt(endDateRange)
	.populate('winner')
	.populate('players.player')
	.sort({ datePlayed: -1 })
	.exec();
});

/* GET last game played. */
router.get('/LastPlayed', function (req, res, next) {

	GameModel.findOne({}, {}, { sort: ({ datePlayed: -1 }) },
		function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('winner')
	.populate('players.player')
	.exec();
});

/* POST save game. */
router.post('/', function (req, res, next) {
	GameHelper.saveGame(null, req.body, next, function(game) {
		res.json(game);
	});
});

router.get('/:id', function (req, res, next) {
	GameModel.findById(req.params.id, function (err, game) {
		if (err) return next(err);
		res.json(game);
	})
	.populate('winner')
	.populate('players.player')
	.exec();
})

router.put('/:id', function (req, res, next) {
	GameHelper.saveGame(req.params.id, req.body, next, function(game) {
		res.end();
	});
})

router.delete('/:id', function (req, res, next) {
	GameModel.findByIdAndRemove(req.params.id, function (err, game) {
		if (err) return next(err);
		res.end();
	});
})

module.exports = router;
