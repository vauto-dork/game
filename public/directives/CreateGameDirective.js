var CreateGameDirective = function() {
	return {
		scope: {

		},
		templateUrl: '/directives/CreateGameTemplate.html',
		controller: 'CreateGameController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var CreateGameController = function ($scope, $window, $http, playerNameFactory) {
	var me = this;
	
	me.playerOrder = 0;
	me.firstGameOfMonth = false;
	
	me.showLoading = false;
	me.showErrorMessage = false;
	me.showPlayers = false;
	
	me.orderedPlayersLoaded = false;
	me.disableOrderedPlayers = false;
	me.useCurrentOrder = false;
	
	me.State = {
		Loading: 0,
		Error: 1,
		Loaded: 2,
		OrderedPlayersLoading: 3,
		OrderedPlayersLoaded: 4,
		ShowPlaylist: 5,
		CreatingGame: 6
	};
	
	me.changeState = function(newState) {
		me.showLoading = (newState === me.State.Loading) ||
						 (newState === me.State.OrderedPlayersLoading);
		me.showPlayers = newState === me.State.Loaded;
		me.showErrorMessage = newState === me.State.Error;
		me.orderedPlayersLoaded = (newState === me.State.OrderedPlayersLoaded) ||
								  (newState === me.State.CreatingGame);
		me.disableOrderedPlayers = newState === me.State.CreatingGame;
		
		switch(newState){
			case me.State.Loading:
				me.getPlayers();
				break;
			case me.State.OrderedPlayersLoading:
				me.getPlayersInGameOrder();
				break;
			case me.State.CreatingGame:
				me.createNewActiveGame();
				break;
		}
	};
	
	me.getPlayers = function() {
		$http.get('/players/newgame')
		.success(function(data, status, headers, config) {
			me.firstGameOfMonth = data.firstGameOfMonth;
		    me.players = data.players.map(function(player) {
				return player.player;
			});
			me.players = me.playerNameFormat(me.players);
		    me.originalList = angular.copy(me.players);
		    
			me.changeState(me.State.Loaded);
		})
		.error(function(data, status, headers, config) {
		    me.changeState(me.State.Error);
			console.error(data);
		});
	};
	
	me.getPlayersInGameOrder = function() {
		var selectedPlayers = me.players
			.filter(function(value) {
				return value.selected == true;
			});
				
		if(me.useCurrentOrder){
			selectedPlayers.sort(function(a, b) {
				return a.order - b.order;
			});
			
			me.orderedPlayers = selectedPlayers;
		    me.changeState(me.State.OrderedPlayersLoaded);
			return;
		}
		
		var month = new Date().getMonth();
		var year = new Date().getFullYear();
		
		if(me.firstGameOfMonth) {
			month = month - 1 < 0 ? 11 : month - 1;
		}
		
		$http.post('/players/sort?sortType=2&month=' + month + '&year=' + year, selectedPlayers)
		.success(function(data, status, headers, config) {
		    me.orderedPlayers = me.playerNameFormat(data);
		    me.changeState(me.State.OrderedPlayersLoaded);
		})
		.error(function(data, status, headers, config) {
		    me.changeState(me.State.Error);
			console.error(data);
		});
	};
	
	me.createNewActiveGame = function() {
		var selectedPlayers = me.orderedPlayers.map(function(value) {
			return { player: { _id: value._id } };
		});
			
		$http.post('/activeGames/save', { players: selectedPlayers })
		.success(function(data, status, headers, config) {
			$window.location.href = '/activeGames/edit/#/' + data._id;
		})
		.error(function(data, status, headers, config) {
		    me.changeState(me.State.Error);
			console.error(data);
		});
	};
	
	me.playerNameFormat = function(rawPlayersList) {
		rawPlayersList.forEach(function(value){
			value = playerNameFactory.playerNameFormat(value);
		});
		
		return rawPlayersList;
	};
	
	me.onSelected = function(data) {
		data.selected = !data.selected;
		data.order = data.selected ? me.playerOrder++ : undefined;
	};
	
	me.hasSelectedPlayers = function() {
		return me.players.some(function(element) {
			return element.selected;
		});
	};
	
	me.removePlayer = function(data){
		data.selected = false;
		data.order = undefined;
	};

	me.removeAll = function() {
		me.players = angular.copy(me.originalList);
		me.playerOrder = 0;
	};
	
	me.useThisOrder = function() {
		me.useCurrentOrder = true;
		me.changeState(me.State.OrderedPlayersLoading);
	};
	
	me.backToSelectPlayers = function() {
		me.changeState(me.State.Loaded);
	};
	
	me.startGame = function() {
		me.changeState(me.State.CreatingGame);
	};
	
	me.createPlaylist = function() {
		me.useCurrentOrder = false;
		me.changeState(me.State.OrderedPlayersLoading);
	};
	
	me.disablePlaylistCreation = function() {
		var numPlayers = me.players.filter(function(element) {
			return element.selected;
		}).length;
		
		return numPlayers < 3;
	};
	
	me.changeState(me.State.Loading);
};

CreateGameController.$inject = ['$scope', '$window', '$http', 'playerNameFactory'];

DorkModule.controller('CreateGameController', CreateGameController);
DorkModule.directive('createGame', CreateGameDirective);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', PlaylistDirective);
