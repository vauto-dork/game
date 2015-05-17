var Playlist = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/PlaylistTemplate.html',
		controller: 'PlaylistController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var PlaylistController = function ($scope, $http, playerNameFactory) {
	$scope.nameFilter = '';

	$http.get('/players?sort=true').success(function(data, status, headers, config) {
		// this callback will be called asynchronously
	    // when the response is available
	    $scope.players = data;
	    $scope.originalList = angular.copy($scope.players);
	}).
		error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    debugger;
	});

	this.playerFullName = playerNameFactory.playerFullName;

	this.playerInitials = playerNameFactory.playerInitials;

	this.removeAll = function() {
		$scope.players = angular.copy($scope.originalList);
	}

	this.createPlaylist = function() {
		var selectedPlayers = $scope.players.filter(function(value) { return value.selected == true; });
		$http.post('/players/sort?sortType=2', selectedPlayers).success(function(data, status, headers, config) {
			// this callback will be called asynchronously
		    // when the response is available
		    $scope.players = data;

		    for (var i = $scope.players.length - 1; i >= 0; i--) {
		    	$scope.players[i].selected = true;
		    };
		}).
			error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    debugger;
		});
	}
}

PlaylistController.$inject = ['$scope', '$http', 'playerNameFactory'];