var Rankings;
(function (Rankings) {
    var PlayerSelection;
    (function (PlayerSelection) {
        PlayerSelection[PlayerSelection["All"] = 0] = "All";
        PlayerSelection[PlayerSelection["OverTen"] = 1] = "OverTen";
        PlayerSelection[PlayerSelection["UnderTen"] = 2] = "UnderTen";
    })(PlayerSelection || (PlayerSelection = {}));
    ;
    var RankingsService = (function () {
        function RankingsService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.cachedPlayers = [];
        }
        RankingsService.prototype.GetRankings = function (month, year, hideUnranked) {
            var _this = this;
            var def = this.$q.defer();
            month = !month ? new Date().getMonth() : month;
            year = !year ? new Date().getFullYear() : year;
            var unrankedParam = hideUnranked ? '&hideUnranked=true' : '';
            var rankedUrl = '/players/ranked?month=' + month + '&year=' + year + unrankedParam;
            this.$http.get(rankedUrl)
                .success(function (data, status, headers, config) {
                _this.cachedPlayers = data.map(function (value) {
                    return new Shared.RankedPlayer(value);
                });
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                def.reject(data);
            });
            return def.promise;
        };
        RankingsService.prototype.GetAllPlayers = function () {
            return this.getPlayers(PlayerSelection.All);
        };
        RankingsService.prototype.GetPlayersOverTenGames = function () {
            return this.getPlayers(PlayerSelection.OverTen);
        };
        RankingsService.prototype.GetPlayersUnderTenGames = function () {
            return this.getPlayers(PlayerSelection.UnderTen);
        };
        RankingsService.prototype.getPlayers = function (playerSelection) {
            switch (playerSelection) {
                case PlayerSelection.UnderTen:
                    var underTen = this.cachedPlayers.filter(function (player) {
                        return player.gamesPlayed < 10;
                    });
                    return this.rankPlayers(underTen);
                case PlayerSelection.OverTen:
                    var overTen = this.cachedPlayers.filter(function (player) {
                        return player.gamesPlayed >= 10;
                    });
                    return this.rankPlayers(overTen);
                default:
                    return this.rankPlayers(this.cachedPlayers);
            }
        };
        ;
        RankingsService.prototype.rankPlayers = function (selectedPlayers) {
            var counter = 0;
            selectedPlayers.forEach(function (player, index) {
                if (!player.gamesPlayed) {
                    player.rank = 0;
                }
                else if (index > 0 && player.rating === selectedPlayers[index - 1].rating) {
                    player.rank = counter;
                }
                else {
                    player.rank = ++counter;
                }
            });
            return selectedPlayers;
        };
        RankingsService.$inject = ['$http', '$q'];
        return RankingsService;
    })();
    Rankings.RankingsService = RankingsService;
})(Rankings || (Rankings = {}));
//# sourceMappingURL=RankingsService.js.map