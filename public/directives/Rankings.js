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

var RankingsController = function ($scope, $http) {
	
	$http.get('/players/ranked').success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.players = data.filter(function (el) {
                        // Removes 'New Guy' and 'New Girl'
                        return el.player.firstName !== "New";
                       });
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    debugger;
  });

  this.playerFullName = function(player) {
    return player.firstName + ' ' + player.lastName;
  }

  this.playerInitials = function(player) {
    return player.firstName.charAt(0) + player.lastName.charAt(0);
  }

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

RankingsController.$inject = ['$scope', '$http'];