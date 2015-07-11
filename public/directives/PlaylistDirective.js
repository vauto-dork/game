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
		item.selected = true;
		me.removeFilter();
	};
	
	me.hasSelectedPlayers = function() {
		return me.players.some(function(element) {
			return element.selected;
		});
	};
};

PlaylistController.$inject = ['$scope', '$http'];