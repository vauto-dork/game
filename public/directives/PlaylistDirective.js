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
	me.playerCounter = 0;
		
	me.removeFilter = function() {
		me.filter = '';
	};
	
	me.toggleSelected = function(item, model, label){
		item.selected = !item.selected;
		item.order = item.selected ? me.playerCounter++ : undefined;
		me.removeFilter();
	};
	
	$scope.$watch(function() { return me.players; }, function() {
		if(!me.players.some(function(element) {
			return element.selected;
		})){
			me.playerCounter = 0;
		}
	});
};

PlaylistController.$inject = ['$scope', '$http'];