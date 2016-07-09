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
            this.alerts = [];
            this.changeState(State.Init);
        }
        Object.defineProperty(EditActiveGameController.prototype, "showModifyPlayers", {
            get: function () {
                return this.editActiveGameService.showModifyPlayers;
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
        EditActiveGameController.prototype.ready = function () {
            if (this.showModifyPlayers) {
                this.editActiveGameService.toggleModifyPlayers();
            }
            this.scrollToTop();
        };
        EditActiveGameController.prototype.errorHandler = function (data, errorMessage) {
            this.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        EditActiveGameController.prototype.closeAlert = function (index) {
            this.alerts.splice(index, 1);
        };
        EditActiveGameController.prototype.addAlert = function (messageType, message) {
            this.alerts.push({ type: messageType, msg: message });
        };
        EditActiveGameController.prototype.clearAlerts = function () {
            this.alerts = [];
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
        };
        EditActiveGameController.prototype.saveGame = function () {
            var _this = this;
            this.clearAlerts();
            this.editActiveGameService.datePlayed = this.datePlayed;
            this.editActiveGameService.save().then(function () {
                _this.addAlert('success', 'Game saved successfully!');
                _this.changeState(State.Ready);
            }, function () {
                _this.saveReject();
            });
        };
        EditActiveGameController.prototype.finalizeGame = function () {
            var _this = this;
            this.editActiveGameService.finalize(true).then(function () {
                _this.$window.location.href = '/GameHistory';
            }, function () {
                _this.saveReject();
            });
        };
        EditActiveGameController.prototype.saveReject = function () {
            var _this = this;
            // get error messages and display alerts
            this.clearAlerts();
            this.editActiveGameService.errorMessages.forEach(function (msg) { _this.addAlert('danger', msg); });
            this.changeState(State.Ready);
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
        EditActiveGameController.prototype.toggleModifyPlayers = function () {
            this.editActiveGameService.toggleModifyPlayers();
        };
        EditActiveGameController.$inject = ['$scope', '$timeout', '$window', 'editActiveGameService'];
        return EditActiveGameController;
    })();
    EditActiveGame.EditActiveGameController = EditActiveGameController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditActiveGameDirective.js.map