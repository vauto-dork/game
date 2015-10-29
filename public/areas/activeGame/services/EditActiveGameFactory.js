var EditActiveGameFactory = function($location, $q, apiFactory, playerNameFactory) {
	var me = this;
	me.gameIdPath = '';
	me.cachedGame = [];
	me.cachedAllPlayers = [];
	
	me.setActivePath = function() {
		if($location.path() !== undefined || $location.path() !== ''){
			me.gameIdPath = $location.path();
		}
	};
	
	me.getActiveGame = function() {
		var def = $q.defer();
		
		var promise = apiFactory.GetActiveGame(me.gameIdPath);
		promise.then(function(data) {
			me.cachedGame = data;
			
			var hasPlayers = apiFactory.GetAllPlayers();
			hasPlayers.then(function(data){
				var allPlayers = data;
				me.markActivePlayersAsSelected(allPlayers);
				me.cachedAllPlayers = allPlayers;
				def.resolve();
			}, function(data) {
				def.reject(data);
			});
		}, function(data) {
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
	
	me.save = function(game) {
		return apiFactory.SaveActiveGame(me.gameIdPath, game);
	};
	
	me.finalizeGame = function(game) {
		var def = $q.defer();
		
		var promise = apiFactory.FinalizeGame(game);
		promise.then(function(){
			var deletePromise = apiFactory.DeleteActiveGame(me.gameIdPath);
			deletePromise.then(function(){
				def.resolve();
			}, function(data) {
				def.reject(data);
			});
		}, function(data){
			def.reject(data);
		});
		
		return def.promise;
	};
	
	me.finalize = function(game) {
		var def = $q.defer();
		
		var savePromise = me.save(game);
		savePromise.then(function() {
			var finalizePromise = me.finalizeGame(game);
			finalizePromise.then(function(){
				def.resolve();
			}, function(data) {
				def.reject(data);
			});
		});
		
		return def.promise;
	};
	
	me.setActivePath();
	
	return {
		GetActiveGame: me.getActiveGame,
		Save: me.save,
		Finalize: me.finalize,
		Game: function() {
			return me.cachedGame;
			},
		AllPlayers: function() {
			return me.cachedAllPlayers;
		}
	};
};

EditActiveGameFactory.$inject = ['$location', '$q', 'apiFactory', 'playerNameFactory'];