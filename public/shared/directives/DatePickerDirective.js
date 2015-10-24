var DatePickerDirective = function() {
	return {
		scope: {
			date: "=",
			disabled: "="
		},
		templateUrl: '/shared/directives/DatePickerTemplate.html',
		controller: 'DatePickerController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var DatePickerController = function ($scope) {
	var me = this;
	me.date = this.date;	
	me.disabled = this.disabled;
	
	$scope.$watch(function() { return me.disabled; }, function() {
		me.changeState(me.disabled ? me.State.Disabled : me.State.Ready);
	});
	
	me.showStatic = false;
	me.showEditor = false;	
	
	me.State = {
		Ready: 0,
		Disabled: 1,
		Editing: 2
	};
	
	me.changeState = function(newState) {
		me.showStatic = newState === me.State.Ready || newState === me.State.Disabled;
		me.showEditor = newState === me.State.Editing;
	};
	
	me.format = 'MMMM dd, yyyy';
	me.hstep = 1;
	me.mstep = 1;
	
	me.today = function() {
		me.date = new Date();
	};
	
	me.clear = function () {
		me.date = null;
	};

	me.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		me.opened = true;
	};

	me.dateOptions = {
		showWeeks: false
	};
	
	me.edit = function() {
		me.changeState(me.State.Editing);
	};
	
	me.changeState(me.State.Ready);
};

DatePickerController.$inject = ['$scope'];
