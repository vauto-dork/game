var RankingsDirective = function() {
  return {
    scope: {
      month: "=",
      year: "=",
      hideUnranked: "="  
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
  me.showUnrankedPlayers = false;
  me.showUnrankBtn = false;
  
  me.players = [];
  me.numberUnranked = 0;
  
  me.State = {
    Loading: 0,
    Loaded: 1,
    Error: 2,
    NoRankings: 3
	};
	
	me.changeState = function(newState) {
    me.showLoading = newState === me.State.Loading;
    me.showRankings = newState === me.State.Loaded;
    me.showUnrankBtn = newState === me.State.Loaded && me.numberUnranked > 0;
    me.showErrorMessage = newState === me.State.Error;
    me.showNoRankingsMessage = newState === me.State.NoRankings;
		
		switch(newState){
			case me.State.Loading:
				me.getRankings();
				break;
		}
	};
  
  $scope.$watch(function() { return me.month; }, function(){
    me.changeState(me.State.Loading);
  });
  
  $scope.$watch(function() { return me.year; }, function(){
    me.changeState(me.State.Loading);
  });
  
  me.getRankings = function(){
    var mon = me.month === undefined ? new Date().getMonth() : me.month;
    var yr = me.year === undefined ? new Date().getFullYear() : me.year;
    var unrankedParam = me.hideUnranked ? '&hideUnranked=true' : '';
    
    var rankedUrl = '/players/ranked?month=' + mon + '&year=' + yr + unrankedParam;
  	
  	$http.get(rankedUrl)
    .success(function(data, status, headers, config) {
      me.players = data;
      me.players.forEach(function(value){
        value.player = playerNameFactory.playerNameFormat(value.player);
      });
      
      if (me.players.some( function(elem) { return elem.rank > 0; } )) {
        me.numberUnranked = me.players.filter(function(element) { return element.rank <= 0; }).length;
        me.changeState(me.State.Loaded);
      } else {
        me.changeState(me.State.NoRankings);
      }
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
    if(rank > 0) {
      return '';
    }
    
    if(!me.showUnrankedPlayers) {
      return 'hidden';
    }
    
    return 'ranking-no-rank';
  };
  
  me.toggleUnrankedPlayers = function() {
    me.showUnrankedPlayers = !me.showUnrankedPlayers;
  };
  
  me.changeState(me.State.Loading);
};

RankingsController.$inject = ['$scope', '$http', 'playerNameFactory'];

DorkModule.controller('RankingsController', RankingsController);
DorkModule.directive('rankings', RankingsDirective);
