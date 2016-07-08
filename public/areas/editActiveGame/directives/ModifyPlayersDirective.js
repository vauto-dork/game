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
            var _this = this;
            this.$scope = $scope;
            this.editActiveGameService = editActiveGameService;
            this.editActiveGameService.getAllPlayers()
                .then(function (data) {
                _this.allPlayers = data;
                _this.curateNewPlayerList();
            });
        }
        Object.defineProperty(ModifyPlayersController.prototype, "currentPlayers", {
            get: function () {
                return this.editActiveGameService.players;
            },
            set: function (value) {
                this.editActiveGameService.players = value;
            },
            enumerable: true,
            configurable: true
        });
        ModifyPlayersController.prototype.curateNewPlayerList = function () {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.currentPlayers.map(function (p) { return p.playerId; });
            // Get players that are not in the current playlist.
            this.curatedPlayersList = this.allPlayers.filter(function (player) {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        };
        ModifyPlayersController.prototype.onSelected = function (data) {
            var player = new Shared.GamePlayer(data.toGamePlayerViewModel());
            this.currentPlayers.push(player);
            this.curateNewPlayerList();
        };
        ModifyPlayersController.prototype.toggleModifyPlayers = function () {
            this.editActiveGameService.toggleModifyPlayers();
        };
        ModifyPlayersController.$inject = ['$scope', 'editActiveGameService'];
        return ModifyPlayersController;
    }());
    EditActiveGame.ModifyPlayersController = ModifyPlayersController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=ModifyPlayersDirective.js.map