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
	me.playersOriginal = angular.copy(me.players);
	me.playerCounter = 0;
	me.disableRemoveAll = false;
	me.disableCreatePlaylist = false;
	
	me.removeAll = function() {
		me.playerCounter = 0;
		me.players = angular.copy(me.playersOriginal);
	};
	
	me.createPlaylist = function() {
		
	};
	
	me.removeFilter = function() {
		me.filter = '';
	};
	
	me.toggleSelected = function(item, model, label){
		item.selected = !item.selected;
		item.order = item.selected ? me.playerCounter++ : undefined;
		me.removeFilter();
	};
	
	me.hasSelectedPlayers = function() {
		return me.players.some(function(element) {
			return element.selected;
		});
	};
};

PlaylistController.$inject = ['$scope', '$http'];