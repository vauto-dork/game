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

var EditActiveGameController = function ($scope, $http, $location, playerNameFactory) {
	var me = this;
	$scope.loading = true;
	me.datePlayedJs = new Date();
	
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
		me.datePlayedJs = Date.parse(data.datePlayed);
		console.log(data.datePlayed);
		$scope.loading = false;
	}).
	error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    debugger;
	});
	
	this.getFormattedDate = function(){
		var formattedDate = new Date(me.datePlayedJs);
		return formattedDate.toISOString();
	}
};

EditActiveGameController.$inject = ['$scope', '$http', '$location', 'playerNameFactory'];

DorkModule.controller('EditActiveGameController', EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditScoresController);
DorkModule.directive('editScores', EditScoresDirective);