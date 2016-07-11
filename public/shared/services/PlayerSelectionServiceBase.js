var Shared;
(function (Shared) {
    var PlayerSelectionServiceBase = (function () {
        function PlayerSelectionServiceBase($q, apiService) {
            this.$q = $q;
            this.apiService = apiService;
        }
        Object.defineProperty(PlayerSelectionServiceBase.prototype, "selectedPlayers", {
            get: function () {
                return this.players;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerSelectionServiceBase.prototype, "unselectedPlayers", {
            get: function () {
                return this.unselectedPlayersList;
            },
            enumerable: true,
            configurable: true
        });
        PlayerSelectionServiceBase.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        PlayerSelectionServiceBase.prototype.addPlayer = function (player) {
            this.players.push(player);
            this.curateNewPlayerList();
        };
        PlayerSelectionServiceBase.prototype.removePlayer = function (player) {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        };
        PlayerSelectionServiceBase.prototype.getPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.apiService.getPlayersForNewGame().then(function (data) {
                _this.allPlayers = data.players;
                def.resolve(data);
            }, function () {
                _this.allPlayers = [];
                def.reject();
            });
            return def.promise;
        };
        PlayerSelectionServiceBase.prototype.curateNewPlayerList = function () {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.players.map(function (p) { return p.playerId; });
            // Get players that are not in the current playlist.
            this.unselectedPlayersList = this.allPlayers.filter(function (player) {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        };
        // Debug functions
        PlayerSelectionServiceBase.prototype.debugShowAllPlayersTable = function () {
            this.debugPrintPlayersTable(this.allPlayers);
        };
        PlayerSelectionServiceBase.prototype.debugShowCuratedPlayersTable = function () {
            this.debugPrintPlayersTable(this.unselectedPlayers);
        };
        PlayerSelectionServiceBase.prototype.debugPrintPlayersTable = function (players) {
            // Change "info" to "table" to show as table in browser debugger
            console.info(players.map(function (p) {
                return {
                    orderNumber: p.orderNumber,
                    rating: p.rating,
                    name: p.player.fullname
                };
            }));
        };
        PlayerSelectionServiceBase.$inject = ['$q', 'apiService'];
        return PlayerSelectionServiceBase;
    }());
    Shared.PlayerSelectionServiceBase = PlayerSelectionServiceBase;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerSelectionServiceBase.js.map