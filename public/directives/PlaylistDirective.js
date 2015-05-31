var PlaylistDirective = function() {
	return {
		scope: {
			players: '='
		},
		templateUrl: '/directives/PlaylistTemplate.html',
		controller: 'PlaylistController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var PlaylistController = function ($scope, $http, playerNameFactory) {
	var me = this;
	
	this.removeFilter = function() {
		$scope.filter = '';
	};
};

PlaylistController.$inject = ['$scope', '$http', 'playerNameFactory'];