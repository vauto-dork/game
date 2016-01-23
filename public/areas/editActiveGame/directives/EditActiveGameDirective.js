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
        Object.defineProperty(EditActiveGameController.prototype, "datePlayed", {
            //private datePlayedJs: Date = new Date();
            get: function () {
                return this.editActiveGameService.datePlayed;
            },
            set: function (value) {
                this.editActiveGameService.datePlayed = value;
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
        // private getFormattedDate(){
        //     return this.datePlayedJs.toISOString();
        // }
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
            //$scope.clearAlerts();
            var _this = this;
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
        EditActiveGameController.$inject = ['$scope', '$timeout', '$window', 'editActiveGameService'];
        return EditActiveGameController;
    })();
    EditActiveGame.EditActiveGameController = EditActiveGameController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditActiveGameDirective.js.map