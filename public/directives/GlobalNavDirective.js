var GlobalNavDirective = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/GlobalNavTemplate.html',
		controller: 'GlobalNavController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var GlobalNavController = function ($scope) {
	
}

GlobalNavController.$inject = ['$scope'];

DorkModule.controller('GlobalNavController', GlobalNavController);
DorkModule.directive('globalNav', GlobalNavDirective);