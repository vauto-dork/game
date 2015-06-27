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
	me.loading = true;
	me.errorLoading = false;
	me.datePlayedJs = new Date();
	
	$scope.alerts = [];
	
	me.State = {
		Loading: 0,
		Error: 1
	};
	
	me.changeState = function(newState) {
		
	};
	
	if($location.path() !== undefined || $location.path() !== ''){
		me.activeGamePath = '/ActiveGames/json' + $location.path();
	}
	else {
		me.activeGamePath = '';
	}
	
	$http.get(me.activeGamePath).success(function(data, status, headers, config) {
		if(data === null || data === undefined) {
			$scope.addAlert('danger', 'Cannot find game.');
			me.errorLoading = true;
		}
		else {
			me.game = data;
			me.datePlayedJs = Date.parse(data.datePlayed);
		}
		
		me.loading = false;
	}).
	error(function(data, status, headers, config) {
		$scope.addAlert('danger', 'Cannot load game.');
		me.scrollToTop();
	    debugger;
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
		$window.scrollTo(0, 0);
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
	
	me.saveGame = function() {
		$scope.clearAlerts();
		me.savePrep();
		
		$http.put(me.activeGamePath, me.game).success(function(data, status, headers, config) {
		    $scope.addAlert('success', 'Game saved successfully!');
			me.scrollToTop();
		}).
		error(function(data, status, headers, config) {
		    $scope.addAlert('danger', 'Game save failure!');
			me.scrollToTop();
			debugger;
		});
	};
	
	me.finalizeGame = function() {
		if( !me.finalizeCheck() ) {
			me.scrollToTop();
			return;
		}
		
		var winner = me.game.players.filter(function(value) {return value.rank === 1; });
		
		me.game.winner = { _id: winner[0].player._id };
		
		me.savePrep();
		
		$http.post('/games', me.game).success(function(data, status, headers, config) {
		    me.deleteGame();
		}).
		error(function(data, status, headers, config) {
			$scope.addAlert('danger', 'Cannot finalize game!');
			me.scrollToTop();
		    debugger;
		});
	};
	
	me.deleteGame = function() {
		$http.delete(me.activeGamePath).success(function(data, status, headers, config) {
		    $window.location.href = '/GameHistory';
		}).
		error(function(data, status, headers, config) {
			$scope.addAlert('danger', 'Cannot finalize game!');
			me.scrollToTop();
		    debugger;
		});
	};
};

EditActiveGameController.$inject = ['$scope', '$http', '$location', '$window', 'playerNameFactory'];

DorkModule.controller('EditActiveGameController', EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditScoresController);
DorkModule.directive('editScores', EditScoresDirective);