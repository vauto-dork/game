var CreateGame;
(function (CreateGame) {
    function SelectedPlayersDirective() {
        return {
            scope: {},
            templateUrl: '/areas/createGame/directives/SelectedPlayersTemplate.html',
            controller: 'SelectedPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    CreateGame.SelectedPlayersDirective = SelectedPlayersDirective;
    var SelectedPlayersController = (function () {
        function SelectedPlayersController($scope, createGameService) {
            this.$scope = $scope;
            this.createGameService = createGameService;
        }
        Object.defineProperty(SelectedPlayersController.prototype, "players", {
            get: function () {
                return this.createGameService.playersSorted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectedPlayersController.prototype, "hasMinimumPlayers", {
            get: function () {
                return this.createGameService.hasMinimumPlayers;
            },
            enumerable: true,
            configurable: true
        });
        SelectedPlayersController.prototype.removePlayer = function (player) {
            this.createGameService.removePlayer(player);
        };
        SelectedPlayersController.$inject = ['$scope', 'createGameService'];
        return SelectedPlayersController;
    }());
    CreateGame.SelectedPlayersController = SelectedPlayersController;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=SelectedPlayersDirective.js.map