var PlayerScoretagDirective = function() {
	return {
		scope: {
			player: '='
		},
		templateUrl: '/directives/PlayerScoretagTemplate.html',
		controller: 'PlayerScoretagController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var PlayerScoretagController = function ($scope) {
	var me = this;
	
	me.initials = this.player.player.initials;
	me.fullname = this.player.player.fullname;
	me.nickname = this.player.player.nickname;
	me.points = this.player.points;
	
	var rankArray = !this.player.rank || this.player.rank === undefined ? 0 : this.player.rank;
	me.rank = new Array( rankArray );
};

PlayerScoretagController.$inject = ['$scope'];
