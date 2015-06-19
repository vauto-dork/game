var GameHistoryDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/GameHistoryTemplate.html',
		controller: 'GameHistoryController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var GameHistoryController = function ($scope, $http, playerNameFactory) {
	var me = this;
	$scope.loading = true;
	
	$http.get("/Games").success(function(data, status, headers, config) {
	    $scope.games = data;
		$scope.games.forEach(function(game){
			game.players.forEach(function(value){
		      value.player = playerNameFactory.playerNameFormat(value.player);
		    });
		});
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    debugger;
	  });
};

GameHistoryController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('GameHistoryController', GameHistoryController);
DorkModule.directive('gameHistory', GameHistoryDirective);