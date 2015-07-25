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

var ActiveGamesController = function ($scope, $http, playerNameFactory) {
	var me = this;
	me.loading = false;
	me.showNoGamesWarning = false;
	me.showErrorMessage = false;
	
	me.activeGamePath = "/ActiveGames/json";
	me.errorMessage = '';
	
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
	
	me.reload = function() {
		me.changeState(me.State.Loading);
	};
	
	me.changeState(me.State.Loading);
};

ActiveGamesController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);