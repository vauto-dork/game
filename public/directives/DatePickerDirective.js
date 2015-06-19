var DatePickerDirective = function() {
	return {
		scope: {
			date: "="
		},
		templateUrl: '/directives/DatePickerTemplate.html',
		controller: 'DatePickerController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var DatePickerController = function ($scope) {
	var me = this;
	me.date = this.date;
	
	me.format = 'MMMM dd, yyyy';
	me.hstep = 1;
	me.mstep = 1;
	
	this.today = function() {
		me.date = new Date();
	};
	
	this.clear = function () {
		me.date = null;
	};

	// Disable weekend selection
	this.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};

	this.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		me.opened = true;
	};

	this.dateOptions = {
		showWeeks: false
	};
};

DatePickerController.$inject = ['$scope'];
