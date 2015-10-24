var PlayerSelectorDirective = function() {
	return {
		scope: {
			players: '=',
			onSelected: '&'
		},
		templateUrl: '/areas/players/directives/PlayerSelectorTemplate.html',
		controller: 'PlayerSelectorController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var PlayerSelectorController = function ($scope, $http, $element, $timeout) {
	var me = this;
	
	$scope.$on('PlayerSelectorFocus', function(event, data) {
		// Wrapped in timeout so it does this after UI is rendered.
		$timeout(function(){
			$element.find("input").focus();
		});
	});
	
	$scope.$on('PlayerSelectorBlur', function(event, data) {
		// UI should be already rendered at this point so timeout is not needed.
		$element.find("input").blur();
	});
		
	me.removeFilter = function() {
		me.filter = '';
	};
	
	me.selectPlayer = function(item, model, label){
		$element.find("input").focus();
		me.onSelected({data: item});
		me.removeFilter();
	};
	
	me.getUnselectedPlayers = function() {
		return me.players.filter(function(element) {
			return !element.selected;
		});
	};
};

PlayerSelectorController.$inject = ['$scope', '$http', '$element', '$timeout'];