var EditScoresDirective = function() {
	return {
		scope: {
			players: '='
		},
		templateUrl: '/directives/EditScoresTemplate.html',
		controller: 'EditScoresController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var EditScoresController = function ($scope, $http, playerNameFactory) {
	var me = this;
	me.players = this.players;
	me.pointsMin = -4;
	me.pointsMax = 99;
	
	this.formatPlayer = function(player){
		return playerNameFactory.playerNameFormat(player);	
	};
		
	this.decrementScore = function(player) {
		var points = parseInt(player.points);
		player.points = (points - 1 >= me.pointsMin) ? points - 1 : points;
	};
	
	this.incrementScore = function(player) {
		var points = parseInt(player.points);
		player.points = (points + 1 <= me.pointsMax) ? points + 1 : points;
	};
};

EditScoresController.$inject = ['$scope', '$http', 'playerNameFactory'];