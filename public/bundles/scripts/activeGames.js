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

var ActiveGame;
(function (ActiveGame) {
    function ActiveGames() {
        return {
            templateUrl: '/areas/activeGame/directives/ActiveGamesTemplate.html',
            controller: ActiveGamesController
        };
    }
    ActiveGame.ActiveGames = ActiveGames;
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

var ActiveGame;
(function (ActiveGame) {
    var ActiveGameModule = angular.module('ActiveGameModule', ['UxControlsModule', 'GameCardModule']);
    ActiveGameModule.component('activeGames', ActiveGame.ActiveGames());
})(ActiveGame || (ActiveGame = {}));

//# sourceMappingURL=maps/activeGames.js.map