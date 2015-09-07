var ReorderPlayersDirective = function() {
	return {
		scope: {
			players: '='
		},
		templateUrl: '/directives/ReorderPlayersTemplate.html',
		controller: 'ReorderPlayersController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var ReorderPlayersController = function ($scope, playerNameFactory) {
	var me = this;
	me.players = this.players;
	
	me.formatPlayer = function(player){
		return playerNameFactory.playerNameFormat(player);	
	};
	
	me.clickHandler = function(player) {
		if(!player.moveDropZoneActive && !player.selectedToMove) {
			me.markToMove(player);
		} else if(!player.moveDropZoneActive && player.selectedToMove) {
			me.unselectMove();
		} else if(player.moveDropZoneActive && !player.selectedToMove) {
			me.dropPlayerHere(player);
		}
	};
		
	me.markToMove = function(player) {
		$scope.$emit('playerMarkedToMove', player._id);
	};
	
	me.unselectMove = function() {
		$scope.$emit('playerUnmarkedToMove');
	};
	
	me.dropPlayerHere = function(player) {
		$scope.$emit('dropPlayerHere', player._id);
	};
};

ReorderPlayersController.$inject = ['$scope', 'playerNameFactory'];