var CreateGame;
(function (CreateGame) {
    (function (NewGameSort) {
        NewGameSort[NewGameSort["Selected"] = 0] = "Selected";
        NewGameSort[NewGameSort["Rating"] = 1] = "Rating";
    })(CreateGame.NewGameSort || (CreateGame.NewGameSort = {}));
    var NewGameSort = CreateGame.NewGameSort;
    var CreateGameService = (function () {
        function CreateGameService($q, apiService) {
            this.$q = $q;
            this.apiService = apiService;
            this.firstGameOfMonth = false;
            this.players = [];
            this.gameOrderSortedPlayers = [];
            this.sort = NewGameSort.Selected;
            this.getPlayers();
        }
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
                return this.unselectedPlayersList;
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
        CreateGameService.prototype.getPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.apiService.getPlayersForNewGame().then(function (data) {
                _this.initializeData(data.firstGameOfMonth, data.players);
                def.resolve();
            }, function () {
                // We still resolve because we just initialize default data
                _this.initializeData(true, []);
                def.resolve();
            });
            this.playerLoadPromise = def.promise;
        };
        CreateGameService.prototype.initializeData = function (firstGameOfMonth, players) {
            this.firstGameOfMonth = firstGameOfMonth;
            this.allPlayers = players;
            this.reset();
            this.curateNewPlayerList();
        };
        CreateGameService.prototype.curateNewPlayerList = function () {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.players.map(function (p) { return p.playerId; });
            // Get players that are not in the current playlist.
            this.unselectedPlayersList = this.allPlayers.filter(function (player) {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
            this.sortPlayersByGameOrder();
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
        CreateGameService.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        CreateGameService.prototype.addPlayer = function (player) {
            this.players.push(player);
            this.curateNewPlayerList();
        };
        CreateGameService.prototype.removePlayer = function (player) {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        };
        CreateGameService.prototype.reset = function () {
            this.players = [];
            this.curateNewPlayerList();
            this.sortOrder = NewGameSort.Selected;
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
        // Debug functions
        CreateGameService.prototype.debugShowAllPlayersTable = function () {
            this.debugPrintPlayersTable(this.allPlayers);
        };
        CreateGameService.prototype.debugShowCuratedPlayersTable = function () {
            this.debugPrintPlayersTable(this.unselectedPlayers);
        };
        CreateGameService.prototype.debugShowSortedPlayersTable = function () {
            this.debugPrintPlayersTable(this.playersSorted);
        };
        CreateGameService.prototype.debugPrintPlayersTable = function (players) {
            // Change "info" to "table" to show as table in browser debugger
            console.info(players.map(function (p) {
                return {
                    orderNumber: p.orderNumber,
                    rating: p.rating,
                    name: p.player.fullname
                };
            }));
        };
        CreateGameService.$inject = ['$q', 'apiService'];
        return CreateGameService;
    }());
    CreateGame.CreateGameService = CreateGameService;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=CreateGameService.js.map