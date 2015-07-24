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
	me.errorMessage = '';
	me.selectedGame = null;
	
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
				me.selectedGame = null;
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
	
	me.errorHandler = function(data, errorMessage) {
		me.errorMessage = errorMessage;
	    console.error(data);
		me.changeState(me.State.Error);
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
			me.errorHandler(data, 'Error fetching games!');
		});
	};
	
	// Dont call directly. Change state to "Deleting" instead.
	me.delete = function() {
		if(!me.selectedGame) {
			return;
		}
		
		$http.delete(me.activeGamePath + '/' + me.selectedGame._id)
		.success(function(data, status, headers, config) {
			me.changeState(me.State.Loading);
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Error deleting game!');
		});
	};
	
	// Dont call directly. Change state to "Copy" instead.
	me.copy = function() {
		if(!me.selectedGame) {
			return;
		}
		
		$http.post('/activeGames/save', { players: me.selectedGame.players })
		.success(function(data, status, headers, config) {
			$window.location.href = '/activeGames/edit/#/' + data._id;
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Error copying game!');
		});
	};
	
	me.deleteGame = function(game) {
		me.selectedGame = game;
		me.changeState(me.State.Deleting);
	};
	
	me.copyGame = function(game) {
		me.selectedGame = game;
		me.changeState(me.State.Copy);
	};
	
	me.changeState(me.State.Loading);
};

ActiveGamesController.$inject = ['$scope', '$http', '$window', 'playerNameFactory'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);