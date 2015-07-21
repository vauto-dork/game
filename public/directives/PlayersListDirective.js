var PlayersListDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/PlayersListTemplate.html',
		controller: 'PlayersListController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var PlayersListController = function ($scope, $http, playerNameFactory) {
	var me = this;
	me.disableControls = false;
	me.showLoading = false;
	me.showPlayers = false;
	me.showPlayerEdit = false;
	
	me.players = [];
	me.filter = '';
	
	me.State = {
		Loading: 0,
		Ready: 1,
		Error: 2,
		EditPlayer: 3,
		SavingPlayer: 4
	};
	
	me.changeState = function(newState) {
		me.showLoading = newState === me.State.Loading;
		me.showPlayers = newState === me.State.Ready;
		me.showPlayerEdit = newState === me.State.EditPlayer;
		me.showErrorMessage = newState === me.State.Error;
		
		switch(newState) {
			case me.State.Loading:
				me.loadPlayers();
				break;
			case me.State.SavingPlayer:
				alert("Saving...");
				me.changeState(me.State.Ready);
				break;
		}
	};
	
	me.loadPlayers = function() {
		$http.get('/players?sort=true')
	    .success(function(data, status, headers, config) {
			me.players = data;
			me.players.forEach(function(value){
				value = playerNameFactory.playerNameFormat(value);
			});
			me.changeState(me.State.Ready);
	    })
	    .error(function(data, status, headers, config) {
			me.changeState(me.State.Error);
			console.error(data);
	    });
	};
	
	me.removeFilter = function() {
		me.filter = '';
	};
	
	me.editPlayer = function(player) {
		me.selectedPlayer = player;
		me.changeState(me.State.EditPlayer);
	};
	
	me.cancelEdit = function() {
		me.selectedPlayer = undefined;
		me.changeState(me.State.Ready);
	}
	
	me.savePlayer = function() {
		me.changeState(me.State.SavingPlayer);
	}
	
	me.changeState(me.State.Loading);
};

PlayersListController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('PlayersListController', PlayersListController);
DorkModule.directive('playersList', PlayersListDirective);