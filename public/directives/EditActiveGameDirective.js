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
	$scope.loading = true;
	$scope.errorLoading = false;
	me.datePlayedJs = new Date();
	
	$scope.alerts = [];
	
	if($location.path() !== undefined || $location.path() !== ''){
		$scope.activeGamePath = '/ActiveGames/json' + $location.path();
	}
	else {
		$scope.activeGamePath = '';
	}
	
	$http.get($scope.activeGamePath).success(function(data, status, headers, config) {
		if(data === null || data === undefined) {
			me.addAlert('danger', 'Cannot find game.');
			$scope.errorLoading = true;
		}
		else {
			$scope.game = data;
			me.datePlayedJs = Date.parse(data.datePlayed);
		}
		
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
		me.addAlert('danger', 'Cannot load game.');
		me.scrollToTop();
	    debugger;
	});
	
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	
	me.addAlert = function(messageType, message) {
		$scope.alerts.push({type: messageType, msg: message});		
	};
		
	me.clearAlerts = function() {
		$scope.alerts = [];	
	};
	
	me.scrollToTop = function() {
		$window.scrollTo(0, 0);
	};
	
	me.savePrep = function(){
		// Convert datetime to string.
		$scope.game.datePlayed = me.getFormattedDate();
		
		// Convert blank points to zeroes.
		$scope.game.players.forEach(function(player) { player.points = !player.points ? 0 : player.points; });
	};
	
	me.finalizeCheck = function() {
		me.clearAlerts();
		
		var rank1 = $scope.game.players.filter(function(value) {return value.rank === 1;}).length;
		var rank2 = $scope.game.players.filter(function(value) {return value.rank === 2;}).length;
		var rank3 = $scope.game.players.filter(function(value) {return value.rank === 3;}).length;
		
		if(rank1 !== 1) {
			me.addAlert('danger', 'No winner selected.');
		}
		
		if(rank2 !== 1) {
			me.addAlert('danger', 'No second place selected.');
		}
		
		if(rank3 !== 1) {
			me.addAlert('danger', 'No third place selected.');
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
		me.clearAlerts();
		me.savePrep();
		
		$http.put($scope.activeGamePath, $scope.game).success(function(data, status, headers, config) {
		    me.addAlert('success', 'Game saved successfully!');
			me.scrollToTop();
		}).
		error(function(data, status, headers, config) {
		    me.addAlert('danger', 'Game save failure!');
			me.scrollToTop();
			debugger;
		});
	};
	
	me.finalizeGame = function() {
		if( !me.finalizeCheck() ) {
			me.scrollToTop();
			return;
		}
		
		var winner = $scope.game.players.filter(function(value) {return value.rank === 1; });
		
		$scope.game.winner = { _id: winner[0].player._id };
		
		me.savePrep();
		
		$http.post('/games', $scope.game).success(function(data, status, headers, config) {
		    me.deleteGame();
		}).
		error(function(data, status, headers, config) {
			me.addAlert('danger', 'Cannot finalize game!');
			me.scrollToTop();
		    debugger;
		});
	};
	
	me.deleteGame = function() {
		$http.delete($scope.activeGamePath).success(function(data, status, headers, config) {
		    $window.location.href = '/GameHistory';
		}).
		error(function(data, status, headers, config) {
			me.addAlert('danger', 'Cannot finalize game!');
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