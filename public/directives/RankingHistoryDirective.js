var RankingHistoryDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/RankingHistoryTemplate.html',
		controller: 'RankingHistoryController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var RankingHistoryController = function ($scope) {
	var me = this;
};

RankingHistoryController.$inject = ['$scope'];

DorkModule.controller('RankingHistoryController', RankingHistoryController);
DorkModule.directive('rankingHistory', RankingHistoryDirective);