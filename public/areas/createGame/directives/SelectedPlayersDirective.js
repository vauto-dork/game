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
        Object.defineProperty(SelectedPlayersController.prototype, "orderModel", {
            get: function () {
                if (this.createGameService.playerSort === CreateGame.NewGameSort.Rating) {
                    return 'Rating';
                }
                else {
                    return 'Selected';
                }
            },
            set: function (value) {
                // do nothing
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectedPlayersController.prototype, "selectedPlayers", {
            get: function () {
                return this.createGameService.getSelectedPlayers();
            },
            set: function (value) {
                //do nothing.
            },
            enumerable: true,
            configurable: true
        });
        SelectedPlayersController.prototype.removePlayer = function (player) {
            this.createGameService.deselectPlayer(player);
        };
        SelectedPlayersController.prototype.useThisOrder = function () {
            this.createGameService.playerSort = CreateGame.NewGameSort.Selected;
        };
        ;
        SelectedPlayersController.prototype.useGameOrder = function () {
            this.createGameService.playerSort = CreateGame.NewGameSort.Rating;
        };
        ;
        SelectedPlayersController.$inject = ['$scope', 'createGameService'];
        return SelectedPlayersController;
    })();
    CreateGame.SelectedPlayersController = SelectedPlayersController;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=SelectedPlayersDirective.js.map