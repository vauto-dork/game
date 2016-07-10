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
        function CreateGameController($scope, $window, createGameService) {
            var _this = this;
            this.$scope = $scope;
            this.$window = $window;
            this.createGameService = createGameService;
            this.showLoading = false;
            this.showErrorMessage = false;
            this.showPlayers = false;
            this.selectedPlayers = [];
            this.unselectedPlayers = [];
            this.orderedPlayersLoaded = false;
            this.disableOrderedPlayers = false;
            this.datePlayed = null;
            this.createGameService.init().then(function () {
                _this.updatePlayers();
                _this.changeState(State.Loaded);
            });
            $scope.$watch(function () { return _this.createGameService.numberSelectedPlayers(); }, function () {
                _this.updatePlayers();
            });
        }
        Object.defineProperty(CreateGameController.prototype, "firstGameOfMonth", {
            get: function () {
                return this.createGameService.isFirstGameOfMonth();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameController.prototype, "orderModel", {
            get: function () {
                if (this.createGameService.playerSort === CreateGame.NewGameSort.Rating) {
                    return 'Rating';
                }
                else {
                    return 'Selected';
                }
            },
            set: function (value) {
                // do nothing
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameController.prototype, "hasDate", {
            get: function () {
                return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
            },
            enumerable: true,
            configurable: true
        });
        CreateGameController.prototype.changeState = function (newState) {
            this.showLoading = (newState === State.Loading) || (newState === State.CreatingGame);
            this.showPlayers = (newState === State.Loaded);
            this.showErrorMessage = newState === State.Error;
            switch (newState) {
                case State.CreatingGame:
                    this.createNewActiveGame();
                    break;
            }
        };
        CreateGameController.prototype.getPlayersInGameOrder = function () {
            this.createGameService.playerSort = CreateGame.NewGameSort.Rating;
        };
        CreateGameController.prototype.onSelected = function (data) {
            this.createGameService.selectPlayer(data);
        };
        Object.defineProperty(CreateGameController.prototype, "hasSelectedPlayers", {
            get: function () {
                return this.createGameService.numberSelectedPlayers() > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameController.prototype, "disableGameCreation", {
            get: function () {
                return !this.hasDate || this.createGameService.numberSelectedPlayers() < 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameController.prototype, "sortByRating", {
            get: function () {
                return this.createGameService.playerSort === CreateGame.NewGameSort.Rating;
            },
            enumerable: true,
            configurable: true
        });
        // Cannot use setter/getter with the player selector
        CreateGameController.prototype.updatePlayers = function () {
            this.selectedPlayers = this.createGameService.getSelectedPlayers();
            this.unselectedPlayers = this.createGameService.getUnselectedPlayers();
        };
        CreateGameController.prototype.removeAll = function () {
            this.createGameService.reset();
        };
        CreateGameController.prototype.startGame = function () {
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
        CreateGameController.prototype.useCurrentDateTime = function () {
            this.datePlayed = new Date();
        };
        CreateGameController.prototype.useThisOrder = function () {
            this.createGameService.playerSort = CreateGame.NewGameSort.Selected;
        };
        CreateGameController.prototype.useGameOrder = function () {
            this.createGameService.playerSort = CreateGame.NewGameSort.Rating;
        };
        CreateGameController.$inject = ['$scope', '$window', 'createGameService'];
        return CreateGameController;
    })();
    CreateGame.CreateGameController = CreateGameController;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=CreateGameDirective.js.map