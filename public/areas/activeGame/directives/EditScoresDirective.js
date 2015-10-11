var EditScoresDirective = function() {
	return {
		scope: {
			players: '=',
			disabled: '='
		},
		templateUrl: '/areas/activeGame/directives/EditScoresTemplate.html',
		controller: 'EditScoresController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var EditScoresController = function ($scope, playerNameFactory) {
	var me = this;
	me.players = this.players;
	me.disabled = this.disabled;
	me.pointsMin = -4;
	me.pointsMax = 99;
	
	me.rankHandler = function(player) {
		player.rank = player.rank === null ? 0 : player.rank;
		
		me.players.forEach(function(p) {
			if(p._id !== player._id) {
				if(player.rank > 0 && p.rank === player.rank) {
					p.rank = 0;
				}
			}
		});
	};
	
	me.formatPlayer = function(player){
		return playerNameFactory.playerNameFormat(player);	
	};
		
	me.decrementScore = function(player) {
		if(!me.disabled) {
			var points = parseInt(player.points);
			player.points = (points - 1 >= me.pointsMin) ? points - 1 : points;
		}
	};
	
	me.incrementScore = function(player) {
		if(!me.disabled) {
			var points = parseInt(player.points);
			player.points = (points + 1 <= me.pointsMax) ? points + 1 : points;
		}
	};
	
	me.toggleRemoved = function(player) {
		player.removed = !player.removed;
	}
};

EditScoresController.$inject = ['$scope', 'playerNameFactory'];