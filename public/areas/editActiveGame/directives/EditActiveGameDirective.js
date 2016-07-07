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
        function EditActiveGameController($scope, $timeout, $window, editActiveGameService) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$window = $window;
            this.editActiveGameService = editActiveGameService;
            this.showLoading = false;
            this.showError = false;
            this.showScoreForm = false;
            this.disableControls = false;
            this.showAddPlayer = false;
            this.showReorderPlayers = false;
            this.changeState(State.Init);
        }
        Object.defineProperty(EditActiveGameController.prototype, "numPlayers", {
            get: function () {
                return this.editActiveGameService.players.length;
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
            this.disableControls = (newState === State.Saving) ||
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
                    this.scrollToTop();
                    break;
                case State.Ready:
                    this.scrollToTop();
                    break;
                case State.Saving:
                    this.saveGame();
                    break;
                case State.Finalizing:
                    this.finalizeGame();
                    break;
            }
        };
        EditActiveGameController.prototype.errorHandler = function (data, errorMessage) {
            //$scope.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        ;
        EditActiveGameController.prototype.returnToActiveGames = function () {
            this.$window.location.href = '/ActiveGames';
        };
        EditActiveGameController.prototype.scrollToTop = function () {
            var _this = this;
            this.$timeout(function () {
                _this.$window.scrollTo(0, 0);
            });
        };
        EditActiveGameController.prototype.scrollToBottom = function () {
            var _this = this;
            this.$timeout(function () {
                _this.$window.scrollTo(0, 100000);
            });
        };
        EditActiveGameController.prototype.getActiveGame = function () {
            var _this = this;
            this.editActiveGameService.getActiveGame().then(function () {
                _this.changeState(State.Ready);
                _this.datePlayed = _this.editActiveGameService.datePlayed;
            }, function () {
                _this.errorHandler('Cannot get active game.', 'Cannot load game');
            });
            // var promise = editActiveGameFactory.GetActiveGame();
            // promise.then(function() {
            //     me.game = editActiveGameFactory.Game();
            //     me.allPlayers = editActiveGameFactory.AllPlayers();
            //     me.resetSelectedToMove();
            //     me.datePlayedJs = Date.parse(me.game.datePlayed);
            //     me.changeState(me.State.Ready);
            // }, function(data) {
            //     me.errorHandler(data, 'Cannot load game.');
            // });
        };
        EditActiveGameController.prototype.saveGame = function () {
            var _this = this;
            //$scope.clearAlerts();
            this.editActiveGameService.datePlayed = this.datePlayed;
            this.editActiveGameService.save().then(function () {
                //$scope.addAlert('success', 'Game saved successfully!');
                _this.changeState(State.Ready);
            }, function () {
                // get error messages and display alerts
                _this.changeState(State.Ready);
            });
        };
        EditActiveGameController.prototype.finalizeGame = function () {
            var _this = this;
            this.editActiveGameService.finalize().then(function () {
                _this.$window.location.href = '/GameHistory';
            }, function () {
                // get error messages and display alerts
                _this.changeState(State.Ready);
            });
        };
        // UI Hookups
        EditActiveGameController.prototype.save = function () {
            this.changeState(State.Saving);
        };
        EditActiveGameController.prototype.finalize = function () {
            this.changeState(State.Finalizing);
        };
        EditActiveGameController.prototype.revert = function () {
            this.changeState(State.Loading);
        };
        EditActiveGameController.prototype.disableSave = function () {
            return this.showReorderPlayers || this.showAddPlayer;
        };
        EditActiveGameController.prototype.toggleReorderPlayers = function () {
            this.showReorderPlayers = !this.showReorderPlayers;
        };
        EditActiveGameController.prototype.toggleAddPlayer = function () {
            this.showAddPlayer = !this.showAddPlayer;
            if (this.showAddPlayer) {
                this.$scope.$broadcast('playerSelectorFocus');
            }
        };
        EditActiveGameController.$inject = ['$scope', '$timeout', '$window', 'editActiveGameService'];
        return EditActiveGameController;
    }());
    EditActiveGame.EditActiveGameController = EditActiveGameController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditActiveGameDirective.js.map