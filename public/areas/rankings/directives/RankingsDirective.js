var RankingsDirective = function() {
  return {
    scope: {
      month: "=",
      year: "=",
      hideUnranked: "="  
    },
    templateUrl: '/areas/rankings/directives/RankingsTemplate.html',
    controller: 'RankingsController',
    controllerAs: 'ctrl',
    bindToController: true
  };
};

var RankingsController = function ($scope, rankingsFactory) {
  var me = this;
  me.showLoading = true;
  me.showRankings = false;
  me.showUnrankedPlayers = false;
  me.showUnrankBtn = false;
  
  me.players = [];
  me.playersUnderTen = [];
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
  
  $scope.$watchGroup([function(){ return me.month; }, function(){ return me.year; }],
    function(newValue, oldValue){
      if((newValue !== oldValue)) {
        me.changeState(me.State.Loading);
      }
  });
  
  me.getRankings = function(){
    var rankingsPromise = rankingsFactory.GetRankings(me.month, me.year, me.hideUnranked);
    rankingsPromise.then( me.loadingSuccess.bind(me), function(data) {
      me.changeState(me.State.Error);
      console.error(data);
    });
  };
  
  me.loadingSuccess = function(){
    me.players = rankingsFactory.GetPlayersOverTenGames();
    me.playersUnderTen = rankingsFactory.GetPlayersUnderTenGames();
    
    if (me.playersUnderTen.some( function(elem) { return elem.rank > 0; } )) {
      me.numberUnranked = me.playersUnderTen.filter(function(element) { return element.rank <= 0; }).length;
      me.changeState(me.State.Loaded);
    } else {
      me.changeState(me.State.NoRankings);
    }
  }
	
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

RankingsController.$inject = ['$scope', 'rankingsFactory'];
