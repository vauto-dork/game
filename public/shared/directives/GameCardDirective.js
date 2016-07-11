var Shared;
(function (Shared) {
    function GameCardDirective() {
        return {
            scope: {
                game: "=",
                showModifyButtons: "=",
                reload: "&"
            },
            templateUrl: '/shared/directives/GameCardTemplate.html',
            controller: 'GameCardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.GameCardDirective = GameCardDirective;
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
        function GameCardController($scope, $http, $window, apiService) {
            this.$scope = $scope;
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
        // Dont call directly. Change state to "Deleting" instead.
        GameCardController.prototype.delete = function () {
            var _this = this;
            this.apiService.deleteActiveGame(this.game.getIdAsPath()).then(function () {
                _this.changeState(State.Deleted);
            }, function (data) {
                _this.errorHandler(data, 'Error deleting game!');
            });
        };
        // Dont call directly. Change state to "Copy" instead.
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
        GameCardController.$inject = ['$scope', '$http', '$window', 'apiService'];
        return GameCardController;
    }());
    Shared.GameCardController = GameCardController;
})(Shared || (Shared = {}));
//# sourceMappingURL=GameCardDirective.js.map