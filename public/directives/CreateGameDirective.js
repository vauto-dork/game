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
	
	me.nameFilter = '';
	
	me.showLoading = false;
	me.showErrorMessage = false;
	me.showPlayers = false;
	me.disableRemoveAll = false;
	me.disableCreatePlaylist = false;
	
	me.orderedPlayersLoading = false;
	me.orderedPlayersLoaded = false;
	me.disableOrderedPlayers = false;
	
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
		me.showLoading = newState === me.State.Loading;
		me.showPlayers = newState !== me.State.Loading;
		me.showErrorMessage = newState === me.State.Error;
		me.orderedPlayersLoading = newState === me.State.OrderedPlayersLoading;
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
		$http.get('/players?sort=true')
		.success(function(data, status, headers, config) {
		    $scope.players = data;
			$scope.players = me.playerNameFormat($scope.players);
		    $scope.originalList = angular.copy($scope.players);
		    
			me.changeState(me.State.Loaded);
		})
		.error(function(data, status, headers, config) {
		    me.changeState(me.State.Error);
			console.error(data);
		});
	};
	
	me.getPlayersInGameOrder = function() {
		var selectedPlayers = $scope.players.filter(function(value) {
			return value.selected == true;
		});
		
		$http.post('/players/sort?sortType=2', selectedPlayers)
		.success(function(data, status, headers, config) {
		    $scope.orderedPlayers = me.playerNameFormat(data);
		    me.changeState(me.State.OrderedPlayersLoaded);
		})
		.error(function(data, status, headers, config) {
		    me.changeState(me.State.Error);
			console.error(data);
		});
	};
	
	me.createNewActiveGame = function() {
		var selectedPlayers = $scope.orderedPlayers.map(function(value) {
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

	me.removeAll = function() {
		$scope.players = angular.copy($scope.originalList);
	};
	
	me.startGame = function() {
		me.changeState(me.State.CreatingGame);
	};
	
	me.createPlaylist = function() {
		me.changeState(me.State.OrderedPlayersLoading);
	};
	
	me.changeState(me.State.Loading);
};

CreateGameController.$inject = ['$scope', '$window', '$http', 'playerNameFactory'];

DorkModule.controller('CreateGameController', CreateGameController);
DorkModule.directive('createGame', CreateGameDirective);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', PlaylistDirective);