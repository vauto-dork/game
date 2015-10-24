var RankingsFactory = function($http, $q, playerNameFactory) {
	var me = this;
	me.cachedPlayers = [];
	
	me.PlayerSelection = {
		All: 0,
		OverTen: 1,
		UnderTen: 2
	};
	
	me.getRankings = function(month, year, hideUnranked){
		var def = $q.defer();
		
		month = !month ? new Date().getMonth() : month;
    	year = !year ? new Date().getFullYear() : year;
		
		var unrankedParam = hideUnranked ? '&hideUnranked=true' : '';
		var rankedUrl = '/players/ranked?month=' + month + '&year=' + year + unrankedParam;
		
		$http.get(rankedUrl)
		.success(function(data, status, headers, config) {
			me.cachedPlayers = data;
			
			me.cachedPlayers.forEach(function(value){
				value.player = playerNameFactory.playerNameFormat(value.player);
			});
			
			def.resolve();
		})
		.error(function(data, status, headers, config) {
			def.reject(data);
		});

		return def.promise;
	};
	
	me.rankPlayers = function(selectedPlayers) {
		var counter = 0;
		
		selectedPlayers.forEach(function(player, index) {
			if(!player.gamesPlayed) {
				player.rank = 0;
			}
			else if(index > 0 && player.rating === selectedPlayers[index - 1].rating) {
				player.rank = counter;
			}
			else {
				player.rank = ++counter;
			}
		});
		
		return selectedPlayers;
	};
	
	me.getPlayers = function(playerSelection) {
		switch(playerSelection) {
			case me.PlayerSelection.UnderTen:
				var underTen = me.cachedPlayers.filter(function(player) { return player.gamesPlayed < 10; });
				return me.rankPlayers(underTen);
			case me.PlayerSelection.OverTen:
				var overTen = me.cachedPlayers.filter(function(player) { return player.gamesPlayed >= 10; });
				return me.rankPlayers(overTen);
			default:
				return me.rankPlayers(me.cachedPlayers);
		}
	};
	
	return {
		GetRankings: function(mon, yr, hideUnranked) {
			return me.getRankings(mon, yr, hideUnranked);
		},
		GetAllPlayers: function() {
			return me.getPlayers();
		},
		GetPlayersOverTenGames: function() {
			return me.getPlayers(me.PlayerSelection.OverTen);
		},
		GetPlayersUnderTenGames: function() {
			return me.getPlayers(me.PlayerSelection.UnderTen);
		}
	};
};

RankingsFactory.$inject = ['$http', '$q', 'playerNameFactory'];