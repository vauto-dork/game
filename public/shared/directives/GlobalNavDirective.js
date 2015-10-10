var GlobalNavDirective = function() {
	return {
		scope: {

		},
		templateUrl: '/shared/directives/GlobalNavTemplate.html',
		controller: 'GlobalNavController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var GlobalNavController = function ($scope) {
	var me = this;
	me.sidebarOpen = false;

	this.closeSidebar = function() {
		if(me.sidebarOpen === true){
			me.sidebarOpen = false;
		}
	}
}

GlobalNavController.$inject = ['$scope'];