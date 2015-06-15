var EditActiveGameDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/EditActiveGameTemplate.html',
		controller: 'EditActiveGameController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var EditActiveGameController = function ($scope, $http, $location) {
	var me = this;
	$scope.loading = true;
	
	if($location.path() !== undefined || $location.path() !== ''){
		$scope.activeGamePath = '/ActiveGames/json' + $location.path();
	}
	else {
		$scope.activeGamePath = '';
	}
	
	$http.get($scope.activeGamePath).success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
	    $scope.game = data;
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    debugger;
	  });
};

EditActiveGameController.$inject = ['$scope', '$http', '$location'];

DorkModule.controller('EditActiveGameController', EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGameDirective);