var PlayerNametagDirective = function() {
	return {
		scope: {
			player: '='
		},
		templateUrl: '/directives/PlayerNametagTemplate.html',
		controller: 'PlayerNametagController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var PlayerNametagController = function ($scope) {
	var me = this;
	
	me.initials = this.player.initials;
	me.fullname = this.player.fullname;
	me.nickname = this.player.nickname;
};

PlayerNametagController.$inject = ['$scope'];
