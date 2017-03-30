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
            console.table(players.map(function (p) {
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

var EnterScores;
(function (EnterScores) {
    var ScoreFormState;
    (function (ScoreFormState) {
        ScoreFormState[ScoreFormState["DateSelect"] = 0] = "DateSelect";
        ScoreFormState[ScoreFormState["ScoreEntry"] = 1] = "ScoreEntry";
    })(ScoreFormState = EnterScores.ScoreFormState || (EnterScores.ScoreFormState = {}));
    var EnterScoresService = (function () {
        function EnterScoresService($q, apiService, playerSelectionService, newPlayerPanelService) {
            var _this = this;
            this.$q = $q;
            this.apiService = apiService;
            this.playerSelectionService = playerSelectionService;
            this.newPlayerPanelService = newPlayerPanelService;
            this.firstGameOfMonth = false;
            this.currentState = ScoreFormState.DateSelect;
            this.players = [];
            this.playerLoadPromise = this.playerSelectionService.getPlayers().then(function (data) {
                _this.initializeData(data.firstGameOfMonth);
                _this.$q.resolve();
            }, function () {
                _this.initializeData(true);
                _this.$q.resolve();
            });
            this.newPlayerPanelService.subscribeSavedPlayer(function (event, player) {
                _this.playerSelectionService.getPlayers().then(function () {
                    var newPlayer = new Shared.NewGamePlayer();
                    newPlayer.player = player;
                    newPlayer.orderNumber = 0;
                    newPlayer.rating = 0;
                    _this.addPlayer(newPlayer);
                });
            });
        }
        Object.defineProperty(EnterScoresService.prototype, "unselectedPlayers", {
            get: function () {
                return this.playerSelectionService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnterScoresService.prototype, "players", {
            get: function () {
                return this.localPlayers;
            },
            set: function (value) {
                this.localPlayers = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnterScoresService.prototype, "state", {
            get: function () {
                return this.currentState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnterScoresService.prototype, "datePlayed", {
            get: function () {
                return this.localDatePlayed;
            },
            set: function (value) {
                this.localDatePlayed = value;
            },
            enumerable: true,
            configurable: true
        });
        EnterScoresService.prototype.initializeData = function (firstGameOfMonth) {
            this.firstGameOfMonth = firstGameOfMonth;
            this.reset();
        };
        EnterScoresService.prototype.init = function () {
            return this.playerLoadPromise;
        };
        EnterScoresService.prototype.reset = function () {
            this.playerSelectionService.reset();
        };
        EnterScoresService.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        EnterScoresService.prototype.createGame = function () {
            this.currentState = ScoreFormState.ScoreEntry;
        };
        EnterScoresService.prototype.createNewActiveGame = function (datePlayed) {
            var _this = this;
            var game = new Shared.Game();
            game.datePlayed = datePlayed.toISOString();
            game.players = this.players;
            this.apiService.createActiveGame(game).then(function (editUrl) {
                _this.gameId = editUrl;
            });
        };
        EnterScoresService.prototype.addPlayer = function (player) {
            this.players.push(player);
            this.playerSelectionService.addPlayer(player.player);
        };
        EnterScoresService.prototype.removePlayer = function (player) {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.playerSelectionService.removePlayer(player.player);
        };
        EnterScoresService.prototype.changePlayerPoints = function (playerId, points) {
            this.players.some(function (p) {
                if (p.playerId === playerId) {
                    p.points = points;
                    return true;
                }
                return false;
            });
        };
        return EnterScoresService;
    }());
    EnterScoresService.$inject = ["$q", "apiService", "playerSelectionService", "newPlayerPanelService"];
    EnterScores.EnterScoresService = EnterScoresService;
})(EnterScores || (EnterScores = {}));

var EnterScores;
(function (EnterScores) {
    function TempPlayerPanelDirective() {
        return {
            scope: {
                player: "=",
                cancel: "&",
                add: "&"
            },
            templateUrl: '/areas/enterScores/directives/TempPlayerPanelTemplate.html',
            controller: 'TempPlayerPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EnterScores.TempPlayerPanelDirective = TempPlayerPanelDirective;
    var TempPlayerPanelController = (function () {
        function TempPlayerPanelController($element, $timeout) {
            this.$element = $element;
            this.$timeout = $timeout;
            this.pointsMin = -4;
            this.pointsMax = 99;
        }
        Object.defineProperty(TempPlayerPanelController.prototype, "player", {
            get: function () {
                return this.gamePlayer;
            },
            set: function (value) {
                var _this = this;
                this.gamePlayer = value;
                if (this.$element) {
                    this.$timeout(function () {
                        _this.$element.find(".game-score-numeric-input").click();
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        TempPlayerPanelController.prototype.decrementScore = function (player) {
            var points = player.points;
            player.points = (points - 1 >= this.pointsMin) ? points - 1 : points;
        };
        TempPlayerPanelController.prototype.incrementScore = function (player) {
            var points = player.points;
            player.points = (points + 1 <= this.pointsMax) ? points + 1 : points;
        };
        return TempPlayerPanelController;
    }());
    TempPlayerPanelController.$inject = ["$element", "$timeout"];
    EnterScores.TempPlayerPanelController = TempPlayerPanelController;
})(EnterScores || (EnterScores = {}));

var EnterScores;
(function (EnterScores) {
    function EditScoresPanelDirective() {
        return {
            scope: {
                disabled: '='
            },
            templateUrl: '/areas/enterScores/directives/EditScoresPanelTemplate.html',
            controller: 'EditScoresPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EnterScores.EditScoresPanelDirective = EditScoresPanelDirective;
    var EditScoresPanelController = (function () {
        function EditScoresPanelController(enterScoresService) {
            this.enterScoresService = enterScoresService;
            this.pointsMin = -4;
            this.pointsMax = 99;
        }
        Object.defineProperty(EditScoresPanelController.prototype, "players", {
            get: function () {
                return this.enterScoresService.players;
            },
            set: function (value) {
                this.enterScoresService.players = value;
            },
            enumerable: true,
            configurable: true
        });
        EditScoresPanelController.prototype.rankHandler = function (player) {
            player.rank = player.rank === null ? 0 : player.rank;
            this.players.forEach(function (p) {
                if (p.playerId !== player.playerId) {
                    if (player.rank > 0 && p.rank === player.rank) {
                        p.rank = 0;
                    }
                }
            });
        };
        EditScoresPanelController.prototype.decrementScore = function (player) {
            if (!this.disabled) {
                var points = player.points;
                player.points = (points - 1 >= this.pointsMin) ? points - 1 : points;
            }
        };
        EditScoresPanelController.prototype.incrementScore = function (player) {
            if (!this.disabled) {
                var points = player.points;
                player.points = (points + 1 <= this.pointsMax) ? points + 1 : points;
            }
        };
        return EditScoresPanelController;
    }());
    EditScoresPanelController.$inject = ['enterScoresService'];
    EnterScores.EditScoresPanelController = EditScoresPanelController;
})(EnterScores || (EnterScores = {}));

var EnterScores;
(function (EnterScores) {
    function GameTimePanelDirective() {
        return {
            scope: {},
            templateUrl: '/areas/enterScores/directives/GametimePanelTemplate.html',
            controller: 'GameTimePanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EnterScores.GameTimePanelDirective = GameTimePanelDirective;
    var GameTimePanelController = (function () {
        function GameTimePanelController(enterScoresService) {
            this.enterScoresService = enterScoresService;
        }
        Object.defineProperty(GameTimePanelController.prototype, "datePlayed", {
            get: function () {
                return this.enterScoresService.datePlayed;
            },
            set: function (value) {
                if (!this.enterScoresService.datePlayed && !!value) {
                    this.enterScoresService.datePlayed = value;
                    if (value.getHours() === 0) {
                        this.enterScoresService.datePlayed.setHours(12);
                    }
                }
                else {
                    this.enterScoresService.datePlayed = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameTimePanelController.prototype, "hasDate", {
            get: function () {
                return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
            },
            enumerable: true,
            configurable: true
        });
        GameTimePanelController.prototype.create = function () {
            this.enterScoresService.createGame();
        };
        return GameTimePanelController;
    }());
    GameTimePanelController.$inject = ["enterScoresService"];
    EnterScores.GameTimePanelController = GameTimePanelController;
})(EnterScores || (EnterScores = {}));

var EnterScores;
(function (EnterScores) {
    function ScoreFormPanelDirective() {
        return {
            scope: {},
            templateUrl: "/areas/enterScores/directives/ScoreFormPanelTemplate.html",
            controller: "ScoreFormPanelController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    EnterScores.ScoreFormPanelDirective = ScoreFormPanelDirective;
    var ScoreFormPanelController = (function () {
        function ScoreFormPanelController($timeout, $element, enterScoresService) {
            this.$timeout = $timeout;
            this.$element = $element;
            this.enterScoresService = enterScoresService;
            this.showTempPlayerPanel = false;
        }
        Object.defineProperty(ScoreFormPanelController.prototype, "datePlayed", {
            get: function () {
                return this.enterScoresService.datePlayed;
            },
            set: function (value) {
                this.enterScoresService.datePlayed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScoreFormPanelController.prototype, "players", {
            get: function () {
                return this.enterScoresService.players;
            },
            enumerable: true,
            configurable: true
        });
        ScoreFormPanelController.prototype.playerSelect = function (data) {
            this.tempPlayer = data.toGamePlayer();
            this.showTempPlayerPanel = true;
        };
        ScoreFormPanelController.prototype.closeTempPlayerPanel = function () {
            var _this = this;
            this.showTempPlayerPanel = false;
            this.tempPlayer = null;
            this.$timeout(function () {
                _this.$element.find(".player-selector").find("input").focus();
            });
        };
        ScoreFormPanelController.prototype.addPlayer = function () {
            this.enterScoresService.addPlayer(this.tempPlayer);
            this.enterScoresService.changePlayerPoints(this.tempPlayer.playerId, this.tempPlayer.points);
            this.closeTempPlayerPanel();
        };
        Object.defineProperty(ScoreFormPanelController.prototype, "unselectedPlayers", {
            get: function () {
                return this.enterScoresService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        return ScoreFormPanelController;
    }());
    ScoreFormPanelController.$inject = ["$timeout", "$element", "enterScoresService"];
    EnterScores.ScoreFormPanelController = ScoreFormPanelController;
})(EnterScores || (EnterScores = {}));

var EnterScores;
(function (EnterScores) {
    function EnterScoresDirective() {
        return {
            scope: {},
            templateUrl: "/areas/enterScores/directives/EnterScoresTemplate.html",
            controller: "EnterScoresController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    EnterScores.EnterScoresDirective = EnterScoresDirective;
    var EnterScoresController = (function () {
        function EnterScoresController(enterScoresService) {
            this.enterScoresService = enterScoresService;
        }
        Object.defineProperty(EnterScoresController.prototype, "showGameTimePanel", {
            get: function () {
                return this.enterScoresService.state === EnterScores.ScoreFormState.DateSelect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnterScoresController.prototype, "showScoreFormPanel", {
            get: function () {
                return this.enterScoresService.state === EnterScores.ScoreFormState.ScoreEntry;
            },
            enumerable: true,
            configurable: true
        });
        return EnterScoresController;
    }());
    EnterScoresController.$inject = ["enterScoresService"];
    EnterScores.EnterScoresController = EnterScoresController;
})(EnterScores || (EnterScores = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);

DorkModule.service('enterScoresService', EnterScores.EnterScoresService);

DorkModule.controller('TempPlayerPanelController', EnterScores.TempPlayerPanelController);
DorkModule.directive('tempPlayerPanel', EnterScores.TempPlayerPanelDirective);

DorkModule.controller('EditScoresPanelController', EnterScores.EditScoresPanelController);
DorkModule.directive('editScoresPanel', EnterScores.EditScoresPanelDirective);

DorkModule.controller('GameTimePanelController', EnterScores.GameTimePanelController);
DorkModule.directive('gameTimePanel', EnterScores.GameTimePanelDirective);

DorkModule.controller('ScoreFormPanelController', EnterScores.ScoreFormPanelController);
DorkModule.directive('scoreFormPanel', EnterScores.ScoreFormPanelDirective);

DorkModule.controller('EnterScoresController', EnterScores.EnterScoresController);
DorkModule.directive('enterScores', EnterScores.EnterScoresDirective);

//# sourceMappingURL=maps/enterScores.js.map