var CreateGame;
(function (CreateGame) {
    (function (NewGameSort) {
        NewGameSort[NewGameSort["Selected"] = 0] = "Selected";
        NewGameSort[NewGameSort["Rating"] = 1] = "Rating";
    })(CreateGame.NewGameSort || (CreateGame.NewGameSort = {}));
    var NewGameSort = CreateGame.NewGameSort;
    var CreateGameService = (function () {
        function CreateGameService($q, apiService, playerSelectionService) {
            var _this = this;
            this.$q = $q;
            this.apiService = apiService;
            this.playerSelectionService = playerSelectionService;
            this.firstGameOfMonth = false;
            this.gameOrderSortedPlayers = [];
            this.sort = NewGameSort.Selected;
            this.playerLoadPromise = this.playerSelectionService.getPlayers().then(function (data) {
                _this.initializeData(data.firstGameOfMonth);
                _this.$q.resolve();
            }, function () {
                _this.initializeData(true);
                _this.$q.resolve();
            });
        }
        Object.defineProperty(CreateGameService.prototype, "players", {
            get: function () {
                return this.playerSelectionService.selectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameService.prototype, "sortOrder", {
            get: function () {
                return this.sort;
            },
            set: function (value) {
                this.sort = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameService.prototype, "playersSorted", {
            get: function () {
                if (this.sort === NewGameSort.Selected) {
                    return this.players;
                }
                else {
                    return this.gameOrderSortedPlayers;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameService.prototype, "unselectedPlayers", {
            get: function () {
                return this.playerSelectionService.unselectedPlayers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameService.prototype, "hasMinimumPlayers", {
            get: function () {
                return this.players.length >= 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreateGameService.prototype, "numPlayers", {
            get: function () {
                return this.players.length;
            },
            enumerable: true,
            configurable: true
        });
        CreateGameService.prototype.initializeData = function (firstGameOfMonth) {
            this.firstGameOfMonth = firstGameOfMonth;
            this.reset();
        };
        CreateGameService.prototype.sortPlayersByGameOrder = function () {
            // Sorts in an alternating outside-in order by rating.
            // For example if the players have the following rating:
            //     1 2 3 4 5 6
            // They would be sorted like so:
            //     6 4 2 1 3 5
            var _this = this;
            var temp = angular.copy(this.players);
            temp.sort(function (a, b) {
                if (a.rating !== b.rating) {
                    return b.rating - a.rating;
                }
                else if (a.orderNumber !== b.orderNumber) {
                    return a.orderNumber - b.orderNumber;
                }
                else {
                    if (a.player.fullname < b.player.fullname) {
                        return -1;
                    }
                    else if (a.player.fullname > b.player.fullname) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            });
            var first = true;
            var firstHalf = [];
            var secondHalf = [];
            while (temp.length > 0) {
                if (first) {
                    firstHalf.push(temp[0]);
                }
                else {
                    secondHalf.push(temp[0]);
                }
                temp.splice(0, 1);
                first = !first;
            }
            this.gameOrderSortedPlayers = [];
            firstHalf.forEach(function (p) {
                _this.gameOrderSortedPlayers.push(p);
            });
            secondHalf.reverse().forEach(function (p) {
                _this.gameOrderSortedPlayers.push(p);
            });
        };
        CreateGameService.prototype.init = function () {
            return this.playerLoadPromise;
        };
        CreateGameService.prototype.reset = function () {
            this.playerSelectionService.reset();
            this.sortPlayersByGameOrder();
            this.sortOrder = NewGameSort.Selected;
        };
        CreateGameService.prototype.addPlayer = function (player) {
            this.playerSelectionService.addPlayer(player.player);
            this.sortPlayersByGameOrder();
        };
        CreateGameService.prototype.removePlayer = function (player) {
            this.playerSelectionService.removePlayer(player.player);
            this.sortPlayersByGameOrder();
        };
        CreateGameService.prototype.createNewActiveGame = function (datePlayed) {
            var game = new Shared.Game();
            game.datePlayed = datePlayed.toISOString();
            game.players = this.playersSorted.map(function (player) {
                var gamePlayer = new Shared.GamePlayer();
                gamePlayer.player = player.player;
                return gamePlayer;
            });
            return this.apiService.createActiveGame(game);
        };
        CreateGameService.prototype.debugShowSortedPlayersTable = function () {
            this.playerSelectionService.debugPrintPlayersTable(this.playersSorted);
        };
        CreateGameService.$inject = ['$q', 'apiService', 'playerSelectionService'];
        return CreateGameService;
    })();
    CreateGame.CreateGameService = CreateGameService;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=CreateGameService.js.map