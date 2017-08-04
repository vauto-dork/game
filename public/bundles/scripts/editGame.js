var Components;
(function (Components) {
    function PlayerFormDirective() {
        return {
            scope: {
                player: "=",
                disableForm: "=?"
            },
            templateUrl: "/components/playerForm/directives/PlayerFormTemplate.html",
            controller: "PlayerFormController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Components.PlayerFormDirective = PlayerFormDirective;
    var PlayerFormController = (function () {
        function PlayerFormController() {
        }
        return PlayerFormController;
    }());
    PlayerFormController.$inject = [];
    Components.PlayerFormController = PlayerFormController;
})(Components || (Components = {}));

var PlayerFormModule = angular.module('PlayerFormModule', []);
PlayerFormModule.controller('PlayerFormController', Components.PlayerFormController);
PlayerFormModule.directive('playerForm', Components.PlayerFormDirective);

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
    var PlayerSelectionService = (function () {
        function PlayerSelectionService($q, apiService) {
            this.$q = $q;
            this.apiService = apiService;
            this.localFilter = "";
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
        Object.defineProperty(PlayerSelectionService.prototype, "filter", {
            get: function () {
                return this.localFilter;
            },
            set: function (value) {
                this.localFilter = value;
            },
            enumerable: true,
            configurable: true
        });
        PlayerSelectionService.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        PlayerSelectionService.prototype.removeFilter = function () {
            this.filter = "";
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
        return PlayerSelectionService;
    }());
    PlayerSelectionService.$inject = ["$q", "apiService"];
    Components.PlayerSelectionService = PlayerSelectionService;
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
            templateUrl: "/components/playerSelector/directives/PlayerSelectorTemplate.html",
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
        }
        Object.defineProperty(PlayerSelectorController.prototype, "filter", {
            get: function () {
                return this.playerSelectionService.filter;
            },
            set: function (value) {
                this.playerSelectionService.filter = value;
            },
            enumerable: true,
            configurable: true
        });
        PlayerSelectorController.prototype.removeFilter = function () {
            this.playerSelectionService.removeFilter();
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
        return PlayerSelectorController;
    }());
    PlayerSelectorController.$inject = ["$element", "$timeout", "$filter", "playerSelectionService"];
    Components.PlayerSelectorController = PlayerSelectorController;
})(Components || (Components = {}));

var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);
PlayerSelectorModule.service('playerSelectionService', Components.PlayerSelectionService);
PlayerSelectorModule.filter('playerSelectorFilter', Components.PlayerSelectorFilter);
PlayerSelectorModule.controller('PlayerSelectorController', Components.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Components.PlayerSelectorDirective);

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Components;
(function (Components) {
    var NewPlayerPanelService = (function (_super) {
        __extends(NewPlayerPanelService, _super);
        function NewPlayerPanelService($timeout, $q, apiService) {
            var _this = _super.call(this, $timeout) || this;
            _this.$q = $q;
            _this.apiService = apiService;
            _this.event = {
                formCancel: "formCancel",
                newPlayerReady: "newPlayerReady"
            };
            return _this;
        }
        NewPlayerPanelService.prototype.subscribeFormCancel = function (callback) {
            this.subscribe(this.event.formCancel, callback);
        };
        NewPlayerPanelService.prototype.subscribeSavedPlayer = function (callback) {
            this.subscribe(this.event.newPlayerReady, callback);
        };
        NewPlayerPanelService.prototype.cancelForm = function () {
            this.publish(this.event.formCancel, null);
        };
        NewPlayerPanelService.prototype.savePlayer = function (player) {
            var _this = this;
            return this.apiService.saveNewPlayer(player).then(function (data) {
                _this.publish(_this.event.newPlayerReady, data);
                _this.$q.resolve();
            }, function (data) {
                _this.$q.reject(data);
            });
        };
        return NewPlayerPanelService;
    }(Shared.PubSubServiceBase));
    NewPlayerPanelService.$inject = ["$timeout", "$q", "apiService"];
    Components.NewPlayerPanelService = NewPlayerPanelService;
})(Components || (Components = {}));

var Components;
(function (Components) {
    function NewPlayerButtonDirective() {
        return {
            scope: {
                click: "&",
                disabled: "="
            },
            templateUrl: "/components/newPlayerPanel/directives/NewPlayerButtonTemplate.html",
            controller: "NewPlayerButtonController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Components.NewPlayerButtonDirective = NewPlayerButtonDirective;
    var NewPlayerButtonController = (function () {
        function NewPlayerButtonController() {
        }
        return NewPlayerButtonController;
    }());
    Components.NewPlayerButtonController = NewPlayerButtonController;
})(Components || (Components = {}));

var Components;
(function (Components) {
    var NewPlayerPanelBase = (function () {
        function NewPlayerPanelBase() {
            this.collapsePlayerSelectorPanel = false;
            this.collapseAddNewPlayerPanel = true;
        }
        NewPlayerPanelBase.prototype.disablePlayerSelectorPanel = function () {
            this.collapsePlayerSelectorPanel = true;
        };
        NewPlayerPanelBase.prototype.enablePlayerSelectorPanel = function () {
            this.collapsePlayerSelectorPanel = false;
        };
        NewPlayerPanelBase.prototype.disableAddNewPlayer = function () {
            this.collapseAddNewPlayerPanel = true;
        };
        NewPlayerPanelBase.prototype.enableAddNewPlayer = function () {
            this.collapseAddNewPlayerPanel = false;
        };
        return NewPlayerPanelBase;
    }());
    Components.NewPlayerPanelBase = NewPlayerPanelBase;
})(Components || (Components = {}));

var Components;
(function (Components) {
    function NewPlayerPanelDirective() {
        return {
            scope: {},
            templateUrl: "/components/newPlayerPanel/directives/NewPlayerPanelTemplate.html",
            controller: "NewPlayerPanelController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Components.NewPlayerPanelDirective = NewPlayerPanelDirective;
    var NewPlayerPanelController = (function () {
        function NewPlayerPanelController(panelService) {
            this.panelService = panelService;
            this.player = new Shared.Player();
            this.resetForm();
        }
        NewPlayerPanelController.prototype.resetForm = function () {
            this.player = new Shared.Player();
            if (this.addPlayerForm) {
                this.addPlayerForm.$setPristine();
                this.addPlayerForm.$setUntouched();
            }
            this.disabled = false;
            this.showError = false;
        };
        NewPlayerPanelController.prototype.cancel = function () {
            this.resetForm();
            this.panelService.cancelForm();
        };
        NewPlayerPanelController.prototype.save = function () {
            var _this = this;
            this.showError = false;
            this.disabled = true;
            this.panelService.savePlayer(this.player).then(function () {
                _this.resetForm();
            }, function (data) {
                console.error(data);
                _this.showError = true;
                _this.disabled = false;
            });
        };
        return NewPlayerPanelController;
    }());
    NewPlayerPanelController.$inject = ["newPlayerPanelService"];
    Components.NewPlayerPanelController = NewPlayerPanelController;
})(Components || (Components = {}));

var newPlayerModule = angular.module('NewPlayerPanelModule', ['PlayerFormModule']);
newPlayerModule.service('newPlayerPanelService', Components.NewPlayerPanelService);
newPlayerModule.controller('NewPlayerButtonController', Components.NewPlayerButtonController);
newPlayerModule.directive('newPlayerButton', Components.NewPlayerButtonDirective);
newPlayerModule.controller('NewPlayerPanelController', Components.NewPlayerPanelController);
newPlayerModule.directive('newPlayerPanel', Components.NewPlayerPanelDirective);

var EditGame;
(function (EditGame) {
    var EditGameType = Shared.EditGameType;
    var EditGameService = (function () {
        function EditGameService($location, $q, apiService, playerSelectionService, newPlayerPanelService) {
            var _this = this;
            this.$location = $location;
            this.$q = $q;
            this.apiService = apiService;
            this.playerSelectionService = playerSelectionService;
            this.newPlayerPanelService = newPlayerPanelService;
            this.errorMessageList = [];
            this.newPlayerPanelService.subscribeSavedPlayer(function (event, player) {
                _this.playerSelectionService.getPlayers().then(function () {
                    var newPlayer = new Shared.GamePlayer();
                    newPlayer.player = player;
                    newPlayer.points = 0;
                    newPlayer.rank = 0;
                    _this.addPlayer(newPlayer);
                });
            });
        }
        Object.defineProperty(EditGameService.prototype, "datePlayed", {
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
        Object.defineProperty(EditGameService.prototype, "movePlayerActive", {
            get: function () {
                return this.isMovePlayerActive;
            },
            set: function (value) {
                this.isMovePlayerActive = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditGameService.prototype, "errorMessages", {
            get: function () {
                return this.errorMessageList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditGameService.prototype, "players", {
            get: function () {
                return this.activeGame.players;
            },
            set: function (value) {
                this.activeGame.players = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditGameService.prototype, "unselectedPlayers", {
            get: function () {
                return this.playerSelectionService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditGameService.prototype, "gameType", {
            get: function () {
                return this.localGameType;
            },
            enumerable: true,
            configurable: true
        });
        EditGameService.prototype.getGame = function (gameType) {
            var _this = this;
            this.localGameType = gameType;
            var def = this.$q.defer();
            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }
            var allPlayersPromise = this.playerSelectionService.getPlayers();
            var gamePromise = gameType === EditGameType.ActiveGame
                ? this.apiService.getActiveGame(this.gameIdPath)
                : this.apiService.getFinalizedGame(this.gameIdPath);
            gamePromise.then(function (game) {
                _this.activeGame = game;
                def.resolve();
            }, function () {
                _this.addErrorMessage('Cannot get active game.');
                def.reject();
            });
            this.$q.all([allPlayersPromise, gamePromise]).then(function () {
                _this.players.forEach(function (p) {
                    _this.playerSelectionService.addPlayer(p.player);
                });
            });
            return def.promise;
        };
        EditGameService.prototype.playerIndex = function (playerId) {
            return this.activeGame.getPlayerIndex(playerId);
        };
        EditGameService.prototype.addPlayer = function (player) {
            this.activeGame.addPlayer(player);
            this.playerSelectionService.addPlayer(player.player);
        };
        EditGameService.prototype.removePlayer = function (player) {
            this.activeGame.removePlayer(player);
            this.playerSelectionService.removePlayer(player.player);
        };
        EditGameService.prototype.movePlayer = function (selectedPlayerId, destinationPlayer) {
            var isSuccess = this.activeGame.movePlayer(selectedPlayerId, destinationPlayer);
            if (!isSuccess) {
                console.error("Cannot find player: ", selectedPlayerId);
            }
        };
        EditGameService.prototype.save = function () {
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
        EditGameService.prototype.finalize = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.filterRemovedPlayers() && this.hasRanks()) {
                this.activeGame.addBonusPoints();
                this.apiService.finalizeGame(this.activeGame).then(function () {
                    _this.apiService.deleteActiveGame(_this.gameIdPath).then(function () {
                        def.resolve();
                    }, function () {
                        _this.activeGame.removeBonusPoints();
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
        EditGameService.prototype.updateFinalizedGame = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.filterRemovedPlayers() && this.hasRanks()) {
                this.activeGame.addBonusPoints();
                this.apiService.updateFinalizeGame(this.activeGame).then(function () {
                    def.resolve();
                }, function () {
                    _this.activeGame.removeBonusPoints();
                    _this.addErrorMessage('Cannot update finalized game.');
                    def.reject();
                });
            }
            else {
                def.reject();
            }
            return def.promise;
        };
        EditGameService.prototype.addErrorMessage = function (message, clear) {
            if (clear === void 0) { clear = true; }
            if (clear) {
                this.clearerrorMessageList();
            }
            this.errorMessageList.push(message);
        };
        EditGameService.prototype.clearerrorMessageList = function () {
            this.errorMessageList = [];
        };
        EditGameService.prototype.filterRemovedPlayers = function () {
            if (this.players.length < 3) {
                this.addErrorMessage('Game cannot have less than three players.');
                return false;
            }
            this.activeGame.convertNullPointsToZero();
            return true;
        };
        EditGameService.prototype.hasRanks = function () {
            this.clearerrorMessageList();
            if (!this.activeGame.hasFirstPlace()) {
                this.addErrorMessage('No winner selected.', false);
            }
            if (!this.activeGame.hasSecondPlace()) {
                this.addErrorMessage('No second place selected.', false);
            }
            if (!this.activeGame.hasThirdPlace()) {
                this.addErrorMessage('No third place selected.', false);
            }
            return this.activeGame.declareWinner();
        };
        return EditGameService;
    }());
    EditGameService.$inject = ["$location", "$q", "apiService", "playerSelectionService", "newPlayerPanelService"];
    EditGame.EditGameService = EditGameService;
})(EditGame || (EditGame = {}));

var EditGame;
(function (EditGame) {
    var EditGameCollapseService = (function () {
        function EditGameCollapseService() {
            this.collapseScoreForm = false;
            this.collapseModifyPlayers = true;
        }
        EditGameCollapseService.prototype.disableScoreForm = function () {
            this.collapseScoreForm = true;
        };
        EditGameCollapseService.prototype.enableScoreForm = function () {
            this.collapseScoreForm = false;
        };
        EditGameCollapseService.prototype.disableModifyPlayers = function () {
            this.collapseModifyPlayers = true;
        };
        EditGameCollapseService.prototype.enableModifyPlayers = function () {
            this.collapseModifyPlayers = false;
        };
        return EditGameCollapseService;
    }());
    EditGame.EditGameCollapseService = EditGameCollapseService;
})(EditGame || (EditGame = {}));

var EditGame;
(function (EditGame) {
    function EditScoresDirective() {
        return {
            scope: {
                disabled: '='
            },
            templateUrl: '/areas/editGame/directives/EditScoresTemplate.html',
            controller: 'EditScoresController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditGame.EditScoresDirective = EditScoresDirective;
    var EditScoresController = (function () {
        function EditScoresController(editGameService) {
            this.editGameService = editGameService;
            this.pointsMin = -4;
            this.pointsMax = 99;
        }
        Object.defineProperty(EditScoresController.prototype, "players", {
            get: function () {
                return this.editGameService.players;
            },
            set: function (value) {
                this.editGameService.players = value;
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
        return EditScoresController;
    }());
    EditScoresController.$inject = ['editGameService'];
    EditGame.EditScoresController = EditScoresController;
})(EditGame || (EditGame = {}));

var EditGame;
(function (EditGame) {
    function ReorderPlayersDirective() {
        return {
            scope: {},
            templateUrl: '/areas/editGame/directives/ReorderPlayersTemplate.html',
            controller: 'ReorderPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditGame.ReorderPlayersDirective = ReorderPlayersDirective;
    var ReorderPlayersController = (function () {
        function ReorderPlayersController(editGameService) {
            this.editGameService = editGameService;
            this.unselect();
        }
        Object.defineProperty(ReorderPlayersController.prototype, "dropZoneActive", {
            get: function () {
                return this.editGameService.movePlayerActive;
            },
            set: function (value) {
                this.editGameService.movePlayerActive = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReorderPlayersController.prototype, "players", {
            get: function () {
                return this.editGameService.players;
            },
            set: function (value) {
                this.editGameService.players = value;
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
            return this.editGameService.playerIndex(playerId);
        };
        ReorderPlayersController.prototype.dropPlayerHere = function (destinationPlayer) {
            if (!!this.selectedPlayerId) {
                this.editGameService.movePlayer(this.selectedPlayerId, destinationPlayer);
            }
            this.unselect();
        };
        ReorderPlayersController.prototype.removePlayer = function (player) {
            this.editGameService.removePlayer(player);
        };
        return ReorderPlayersController;
    }());
    ReorderPlayersController.$inject = ['editGameService'];
    EditGame.ReorderPlayersController = ReorderPlayersController;
})(EditGame || (EditGame = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EditGame;
(function (EditGame) {
    function ModifyPlayersDirective() {
        return {
            scope: {},
            templateUrl: "/areas/editGame/directives/ModifyPlayersTemplate.html",
            controller: "ModifyPlayersController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    EditGame.ModifyPlayersDirective = ModifyPlayersDirective;
    var ModifyPlayersController = (function (_super) {
        __extends(ModifyPlayersController, _super);
        function ModifyPlayersController(editGameService, playerSelectionService, newPlayerPanelService, editGameCollapseService) {
            var _this = _super.call(this) || this;
            _this.editGameService = editGameService;
            _this.playerSelectionService = playerSelectionService;
            _this.newPlayerPanelService = newPlayerPanelService;
            _this.editGameCollapseService = editGameCollapseService;
            _this.newPlayerPanelService.subscribeFormCancel(function () {
                _this.disableAddNewPlayer();
            });
            _this.newPlayerPanelService.subscribeSavedPlayer(function () {
                _this.disableAddNewPlayer();
            });
            return _this;
        }
        Object.defineProperty(ModifyPlayersController.prototype, "unselectedPlayers", {
            get: function () {
                return this.editGameService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModifyPlayersController.prototype, "movePlayerActive", {
            get: function () {
                return this.editGameService.movePlayerActive;
            },
            enumerable: true,
            configurable: true
        });
        ModifyPlayersController.prototype.onSelected = function (data) {
            var player = new Shared.GamePlayer(data.toGamePlayerViewModel());
            this.editGameService.addPlayer(player);
        };
        ModifyPlayersController.prototype.back = function () {
            this.editGameCollapseService.disableModifyPlayers();
        };
        ModifyPlayersController.prototype.enablePlayerSelectorPanel = function () {
            this.playerSelectionService.removeFilter();
            _super.prototype.enablePlayerSelectorPanel.call(this);
        };
        return ModifyPlayersController;
    }(Components.NewPlayerPanelBase));
    ModifyPlayersController.$inject = ["editGameService", "playerSelectionService", "newPlayerPanelService", "editGameCollapseService"];
    EditGame.ModifyPlayersController = ModifyPlayersController;
})(EditGame || (EditGame = {}));

var EditGame;
(function (EditGame) {
    var EditGameType = Shared.EditGameType;
    function RevertFinalizeDirective() {
        return {
            scope: {
                save: "&",
                revert: "&",
                finalize: "&",
                update: "&",
                disabled: "="
            },
            templateUrl: '/areas/editGame/directives/RevertFinalizeTemplate.html',
            controller: 'RevertFinalizeController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditGame.RevertFinalizeDirective = RevertFinalizeDirective;
    var RevertFinalizeController = (function () {
        function RevertFinalizeController(editGameService) {
            this.editGameService = editGameService;
        }
        Object.defineProperty(RevertFinalizeController.prototype, "numPlayers", {
            get: function () {
                return this.editGameService.players.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RevertFinalizeController.prototype, "isFinalizedGame", {
            get: function () {
                return this.editGameService.gameType === EditGameType.FinalizedGame;
            },
            enumerable: true,
            configurable: true
        });
        return RevertFinalizeController;
    }());
    RevertFinalizeController.$inject = ['editGameService'];
    EditGame.RevertFinalizeController = RevertFinalizeController;
})(EditGame || (EditGame = {}));

var EditGame;
(function (EditGame) {
    var EditGameType = Shared.EditGameType;
    function EditGameDirective() {
        return {
            scope: {
                isFinalizedGame: '='
            },
            templateUrl: "/areas/editGame/directives/EditGameTemplate.html",
            controller: "EditGameController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    EditGame.EditGameDirective = EditGameDirective;
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
    var EditGameController = (function () {
        function EditGameController($window, editGameService, alertsService, editGameCollapseService) {
            this.$window = $window;
            this.editGameService = editGameService;
            this.alertsService = alertsService;
            this.editGameCollapseService = editGameCollapseService;
            this.showLoading = false;
            this.showError = false;
            this.showScoreForm = false;
            this.disabled = false;
            this.changeState(State.Init);
        }
        Object.defineProperty(EditGameController.prototype, "alerts", {
            get: function () {
                return this.alertsService.alerts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditGameController.prototype, "collapseScoreForm", {
            get: function () {
                return this.editGameCollapseService.collapseScoreForm;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditGameController.prototype, "collapseModifyPlayers", {
            get: function () {
                return this.editGameCollapseService.collapseModifyPlayers;
            },
            enumerable: true,
            configurable: true
        });
        EditGameController.prototype.changeState = function (newState) {
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
                    this.getGame();
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
        EditGameController.prototype.ready = function () {
            if (this.collapseScoreForm) {
                this.editGameCollapseService.enableScoreForm();
            }
            this.alertsService.scrollToTop();
        };
        EditGameController.prototype.errorHandler = function (data, errorMessage) {
            this.alertsService.addAlert("danger", errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        EditGameController.prototype.getGame = function () {
            var _this = this;
            var gameType = this.isFinalizedGame ? EditGameType.FinalizedGame : EditGameType.ActiveGame;
            this.editGameService.getGame(gameType).then(function () {
                _this.changeState(State.Ready);
                _this.datePlayed = _this.editGameService.datePlayed;
            }, function () {
                _this.errorHandler("Cannot get active game.", "Cannot load game");
            });
        };
        EditGameController.prototype.saveGame = function () {
            var _this = this;
            this.alertsService.clearAlerts();
            this.editGameService.datePlayed = this.datePlayed;
            this.editGameService.save().then(function () {
                _this.alertsService.addAlert("success", "Game saved successfully!");
                _this.changeState(State.Ready);
            }, function () {
                _this.saveReject();
            });
        };
        EditGameController.prototype.finalizeGame = function () {
            var _this = this;
            this.editGameService.finalize().then(function () {
                _this.$window.location.href = "/GameHistory";
            }, function () {
                _this.saveReject();
            });
        };
        EditGameController.prototype.updateFinalizedGame = function () {
            var _this = this;
            this.editGameService.updateFinalizedGame().then(function () {
                _this.$window.location.href = "/GameHistory/Admin";
            }, function () {
                _this.saveReject();
            });
        };
        EditGameController.prototype.saveReject = function () {
            var _this = this;
            this.alertsService.clearAlerts();
            this.editGameService.errorMessages.forEach(function (msg) { _this.alertsService.addAlert("danger", msg); });
            this.changeState(State.Ready);
        };
        EditGameController.prototype.closeAlert = function (index) {
            this.alertsService.closeAlert(index);
        };
        EditGameController.prototype.save = function () {
            this.changeState(State.Saving);
        };
        EditGameController.prototype.finalize = function () {
            this.changeState(State.Finalizing);
        };
        EditGameController.prototype.revert = function () {
            this.changeState(State.Loading);
        };
        EditGameController.prototype.enableScoreForm = function () {
            this.editGameCollapseService.enableScoreForm();
        };
        EditGameController.prototype.disableScoreForm = function () {
            this.editGameCollapseService.disableScoreForm();
        };
        EditGameController.prototype.enableModifyPlayers = function () {
            this.editGameCollapseService.enableModifyPlayers();
        };
        return EditGameController;
    }());
    EditGameController.$inject = ["$window", "editGameService", "alertsService", "editGameCollapseService"];
    EditGame.EditGameController = EditGameController;
})(EditGame || (EditGame = {}));

var EditGameModule = angular.module('EditGameModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);
EditGameModule.service('alertsService', Shared.AlertsService);
EditGameModule.service('editGameService', EditGame.EditGameService);
EditGameModule.service('editGameCollapseService', EditGame.EditGameCollapseService);
EditGameModule.controller('EditGameController', EditGame.EditGameController);
EditGameModule.directive('editGame', EditGame.EditGameDirective);
EditGameModule.controller('EditScoresController', EditGame.EditScoresController);
EditGameModule.directive('editScores', EditGame.EditScoresDirective);
EditGameModule.controller('ReorderPlayersController', EditGame.ReorderPlayersController);
EditGameModule.directive('reorderPlayers', EditGame.ReorderPlayersDirective);
EditGameModule.controller('ModifyPlayersController', EditGame.ModifyPlayersController);
EditGameModule.directive('modifyPlayers', EditGame.ModifyPlayersDirective);
EditGameModule.controller('RevertFinalizeController', EditGame.RevertFinalizeController);
EditGameModule.directive('revertFinalize', EditGame.RevertFinalizeDirective);
EditGameModule.controller('PlayerBonusPanelController', Shared.PlayerBonusPanelController);
EditGameModule.directive('playerBonusPanel', Shared.PlayerBonusPanelDirective);

var DorkModule = angular.module('DorkModule', ['EditGameModule']);

//# sourceMappingURL=maps/editGame.js.map