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

var ActiveGamesController = function ($scope, $http, $window, playerNameFactory) {
	var me = this;
	me.loading = true;
	me.activeGamePath = "/ActiveGames/json";
	
	me.scrollToTop = function() {
		$window.scrollTo(0, 0);
	};
	
	me.getGames = function() {
		$http.get(me.activeGamePath)
		.success(function(data, status, headers, config) {
			me.games = data;
			me.games.forEach(function(game){
				game.deleteWarning = false;
				game.players.forEach(function(value){
					value.player = playerNameFactory.playerNameFormat(value.player);
				});
			});
			me.loading = false;
		})
		.error(function(data, status, headers, config) {
			debugger;
		});
	};
	
	me.deleteGame = function(game) {
		$http.delete(me.activeGamePath + '/' + game._id)
		.success(function(data, status, headers, config) {
			game.deleteWarning = false;
		    me.getGames();
			me.scrollToTop();
		})
		.error(function(data, status, headers, config) {
			game.deleteWarning = false;
		    debugger;
		});
	};
	
	me.getGames();
};

ActiveGamesController.$inject = ['$scope', '$http', '$window', 'playerNameFactory'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);