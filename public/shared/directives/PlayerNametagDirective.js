var Shared;
(function (Shared) {
    function PlayerNametagDirective() {
        return {
            scope: {
                player: '='
            },
            templateUrl: '/shared/directives/PlayerNametagTemplate.html',
            controller: 'PlayerNametagController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerNametagDirective = PlayerNametagDirective;
    var PlayerNametagController = (function () {
        function PlayerNametagController($scope) {
            this.$scope = $scope;
        }
        PlayerNametagController.$inject = ['$scope'];
        return PlayerNametagController;
    }());
    Shared.PlayerNametagController = PlayerNametagController;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerNametagDirective.js.map