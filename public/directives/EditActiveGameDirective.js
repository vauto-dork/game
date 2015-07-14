var EditActiveGameDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/EditActiveGameTemplate.html',
		controller: 'EditActiveGameController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var EditActiveGameController = function ($scope, $http, $location, $window, playerNameFactory) {
	var me = this;
	me.showLoading = false;
	me.showError = false;
	me.showScoreForm = false;
	me.disableControls = false;
	me.datePlayedJs = new Date();
	
	$scope.alerts = [];
	
	me.State = {
		Init: 0,
		Loading: 1,
		Error: 2,
		Ready: 3,
		Saving: 4,
		Saved: 5,
		Deleting: 6,
		Deleted: 7,
		Finalizing: 8
	};
	
	me.changeState = function(newState) {
		
		me.showLoading = (newState === me.State.Init) ||
						 (newState === me.State.Loading);
						 
		me.showError = newState === me.State.Error;
		
		me.showScoreForm = (newState !== me.State.Init) &&
						   (newState !== me.State.Loading) && 
						   (newState !== me.State.Error);
		
		me.disableControls = (newState === me.State.Saving) ||
							 (newState === me.State.Finalizing) ||
							 (newState === me.State.Deleting) ||
							 (newState === me.State.Deleted);
		
		switch(newState) {
			case me.State.Init:
				me.setActivePath();
				me.changeState(me.State.Loading);
				break;
			case me.State.Loading:
				me.getAllPlayers();
				me.getActiveGames();
				break;
			case me.State.Error:
				me.scrollToTop();
				break;
			case me.State.Ready:
				me.scrollToTop();
				break;
			case me.State.Saving:
				me.saveGame();
				break;
			case me.State.Saved:
				$scope.addAlert('success', 'Game saved successfully!');
				me.scrollToTop();
				break;
			case me.State.Deleting:
				me.deleteGame();
				break;
			case me.State.Deleted:
				$window.location.href = '/GameHistory';
				break;
			case me.State.Finalizing:
				me.finalizeGame();
				break;
		}
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
	
	me.scrollToTop = function() {
		$window.scrollTo(0, 0);
	};
		
	me.setActivePath = function() {
		if($location.path() !== undefined || $location.path() !== ''){
			me.activeGamePath = '/ActiveGames/json' + $location.path();
		}
		else {
			me.activeGamePath = '';
		}
	};
	
	me.save = function() {
		me.changeState(me.State.Saving);	
	};
	
	me.finalize = function() {
		me.changeState(me.State.Finalizing);
	};
	
	me.errorHandler = function(data, errorMessage) {
		$scope.addAlert('danger', errorMessage);
	    console.error(data);
		me.changeState(me.State.Error);
	};
		
	me.savePrep = function(){
		// Convert datetime to string.
		me.game.datePlayed = me.getFormattedDate();
		
		// Convert blank points to zeroes.
		me.game.players.forEach(function(player) { player.points = !player.points ? 0 : player.points; });
	};
	
	me.finalizeCheck = function() {
		$scope.clearAlerts();
		
		var rank1 = me.game.players.filter(function(value) {return value.rank === 1;}).length;
		var rank2 = me.game.players.filter(function(value) {return value.rank === 2;}).length;
		var rank3 = me.game.players.filter(function(value) {return value.rank === 3;}).length;
		
		if(rank1 !== 1) {
			$scope.addAlert('danger', 'No winner selected.');
		}
		
		if(rank2 !== 1) {
			$scope.addAlert('danger', 'No second place selected.');
		}
		
		if(rank3 !== 1) {
			$scope.addAlert('danger', 'No third place selected.');
		}
		
		return (rank1 === 1 && rank2 === 1 && rank3 === 1);
	};
	
	me.getFormattedDate = function(){
		var formattedDate = new Date(me.datePlayedJs);
		return formattedDate.toISOString();
	};
	
	me.returnToActiveGames = function(){
		$window.location.href = '/ActiveGames';
	};
	
	me.getActiveGames = function() {
		$http.get(me.activeGamePath)
		.success(function(data, status, headers, config) {
			if(data === null || data === undefined) {
				me.errorHandler(status, 'Cannot find game.');
			}
			else {
				me.game = data;
				me.datePlayedJs = Date.parse(data.datePlayed);
				me.changeState(me.State.Ready);
			}
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Cannot load game.');
		});
	};
	
	me.getAllPlayers = function() {
		$http.get('/players?sort=true')
		.success(function(data, status, headers, config) {
		    me.allPlayers = data;
			me.allPlayers = me.playerNameFormat(me.allPlayers);
		})
		.error(function(data, status, headers, config) {
		    me.errorHandler(data, 'Cannot get all players.');
		});
	};
	
	me.playerNameFormat = function(rawPlayersList) {
		rawPlayersList.forEach(function(value){
			value = playerNameFactory.playerNameFormat(value);
		});
		
		return rawPlayersList;
	};
	
	me.onSelected = function(data) {
		data.selected = !data.selected;
		me.game.players.push({player: data, points: 0, rank: 0});
	};
	
	me.saveGame = function() {
		$scope.clearAlerts();
		me.savePrep();
		
		$http.put(me.activeGamePath, me.game).success(function(data, status, headers, config) {
			me.changeState(me.State.Saved);
		}).
		error(function(data, status, headers, config) {
			me.errorHandler(data, 'Game save failure!');
		});
	};
	
	me.finalizeGame = function() {
		if( !me.finalizeCheck() ) {
			me.changeState(me.State.Ready);
			return;
		}
		
		var winner = me.game.players.filter(function(value) {return value.rank === 1; });
		
		me.game.winner = { _id: winner[0].player._id };
		
		me.savePrep();
		
		$http.post('/games', me.game).success(function(data, status, headers, config) {
			me.changeState(me.State.Deleting);
		}).
		error(function(data, status, headers, config) {
			me.errorHandler(data, 'Cannot finalize game!');
		});
	};
	
	me.deleteGame = function() {
		$http.delete(me.activeGamePath)
		.success(function(data, status, headers, config) {
		    me.changeState(me.State.Deleted);
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Cannot delete game!');
		});
	};
	
	me.changeState(me.State.Init);
};

EditActiveGameController.$inject = ['$scope', '$http', '$location', '$window', 'playerNameFactory'];

DorkModule.controller('EditActiveGameController', EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditScoresController);
DorkModule.directive('editScores', EditScoresDirective);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', PlaylistDirective);
