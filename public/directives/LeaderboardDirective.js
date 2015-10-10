var LeaderboardDirective = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/LeaderboardTemplate.html',
		controller: 'LeaderboardController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var LeaderboardController = function ($scope, $http, dateTimeFactory) {
	var me = this;
	me.currentMonth = dateTimeFactory.CurrentMonthValue();
	me.currentYear = dateTimeFactory.CurrentYear();
	me.lastMonth = dateTimeFactory.LastMonthValue();
	me.lastMonthYear = dateTimeFactory.LastMonthYear();
	me.noGamesThisMonth = false;
		
	me.getLastPlayedGame = function() {
		$http.get("/Games/LastPlayed").success(function(data, status, headers, config) {
		    me.lastDatePlayed = data.datePlayed;
			me.noGamesThisMonth = me.hasGames();
		}).
		error(function(data, status, headers, config) {
		    debugger;
		});
	};
	
	me.hasGames = function() {		
		var lastGame = new Date(me.lastDatePlayed);
		var lastGameMonth = lastGame.getMonth();
		var lastGameYear = lastGame.getFullYear();
		
		return !(me.currentMonth === lastGameMonth && me.currentYear === lastGameYear);
	};
	
	me.getLastPlayedGame();
}

LeaderboardController.$inject = ['$scope', '$http', 'dateTimeFactory'];

DorkModule.controller('LeaderboardController', LeaderboardController);
DorkModule.directive('leaderboard', LeaderboardDirective);