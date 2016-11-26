var Components;
(function (Components) {
    function GameCardDirective() {
        return {
            scope: {
                game: "=",
                showModifyButtons: "=",
                reload: "&"
            },
            templateUrl: '/components/gameCard/directives/GameCardTemplate.html',
            controller: 'GameCardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Components.GameCardDirective = GameCardDirective;
    var State;
    (function (State) {
        State[State["Ready"] = 0] = "Ready";
        State[State["DeleteWarning"] = 1] = "DeleteWarning";
        State[State["Deleting"] = 2] = "Deleting";
        State[State["Deleted"] = 3] = "Deleted";
        State[State["Copy"] = 4] = "Copy";
        State[State["Error"] = 5] = "Error";
    })(State || (State = {}));
    var GameCardController = (function () {
        function GameCardController($http, $window, apiService) {
            this.$http = $http;
            this.$window = $window;
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
            this.showLoadBar = newState === State.Deleting || newState === State.Copy;
            this.showDeleteWarning = newState === State.DeleteWarning;
            this.showError = newState === State.Error;
            this.showDeleted = newState === State.Deleted;
            switch (newState) {
                case State.Ready:
                    break;
                case State.Copy:
                    this.copy();
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
            this.apiService.deleteActiveGame(this.game.getIdAsPath()).then(function () {
                _this.changeState(State.Deleted);
            }, function (data) {
                _this.errorHandler(data, 'Error deleting game!');
            });
        };
        GameCardController.prototype.copy = function () {
            var _this = this;
            var newGame = new Shared.Game();
            newGame.players = this.game.players.map(function (player) {
                var gamePlayer = new Shared.GamePlayer();
                gamePlayer.player = player.player;
                return gamePlayer;
            });
            this.apiService.createActiveGame(newGame).then(function (editUrl) {
                _this.$window.location.href = editUrl;
            }, function (data) {
                _this.errorHandler(data, 'Error copying game!');
            });
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
        GameCardController.$inject = ['$http', '$window', 'apiService'];
        return GameCardController;
    }());
    Components.GameCardController = GameCardController;
})(Components || (Components = {}));

var GameCardModule = angular.module('GameCardModule', []);
GameCardModule.controller('GameCardController', Components.GameCardController);
GameCardModule.directive('gameCard', Components.GameCardDirective);

var DorkHistory;
(function (DorkHistory) {
    function GameHistoryDirective() {
        return {
            scope: {},
            templateUrl: '/areas/history/directives/GameHistoryTemplate.html',
            controller: 'GameHistoryController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    DorkHistory.GameHistoryDirective = GameHistoryDirective;
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
        function GameHistoryController($timeout, dateTimeService, monthYearQueryService, apiService) {
            this.$timeout = $timeout;
            this.dateTimeService = dateTimeService;
            this.monthYearQueryService = monthYearQueryService;
            this.apiService = apiService;
            this.loading = true;
            this.errorMessage = '';
            this.showErrorMessage = false;
            this.showNoGamesWarning = false;
            this.month = dateTimeService.currentMonthValue();
            this.year = dateTimeService.currentYear();
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
                        _this.month = _this.monthYearQueryService.getMonthQueryParam(_this.month);
                        _this.year = _this.monthYearQueryService.getYearQueryParam(_this.year);
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
        GameHistoryController.$inject = ['$timeout', 'dateTimeService', 'monthYearQueryService', 'apiService'];
        return GameHistoryController;
    }());
    DorkHistory.GameHistoryController = GameHistoryController;
})(DorkHistory || (DorkHistory = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'GameCardModule']);

DorkModule.controller('GameHistoryController', DorkHistory.GameHistoryController);
DorkModule.directive('gameHistory', DorkHistory.GameHistoryDirective);
//# sourceMappingURL=maps/gameHistory.js.map