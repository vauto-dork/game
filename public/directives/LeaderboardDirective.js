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
	
	$http.get("/Games/LastPlayed").success(function(data, status, headers, config) {
	    me.lastDatePlayed = data.datePlayed;
	}).
	error(function(data, status, headers, config) {
	    debugger;
	  });
}

LeaderboardController.$inject = ['$scope', '$http'];

DorkModule.controller('LeaderboardController', LeaderboardController);
DorkModule.directive('leaderboard', LeaderboardDirective);