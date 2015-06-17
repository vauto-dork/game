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
	
	this.formatPlayer = function(player){
		return playerNameFactory.playerNameFormat(player);	
	};
	
	this.changeScore = function(player){
		if(player.score != undefined){
			player.score = player.score.replace(/\D/g,'');
		}
	};
};

EditScoresController.$inject = ['$scope', '$http', 'playerNameFactory'];