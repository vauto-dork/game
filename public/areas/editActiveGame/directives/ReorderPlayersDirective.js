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
        function ReorderPlayersController($scope, editActiveGameService) {
            this.$scope = $scope;
            this.editActiveGameService = editActiveGameService;
            this.unselect();
        }
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
        ReorderPlayersController.prototype.dropPlayerHere = function (player) {
            var _this = this;
            if (!!this.selectedPlayerId) {
                var selectedPlayer = this.players.filter(function (p) {
                    return p.playerId === _this.selectedPlayerId;
                });
                if (selectedPlayer.length === 1) {
                    var selectedPlayerIndex = this.playerIndex(this.selectedPlayerId);
                    this.players.splice(selectedPlayerIndex, 1);
                    var dropIndex = this.playerIndex(player.playerId);
                    this.players.splice(dropIndex, 0, selectedPlayer[0]);
                }
            }
            this.unselect();
        };
        ReorderPlayersController.prototype.removePlayer = function (player) {
            this.editActiveGameService.removePlayer(player);
        };
        ReorderPlayersController.$inject = ['$scope', 'editActiveGameService'];
        return ReorderPlayersController;
    })();
    EditActiveGame.ReorderPlayersController = ReorderPlayersController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=ReorderPlayersDirective.js.map