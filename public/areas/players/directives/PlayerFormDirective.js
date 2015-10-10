var PlayerFormDirective = function() {
	return {
		scope: {
			player: "=",
			disableForm: "="
		},
		templateUrl: '/areas/players/directives/PlayerFormTemplate.html',
		controller: 'PlayerFormController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var PlayerFormController = function ($scope) {
	var me = this;
	me.player = this.player;
	me.disableForm = this.disableForm;
}

PlayerFormController.$inject = ['$scope'];
