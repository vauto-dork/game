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
            this.selected = [];
            this.sort = NewGameSort.Selected;
            this.getPlayers();
        }
        Object.defineProperty(CreateGameService.prototype, "playerSort", {
            get: function () {
                return this.sort;
            },
            set: function (value) {
                this.sort = value;
            },
            enumerable: true,
            configurable: true
        });
        CreateGameService.prototype.getPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.apiService.getPlayersForNewGame().then(function (data) {
                _this.firstGameOfMonth = data.firstGameOfMonth;
                _this.players = data.players;
                _this.reset();
                def.resolve();
            }, function () {
                _this.firstGameOfMonth = true;
                _this.players = [];
                _this.reset();
                def.resolve();
            });
            this.playerLoadPromise = def.promise;
        };
        CreateGameService.prototype.isPlayerSelected = function (player) {
            return this.selected.indexOf(player._id) > -1;
        };
        CreateGameService.prototype.init = function () {
            return this.playerLoadPromise;
        };
        CreateGameService.prototype.isFirstGameOfMonth = function () {
            return this.firstGameOfMonth;
        };
        CreateGameService.prototype.getAllPlayers = function () {
            return this.players;
        };
        CreateGameService.prototype.getSelectedPlayers = function () {
            var _this = this;
            var selection = [];
            this.selected.forEach(function (playerId) {
                var found = _this.players.filter(function (player) {
                    return player.playerId === playerId;
                });
                if (found.length === 1) {
                    selection.push(found[0]);
                }
            });
            if (this.sort === NewGameSort.Rating) {
                selection.sort(function (a, b) {
                    return b.rating - a.rating;
                });
            }
            return selection;
        };
        CreateGameService.prototype.getUnselectedPlayers = function () {
            var _this = this;
            // This function just returns the list alphabetically.
            return this.players.filter(function (player) {
                return !_this.isPlayerSelected(player.player);
            });
        };
        CreateGameService.prototype.selectPlayer = function (player) {
            if (!this.isPlayerSelected(player.player)) {
                this.selected.push(player.playerId);
            }
        };
        CreateGameService.prototype.deselectPlayer = function (player) {
            var index = this.selected.indexOf(player.playerId);
            if (index > -1) {
                this.selected.splice(index, 1);
            }
        };
        CreateGameService.prototype.reset = function () {
            this.selected = [];
            this.playerSort = NewGameSort.Selected;
        };
        CreateGameService.prototype.numberSelectedPlayers = function () {
            if (!this.selected) {
                return 0;
            }
            return this.selected.length;
        };
        CreateGameService.prototype.createNewActiveGame = function () {
            var game = new Shared.Game();
            game.players = this.getSelectedPlayers().map(function (player) {
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