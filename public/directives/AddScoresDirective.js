var AddScoresDirective = function() {
	return {
		scope: {
			players: '='
		},
		templateUrl: '/directives/AddScoresTemplate.html',
		controller: 'AddScoresController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var AddScoresController = function ($scope, $http) {
	var me = this;
	
	this.changeScore = function(player){
		if(player.score != undefined){
			player.score = player.score.replace(/\D/g,'');
		}
	};
};

AddScoresController.$inject = ['$scope', '$http'];