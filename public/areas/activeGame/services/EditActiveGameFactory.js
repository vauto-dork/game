var EditActiveGameFactory = function($http, $location, $q, playerNameFactory) {
	var me = this;
	me.activeGamePath = '';
	
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
				def.resolve(data);
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
			def.resolve(allPlayers);
		})
		.error(function(data, status, headers, config) {
		    def.reject(data);
		});
		
		return def.promise;
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
		GetAllPlayers: me.getAllPlayers,
		SaveGame: me.saveGame,
		FinalizeGame: me.finalizeGame
	};
};

EditActiveGameFactory.$inject = ['$http', '$location', '$q', 'playerNameFactory'];