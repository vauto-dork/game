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

var EditActiveGameController = function ($scope, $http, $location, $window, $q, $timeout, playerNameFactory) {
	var me = this;
	me.showLoading = false;
	me.showError = false;
	me.showScoreForm = false;
	me.disableControls = false;
	me.showAddPlayer = false;
	me.showReorderPlayers = false;
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
							 (newState === me.State.Deleted) ||
							 (newState === me.State.Init) ||
							 (newState === me.State.Loading);
		
		switch(newState) {
			case me.State.Init:
				me.setActivePath();
				me.changeState(me.State.Loading);
				break;
			case me.State.Loading:				
				me.getActiveGames().then(function() {
					me.getAllPlayers();
				}, function(){
					// Do nothing as error is already handled.
				});
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
	
	$scope.$on('playerMarkedToMove', function(event, playerId) {
		me.game.players.forEach(function(element) {
			element.selectedToMove = element._id === playerId;
			element.moveDropZoneActive = element._id !== playerId;
		});
	});
	
	$scope.$on('playerUnmarkedToMove', function(event) {
		me.resetSelectedToMove();
	});
	
	$scope.$on('dropPlayerHere', function(event, oldPlayerId) {
		var playerIds = me.game.players.map(function(element) {
			return element._id;
		});
		
		var playerMarkedForMove = me.game.players.filter(function(element) {
			return element.selectedToMove;
		})[0];
		
		var fromPositionIndex = playerIds.indexOf(playerMarkedForMove._id);
		var toPositionIndex = playerIds.indexOf(oldPlayerId);
		
		me.game.players.splice(fromPositionIndex, 1);
		me.game.players.splice(toPositionIndex, 0, playerMarkedForMove);;
		me.resetSelectedToMove();
	});
	
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
		$timeout(function() {
			$window.scrollTo(0, 0);
		});
	};
	
	me.scrollToBottom = function() {
		$timeout(function() {
			$window.scrollTo(0, 100000);
		});
	};
		
	me.setActivePath = function() {
		if($location.path() !== undefined || $location.path() !== ''){
			me.activeGamePath = '/ActiveGames/json' + $location.path();
		}
		else {
			me.activeGamePath = '';
		}
	};
	
	me.getAllPlayers = function() {
		$http.get('/players?sort=true')
		.success(function(data, status, headers, config) {
		    me.allPlayers = data;
			me.allPlayers = me.playerNameFormat(me.allPlayers);
			me.markActivePlayersAsSelected(me.allPlayers);
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
	
	me.markActivePlayersAsSelected = function(allPlayers) {
		var activePlayerIds = me.game.players.map(function(element) {
			return element.player._id;
		});
		
		allPlayers.forEach(function(element) {
			if(activePlayerIds.indexOf(element._id) !== -1){
				element.selected = true;
			}
		});
	};
	
	me.onSelected = function(data) {
		$scope.$broadcast('playlistBlur');
		data.selected = !data.selected;
		me.game.players.push({player: data, points: 0, rank: 0});
		me.resetSelectedToMove();
		me.toggleAddPlayer();
		me.scrollToBottom();
	};
	
	me.resetSelectedToMove = function() {
		me.game.players.forEach(function(element){
			element.selectedToMove = false;
			element.moveDropZoneActive = false;
		});
	};
	
	me.errorHandler = function(data, errorMessage) {
		$scope.addAlert('danger', errorMessage);
	    console.error(data);
		me.changeState(me.State.Error);
	};
		
	me.savePrep = function(){
		// Convert datetime to string.
		me.game.datePlayed = me.getFormattedDate();
		
		var remainingPlayers = me.game.players.filter(function(element) { return element.removed != true; });
		
		if(remainingPlayers.length < 3) {
			$scope.addAlert('danger', 'Cannot save a game with less than three players.');
			return false;
		}
		
		me.game.players = angular.copy(remainingPlayers);
		
		// Convert blank points to zeroes.
		me.game.players.forEach(function(player) {
			player.points = !player.points ? 0 : player.points;
		});
		
		return true;
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
		var deferred = $q.defer();
		
		$http.get(me.activeGamePath)
		.success(function(data, status, headers, config) {
			if(data === null || data === undefined) {
				me.errorHandler(status, 'Cannot find game.');
			}
			else {
				me.game = data;
				me.resetSelectedToMove();
				me.datePlayedJs = Date.parse(data.datePlayed);
				me.changeState(me.State.Ready);
			}
			deferred.resolve();
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Cannot load game.');
			deferred.reject();
		});
		
		return deferred.promise;
	};
	
	me.saveGame = function() {
		$scope.clearAlerts();
		
		if(!me.savePrep()) {
			me.changeState(me.State.Ready);
			return;
		}
		
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
		
		if(!me.savePrep()) {
			me.changeState(me.State.Ready);
			return;
		}
		
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
	
	me.toggleReorderPlayers = function() {
		me.showReorderPlayers = !me.showReorderPlayers;
	};
	
	me.toggleAddPlayer = function() {
		me.showAddPlayer = !me.showAddPlayer;
		
		if (me.showAddPlayer){
			$scope.$broadcast('playlistFocus');
		}
	};
	
	me.save = function() {
		me.changeState(me.State.Saving);	
	};
	
	me.finalize = function() {
		me.changeState(me.State.Finalizing);
	};
	
	me.revert = function() {
		me.changeState(me.State.Loading);
	};
	
	me.changeState(me.State.Init);
};

EditActiveGameController.$inject = ['$scope', '$http', '$location', '$window', '$q', '$timeout', 'playerNameFactory'];

DorkModule.controller('EditActiveGameController', EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditScoresController);
DorkModule.directive('editScores', EditScoresDirective);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', PlaylistDirective);

DorkModule.controller('ReorderPlayersController', ReorderPlayersController);
DorkModule.directive('reorderPlayers', ReorderPlayersDirective);
