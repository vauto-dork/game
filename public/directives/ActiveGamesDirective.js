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
		Copy: 4,
		Error: 5
	};
	
	me.changeState = function(newState) {
		me.loading = newState === me.State.Loading ||
					 newState === me.State.Deleting ||
					 newState === me.State.Copy;
		me.showErrorMessage = newState === me.State.Error;
		me.showNoGamesWarning = newState === me.State.NoGames;
		
		switch(newState){
			case me.State.Loading:
				me.gameToDelete = null;
				me.getGames();
				break;
			case me.State.NoGames:
				break;
			case me.State.Loaded:
				break;
			case me.State.Copy:
				me.copy();
				break;
			case me.State.Deleting:
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
	
	// Dont call directly. Change state to "Copy" instead.
	me.copy = function() {
		alert("copying...");
	}
	
	me.deleteGame = function(game) {
		me.gameToDelete = game;
		me.changeState(me.State.Deleting);
	};
	
	me.copyGame = function(game) {
		me.changeState(me.State.Copy);
	};
	
	me.changeState(me.State.Loading);
};

ActiveGamesController.$inject = ['$scope', '$http', '$window', 'playerNameFactory'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);