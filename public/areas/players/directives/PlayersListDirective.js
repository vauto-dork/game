var Players;
(function (Players) {
    function PlayersListDirective() {
        return {
            scope: {},
            templateUrl: '/areas/players/directives/PlayersListTemplate.html',
            controller: 'PlayersListController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Players.PlayersListDirective = PlayersListDirective;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["Ready"] = 1] = "Ready";
        State[State["Error"] = 2] = "Error";
        State[State["EditPlayer"] = 3] = "EditPlayer";
        State[State["SavingPlayer"] = 4] = "SavingPlayer";
        State[State["Saved"] = 5] = "Saved";
    })(State || (State = {}));
    var PlayersListController = (function () {
        function PlayersListController(apiService, alertsService) {
            this.apiService = apiService;
            this.alertsService = alertsService;
            this.disableControls = false;
            this.showError = false;
            this.showLoading = false;
            this.showPlayers = false;
            this.showPlayerEdit = false;
            this.players = [];
            this.filter = '';
            this.changeState(State.Loading);
        }
        Object.defineProperty(PlayersListController.prototype, "alerts", {
            get: function () {
                return this.alertsService.alerts;
            },
            enumerable: true,
            configurable: true
        });
        PlayersListController.prototype.changeState = function (newState) {
            this.showLoading = newState === State.Loading;
            this.showPlayers = newState === State.Ready;
            this.showPlayerEdit = newState === State.EditPlayer || newState === State.SavingPlayer;
            this.disableControls = newState === State.SavingPlayer;
            this.showError = newState === State.Error;
            switch (newState) {
                case State.Loading:
                    this.loadPlayers();
                    break;
                case State.EditPlayer:
                    this.alertsService.clearAlerts();
                    break;
                case State.SavingPlayer:
                    this.savePlayer();
                    break;
                case State.Saved:
                    this.alertsService.addAlert('success', 'Player saved successfully!');
                    this.changeState(State.Loading);
                    break;
            }
        };
        PlayersListController.prototype.errorHandler = function (data, errorMessage) {
            this.alertsService.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        PlayersListController.prototype.loadPlayers = function () {
            var _this = this;
            this.apiService.getAllPlayers().then(function (data) {
                _this.players = data;
                _this.changeState(State.Ready);
            }, function (data) {
                _this.errorHandler(data, 'Error fetching players!');
            });
        };
        PlayersListController.prototype.savePlayer = function () {
            var _this = this;
            this.apiService.saveExistingPlayer(this.selectedPlayer).then(function () {
                _this.changeState(State.Saved);
            }, function (data) {
                _this.errorHandler(data, 'Player save failure!');
            });
        };
        PlayersListController.prototype.removeFilter = function () {
            this.filter = '';
        };
        PlayersListController.prototype.editPlayer = function (player) {
            this.selectedPlayer = player;
            this.changeState(State.EditPlayer);
        };
        PlayersListController.prototype.cancelEdit = function () {
            this.selectedPlayer = undefined;
            this.changeState(State.Ready);
        };
        PlayersListController.prototype.save = function () {
            this.changeState(State.SavingPlayer);
        };
        PlayersListController.prototype.reload = function () {
            this.alertsService.clearAlerts();
            this.changeState(State.Loading);
        };
        PlayersListController.prototype.closeAlert = function (index) {
            this.alertsService.closeAlert(index);
        };
        PlayersListController.$inject = ['apiService', 'alertsService'];
        return PlayersListController;
    }());
    Players.PlayersListController = PlayersListController;
})(Players || (Players = {}));
//# sourceMappingURL=PlayersListDirective.js.map