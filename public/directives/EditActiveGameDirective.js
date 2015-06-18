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
	me.datePlayedJs = new Date();
	
	if($location.path() !== undefined || $location.path() !== ''){
		$scope.activeGamePath = '/ActiveGames/json' + $location.path();
	}
	else {
		$scope.activeGamePath = '';
	}
	
	$http.get($scope.activeGamePath).success(function(data, status, headers, config) {
	    $scope.game = data;
		me.datePlayedJs = Date.parse(data.datePlayed);
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    debugger;
	});
	
	this.getFormattedDate = function(){
		var formattedDate = new Date(me.datePlayedJs);
		return formattedDate.toISOString();
	};
	
	this.returnToActiveGames = function(){
		$window.location.href = '/ActiveGames';
	};
	
	this.saveGame = function() {
		$scope.game.datePlayed = this.getFormattedDate();
		$http.put($scope.activeGamePath, $scope.game).success(function(data, status, headers, config) {
		    me.returnToActiveGames();
		}).
		error(function(data, status, headers, config) {
		    debugger;
		});
	};
	
	this.finalizeGame = function() {
		var winner = $scope.game.players.filter(function(value) {return value.rank === 1; });
		if(!winner || winner.length < 1) {
			alert('Must select a winner.');
			return;
		}
		
		$scope.game.winner = { _id: winner[0].player._id };
		$scope.game.datePlayed = this.getFormattedDate();
		
		$http.post('/games', $scope.game).success(function(data, status, headers, config) {
		    me.deleteGame();
		}).
		error(function(data, status, headers, config) {
		    debugger;
		});
	};
	
	this.deleteGame = function() {
		$http.delete($scope.activeGamePath).success(function(data, status, headers, config) {
		    me.returnToActiveGames();
		}).
		error(function(data, status, headers, config) {
		    debugger;
		});
	};
};

EditActiveGameController.$inject = ['$scope', '$http', '$location', '$window', 'playerNameFactory'];

DorkModule.controller('EditActiveGameController', EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditScoresController);
DorkModule.directive('editScores', EditScoresDirective);