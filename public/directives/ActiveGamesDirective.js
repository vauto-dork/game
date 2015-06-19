var ActiveGamesDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/ActiveGamesTemplate.html',
		controller: 'ActiveGamesController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var ActiveGamesController = function ($scope, $http, playerNameFactory) {
	var me = this;
	$scope.loading = true;
	
	$http.get("/ActiveGames/json").success(function(data, status, headers, config) {
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

ActiveGamesController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);