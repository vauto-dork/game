var EditActiveGame;
(function (EditActiveGame) {
    var EditActiveGameService = (function () {
        function EditActiveGameService($location, $q, apiService) {
            this.$location = $location;
            this.$q = $q;
            this.apiService = apiService;
            this.errorMessages = [];
        }
        Object.defineProperty(EditActiveGameService.prototype, "datePlayed", {
            get: function () {
                if (this.activeGame && this.activeGame.datePlayed) {
                    return new Date(this.activeGame.datePlayed);
                }
                return null;
            },
            set: function (value) {
                if (this.activeGame) {
                    this.activeGame.datePlayed = value.toISOString();
                }
            },
            enumerable: true,
            configurable: true
        });
        EditActiveGameService.prototype.getErrorMessages = function () {
            return this.errorMessages;
        };
        EditActiveGameService.prototype.getActiveGame = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }
            this.apiService.getActiveGame(this.gameIdPath).then(function (game) {
                _this.activeGame = game;
                def.resolve();
            }, function () {
                _this.addErrorMessage('Cannot get active game.');
                def.reject();
            });
            return def.promise;
        };
        EditActiveGameService.prototype.getGamePlayers = function () {
            return this.activeGame.players;
        };
        EditActiveGameService.prototype.save = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.filterRemovedPlayers()) {
                this.apiService.saveActiveGame(this.gameIdPath, this.activeGame).then(function () {
                    def.resolve();
                }, function () {
                    _this.addErrorMessage('Cannot save active game.');
                    def.reject();
                });
            }
            else {
                def.reject();
            }
            return def.promise;
        };
        EditActiveGameService.prototype.finalize = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.hasRanks() && this.filterRemovedPlayers()) {
                this.apiService.finalizeGame(this.activeGame).then(function () {
                    _this.apiService.deleteActiveGame(_this.gameIdPath).then(function () {
                        def.resolve();
                    }, function () {
                        _this.addErrorMessage('Cannot delete active game.');
                        def.reject();
                    });
                }, function () {
                    _this.addErrorMessage('Cannot finalize active game.');
                    def.reject();
                });
            }
            else {
                def.reject();
            }
            return def.promise;
        };
        EditActiveGameService.prototype.addErrorMessage = function (message, clear) {
            if (clear === void 0) { clear = true; }
            if (clear) {
                this.clearErrorMessages();
            }
            this.errorMessages.push(message);
        };
        EditActiveGameService.prototype.clearErrorMessages = function () {
            this.errorMessages = [];
        };
        EditActiveGameService.prototype.filterRemovedPlayers = function () {
            var remainingPlayers = this.activeGame.players.filter(function (player) {
                return !player.removed;
            });
            if (remainingPlayers.length < 3) {
                this.addErrorMessage('Game cannot have less than three players.');
                return false;
            }
            this.activeGame.players = remainingPlayers;
            // Convert blank points to zeroes.
            this.activeGame.players.forEach(function (player) {
                player.points = !player.points ? 0 : player.points;
            });
            return true;
        };
        EditActiveGameService.prototype.hasRanks = function () {
            this.clearErrorMessages();
            var rank1 = this.activeGame.players.filter(function (value) { return value.rank === 1; }).length;
            var rank2 = this.activeGame.players.filter(function (value) { return value.rank === 2; }).length;
            var rank3 = this.activeGame.players.filter(function (value) { return value.rank === 3; }).length;
            if (rank1 !== 1) {
                this.addErrorMessage('No winner selected.', false);
            }
            if (rank2 !== 1) {
                this.addErrorMessage('No second place selected.', false);
            }
            if (rank3 !== 1) {
                this.addErrorMessage('No third place selected.', false);
            }
            var hasRanks = (rank1 === 1 && rank2 === 1 && rank3 === 1);
            if (hasRanks) {
                var winner = this.activeGame.players.filter(function (player) { return player.rank === 1; });
                this.activeGame.winner = winner[0].player;
            }
            return hasRanks;
        };
        EditActiveGameService.$inject = ['$location', '$q', 'apiService'];
        return EditActiveGameService;
    }());
    EditActiveGame.EditActiveGameService = EditActiveGameService;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditActiveGameService.js.map