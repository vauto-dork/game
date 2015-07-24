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

var PlayersListController = function ($scope, $http, $window, playerNameFactory) {
	var me = this;
	me.disableControls = false;
	me.showError = false;
	me.showLoading = false;
	me.showPlayers = false;
	me.showPlayerEdit = false;
	
	$scope.alerts = [];
	
	me.players = [];
	me.filter = '';
	
	me.State = {
		Loading: 0,
		Ready: 1,
		Error: 2,
		EditPlayer: 3,
		SavingPlayer: 4,
		Saved: 5
	};
	
	me.changeState = function(newState) {
		me.showLoading = newState === me.State.Loading;
		me.showPlayers = newState === me.State.Ready;
		me.showPlayerEdit = newState === me.State.EditPlayer ||
							newState === me.State.SavingPlayer;
		me.disableControls = newState === me.State.SavingPlayer;
		me.showError = newState === me.State.Error;
		
		switch(newState) {
			case me.State.Loading:
				me.loadPlayers();
				break;
			case me.State.EditPlayer:
				$scope.clearAlerts();
				break;
			case me.State.SavingPlayer:
				me.savePlayer();
				break;
			case me.State.Saved:
				$scope.addAlert('success', 'Player saved successfully!');
				me.changeState(me.State.Loading);
				break;
		}
	};
	
	me.errorHandler = function(data, errorMessage) {
		$scope.addAlert('danger', errorMessage);
	    console.error(data);
		me.changeState(me.State.Error);
	};
	
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	
	$scope.addAlert = function(messageType, message) {
		$scope.alerts.push({type: messageType, msg: message});		
	};
		
	$scope.clearAlerts = function() {
		$scope.alerts = [];	
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
			me.errorHandler(data, 'Error fetching players!');
	    });
	};
	
	me.savePlayer = function() {
		$http.put('players/' + me.selectedPlayer._id, me.selectedPlayer)
		.success(function(data, status, headers, config) {
			me.changeState(me.State.Saved);
		}).
		error(function(data, status, headers, config) {
			me.errorHandler(data, 'Player save failure!');
		});
	};
	
	me.removeFilter = function() {
		me.filter = '';
	};
	
	me.scrollToTop = function() {
		$window.scrollTo(0, 0);
	};
	
	me.editPlayer = function(player) {
		me.selectedPlayer = player;
		me.changeState(me.State.EditPlayer);
	};
	
	me.cancelEdit = function() {
		me.selectedPlayer = undefined;
		me.changeState(me.State.Ready);
	}
	
	me.save = function() {
		me.changeState(me.State.SavingPlayer);
	}
	
	me.reload = function() {
		$scope.clearAlerts();
		me.changeState(me.State.Loading);
	}
	
	me.changeState(me.State.Loading);
};

PlayersListController.$inject = ['$scope', '$http', '$window', 'playerNameFactory'];

DorkModule.controller('PlayersListController', PlayersListController);
DorkModule.directive('playersList', PlayersListDirective);