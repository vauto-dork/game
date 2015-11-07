var Shared;
(function (Shared) {
    function PlayerScoretagDirective() {
        return {
            scope: {
                player: '='
            },
            templateUrl: '/shared/directives/PlayerScoretagTemplate.html',
            controller: 'PlayerScoretagController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerScoretagDirective = PlayerScoretagDirective;
    var PlayerScoretagController = (function () {
        function PlayerScoretagController($scope) {
            this.$scope = $scope;
            var rankArray = !this.player.rank ? 0 : this.player.rank;
            this.rank = new Array(rankArray);
        }
        PlayerScoretagController.$inject = ['$scope'];
        return PlayerScoretagController;
    })();
    Shared.PlayerScoretagController = PlayerScoretagController;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerScoretagDirective.js.map