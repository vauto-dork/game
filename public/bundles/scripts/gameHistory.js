var Components;
(function (Components) {
    var EditGameType = Shared.EditGameType;
    var GameCardService = (function () {
        function GameCardService($window, apiService) {
            this.$window = $window;
            this.apiService = apiService;
            this.gameType = EditGameType.ActiveGame;
        }
        GameCardService.prototype.copy = function (game) {
            var _this = this;
            var newGame = new Shared.Game();
            newGame.players = game.players.map(function (player) {
                var gamePlayer = new Shared.GamePlayer();
                gamePlayer.player = player.player;
                return gamePlayer;
            });
            var promise = this.apiService.createActiveGame(newGame);
            promise.then(function (editUrl) {
                _this.$window.location.href = editUrl;
            });
            return promise;
        };
        GameCardService.prototype.edit = function (game) {
            var parentPath = this.gameType === EditGameType.ActiveGame
                ? "/ActiveGames/Edit/#"
                : "/GameHistory/Edit/#";
            this.$window.location.href = parentPath + game.getIdAsPath();
        };
        GameCardService.prototype.delete = function (game) {
            return this.gameType === EditGameType.ActiveGame
                ? this.apiService.deleteActiveGame(game.getIdAsPath())
                : this.apiService.deleteGame(game.getIdAsPath());
        };
        GameCardService.$inject = ['$window', 'apiService'];
        return GameCardService;
    }());
    Components.GameCardService = GameCardService;
})(Components || (Components = {}));

var Components;
(function (Components) {
    function GameCard() {
        return {
            bindings: {
                game: "=",
                showModifyButtons: "=",
                reload: "&"
            },
            templateUrl: '/components/gameCard/directives/GameCardTemplate.html',
            controller: GameCardController
        };
    }
    Components.GameCard = GameCard;
    var State;
    (function (State) {
        State[State["Ready"] = 0] = "Ready";
        State[State["DeleteWarning"] = 1] = "DeleteWarning";
        State[State["Deleting"] = 2] = "Deleting";
        State[State["Deleted"] = 3] = "Deleted";
        State[State["Copy"] = 4] = "Copy";
        State[State["Edit"] = 5] = "Edit";
        State[State["Error"] = 6] = "Error";
    })(State || (State = {}));
    var GameCardController = (function () {
        function GameCardController(gameCardService, apiService) {
            this.gameCardService = gameCardService;
            this.apiService = apiService;
            this.showOverlay = false;
            this.showLoadBar = false;
            this.showDeleteWarning = false;
            this.showDeleted = false;
            this.showError = false;
            this.changeState(State.Ready);
        }
        GameCardController.prototype.changeState = function (newState) {
            this.showOverlay = newState !== State.Ready;
            this.showLoadBar = newState === State.Deleting || newState === State.Copy || newState === State.Edit;
            this.showDeleteWarning = newState === State.DeleteWarning;
            this.showError = newState === State.Error;
            this.showDeleted = newState === State.Deleted;
            switch (newState) {
                case State.Ready:
                    break;
                case State.Copy:
                    this.copy();
                    break;
                case State.Edit:
                    this.gameCardService.edit(this.game);
                    break;
                case State.Deleting:
                    this.delete();
                    break;
            }
        };
        GameCardController.prototype.errorHandler = function (data, errorMessage) {
            this.errorMessage = errorMessage;
            console.error(data);
            this.changeState(State.Error);
        };
        GameCardController.prototype.delete = function () {
            var _this = this;
            this.gameCardService.delete(this.game).then(function () {
                _this.changeState(State.Deleted);
            }, function (data) {
                _this.errorHandler(data, 'Error deleting game!');
            });
        };
        GameCardController.prototype.copy = function () {
            var _this = this;
            this.gameCardService.copy(this.game).then(function () { }, function (data) {
                _this.errorHandler(data, 'Error copying game!');
            });
        };
        GameCardController.prototype.edit = function () {
            this.changeState(State.Edit);
        };
        GameCardController.prototype.warnDelete = function () {
            this.changeState(State.DeleteWarning);
        };
        GameCardController.prototype.dismissOverlay = function () {
            this.changeState(State.Ready);
        };
        GameCardController.prototype.deleteGame = function (game) {
            this.changeState(State.Deleting);
        };
        GameCardController.prototype.copyGame = function (game) {
            this.changeState(State.Copy);
        };
        GameCardController.$inject = ['gameCardService', 'apiService'];
        return GameCardController;
    }());
    Components.GameCardController = GameCardController;
})(Components || (Components = {}));

var Components;
(function (Components) {
    var GameCardModule = angular.module('GameCardModule', []);
    GameCardModule.service('gameCardService', Components.GameCardService);
    GameCardModule.component('gameCard', Components.GameCard());
})(Components || (Components = {}));

var GameHistory;
(function (GameHistory_1) {
    var EditGameType = Shared.EditGameType;
    function GameHistory() {
        return {
            bindings: {
                isFinalizedGame: '='
            },
            templateUrl: '/areas/gameHistory/directives/GameHistoryTemplate.html',
            controller: GameHistoryController
        };
    }
    GameHistory_1.GameHistory = GameHistory;
    var State;
    (function (State) {
        State[State["Init"] = 0] = "Init";
        State[State["Loading"] = 1] = "Loading";
        State[State["NoGames"] = 2] = "NoGames";
        State[State["Ready"] = 3] = "Ready";
        State[State["Error"] = 4] = "Error";
        State[State["Change"] = 5] = "Change";
    })(State || (State = {}));
    ;
    var GameHistoryController = (function () {
        function GameHistoryController($timeout, dateTimeService, monthYearQueryService, apiService, gameCardService) {
            this.$timeout = $timeout;
            this.dateTimeService = dateTimeService;
            this.monthYearQueryService = monthYearQueryService;
            this.apiService = apiService;
            this.gameCardService = gameCardService;
            this.loading = true;
            this.errorMessage = '';
            this.showErrorMessage = false;
            this.showNoGamesWarning = false;
            this.gameCardService.gameType = this.isFinalizedGame
                ? EditGameType.FinalizedGame
                : EditGameType.ActiveGame;
            this.changeState(State.Init);
        }
        GameHistoryController.prototype.changeState = function (newState) {
            var _this = this;
            this.loading = newState === State.Init
                || newState === State.Change
                || newState === State.Loading;
            this.showErrorMessage = newState === State.Error;
            this.showNoGamesWarning = newState === State.NoGames;
            switch (newState) {
                case State.Init:
                    this.$timeout(function () {
                        var date = _this.monthYearQueryService.getQueryParams();
                        if (date) {
                            _this.month = date.month;
                            _this.year = date.year;
                        }
                        else {
                            _this.month = _this.dateTimeService.currentMonthValue();
                            _this.year = _this.dateTimeService.currentYear();
                            _this.monthYearQueryService.saveQueryParams(_this.month, _this.year);
                        }
                        _this.changeState(State.Loading);
                    }, 0);
                    break;
                case State.Change:
                    this.$timeout(function () {
                        _this.monthYearQueryService.saveQueryParams(_this.month, _this.year);
                        _this.changeState(State.Loading);
                    }, 0);
                    break;
                case State.Loading:
                    this.getGames();
                    break;
                case State.NoGames:
                    break;
                case State.Ready:
                    break;
            }
        };
        GameHistoryController.prototype.errorHandler = function (data, errorMessage) {
            this.errorMessage = errorMessage;
            console.error(data);
            this.changeState(State.Error);
        };
        GameHistoryController.prototype.getGames = function () {
            var _this = this;
            this.apiService.getGames(this.month, this.year).then(function (data) {
                _this.games = data;
                if (!data || data.length === 0) {
                    _this.changeState(State.NoGames);
                }
                else {
                    _this.changeState(State.Ready);
                }
            }, function (data) {
                _this.errorHandler(data, 'Error loading games!');
            });
        };
        GameHistoryController.prototype.updateQueryParams = function () {
            this.changeState(State.Change);
        };
        GameHistoryController.prototype.reload = function () {
            this.changeState(State.Loading);
        };
        GameHistoryController.$inject = ['$timeout', 'dateTimeService', 'monthYearQueryService', 'apiService', 'gameCardService'];
        return GameHistoryController;
    }());
    GameHistory_1.GameHistoryController = GameHistoryController;
})(GameHistory || (GameHistory = {}));

var GameHistory;
(function (GameHistory) {
    var GameHistoryModule = angular.module('GameHistoryModule', ['UxControlsModule', 'GameCardModule']);
    GameHistoryModule.component('gameHistory', GameHistory.GameHistory());
})(GameHistory || (GameHistory = {}));

//# sourceMappingURL=maps/gameHistory.js.map