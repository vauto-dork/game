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
	me.loading = true;
	me.errorMessage = '';
	me.gamePath = "/Games";
	
	me.State = {
		Loading: 0,
		NoGames: 1,
		Loaded: 2,
		Error: 3
	};
	
	me.changeState = function(newState) {
		me.loading = newState === me.State.Loading;
		me.showErrorMessage = newState === me.State.Error;
		me.showNoGamesWarning = newState === me.State.NoGames;
		
		switch(newState){
			case me.State.Loading:
				me.getGames();
				break;
			case me.State.NoGames:
				break;
			case me.State.Loaded:
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
		$http.get(me.gamePath).success(function(data, status, headers, config) {
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
	
	me.reload = function() {
		me.changeState(me.State.Loading);
	};
	
	me.changeState(me.State.Loading);
};

GameHistoryController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('GameHistoryController', GameHistoryController);
DorkModule.directive('gameHistory', GameHistoryDirective);