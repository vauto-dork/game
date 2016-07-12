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
        function EditActiveGameController($window, editActiveGameService, alertsService) {
            this.$window = $window;
            this.editActiveGameService = editActiveGameService;
            this.alertsService = alertsService;
            this.showLoading = false;
            this.showError = false;
            this.showScoreForm = false;
            this.disabled = false;
            this.changeState(State.Init);
        }
        Object.defineProperty(EditActiveGameController.prototype, "alerts", {
            get: function () {
                return this.alertsService.alerts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditActiveGameController.prototype, "showModifyPlaylist", {
            get: function () {
                return this.editActiveGameService.showModifyPlaylist;
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
            this.disabled = (newState === State.Saving) ||
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
                    this.alertsService.scrollToTop();
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
            if (this.showModifyPlaylist) {
                this.toggleModifyPlaylist();
            }
            this.alertsService.scrollToTop();
        };
        EditActiveGameController.prototype.errorHandler = function (data, errorMessage) {
            this.alertsService.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
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
            this.alertsService.clearAlerts();
            this.editActiveGameService.datePlayed = this.datePlayed;
            this.editActiveGameService.save().then(function () {
                _this.alertsService.addAlert('success', 'Game saved successfully!');
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
            this.alertsService.clearAlerts();
            this.editActiveGameService.errorMessages.forEach(function (msg) { _this.alertsService.addAlert('danger', msg); });
            this.changeState(State.Ready);
        };
        // UI Hookups
        EditActiveGameController.prototype.closeAlert = function (index) {
            this.alertsService.closeAlert(index);
        };
        EditActiveGameController.prototype.save = function () {
            this.changeState(State.Saving);
        };
        EditActiveGameController.prototype.finalize = function () {
            this.changeState(State.Finalizing);
        };
        EditActiveGameController.prototype.revert = function () {
            this.changeState(State.Loading);
        };
        EditActiveGameController.prototype.toggleModifyPlaylist = function () {
            this.editActiveGameService.toggleModifyPlaylist();
        };
        EditActiveGameController.$inject = ['$window', 'editActiveGameService', 'alertsService'];
        return EditActiveGameController;
    }());
    EditActiveGame.EditActiveGameController = EditActiveGameController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditActiveGameDirective.js.map