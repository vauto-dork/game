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
	}).
		error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    debugger;
	});

	this.playerFullName = playerNameFactory.playerFullName;

	this.playerInitials = playerNameFactory.playerInitials;
}

PlaylistController.$inject = ['$scope', '$http', 'playerNameFactory'];