var RankingHistoryDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/RankingHistoryTemplate.html',
		controller: 'RankingHistoryController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var RankingHistoryController = function ($scope, $http, playerNameFactory) {
	var me = this;
	var currentMonth = new Date().getMonth();
	var currentYear = new Date().getFullYear();
		
	me.months = [
		{name: 'January', value: 0},
		{name: 'February', value: 1},
		{name: 'March', value: 2},
		{name: 'April', value: 3},
		{name: 'May', value: 4},
		{name: 'June', value: 5},
		{name: 'July', value: 6},
		{name: 'August', value: 7},
		{name: 'September', value: 8},
		{name: 'October', value: 9},
		{name: 'November', value: 10},
		{name: 'December', value: 11}
		];
	me.selectedMonth = me.months[currentMonth === 0 ? 11 : currentMonth - 1];
	
	me.years = [];	
	for(var i=2015; i<= currentYear; i++){
		var tempYear = { name: i.toString(), value: i };
		me.years.push(tempYear);
		
		if(i === currentYear){
			me.selectedYear = tempYear;
		}
	}
	
	me.disableYear = me.years.length <= 1;
};

RankingHistoryController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('RankingHistoryController', RankingHistoryController);
DorkModule.directive('rankingHistory', RankingHistoryDirective);