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
	    $scope.games = data;		
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    debugger;
	  });
};

ActiveGamesController.$inject = ['$scope', '$http'];

DorkModule.controller('ActiveGamesController', ActiveGamesController);
DorkModule.directive('activeGames', ActiveGamesDirective);