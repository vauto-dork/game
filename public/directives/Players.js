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
	
	$http.get('/players/ranked').success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.players = data;
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    debugger;
  });

  this.playerAverage = function(points, gamesPlayed){
  	var average = 0;
  	
  	if(gamesPlayed > 0){
  		average = points/gamesPlayed;
  	}

  	return average.toFixed(2);
  };
}

PlayersController.$inject = ['$scope', '$http'];