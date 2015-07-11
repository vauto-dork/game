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
	
	me.removeFilter = function() {
		me.filter = '';
	};
	
	me.selected = function(item, model, label){
		me.wtf = JSON.stringify(item, null, '  ') + ' ' + JSON.stringify(model, null, '  ') + ' ' + label;
	};
};

PlaylistController.$inject = ['$scope', '$http'];