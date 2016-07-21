var EditActiveGame;
(function (EditActiveGame) {
    function ReorderPlayersDirective() {
        return {
            scope: {},
            templateUrl: '/areas/editActiveGame/directives/ReorderPlayersTemplate.html',
            controller: 'ReorderPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.ReorderPlayersDirective = ReorderPlayersDirective;
    var ReorderPlayersController = (function () {
        function ReorderPlayersController(editActiveGameService) {
            this.editActiveGameService = editActiveGameService;
            this.unselect();
        }
        Object.defineProperty(ReorderPlayersController.prototype, "dropZoneActive", {
            get: function () {
                return this.editActiveGameService.movePlayerActive;
            },
            set: function (value) {
                this.editActiveGameService.movePlayerActive = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReorderPlayersController.prototype, "players", {
            get: function () {
                return this.editActiveGameService.players;
            },
            set: function (value) {
                this.editActiveGameService.players = value;
            },
            enumerable: true,
            configurable: true
        });
        ReorderPlayersController.prototype.clickHandler = function (player) {
            if (!this.dropZoneActive && !this.selectedPlayerId) {
                this.markToMove(player);
            }
            else if (this.dropZoneActive && this.selectedPlayerId) {
                if (this.isPlayerSelected(player)) {
                    this.unselect();
                }
                else {
                    this.dropPlayerHere(player);
                }
            }
        };
        ReorderPlayersController.prototype.isPlayerSelected = function (player) {
            return this.selectedPlayerId === player.playerId;
        };
        ReorderPlayersController.prototype.markToMove = function (player) {
            this.dropZoneActive = true;
            this.selectedPlayerId = player.playerId;
        };
        ReorderPlayersController.prototype.unselect = function () {
            this.dropZoneActive = false;
            this.selectedPlayerId = null;
        };
        ReorderPlayersController.prototype.playerIndex = function (playerId) {
            return this.editActiveGameService.playerIndex(playerId);
        };
        ReorderPlayersController.prototype.dropPlayerHere = function (destinationPlayer) {
            if (!!this.selectedPlayerId) {
                this.editActiveGameService.movePlayer(this.selectedPlayerId, destinationPlayer);
            }
            this.unselect();
        };
        ReorderPlayersController.prototype.removePlayer = function (player) {
            this.editActiveGameService.removePlayer(player);
        };
        ReorderPlayersController.$inject = ['editActiveGameService'];
        return ReorderPlayersController;
    }());
    EditActiveGame.ReorderPlayersController = ReorderPlayersController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=ReorderPlayersDirective.js.map