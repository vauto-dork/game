var MonthYearPickerDirective = function() {
	return {
		scope: {
			month: "=",
			year: "=",
			disabled: "="
		},
		templateUrl: '/directives/MonthYearPickerTemplate.html',
		controller: 'MonthYearPickerController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var MonthYearPickerController = function ($scope, $location) {
	var me = this;
	me.minimumYear = 2015;
	
	me.disableMonth = me.disabled || false;
	me.disableYear = me.disabled || false;
	
	me.currentMonth = new Date().getMonth() - 1;
	me.currentYear = new Date().getFullYear();
	
	me.getQueryParams = function() {
		var queryMonth = me.sanitizeParam($location.search().month);
		var queryYear = me.sanitizeParam($location.search().year);
		
		if(queryMonth !== undefined) {
			queryMonth--;
			me.currentMonth = queryMonth > 11
							? 0
							: queryMonth < 0 ? 11 : queryMonth;
		}
		
		if(queryYear !== undefined) {
			me.currentYear = queryYear < me.minimumYear ? me.minimumYear : queryYear;
		}
	};
	
	me.init = function() {
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
		me.selectedMonth = me.months[me.currentMonth === 0 ? 11 : me.currentMonth];
		
		me.years = [];	
		for(var i = me.minimumYear; i <= me.currentYear; i++){
			var tempYear = { name: i.toString(), value: i };
			me.years.push(tempYear);
			
			if(i === me.currentYear){
				me.selectedYear = tempYear;
			}
		}
		
		me.disableYear = me.disableYear || me.years.length <= 1;
	};
	
	me.updateParams = function(){
		me.month = me.selectedMonth.value;
		me.year = me.selectedYear.value;
		
		$location.search('month', me.selectedMonth.value + 1);
		$location.search('year', me.selectedYear.value);
		$location.replace();
	};
	
	me.sanitizeParam = function(value) {
		if(value === undefined) {
			return undefined;
		}
		
		var parsedValue = parseInt(value, 10);
		return isNaN(parsedValue) ? undefined : parsedValue;
	};
	
	me.getQueryParams();
	me.init();
};

MonthYearPickerController.$inject = ['$scope', '$location'];
