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

var LeaderboardController = function ($scope, $http) {
	var me = this;
	me.lastMonthName = '';
	me.currentMonth = new Date().getMonth();
	me.currentYear = new Date().getFullYear();
	me.noGamesThisMonth = false;
	
	me.monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
		
	me.getLastPlayedGame = function() {
		$http.get("/Games/LastPlayed").success(function(data, status, headers, config) {
		    me.lastDatePlayed = data.datePlayed;
			me.noGamesThisMonth = me.hasGames();
			if(me.noGamesThisMonth) {
				me.getDotm();
			}
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

LeaderboardController.$inject = ['$scope', '$http'];

DorkModule.controller('LeaderboardController', LeaderboardController);
DorkModule.directive('leaderboard', LeaderboardDirective);