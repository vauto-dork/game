var DotmPanelDirective = function() {
	return {
		scope: {
			heading: "=",
			players: "="
		},
		templateUrl: '/areas/dotm/directives/DotmPanelTemplate.html',
		controller: 'DotmPanelController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var DotmPanelController = function ($scope) {
	var me = this;
	me.heading = this.heading;
	me.players = this.players;
}

DotmPanelController.$inject = ['$scope'];
