var EditActiveGame;
(function (EditActiveGame) {
    function ModifyPlayersDirective() {
        return {
            scope: {},
            templateUrl: '/areas/editActiveGame/directives/ModifyPlayersTemplate.html',
            controller: 'ModifyPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.ModifyPlayersDirective = ModifyPlayersDirective;
    var ModifyPlayersController = (function () {
        function ModifyPlayersController($scope, editActiveGameService) {
            this.$scope = $scope;
            this.editActiveGameService = editActiveGameService;
        }
        Object.defineProperty(ModifyPlayersController.prototype, "unselectedPlayers", {
            get: function () {
                return this.editActiveGameService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModifyPlayersController.prototype, "movePlayerActive", {
            get: function () {
                return this.editActiveGameService.movePlayerActive;
            },
            enumerable: true,
            configurable: true
        });
        ModifyPlayersController.prototype.onSelected = function (data) {
            var player = new Shared.GamePlayer(data.toGamePlayerViewModel());
            this.editActiveGameService.addPlayer(player);
        };
        ModifyPlayersController.prototype.back = function () {
            this.editActiveGameService.toggleModifyPlaylist();
        };
        ModifyPlayersController.$inject = ['$scope', 'editActiveGameService'];
        return ModifyPlayersController;
    }());
    EditActiveGame.ModifyPlayersController = ModifyPlayersController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=ModifyPlayersDirective.js.map