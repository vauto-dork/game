var ApiFactory = function($http, $q, playerNameFactory) {
	var me = this;
	
	// --------------------------------------------------------------
	// Active Games
	
	me.getActiveGamePath = function(gameIdPath) {
		return '/ActiveGames/json' + gameIdPath;
	};
	
	me.getActiveGame = function(gameIdPath) {
		var def = $q.defer();
		
		$http.get(me.getActiveGamePath(gameIdPath))
		.success(function(data, status, headers, config) {
			if(data === null || data === undefined) {
				def.reject(status);
			}
			else {
				def.resolve(data);
			}
		})
		.error(function(data, status, headers, config) {
			console.error(`Cannot get game with id ${gameIdPath}`);
			def.reject(data);
		});
		
		return def.promise;
	};
	
	me.saveActiveGame = function(gameIdPath, game) {
		var def = $q.defer();
		
		$http.put(me.getActiveGamePath(gameIdPath), game)
		.success(function(data, status, headers, config) {
			def.resolve();
		}).
		error(function(data, status, headers, config) {
			console.error(`Cannot save active game with id ${gameIdPath}`)
			def.reject(data);
		});
		
		return def.promise;
	};
	
	me.deleteActiveGame = function(gameIdPath) {
		var def = $q.defer();
		
		$http.delete(me.getActiveGamePath(gameIdPath))
		.success(function(data, status, headers, config) {
		    def.resolve();
		})
		.error(function(data, status, headers, config) {
			console.error(`Cannot delete active game with id ${gameIdPath}`)
			def.reject(data);
		});
		
		return def.promise;
	};
	
	// --------------------------------------------------------------
	// Get Players
	
	me.getAllPlayers = function() {
		var def = $q.defer();
		
		$http.get('/players?sort=true')
		.success(function(data, status, headers, config) {
		    var allPlayers = data;
			allPlayers = me.playerNameFormat(allPlayers);
			def.resolve(data);
		})
		.error(function(data, status, headers, config) {
			console.error('Cannot get all players.');
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
	
	// --------------------------------------------------------------
	// Games 
	
	me.finalizeGame = function(game) {
		var def = $q.defer();
		
		$http.post('/games', game).success(function(data, status, headers, config) {
			def.resolve();
		}).
		error(function(data, status, headers, config) {
			console.error(`Cannot finalize game. Status code: ${status}.`);
			def.reject(data);
		});
		
		return def.promise;
	};
	
	// --------------------------------------------------------------
	// Public Interface
	
	return {
		GetActiveGame: me.getActiveGame,
		SaveActiveGame: me.saveActiveGame,
		DeleteActiveGame: me.deleteActiveGame,
		GetAllPlayers: me.getAllPlayers,
		FinalizeGame: me.finalizeGame
	};
}

ApiFactory.$inject = ['$http', '$q', 'playerNameFactory'];