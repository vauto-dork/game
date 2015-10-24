var RankingsCardDirective = function() {
  return {
    scope: {
      player: "="
    },
    templateUrl: '/areas/rankings/directives/RankingsCardTemplate.html',
    controller: 'RankingsCardController',
    controllerAs: 'ctrl',
    bindToController: true
  };
};

var RankingsCardController = function ($scope) {
  var me = this;
  me.player = this.player;
};

RankingsCardController.$inject = ['$scope'];