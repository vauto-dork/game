var CreateGameDirective = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/CreateGameTemplate.html',
		controller: 'CreateGameController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var CreateGameController = function ($scope, $window, $http, playerNameFactory) {
	var me = this;
	
	$scope.nameFilter = '';
	$scope.playersLoading = true;

	$http.get('/players?sort=true').success(function(data, status, headers, config) {
		// this callback will be called asynchronously
	    // when the response is available
	    $scope.players = data;
		$scope.players = me.playerNameFormat($scope.players);
	    $scope.originalList = angular.copy($scope.players);
	    $scope.playersLoading = false;
	}).
		error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    debugger;
	});
	
	this.playerNameFormat = function(rawPlayersList) {
		rawPlayersList.forEach(function(value){
			value = playerNameFactory.playerNameFormat(value);
		});
		
		return rawPlayersList;
	};

	this.removeAll = function() {
		$scope.players = angular.copy($scope.originalList);
	};

	this.createPlaylist = function() {
		$scope.orderedPlayersLoading = true;

		var selectedPlayers = $scope.players.filter(function(value) { return value.selected == true; });
		$http.post('/players/sort?sortType=2', selectedPlayers).success(function(data, status, headers, config) {
			// this callback will be called asynchronously
		    // when the response is available
		    $scope.orderedPlayers = me.playerNameFormat(data);
		    $scope.orderedPlayersLoading = false;
		}).
			error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    debugger;
		});
	};
	
	this.startGame = function() {
		var selectedPlayers = $scope.orderedPlayers.map(function(value) {return { player: { _id: value._id } }; });
		$http.post('/activeGames/save', { players: selectedPlayers }).success(function(data, status, headers, config) {
			// this callback will be called asynchronously
		    // when the response is available
			$window.location.href = '/activeGames/edit/#/' + data._id;
		}).
			error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    debugger;
		});
	}
};

CreateGameController.$inject = ['$scope', '$window', '$http', 'playerNameFactory'];

DorkModule.controller('CreateGameController', CreateGameController);
DorkModule.directive('createGame', CreateGameDirective);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', PlaylistDirective);
