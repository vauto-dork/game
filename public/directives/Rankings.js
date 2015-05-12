var Rankings = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/RankingsTemplate.html',
		controller: 'RankingsController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var RankingsController = function ($scope, $http, playerNameFactory) {
	
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

  this.playerFullName = playerNameFactory.playerFullName;

  this.playerInitials = playerNameFactory.playerInitials;

  this.playerAverage = function(points, gamesPlayed){
  	var average = 0;
  	
  	if(gamesPlayed > 0){
  		average = points/gamesPlayed;
  	}

  	return average.toFixed(2);
  };

  this.hasNoRank = function(rank) {
    return (rank <= 0) ? 'ranking-no-rank' : '';
  }
}

RankingsController.$inject = ['$scope', '$http', 'playerNameFactory'];