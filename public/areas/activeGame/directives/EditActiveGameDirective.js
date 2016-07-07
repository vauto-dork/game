var EditActiveGameDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/areas/activeGame/directives/EditActiveGameTemplate.html',
		controller: 'EditActiveGameController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var EditActiveGameController = function ($scope, $window, $timeout, editActiveGameFactory) {
	// var me = this;
	// me.showLoading = false;
	// me.showError = false;
	// me.showScoreForm = false;
	// me.disableControls = false;
	// me.showAddPlayer = false;
	// me.showReorderPlayers = false;
	// me.datePlayedJs = new Date();
	
	$scope.alerts = [];
	
	// me.State = {
	// 	Init: 0,
	// 	Loading: 1,
	// 	Error: 2,
	// 	Ready: 3,
	// 	Saving: 4,
	// 	Finalizing: 8
	// };
	// 
	// me.changeState = function(newState) {
	// 	
	// 	me.showLoading = (newState === me.State.Init) ||
	// 					 (newState === me.State.Loading);
	// 					 
	// 	me.showError = newState === me.State.Error;
	// 	
	// 	me.showScoreForm = (newState !== me.State.Init) &&
	// 					   (newState !== me.State.Loading) && 
	// 					   (newState !== me.State.Error);
	// 	
	// 	me.disableControls = (newState === me.State.Saving) ||
	// 						 (newState === me.State.Finalizing) ||
	// 						 (newState === me.State.Init) ||
	// 						 (newState === me.State.Loading);
	// 	
	// 	switch(newState) {
	// 		case me.State.Init:
	// 			me.changeState(me.State.Loading);
	// 			break;
	// 		case me.State.Loading:				
	// 			me.getActiveGame();
	// 			break;
	// 		case me.State.Error:
	// 			me.scrollToTop();
	// 			break;
	// 		case me.State.Ready:
	// 			me.scrollToTop();
	// 			break;
	// 		case me.State.Saving:
	// 			me.saveGame();
	// 			break;
	// 		case me.State.Finalizing:
	// 			me.finalizeGame();
	// 			break;
	// 	}
	// };
	
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
	
	// me.scrollToTop = function() {
	// 	$timeout(function() {
	// 		$window.scrollTo(0, 0);
	// 	});
	// };
	// 
	// me.scrollToBottom = function() {
	// 	$timeout(function() {
	// 		$window.scrollTo(0, 100000);
	// 	});
	// };
	// 
	me.onSelected = function(data) {
		$scope.$broadcast('playerSelectorBlur');
		data.selected = !data.selected;
		me.game.players.push({player: data, points: 0, rank: 0});
		me.resetSelectedToMove();
		me.toggleAddPlayer();
		me.scrollToBottom();
	};
	
	//me.resetSelectedToMove = function() {
	//	me.game.players.forEach(function(element){
	//		element.selectedToMove = false;
	//		element.moveDropZoneActive = false;
	//	});
	//};
	
	// me.errorHandler = function(data, errorMessage) {
	// 	$scope.addAlert('danger', errorMessage);
	//     console.error(data);
	// 	me.changeState(me.State.Error);
	// };
		
	// me.savePrep = function(){
	// 	// Convert datetime to string.
	// 	me.game.datePlayed = me.getFormattedDate();
	// 	
	// 	var remainingPlayers = me.game.players.filter(function(element) { return element.removed != true; });
	// 	
	// 	if(remainingPlayers.length < 3) {
	// 		$scope.addAlert('danger', 'Cannot save a game with less than three players.');
	// 		return false;
	// 	}
	// 	
	// 	me.game.players = angular.copy(remainingPlayers);
	// 	
	// 	// Convert blank points to zeroes.
	// 	me.game.players.forEach(function(player) {
	// 		player.points = !player.points ? 0 : player.points;
	// 	});
	// 	
	// 	return true;
	// };
	// 
	// me.finalizeCheck = function() {
	// 	$scope.clearAlerts();
	// 	
	// 	var rank1 = me.game.players.filter(function(value) {return value.rank === 1;}).length;
	// 	var rank2 = me.game.players.filter(function(value) {return value.rank === 2;}).length;
	// 	var rank3 = me.game.players.filter(function(value) {return value.rank === 3;}).length;
	// 	
	// 	if(rank1 !== 1) {
	// 		$scope.addAlert('danger', 'No winner selected.');
	// 	}
	// 	
	// 	if(rank2 !== 1) {
	// 		$scope.addAlert('danger', 'No second place selected.');
	// 	}
	// 	
	// 	if(rank3 !== 1) {
	// 		$scope.addAlert('danger', 'No third place selected.');
	// 	}
	// 	
	// 	return (rank1 === 1 && rank2 === 1 && rank3 === 1);
	// };
	// 
	// me.getFormattedDate = function(){
	// 	var formattedDate = new Date(me.datePlayedJs);
	// 	return formattedDate.toISOString();
	// };
	// 
	// me.returnToActiveGames = function(){
	// 	$window.location.href = '/ActiveGames';
	// };
	// 
	// me.getActiveGame = function() {
	// 	var promise = editActiveGameFactory.GetActiveGame();
	// 	promise.then(function() {
	// 		me.game = editActiveGameFactory.Game();
	// 		me.allPlayers = editActiveGameFactory.AllPlayers();
	// 		me.resetSelectedToMove();
	// 		me.datePlayedJs = Date.parse(me.game.datePlayed);
	// 		me.changeState(me.State.Ready);
	// 	}, function(data) {
	// 		me.errorHandler(data, 'Cannot load game.');
	// 	});
	// };
	
	// me.saveGame = function() {
	// 	$scope.clearAlerts();
	// 	
	// 	if(!me.savePrep()) {
	// 		me.changeState(me.State.Ready);
	// 		return;
	// 	}
	// 	
	// 	var promise = editActiveGameFactory.Save(me.game);
	// 	promise.then(function(){
	// 		$scope.addAlert('success', 'Game saved successfully!');
	// 		me.changeState(me.State.Ready);
	// 	}, function(data){
	// 		me.errorHandler(data, 'Game save failure!');
	// 	});
	// };
	
	// me.finalizeGame = function() {
	// 	if( !me.finalizeCheck() ) {
	// 		me.changeState(me.State.Ready);
	// 		return;
	// 	}
	// 	
	// 	var winner = me.game.players.filter(function(value) {return value.rank === 1; });
	// 	
	// 	me.game.winner = { _id: winner[0].player._id };
	// 	
	// 	if(!me.savePrep()) {
	// 		me.changeState(me.State.Ready);
	// 		return;
	// 	}
	// 	
	// 	var promise = editActiveGameFactory.Finalize(me.game);
	// 	promise.then(function(){
	// 		$window.location.href = '/GameHistory';
	// 	}, function(data){
	// 		me.errorHandler(data, 'Cannot finalize game!');
	// 	});
	// };
	// 
	//me.toggleReorderPlayers = function() {
	//	me.showReorderPlayers = !me.showReorderPlayers;
	//	me.resetSelectedToMove();
	//};
	
	me.toggleAddPlayer = function() {
		me.showAddPlayer = !me.showAddPlayer;
		
		if (me.showAddPlayer){
			$scope.$broadcast('playerSelectorFocus');
		}
	};
	
	// me.save = function() {
	// 	me.changeState(me.State.Saving);	
	// };
	// 
	// me.finalize = function() {
	// 	me.changeState(me.State.Finalizing);
	// };
	// 
	// me.revert = function() {
	// 	me.changeState(me.State.Loading);
	// };
	// 
	// me.disableSave = function() {
	// 	return me.showReorderPlayers || me.showAddPlayer;
	// }
	
	// me.changeState(me.State.Init);
};

EditActiveGameController.$inject = ['$scope', '$window', '$timeout', 'editActiveGameFactory'];
