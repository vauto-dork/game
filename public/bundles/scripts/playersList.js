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
        function PlayerSelectorController($element, $timeout) {
            this.$element = $element;
            this.$timeout = $timeout;
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
        PlayerSelectorController.$inject = ["$element", "$timeout"];
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

var PlayerSelectorModule = angular.module('PlayerSelectorModule', ['PlayerFormModule']);
PlayerSelectorModule.service('playerSelectionService', Components.PlayerSelectionService);
PlayerSelectorModule.filter('playerSelectorFilter', Components.PlayerSelectorFilter);
PlayerSelectorModule.controller('PlayerSelectorController', Components.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Components.PlayerSelectorDirective);

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Players;
(function (Players) {
    var PlayersListService = (function (_super) {
        __extends(PlayersListService, _super);
        function PlayersListService($timeout, $q, apiService, playerSelectionService) {
            _super.call(this, $timeout);
            this.$q = $q;
            this.apiService = apiService;
            this.playerSelectionService = playerSelectionService;
            this.event = {
                editOpen: "editOpen",
                editCancel: "editCancel",
                editSave: "editSave"
            };
            this.playerLoadPromise = this.loadPlayers();
        }
        Object.defineProperty(PlayersListService.prototype, "players", {
            get: function () {
                return this.allPlayers;
            },
            enumerable: true,
            configurable: true
        });
        PlayersListService.prototype.subscribeEditOpen = function (callback) {
            this.subscribe(this.event.editOpen, callback);
        };
        PlayersListService.prototype.subscribeEditSave = function (callback) {
            this.subscribe(this.event.editSave, callback);
        };
        PlayersListService.prototype.subscribeEditCancel = function (callback) {
            this.subscribe(this.event.editCancel, callback);
        };
        PlayersListService.prototype.ready = function () {
            return this.playerLoadPromise;
        };
        PlayersListService.prototype.loadPlayers = function () {
            var _this = this;
            return this.apiService.getAllPlayers().then(function (data) {
                _this.allPlayers = data;
                _this.$q.resolve();
            }, function (data) {
                _this.$q.reject(data);
            });
        };
        PlayersListService.prototype.savePlayer = function (player, notify) {
            var _this = this;
            return this.apiService.saveExistingPlayer(player).then(function () {
                if (notify) {
                    _this.publish(_this.event.editSave, null);
                }
                _this.$q.resolve();
            }, function (data) {
                _this.$q.reject(data);
            });
        };
        PlayersListService.prototype.cancelEdit = function () {
            this.publish(this.event.editCancel, null);
        };
        PlayersListService.prototype.openEdit = function () {
            this.publish(this.event.editOpen, null);
        };
        PlayersListService.$inject = ['$timeout', '$q', 'apiService', 'playerSelectionService'];
        return PlayersListService;
    }(Shared.PubSubServiceBase));
    Players.PlayersListService = PlayersListService;
})(Players || (Players = {}));

var Players;
(function (Players) {
    function EditPlayerDirective() {
        return {
            scope: {
                player: "="
            },
            templateUrl: "/areas/players/directives/EditPlayerTemplate.html",
            controller: "EditPlayerController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Players.EditPlayerDirective = EditPlayerDirective;
    var EditPlayerController = (function () {
        function EditPlayerController(playersListService) {
            var _this = this;
            this.playersListService = playersListService;
            this.disabled = false;
            this.playersListService.subscribeEditOpen(function () {
                _this.disabled = false;
            });
        }
        EditPlayerController.prototype.save = function () {
            this.disabled = true;
            this.playersListService.savePlayer(this.player, true);
        };
        EditPlayerController.prototype.cancel = function () {
            this.playersListService.cancelEdit();
        };
        EditPlayerController.$inject = ["playersListService"];
        return EditPlayerController;
    }());
    Players.EditPlayerController = EditPlayerController;
})(Players || (Players = {}));

var Players;
(function (Players) {
    function PlayersListDirective() {
        return {
            scope: {},
            templateUrl: "/areas/players/directives/PlayersListTemplate.html",
            controller: "PlayersListController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Players.PlayersListDirective = PlayersListDirective;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["Ready"] = 1] = "Ready";
        State[State["Error"] = 2] = "Error";
        State[State["EditPlayer"] = 3] = "EditPlayer";
        State[State["Saved"] = 4] = "Saved";
    })(State || (State = {}));
    var PlayersListController = (function () {
        function PlayersListController(apiService, alertsService, playersListService) {
            var _this = this;
            this.apiService = apiService;
            this.alertsService = alertsService;
            this.playersListService = playersListService;
            this.disableControls = false;
            this.showError = false;
            this.showLoading = false;
            this.showPlayers = false;
            this.showPlayerEdit = false;
            this.filter = "";
            this.changeState(State.Loading);
            this.playersListService.subscribeEditSave(function () {
                _this.changeState(State.Saved);
            });
            this.playersListService.subscribeEditCancel(function () {
                _this.selectedPlayer = undefined;
                _this.changeState(State.Ready);
            });
        }
        Object.defineProperty(PlayersListController.prototype, "alerts", {
            get: function () {
                return this.alertsService.alerts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayersListController.prototype, "players", {
            get: function () {
                return this.playersListService.players;
            },
            enumerable: true,
            configurable: true
        });
        PlayersListController.prototype.changeState = function (newState) {
            this.showLoading = newState === State.Loading;
            this.showPlayers = newState === State.Ready;
            this.showPlayerEdit = newState === State.EditPlayer;
            this.showError = newState === State.Error;
            switch (newState) {
                case State.Loading:
                    this.loadPlayers();
                    break;
                case State.EditPlayer:
                    this.playersListService.openEdit();
                    this.alertsService.clearAlerts();
                    break;
                case State.Saved:
                    this.alertsService.addAlert("success", "Player saved successfully!");
                    this.changeState(State.Loading);
                    break;
            }
        };
        PlayersListController.prototype.errorHandler = function (data, errorMessage) {
            this.alertsService.addAlert("danger", errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        PlayersListController.prototype.loadPlayers = function () {
            var _this = this;
            this.playersListService.loadPlayers().then(function () {
                _this.changeState(State.Ready);
            }, function (data) {
                _this.errorHandler(data, "Error fetching players!");
            });
        };
        PlayersListController.prototype.toggleInactive = function (player) {
            var _this = this;
            player.inactive = !player.inactive;
            this.playersListService.savePlayer(player, false).then(function () { }, function (data) {
                _this.errorHandler(data, "Player save failure!");
            });
        };
        PlayersListController.prototype.removeFilter = function () {
            this.filter = "";
        };
        PlayersListController.prototype.editPlayer = function (player) {
            this.selectedPlayer = angular.copy(player);
            this.changeState(State.EditPlayer);
        };
        PlayersListController.prototype.reload = function () {
            this.alertsService.clearAlerts();
            this.changeState(State.Loading);
        };
        PlayersListController.prototype.closeAlert = function (index) {
            this.alertsService.closeAlert(index);
        };
        PlayersListController.$inject = ["apiService", "alertsService", "playersListService"];
        return PlayersListController;
    }());
    Players.PlayersListController = PlayersListController;
})(Players || (Players = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule']);

DorkModule.service('alertsService', Shared.AlertsService);
DorkModule.service('playersListService', Players.PlayersListService);

DorkModule.controller('EditPlayerController', Players.EditPlayerController);
DorkModule.directive('editPlayer', Players.EditPlayerDirective);

DorkModule.controller('PlayersListController', Players.PlayersListController);
DorkModule.directive('playersList', Players.PlayersListDirective);

//# sourceMappingURL=maps/playersList.js.map