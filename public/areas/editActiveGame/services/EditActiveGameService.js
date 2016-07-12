var EditActiveGame;
(function (EditActiveGame) {
    var EditActiveGameService = (function () {
        function EditActiveGameService($location, $q, apiService, playerSelectionService) {
            this.$location = $location;
            this.$q = $q;
            this.apiService = apiService;
            this.playerSelectionService = playerSelectionService;
            this.errorMessageList = [];
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
        Object.defineProperty(EditActiveGameService.prototype, "movePlayerActive", {
            get: function () {
                return this.isMovePlayerActive;
            },
            set: function (value) {
                this.isMovePlayerActive = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditActiveGameService.prototype, "showModifyPlaylist", {
            get: function () {
                return this.showModifyPlaylistScreen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditActiveGameService.prototype, "errorMessages", {
            get: function () {
                return this.errorMessageList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditActiveGameService.prototype, "players", {
            get: function () {
                return this.activeGame.players;
            },
            set: function (value) {
                this.activeGame.players = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditActiveGameService.prototype, "unselectedPlayers", {
            get: function () {
                return this.playerSelectionService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        EditActiveGameService.prototype.toggleModifyPlaylist = function () {
            this.showModifyPlaylistScreen = !this.showModifyPlaylistScreen;
        };
        EditActiveGameService.prototype.getActiveGame = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }
            var allPlayersPromise = this.playerSelectionService.getPlayers();
            var activeGamePromise = this.apiService.getActiveGame(this.gameIdPath);
            activeGamePromise.then(function (game) {
                _this.activeGame = game;
                def.resolve();
            }, function () {
                _this.addErrorMessage('Cannot get active game.');
                def.reject();
            });
            this.$q.all([allPlayersPromise, activeGamePromise]).then(function () {
                _this.players.forEach(function (p) {
                    _this.playerSelectionService.addPlayer(p.player);
                });
            });
            return def.promise;
        };
        EditActiveGameService.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        EditActiveGameService.prototype.addPlayer = function (player) {
            this.players.push(player);
            this.playerSelectionService.addPlayer(player.player);
        };
        EditActiveGameService.prototype.removePlayer = function (player) {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.playerSelectionService.removePlayer(player.player);
        };
        EditActiveGameService.prototype.movePlayer = function (selectedPlayerId, destinationPlayer) {
            var selectedPlayer = this.players.filter(function (p) {
                return p.playerId === selectedPlayerId;
            });
            if (selectedPlayer.length === 1) {
                var selectedPlayerIndex = this.playerIndex(selectedPlayerId);
                this.players.splice(selectedPlayerIndex, 1);
                var dropIndex = this.playerIndex(destinationPlayer.playerId);
                if (selectedPlayerIndex <= dropIndex) {
                    dropIndex += 1;
                }
                this.players.splice(dropIndex, 0, selectedPlayer[0]);
            }
            else {
                console.error("Cannot find player: ", selectedPlayerId);
            }
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
        EditActiveGameService.prototype.finalize = function (addBonusPoints) {
            var _this = this;
            var def = this.$q.defer();
            if (this.filterRemovedPlayers() && this.hasRanks()) {
                if (addBonusPoints) {
                    this.addBonusPoints();
                }
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
        EditActiveGameService.prototype.addBonusPoints = function () {
            var numPlayers = this.players.length;
            this.players.forEach(function (player) {
                if (player.rank === 1) {
                    player.points += numPlayers - 1;
                }
                if (player.rank === 2) {
                    player.points += numPlayers - 2;
                }
                if (player.rank === 3) {
                    player.points += numPlayers - 3;
                }
            });
        };
        EditActiveGameService.prototype.addErrorMessage = function (message, clear) {
            if (clear === void 0) { clear = true; }
            if (clear) {
                this.clearerrorMessageList();
            }
            this.errorMessageList.push(message);
        };
        EditActiveGameService.prototype.clearerrorMessageList = function () {
            this.errorMessageList = [];
        };
        EditActiveGameService.prototype.filterRemovedPlayers = function () {
            if (this.players.length < 3) {
                this.addErrorMessage('Game cannot have less than three players.');
                return false;
            }
            // Convert blank points to zeroes.
            this.players.forEach(function (player) {
                player.points = !player.points ? 0 : player.points;
            });
            return true;
        };
        EditActiveGameService.prototype.hasRanks = function () {
            this.clearerrorMessageList();
            var rank1 = this.players.filter(function (value) { return value.rank === 1; }).length;
            var rank2 = this.players.filter(function (value) { return value.rank === 2; }).length;
            var rank3 = this.players.filter(function (value) { return value.rank === 3; }).length;
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
                var winner = this.players.filter(function (player) { return player.rank === 1; });
                this.activeGame.winner = winner[0].player;
            }
            return hasRanks;
        };
        EditActiveGameService.$inject = ['$location', '$q', 'apiService', 'playerSelectionService'];
        return EditActiveGameService;
    }());
    EditActiveGame.EditActiveGameService = EditActiveGameService;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditActiveGameService.js.map