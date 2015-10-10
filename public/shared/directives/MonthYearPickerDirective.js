var MonthYearPickerDirective = function() {
	return {
		scope: {
			month: "=",
			year: "=",
			disabled: "=",
			change: "&"
		},
		templateUrl: '/shared/directives/MonthYearPickerTemplate.html',
		controller: 'MonthYearPickerController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var MonthYearPickerController = function ($scope) {
	var me = this;
	me.minimumYear = 2015;
	
	me.disableMonth = me.disabled || false;
	me.disableYear = me.disabled || false;
	
	me.currentMonth = me.month || new Date().getMonth();
	me.currentYear = me.year || new Date().getFullYear();
	
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
		
		if(me.change !== undefined) {
			me.change();
		}
	};
	
	me.init();
};

MonthYearPickerController.$inject = ['$scope'];
