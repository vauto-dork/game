var CreateGame;
(function (CreateGame) {
    function CreateGameDirective() {
        return {
            scope: {},
            templateUrl: '/areas/createGame/directives/CreateGameTemplate.html',
            controller: 'CreateGameController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    CreateGame.CreateGameDirective = CreateGameDirective;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["Error"] = 1] = "Error";
        State[State["Loaded"] = 2] = "Loaded";
        State[State["CreatingGame"] = 3] = "CreatingGame";
    })(State || (State = {}));
    var CreateGameController = (function () {
        function CreateGameController($window, createGameService) {
            var _this = this;
            this.$window = $window;
            this.createGameService = createGameService;
            this.showLoading = false;
            this.showErrorMessage = false;
            this.showForm = false;
            this.orderedPlayersLoaded = false;
            this.disableOrderedPlayers = false;
            this.datePlayed = null;
            this.createGameService.init().then(function () {
                _this.changeState(State.Loaded);
            });
        }
        Object.defineProperty(CreateGameController.prototype, "sortOrder", {
            get: function () {
                return CreateGame.NewGameSort[this.createGameService.sortOrder];
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameController.prototype, "unselectedPlayers", {
            get: function () {
                return this.createGameService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        CreateGameController.prototype.changeState = function (newState) {
            this.showLoading = (newState === State.Loading) || (newState === State.CreatingGame);
            this.showForm = (newState === State.Loaded);
            this.showErrorMessage = newState === State.Error;
            switch (newState) {
                case State.CreatingGame:
                    this.createNewActiveGame();
                    break;
            }
        };
        CreateGameController.prototype.addPlayer = function (data) {
            this.createGameService.addPlayer(data);
        };
        CreateGameController.prototype.createGame = function () {
            this.changeState(State.CreatingGame);
        };
        CreateGameController.prototype.createNewActiveGame = function () {
            var _this = this;
            this.createGameService.createNewActiveGame(this.datePlayed).then(function (editUrl) {
                _this.$window.location.href = editUrl;
            }, function () {
                _this.changeState(State.Error);
            });
        };
        CreateGameController.prototype.useThisOrder = function () {
            this.createGameService.sortOrder = CreateGame.NewGameSort.Selected;
        };
        CreateGameController.prototype.useGameOrder = function () {
            this.createGameService.sortOrder = CreateGame.NewGameSort.Rating;
        };
        CreateGameController.$inject = ['$window', 'createGameService'];
        return CreateGameController;
    }());
    CreateGame.CreateGameController = CreateGameController;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=CreateGameDirective.js.map