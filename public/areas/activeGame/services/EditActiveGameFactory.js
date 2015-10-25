var EditActiveGameFactory = function($http, $location, $q, playerNameFactory) {
	var me = this;
	me.activeGamePath = '';
	me.cachedGame = [];
	me.cachedAllPlayers = [];
	
	me.setActivePath = function() {
		if($location.path() !== undefined || $location.path() !== ''){
			me.activeGamePath = '/ActiveGames/json' + $location.path();
		}
		else {
			me.activeGamePath = '';
		}
	};
	
	me.getActiveGame = function() {
		var def = $q.defer();
		
		$http.get(me.activeGamePath)
		.success(function(data, status, headers, config) {
			if(data === null || data === undefined) {
				def.reject(status);
			}
			else {
				me.cachedGame = data;
				
				var promise = me.getAllPlayers();
				promise.then(function(){
					def.resolve();
				}, function(data) {
					def.reject(data);
				});
			}
		})
		.error(function(data, status, headers, config) {
			def.reject(data);
		});
		
		return def.promise;
	};	
	
	me.getAllPlayers = function() {
		var def = $q.defer();
		
		$http.get('/players?sort=true')
		.success(function(data, status, headers, config) {
		    var allPlayers = data;
			allPlayers = me.playerNameFormat(allPlayers);
			me.markActivePlayersAsSelected(allPlayers);
			me.cachedAllPlayers = allPlayers;
			def.resolve();
		})
		.error(function(data, status, headers, config) {
		    def.reject(data);
		});
		
		return def.promise;
	};
	
	me.markActivePlayersAsSelected = function(allPlayers) {
		var activePlayerIds = me.cachedGame.players.map(function(element) {
			return element.player._id;
		});
		
		allPlayers.forEach(function(element) {
			if(activePlayerIds.indexOf(element._id) !== -1){
				element.selected = true;
			}
		});
	};
	
	me.playerNameFormat = function(rawPlayersList) {
		rawPlayersList.forEach(function(value){
			value = playerNameFactory.playerNameFormat(value);
		});
		
		return rawPlayersList;
	};
	
	me.saveGame = function(game) {
		var def = $q.defer();
		
		$http.put(me.activeGamePath, game).success(function(data, status, headers, config) {
			def.resolve();
		}).
		error(function(data, status, headers, config) {
			def.reject(data);
		});
		
		return def.promise;
	};
	
	me.finalizeGame = function(game) {
		var def = $q.defer();
		
		$http.post('/games', game).success(function(data, status, headers, config) {
			var promise = me.deleteGame();
			promise.then(function(){
				def.resolve();
			}, function(data) {
				def.reject(data);
			});
		}).
		error(function(data, status, headers, config) {
			def.reject(data);
		});
		
		return def.promise;
	};
	
	me.deleteGame = function() {
		var def = $q.defer();
		
		$http.delete(me.activeGamePath)
		.success(function(data, status, headers, config) {
		    def.resolve();
		})
		.error(function(data, status, headers, config) {
			def.reject(data);
		});
		
		return def.promise;
	};
	
	me.setActivePath();
	
	return {
		GetActiveGame: me.getActiveGame,
		SaveGame: me.saveGame,
		FinalizeGame: me.finalizeGame,
		Game: function() {
			return me.cachedGame;
			},
		AllPlayers: function() {
			return me.cachedAllPlayers;
		}
	};
};

EditActiveGameFactory.$inject = ['$http', '$location', '$q', 'playerNameFactory'];