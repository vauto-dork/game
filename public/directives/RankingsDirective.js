var RankingsDirective = function() {
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
  $scope.playersLoading = true;
  var currentMonth = new Date().getMonth();
  var rankedUrl = '/players/ranked?month=' + currentMonth;
	
	$http.get(rankedUrl).success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.players = data;
    $scope.players.forEach(function(value){
      value.player = playerNameFactory.playerNameFormat(value.player);
    });
    $scope.playersLoading = false;
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

  this.hasNoRank = function(rank) {
    return (rank <= 0) ? 'ranking-no-rank' : '';
  }
}

RankingsController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('RankingsController', RankingsController);
DorkModule.directive('rankings', RankingsDirective);
