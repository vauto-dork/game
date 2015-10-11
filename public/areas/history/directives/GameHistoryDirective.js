var GameHistoryDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/areas/history/directives/GameHistoryTemplate.html',
		controller: 'GameHistoryController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var GameHistoryController = function ($scope, $http, $timeout, playerNameFactory, monthYearQueryFactory) {
	var me = this;
	me.month = new Date().getMonth();
	me.year = new Date().getFullYear();
	
	me.loading = true;
	me.errorMessage = '';
	me.gamePath = "/Games";
	
	me.State = {
		Init: 0,
		Loading: 1,
		NoGames: 2,
		Ready: 3,
		Error: 4,
		Change: 5,
	};
	
	me.changeState = function(newState) {
		me.loading = newState === me.State.Init
				  || newState === me.State.Change
				  || newState === me.State.Loading;
		me.showErrorMessage = newState === me.State.Error;
		me.showNoGamesWarning = newState === me.State.NoGames;
		
		switch(newState){
			case me.State.Init:
				$timeout(function() {
					me.month = monthYearQueryFactory.GetMonthQueryParam(me.month);
					me.year = monthYearQueryFactory.GetYearQueryParam(me.year);
					me.changeState(me.State.Loading);
				}, 0);
				break;
			case me.State.Change:
				$timeout(function() {
					monthYearQueryFactory.SaveQueryParams(me.month, me.year);
					me.changeState(me.State.Loading);
				}, 0);
				break;
			case me.State.Loading:
				me.getGames();
				break;
			case me.State.NoGames:
				break;
			case me.State.Ready:
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
		var path = me.gamePath + '?month=' + me.month + '&year=' + me.year;
		$http.get(path).success(function(data, status, headers, config) {
			me.games = data;
			
			if(data.length === 0) {
				me.changeState(me.State.NoGames)
				return;
			}
			
			me.games.forEach(function(game){
				game.players.forEach(function(value){
			      value.player = playerNameFactory.playerNameFormat(value.player);
			    });
			});
			me.changeState(me.State.Ready);
		}).
		error(function(data, status, headers, config) {
		    me.errorHandler(data, 'Error loading games!');
		});
	};
	
	me.updateQueryParams = function() {
		me.changeState(me.State.Change);
	};
	
	me.reload = function() {
		me.changeState(me.State.Loading);
	};
	
	me.changeState(me.State.Init);
};

GameHistoryController.$inject = ['$scope', '$http', '$timeout', 'playerNameFactory', 'monthYearQueryFactory'];
