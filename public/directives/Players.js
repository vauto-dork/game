var Players = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/PlayersTemplate.html',
		controller: 'PlayersController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var PlayersController = function ($scope, $http) {
	
	$http.get('/players').success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.players = data;
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    debugger;
  });
}

PlayersController.$inject = ['$scope', '$http'];