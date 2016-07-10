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
        Object.defineProperty(CreateGameService.prototype, "curatedNewPlayers", {
            get: function () {
                return this.curatedPlayersList;
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
            var currentPlayerIds = this.players.map(function (p) { return p.playerId; });
            this.curatedPlayersList = this.allPlayers.filter(function (player) {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
            this.gameOrderSortedPlayers = angular.copy(this.players);
            this.gameOrderSortedPlayers.sort(function (a, b) {
                return b.rating - a.rating;
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
        CreateGameService.$inject = ['$q', 'apiService'];
        return CreateGameService;
    })();
    CreateGame.CreateGameService = CreateGameService;
})(CreateGame || (CreateGame = {}));
//# sourceMappingURL=CreateGameService.js.map