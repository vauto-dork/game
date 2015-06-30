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

var PlaylistController = function ($scope, $http) {
	var me = this;
	
	this.removeFilter = function() {
		me.filter = '';
	};
};

PlaylistController.$inject = ['$scope', '$http'];