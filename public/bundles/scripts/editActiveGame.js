var Components;
(function (Components) {
    function PlayerSelectorFilter() {
        return function (playersList, filter) {
            var caseInsensitiveMatch = function (value, filter) {
                return value.toUpperCase().search(filter.toUpperCase()) >= 0;
            };
            var initials = playersList.filter(function (player) {
                return caseInsensitiveMatch(player.player.initials, filter);
            });
            var nicknames = playersList.filter(function (player) {
                return caseInsensitiveMatch(player.player.nickname, filter);
            }).sort(function (a, b) {
                if (a.player.nickname.length < b.player.nickname.length)
                    return -1;
                if (a.player.nickname.length > b.player.nickname.length)
                    return 1;
                return 0;
            });
            var fullname = playersList.filter(function (player) {
                return caseInsensitiveMatch(player.player.fullname, filter);
            });
            var output = [];
            var existsInOutput = function (playerId) {
                return !output.length || output.map(function (p) { return p.playerId; }).indexOf(playerId) === -1;
            };
            initials.forEach(function (player) {
                output.push(player);
            });
            nicknames.forEach(function (player) {
                if (existsInOutput(player.playerId)) {
                    output.push(player);
                }
            });
            fullname.forEach(function (player) {
                if (existsInOutput(player.playerId)) {
                    output.push(player);
                }
            });
            var inactivePlayers = output.filter(function (player) {
                return player.player.inactive;
            });
            return output.filter(function (player) {
                return !player.player.inactive;
            }).concat(inactivePlayers);
        };
    }
    Components.PlayerSelectorFilter = PlayerSelectorFilter;
})(Components || (Components = {}));

var Components;
(function (Components) {
    function PlayerSelectorDirective() {
        return {
            scope: {
                players: "=",
                onSelected: "&",
                disabled: "="
            },
            templateUrl: "/components/PlayerSelector/directives/PlayerSelectorTemplate.html",
            controller: "PlayerSelectorController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Components.PlayerSelectorDirective = PlayerSelectorDirective;
    var PlayerSelectorController = (function () {
        function PlayerSelectorController($element, $timeout, $filter, playerSelectionService) {
            this.$element = $element;
            this.$timeout = $timeout;
            this.$filter = $filter;
            this.playerSelectionService = playerSelectionService;
            this.filter = "";
        }
        PlayerSelectorController.prototype.removeFilter = function () {
            this.filter = "";
        };
        PlayerSelectorController.prototype.selectPlayer = function (item, model, label) {
            this.$element.find("input").focus();
            this.onSelected({ data: item });
            this.removeFilter();
        };
        PlayerSelectorController.prototype.possiblePlayersAdded = function () {
            var list = this.$filter("playerSelectorFilter")(this.playerSelectionService.selectedPlayers, this.filter)
                .map(function (player) {
                return player.player.fullname;
            });
            return {
                flatList: list.join(", "),
                hasPlayers: list.length > 0
            };
        };
        PlayerSelectorController.$inject = ["$element", "$timeout", "$filter", "playerSelectionService"];
        return PlayerSelectorController;
    }());
    Components.PlayerSelectorController = PlayerSelectorController;
})(Components || (Components = {}));

var Components;
(function (Components) {
    var PlayerSelectionService = (function () {
        function PlayerSelectionService($q, apiService) {
            this.$q = $q;
            this.apiService = apiService;
            this.allPlayers = [];
            this.players = [];
            this.unselectedPlayersList = [];
        }
        Object.defineProperty(PlayerSelectionService.prototype, "selectedPlayers", {
            get: function () {
                return this.players;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerSelectionService.prototype, "unselectedPlayers", {
            get: function () {
                return this.unselectedPlayersList;
            },
            enumerable: true,
            configurable: true
        });
        PlayerSelectionService.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        PlayerSelectionService.prototype.addPlayer = function (player) {
            var found = this.allPlayers.filter(function (p) { return p.playerId === player._id; });
            if (found.length === 1) {
                this.players.push(found[0]);
                this.curateNewPlayerList();
            }
            else {
                console.error("Player not found.", player);
            }
        };
        PlayerSelectionService.prototype.removePlayer = function (player) {
            var index = this.playerIndex(player._id);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        };
        PlayerSelectionService.prototype.getPlayers = function () {
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
        PlayerSelectionService.prototype.curateNewPlayerList = function () {
            var currentPlayerIds = this.players.map(function (p) { return p.playerId; });
            this.unselectedPlayersList = this.allPlayers.filter(function (player) {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        };
        PlayerSelectionService.prototype.reset = function () {
            this.players = [];
            this.curateNewPlayerList();
        };
        PlayerSelectionService.prototype.debugShowAllPlayersTable = function () {
            this.debugPrintPlayersTable(this.allPlayers);
        };
        PlayerSelectionService.prototype.debugShowCuratedPlayersTable = function () {
            this.debugPrintPlayersTable(this.unselectedPlayers);
        };
        PlayerSelectionService.prototype.debugPrintPlayersTable = function (players) {
            console.info(players.map(function (p) {
                return {
                    orderNumber: p.orderNumber,
                    rating: p.rating,
                    name: p.player.fullname
                };
            }));
        };
        PlayerSelectionService.$inject = ['$q', 'apiService'];
        return PlayerSelectionService;
    }());
    Components.PlayerSelectionService = PlayerSelectionService;
})(Components || (Components = {}));

var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);
PlayerSelectorModule.service('playerSelectionService', Components.PlayerSelectionService);
PlayerSelectorModule.filter('playerSelectorFilter', Components.PlayerSelectorFilter);
PlayerSelectorModule.controller('PlayerSelectorController', Components.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Components.PlayerSelectorDirective);

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

var EditActiveGame;
(function (EditActiveGame) {
    function EditScoresDirective() {
        return {
            scope: {
                disabled: '='
            },
            templateUrl: '/areas/editActiveGame/directives/EditScoresTemplate.html',
            controller: 'EditScoresController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.EditScoresDirective = EditScoresDirective;
    var EditScoresController = (function () {
        function EditScoresController(editActiveGameService) {
            this.editActiveGameService = editActiveGameService;
            this.pointsMin = -4;
            this.pointsMax = 99;
        }
        Object.defineProperty(EditScoresController.prototype, "players", {
            get: function () {
                return this.editActiveGameService.players;
            },
            set: function (value) {
                this.editActiveGameService.players = value;
            },
            enumerable: true,
            configurable: true
        });
        EditScoresController.prototype.rankHandler = function (player) {
            player.rank = player.rank === null ? 0 : player.rank;
            this.players.forEach(function (p) {
                if (p.playerId !== player.playerId) {
                    if (player.rank > 0 && p.rank === player.rank) {
                        p.rank = 0;
                    }
                }
            });
        };
        EditScoresController.prototype.decrementScore = function (player) {
            if (!this.disabled) {
                var points = player.points;
                player.points = (points - 1 >= this.pointsMin) ? points - 1 : points;
            }
        };
        EditScoresController.prototype.incrementScore = function (player) {
            if (!this.disabled) {
                var points = player.points;
                player.points = (points + 1 <= this.pointsMax) ? points + 1 : points;
            }
        };
        EditScoresController.$inject = ['editActiveGameService'];
        return EditScoresController;
    }());
    EditActiveGame.EditScoresController = EditScoresController;
})(EditActiveGame || (EditActiveGame = {}));

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
        function ModifyPlayersController(editActiveGameService) {
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
        ModifyPlayersController.$inject = ['editActiveGameService'];
        return ModifyPlayersController;
    }());
    EditActiveGame.ModifyPlayersController = ModifyPlayersController;
})(EditActiveGame || (EditActiveGame = {}));

var EditActiveGame;
(function (EditActiveGame) {
    function RevertFinalizeDirective() {
        return {
            scope: {
                save: "&",
                revert: "&",
                finalize: "&",
                disabled: "="
            },
            templateUrl: '/areas/editActiveGame/directives/RevertFinalizeTemplate.html',
            controller: 'RevertFinalizeController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.RevertFinalizeDirective = RevertFinalizeDirective;
    var RevertFinalizeController = (function () {
        function RevertFinalizeController(editActiveGameService) {
            this.editActiveGameService = editActiveGameService;
        }
        Object.defineProperty(RevertFinalizeController.prototype, "numPlayers", {
            get: function () {
                return this.editActiveGameService.players.length;
            },
            enumerable: true,
            configurable: true
        });
        RevertFinalizeController.$inject = ['editActiveGameService'];
        return RevertFinalizeController;
    }());
    EditActiveGame.RevertFinalizeController = RevertFinalizeController;
})(EditActiveGame || (EditActiveGame = {}));

var EditActiveGame;
(function (EditActiveGame) {
    function EditActiveGameDirective() {
        return {
            scope: {},
            templateUrl: '/areas/editActiveGame/directives/EditActiveGameTemplate.html',
            controller: 'EditActiveGameController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.EditActiveGameDirective = EditActiveGameDirective;
    var State;
    (function (State) {
        State[State["Init"] = 0] = "Init";
        State[State["Loading"] = 1] = "Loading";
        State[State["Error"] = 2] = "Error";
        State[State["Ready"] = 3] = "Ready";
        State[State["Saving"] = 4] = "Saving";
        State[State["Finalizing"] = 5] = "Finalizing";
    })(State || (State = {}));
    ;
    var EditActiveGameController = (function () {
        function EditActiveGameController($window, editActiveGameService, alertsService) {
            this.$window = $window;
            this.editActiveGameService = editActiveGameService;
            this.alertsService = alertsService;
            this.showLoading = false;
            this.showError = false;
            this.showScoreForm = false;
            this.disabled = false;
            this.changeState(State.Init);
        }
        Object.defineProperty(EditActiveGameController.prototype, "alerts", {
            get: function () {
                return this.alertsService.alerts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditActiveGameController.prototype, "showModifyPlaylist", {
            get: function () {
                return this.editActiveGameService.showModifyPlaylist;
            },
            enumerable: true,
            configurable: true
        });
        EditActiveGameController.prototype.changeState = function (newState) {
            this.showLoading = (newState === State.Init) ||
                (newState === State.Loading);
            this.showError = newState === State.Error;
            this.showScoreForm = (newState !== State.Init) &&
                (newState !== State.Loading) &&
                (newState !== State.Error);
            this.disabled = (newState === State.Saving) ||
                (newState === State.Finalizing) ||
                (newState === State.Init) ||
                (newState === State.Loading);
            switch (newState) {
                case State.Init:
                    this.changeState(State.Loading);
                    break;
                case State.Loading:
                    this.getActiveGame();
                    break;
                case State.Error:
                    this.alertsService.scrollToTop();
                    break;
                case State.Ready:
                    this.ready();
                    break;
                case State.Saving:
                    this.saveGame();
                    break;
                case State.Finalizing:
                    this.finalizeGame();
                    break;
            }
        };
        EditActiveGameController.prototype.ready = function () {
            if (this.showModifyPlaylist) {
                this.toggleModifyPlaylist();
            }
            this.alertsService.scrollToTop();
        };
        EditActiveGameController.prototype.errorHandler = function (data, errorMessage) {
            this.alertsService.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        EditActiveGameController.prototype.getActiveGame = function () {
            var _this = this;
            this.editActiveGameService.getActiveGame().then(function () {
                _this.changeState(State.Ready);
                _this.datePlayed = _this.editActiveGameService.datePlayed;
            }, function () {
                _this.errorHandler('Cannot get active game.', 'Cannot load game');
            });
        };
        EditActiveGameController.prototype.saveGame = function () {
            var _this = this;
            this.alertsService.clearAlerts();
            this.editActiveGameService.datePlayed = this.datePlayed;
            this.editActiveGameService.save().then(function () {
                _this.alertsService.addAlert('success', 'Game saved successfully!');
                _this.changeState(State.Ready);
            }, function () {
                _this.saveReject();
            });
        };
        EditActiveGameController.prototype.finalizeGame = function () {
            var _this = this;
            this.editActiveGameService.finalize(true).then(function () {
                _this.$window.location.href = '/GameHistory';
            }, function () {
                _this.saveReject();
            });
        };
        EditActiveGameController.prototype.saveReject = function () {
            var _this = this;
            this.alertsService.clearAlerts();
            this.editActiveGameService.errorMessages.forEach(function (msg) { _this.alertsService.addAlert('danger', msg); });
            this.changeState(State.Ready);
        };
        EditActiveGameController.prototype.closeAlert = function (index) {
            this.alertsService.closeAlert(index);
        };
        EditActiveGameController.prototype.save = function () {
            this.changeState(State.Saving);
        };
        EditActiveGameController.prototype.finalize = function () {
            this.changeState(State.Finalizing);
        };
        EditActiveGameController.prototype.revert = function () {
            this.changeState(State.Loading);
        };
        EditActiveGameController.prototype.toggleModifyPlaylist = function () {
            this.editActiveGameService.toggleModifyPlaylist();
        };
        EditActiveGameController.$inject = ['$window', 'editActiveGameService', 'alertsService'];
        return EditActiveGameController;
    }());
    EditActiveGame.EditActiveGameController = EditActiveGameController;
})(EditActiveGame || (EditActiveGame = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule']);

DorkModule.service('alertsService', Shared.AlertsService);
DorkModule.service('editActiveGameService', EditActiveGame.EditActiveGameService);

DorkModule.controller('EditActiveGameController', EditActiveGame.EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGame.EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditActiveGame.EditScoresController);
DorkModule.directive('editScores', EditActiveGame.EditScoresDirective);

DorkModule.controller('ReorderPlayersController', EditActiveGame.ReorderPlayersController);
DorkModule.directive('reorderPlayers', EditActiveGame.ReorderPlayersDirective);

DorkModule.controller('ModifyPlayersController', EditActiveGame.ModifyPlayersController);
DorkModule.directive('modifyPlayers', EditActiveGame.ModifyPlayersDirective);

DorkModule.controller('RevertFinalizeController', EditActiveGame.RevertFinalizeController);
DorkModule.directive('revertFinalize', EditActiveGame.RevertFinalizeDirective);

DorkModule.controller('PlayerBonusPanelController', Shared.PlayerBonusPanelController);
DorkModule.directive('playerBonusPanel', Shared.PlayerBonusPanelDirective);
//# sourceMappingURL=maps/editActiveGame.js.map