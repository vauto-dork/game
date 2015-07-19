var PlaylistDirective = function() {
	return {
		scope: {
			players: '=',
			onSelected: '&'
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
	
	me.toggleSelected = function(item, model, label){
		me.onSelected({data: item});
		me.removeFilter();
	};
	
	me.getUnselectedPlayers = function() {
		return me.players.filter(function(element) {
			return !element.selected;
		});
	};
};

PlaylistController.$inject = ['$scope', '$http'];