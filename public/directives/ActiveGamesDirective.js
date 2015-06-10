var ActiveGamesDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/ActiveGamesTemplate.html',
		controller: 'ActiveGamesController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var ActiveGamesController = function ($scope, $http) {
	var me = this;
	$scope.loading = true;
	
	$http.get("/ActiveGames/json").success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
	    $scope.games = data;
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    debugger;
	  });
};

ActiveGamesController.$inject = ['$scope', '$http'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);