var ActiveGamesDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/ActiveGamesTemplate.html',
		controller: 'ActiveGamesController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var ActiveGamesController = function ($scope, $http, $window, playerNameFactory) {
	var me = this;
	me.loading = false;
	me.showNoGamesWarning = false;
	me.showErrorMessage = false;
	
	me.activeGamePath = "/ActiveGames/json";
	me.gameToDelete = null;
	
	me.State = {
		Loading: 0,
		NoGames: 1,
		Loaded: 2,
		Deleting: 3,
		Error: 4
	};
	
	me.changeState = function(newState) {
		me.showErrorMessage = newState === me.State.Error;
		me.showNoGamesWarning = newState === me.State.NoGames;
		
		switch(newState){
			case me.State.Loading:
				me.gameToDelete = null;
				me.loading = true;
				me.getGames();
				break;
			case me.State.NoGames:
				me.loading = false;
				break;
			case me.State.Loaded:
				me.loading = false;
				break;
			case me.State.Deleting:
				me.loading = true;
				me.delete();
				break;
		}
	};
	
	// Dont call directly. Change state to "Loading" instead.
	me.getGames = function() {
		$http.get(me.activeGamePath)
		.success(function(data, status, headers, config) {
			if(!data || data.length === 0){
				me.games = [];
				me.changeState(me.State.NoGames);
				return;
			}
			
			me.games = data;
			me.games.forEach(function(game){
				game.deleteWarning = false;
				game.players.forEach(function(value){
					value.player = playerNameFactory.playerNameFormat(value.player);
				});
			});
			
			me.changeState(me.State.Loaded);
		})
		.error(function(data, status, headers, config) {
			me.changeState(me.State.Error);
			console.error(data);
		});
	};
	
	// Dont call directly. Change state to "Deleting" instead.
	me.delete = function() {
		if(!me.gameToDelete) {
			return;
		}
		
		$http.delete(me.activeGamePath + '/' + me.gameToDelete._id)
		.success(function(data, status, headers, config) {
			me.changeState(me.State.Loading);
		})
		.error(function(data, status, headers, config) {
			me.changeState(me.State.Error);
		    console.error(data);
		});
	};
	
	me.deleteGame = function(game) {
		me.gameToDelete = game;
		me.changeState(me.State.Deleting);
	};
	
	me.changeState(me.State.Loading);
};

ActiveGamesController.$inject = ['$scope', '$http', '$window', 'playerNameFactory'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);