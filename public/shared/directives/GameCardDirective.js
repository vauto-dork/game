var GameCardDirective = function() {
	return {
		scope: {
			game: "=",
			gamePath: "=",
			showModifyButtons: "=",
			reload: "&"
		},
		templateUrl: '/shared/directives/GameCardTemplate.html',
		controller: 'GameCardController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var GameCardController = function ($scope, $http, $window) {
	var me = this;
	me.showOverlay = false;
	me.showLoadBar = false;
	me.showDeleteWarning = false;
	me.showDeleted = false;
	me.showError = false;
	
	me.State = {
		Ready: 0,
		DeleteWarning: 1,
		Deleting: 2,
		Deleted: 3,
		Copy: 4,
		Error: 5
	};
	
	me.changeState = function(newState) {
		me.showOverlay = newState !== me.State.Ready;
		me.showLoadBar = newState === me.State.Deleting ||
						 newState === me.State.Copy;
		me.showDeleteWarning = newState === me.State.DeleteWarning;
		me.showError = newState === me.State.Error;
		me.showDeleted = newState === me.State.Deleted;
		
		switch(newState){
			case me.State.Ready:
				me.selectedGame = null;
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
	
	// Dont call directly. Change state to "Deleting" instead.
	me.delete = function() {
		if(!me.selectedGame) {
			me.errorHandler(null, 'No game selected!');
			return;
		}
		
		$http.delete(me.gamePath + '/' + me.selectedGame._id)
		.success(function(data, status, headers, config) {
			me.changeState(me.State.Deleted);
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Error deleting game!');
		});
	};
	
	// Dont call directly. Change state to "Copy" instead.
	me.copy = function() {
		if(!me.selectedGame) {
			me.errorHandler(null, 'No game selected!');
			return;
		}
		
		var removedScores = angular.copy(me.selectedGame.players)
		
		removedScores.forEach(function (element) {
			element.points = 0;
			element.rank = 0;
		});
		
		$http.post('/activeGames/save', { players: removedScores })
		.success(function(data, status, headers, config) {
			$window.location.href = '/activeGames/edit/#/' + data._id;
		})
		.error(function(data, status, headers, config) {
			me.errorHandler(data, 'Error copying game!');
		});
	};
	
	me.warnDelete = function() {
		me.changeState(me.State.DeleteWarning);
	};
	
	me.dismissOverlay = function() {
		me.changeState(me.State.Ready);
	}
	
	me.deleteGame = function(game) {
		me.selectedGame = game;
		me.changeState(me.State.Deleting);
	};
	
	me.copyGame = function(game) {
		me.selectedGame = game;
		me.changeState(me.State.Copy);
	};
	
	me.changeState(me.State.Ready);
};

GameCardController.$inject = ['$scope', '$http', '$window'];