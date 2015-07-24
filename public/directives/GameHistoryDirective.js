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

var GameHistoryController = function ($scope, $http, $window, playerNameFactory) {
	var me = this;
	me.loading = true;
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
		$http.get("/Games").success(function(data, status, headers, config) {
		    me.games = data;
			me.games.forEach(function(game){
				game.players.forEach(function(value){
			      value.player = playerNameFactory.playerNameFormat(value.player);
			    });
			});
			me.loading = false;
		}).
		error(function(data, status, headers, config) {
		    me.errorHandler(data, 'Error loading games!');
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
	
	me.copyGame = function(game) {
		me.selectedGame = game;
		me.changeState(me.State.Copy);
	};
	
	me.changeState(me.State.Loading);
};

GameHistoryController.$inject = ['$scope', '$http', '$window', 'playerNameFactory'];

DorkModule.controller('GameHistoryController', GameHistoryController);
DorkModule.directive('gameHistory', GameHistoryDirective);