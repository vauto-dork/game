var Players;
(function (Players) {
    function PlayerFormDirective() {
        return {
            scope: {
                player: "=",
                disableForm: "="
            },
            templateUrl: "/areas/players/directives/PlayerFormTemplate.html",
            controller: "PlayerFormController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Players.PlayerFormDirective = PlayerFormDirective;
    var PlayerFormController = (function () {
        function PlayerFormController() {
            this.disableForm = false;
        }
        PlayerFormController.$inject = [];
        return PlayerFormController;
    }());
    Players.PlayerFormController = PlayerFormController;
})(Players || (Players = {}));

var Players;
(function (Players) {
    function AddPlayerDirective() {
        return {
            scope: {},
            templateUrl: '/areas/players/directives/AddPlayerTemplate.html',
            controller: 'AddPlayerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Players.AddPlayerDirective = AddPlayerDirective;
    var State;
    (function (State) {
        State[State["Ready"] = 0] = "Ready";
        State[State["Saving"] = 1] = "Saving";
        State[State["Saved"] = 2] = "Saved";
        State[State["Fail"] = 3] = "Fail";
    })(State || (State = {}));
    ;
    var AddPlayerController = (function () {
        function AddPlayerController($timeout, apiService) {
            this.$timeout = $timeout;
            this.apiService = apiService;
            this.success = false;
            this.failure = false;
            this.disableControls = false;
            this.player = new Shared.Player();
            this.changeState(State.Ready);
        }
        AddPlayerController.prototype.changeState = function (newState) {
            var _this = this;
            this.success = newState === State.Saved;
            this.failure = newState === State.Fail;
            this.disableControls = newState === State.Saving;
            switch (newState) {
                case State.Ready:
                    this.resetForm();
                    break;
                case State.Saving:
                    this.savePlayer();
                    break;
                case State.Saved:
                    this.resetForm();
                    this.$timeout(function () {
                        _this.changeState(State.Ready);
                    }, 5000);
                    break;
            }
        };
        AddPlayerController.prototype.savePlayer = function () {
            var _this = this;
            this.apiService.saveNewPlayer(this.player).then(function () {
                _this.changeState(State.Saved);
            }, function (data) {
                _this.changeState(State.Fail);
            });
        };
        AddPlayerController.prototype.resetForm = function () {
            this.player = new Shared.Player();
            if (this.addPlayerForm) {
                this.addPlayerForm.$setPristine();
                this.addPlayerForm.$setUntouched();
            }
        };
        AddPlayerController.prototype.reset = function () {
            this.changeState(State.Ready);
        };
        AddPlayerController.prototype.submit = function () {
            this.addPlayerForm.$setSubmitted();
            if (!this.addPlayerForm.$invalid) {
                this.changeState(State.Saving);
            }
        };
        AddPlayerController.$inject = ['$timeout', 'apiService'];
        return AddPlayerController;
    }());
    Players.AddPlayerController = AddPlayerController;
})(Players || (Players = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.controller('AddPlayerController', Players.AddPlayerController);
DorkModule.directive('addPlayer', Players.AddPlayerDirective);

DorkModule.controller('PlayerFormController', Players.PlayerFormController);
DorkModule.directive('playerForm', Players.PlayerFormDirective);

//# sourceMappingURL=maps/addPlayer.js.map