var RankingsDirective = function() {
  return {
    scope: {
      month: "=",
      year: "="  
    },
    templateUrl: '/directives/RankingsTemplate.html',
    controller: 'RankingsController',
    controllerAs: 'ctrl',
    bindToController: true
  };
};

var RankingsController = function ($scope, $http, playerNameFactory) {
  var me = this;
  me.showLoading = true;
  me.showRankings = false;
  me.players = [];
  
  me.State = {
		Loading: 0,
		Loaded: 1,
		Error: 2
	};
	
	me.changeState = function(newState) {
    me.showLoading = newState === me.State.Loading;
    me.showRankings = newState === me.State.Loaded;
		me.showErrorMessage = newState === me.State.Error;
		
		switch(newState){
			case me.State.Loading:
				me.getRankings();
				break;
		}
	};
  
  me.getRankings = function(){
    var mon = me.month === undefined ? new Date().getMonth() : me.month;
    var yr = me.year === undefined ? new Date().getFullYear() : me.year;
    
    var rankedUrl = '/players/ranked?month=' + mon + '&year=' + yr;
  	
  	$http.get(rankedUrl)
    .success(function(data, status, headers, config) {
      me.players = data;
      me.players.forEach(function(value){
        value.player = playerNameFactory.playerNameFormat(value.player);
      });
      me.changeState(me.State.Loaded);
    })
    .error(function(data, status, headers, config) {
      me.changeState(me.State.Error);
			console.error(data);
    });
  };
	
  me.playerAverage = function(points, gamesPlayed){
  	var average = 0;
  	
  	if(gamesPlayed > 0){
  		average = points/gamesPlayed;
  	}

  	return average.toFixed(2);
  };

  me.hasNoRank = function(rank) {
    return (rank <= 0) ? 'ranking-no-rank' : '';
  };
  
  me.changeState(me.State.Loading);
};

RankingsController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('RankingsController', RankingsController);
DorkModule.directive('rankings', RankingsDirective);
