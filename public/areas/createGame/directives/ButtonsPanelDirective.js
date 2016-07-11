var CreateGame;
(function (CreateGame) {
    function ButtonsPanelDirective() {
        return {
            scope: {
                datePlayed: "=",
                create: "&"
            },
            templateUrl: '/areas/createGame/directives/ButtonsPanelTemplate.html',
            controller: 'ButtonsPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    CreateGame.ButtonsPanelDirective = ButtonsPanelDirective;
    var ButtonsPanelController = (function () {
        function ButtonsPanelController($window, createGameService) {
            this.$window = $window;
            this.createGameService = createGameService;
            this.datePlayed = null;
        }
        Object.defineProperty(ButtonsPanelController.prototype, "hasDate", {
            get: function () {
                return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonsPanelController.prototype, "hasSelectedPlayers", {
            get: function () {
                return this.createGameService.numPlayers > 0;
            },
            enumerable: true,
            configurable: true
        });
        ButtonsPanelController.prototype.reset = function () {
            this.datePlayed = null;
            this.createGameService.reset();
        };
        ButtonsPanelController.prototype.useCurrentDateTime = function () {
            this.datePlayed = new Date();
        };
        Object.defineProperty(ButtonsPanelController.prototype, "disableGameCreation", {
            get: function () {
                return !this.hasDate || !this.createGameService.hasMinimumPlayers;
            },
            enumerable: true,
            configurable: true
        });
        ButtonsPanelController.$inject = ['$window', 'createGameService'];
        return ButtonsPanelController;
    }());
    CreateGame.ButtonsPanelController = ButtonsPanelController;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=ButtonsPanelDirective.js.map