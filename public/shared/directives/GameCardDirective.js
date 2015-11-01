var Shared;
(function (Shared) {
    function GameCardDirective() {
        return {
            scope: {
                game: "=",
                gamePath: "=",
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
        function GameCardController($scope, $http, $window) {
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
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
                    this.selectedGame = null;
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
            if (!this.selectedGame) {
                this.errorHandler(null, 'No game selected!');
                return;
            }
            this.$http.delete(this.gamePath + '/' + this.selectedGame._id)
                .success(function (data, status, headers, config) {
                this.changeState(State.Deleted);
            })
                .error(function (data, status, headers, config) {
                this.errorHandler(data, 'Error deleting game!');
            });
        };
        // Dont call directly. Change state to "Copy" instead.
        GameCardController.prototype.copy = function () {
            if (!this.selectedGame) {
                this.errorHandler(null, 'No game selected!');
                return;
            }
            var removedScores = angular.copy(this.selectedGame.players);
            removedScores.forEach(function (element) {
                element.points = 0;
                element.rank = 0;
            });
            this.$http.post('/activeGames/save', { players: removedScores })
                .success(function (data, status, headers, config) {
                this.$window.location.href = '/activeGames/edit/#/' + data._id;
            })
                .error(function (data, status, headers, config) {
                this.errorHandler(data, 'Error copying game!');
            });
        };
        GameCardController.prototype.warnDelete = function () {
            this.changeState(State.DeleteWarning);
        };
        GameCardController.prototype.dismissOverlay = function () {
            this.changeState(State.Ready);
        };
        GameCardController.prototype.deleteGame = function (game) {
            this.selectedGame = game;
            this.changeState(State.Deleting);
        };
        GameCardController.prototype.copyGame = function (game) {
            this.selectedGame = game;
            this.changeState(State.Copy);
        };
        GameCardController.$inject = ['$scope', '$http', '$window'];
        return GameCardController;
    })();
    Shared.GameCardController = GameCardController;
})(Shared || (Shared = {}));
//# sourceMappingURL=GameCardDirective.js.map