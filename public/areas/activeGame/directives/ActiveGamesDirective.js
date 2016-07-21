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
//# sourceMappingURL=ActiveGamesDirective.js.map