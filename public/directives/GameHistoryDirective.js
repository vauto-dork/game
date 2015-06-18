var GameHistoryDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/GameHistoryTemplate.html',
		controller: 'GameHistoryController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var GameHistoryController = function ($scope, $http) {
	var me = this;
	$scope.loading = true;
	
	$http.get("/Games").success(function(data, status, headers, config) {
	    $scope.games = data;
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    debugger;
	  });
};

GameHistoryController.$inject = ['$scope', '$http'];

DorkModule.controller('GameHistoryController', GameHistoryController);
DorkModule.directive('gameHistory', GameHistoryDirective);