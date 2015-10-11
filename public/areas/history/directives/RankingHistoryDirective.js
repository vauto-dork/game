var RankingHistoryDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/areas/history/directives/RankingHistoryTemplate.html',
		controller: 'RankingHistoryController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var RankingHistoryController = function ($scope, $timeout, monthYearQueryFactory, dateTimeFactory) {
	var me = this;
	me.month = dateTimeFactory.LastMonthValue();
	me.year = dateTimeFactory.LastMonthYear();
	
	me.State = {
		Init: 0,
		Ready: 1,
		Change: 2
	};
	
	me.changeState = function(newState) {
		// Timeouts are required to force a digest cycle so the query
		// param factory will update in the correct scope.
		switch(newState) {
			case me.State.Init:
				$timeout(function() {
					me.month = monthYearQueryFactory.GetMonthQueryParam(me.month);
					me.year = monthYearQueryFactory.GetYearQueryParam(me.year);
				}, 0);
				me.changeState(me.State.Ready);
				break;
			case me.State.Change:
				$timeout(function() {
					monthYearQueryFactory.SaveQueryParams(me.month, me.year);
					$scope.$broadcast('dotmUpdate');
				}, 0);
				me.changeState(me.State.Ready);
				break;
		}
	};	
	
	me.updateQueryParams = function() {
		me.changeState(me.State.Change);
	};
	
	me.changeState(me.State.Init);
};

RankingHistoryController.$inject = ['$scope', '$timeout', 'monthYearQueryFactory', 'dateTimeFactory'];
