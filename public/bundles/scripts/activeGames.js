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

var ActiveGame;
(function (ActiveGame) {
    function ActiveGamesDirective() {
        return {
            scope: {},
            templateUrl: '/areas/activeGame/directives/ActiveGamesTemplate.html',
            controller: 'ActiveGamesController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    ActiveGame.ActiveGamesDirective = ActiveGamesDirective;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["NoGames"] = 1] = "NoGames";
        State[State["Loaded"] = 2] = "Loaded";
        State[State["Error"] = 3] = "Error";
    })(State || (State = {}));
    ;
    var ActiveGamesController = (function () {
        function ActiveGamesController(apiService) {
            this.apiService = apiService;
            this.loading = false;
            this.showNoGamesWarning = false;
            this.showErrorMessage = false;
            this.errorMessage = '';
            this.changeState(State.Loading);
        }
        ActiveGamesController.prototype.changeState = function (newState) {
            this.loading = newState === State.Loading;
            this.showErrorMessage = newState === State.Error;
            this.showNoGamesWarning = newState === State.NoGames;
            switch (newState) {
                case State.Loading:
                    this.getGames();
                    break;
            }
        };
        ActiveGamesController.prototype.errorHandler = function (data, errorMessage) {
            this.errorMessage = errorMessage;
            console.error(data);
            this.changeState(State.Error);
        };
        ActiveGamesController.prototype.getGames = function () {
            var _this = this;
            this.apiService.getAllActiveGames().then(function (data) {
                if (!data || data.length === 0) {
                    _this.games = [];
                    _this.changeState(State.NoGames);
                    return;
                }
                _this.games = data;
                _this.changeState(State.Loaded);
            }, function (data) {
                _this.errorHandler(data, 'Error fetching games!');
            });
        };
        ActiveGamesController.prototype.reload = function () {
            this.changeState(State.Loading);
        };
        ActiveGamesController.$inject = ['apiService'];
        return ActiveGamesController;
    }());
    ActiveGame.ActiveGamesController = ActiveGamesController;
})(ActiveGame || (ActiveGame = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'GameCardModule']);

DorkModule.controller('ActiveGamesController', ActiveGame.ActiveGamesController);
DorkModule.directive('activeGames', ActiveGame.ActiveGamesDirective);
//# sourceMappingURL=maps/activeGames.js.map