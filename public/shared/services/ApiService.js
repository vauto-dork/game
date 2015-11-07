var Shared;
(function (Shared) {
    var ApiService = (function () {
        function ApiService($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        // --------------------------------------------------------------
        // Active Games
        ApiService.prototype.getActiveGamePath = function (gameIdPath) {
            return '/ActiveGames/json' + gameIdPath;
        };
        ;
        ApiService.prototype.getActiveGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.get(this.getActiveGamePath(gameIdPath))
                .success(function (data, status, headers, config) {
                if (data === null || data === undefined) {
                    def.reject(status);
                }
                else {
                    def.resolve(data);
                }
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot get game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.createActiveGame = function (game) {
            var def = this.$q.defer();
            this.$http.post('/activeGames/save', game)
                .success(function (data, status, headers, config) {
                def.resolve(data);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot create active game');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.saveActiveGame = function (gameIdPath, game) {
            var def = this.$q.defer();
            this.$http.put(this.getActiveGamePath(gameIdPath), game)
                .success(function (data, status, headers, config) {
                def.resolve();
            }).
                error(function (data, status, headers, config) {
                console.error("Cannot save active game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.deleteActiveGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.delete(this.getActiveGamePath(gameIdPath))
                .success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot delete active game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        // --------------------------------------------------------------
        // Get Players
        ApiService.prototype.getAllPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.$http.get('/players?sort=true')
                .success(function (data, status, headers, config) {
                var allPlayers = data;
                var formattedPlayers = _this.playerNameFormat(allPlayers);
                def.resolve(formattedPlayers);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get all players.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getRankedPlayers = function (month, year, hideUnranked) {
            var def = this.$q.defer();
            month = (month === undefined || month === null) ? new Date().getMonth() : month;
            year = year || new Date().getFullYear();
            var unrankedParam = hideUnranked ? '&hideUnranked=true' : '';
            var rankedUrl = '/players/ranked?month=' + month + '&year=' + year + unrankedParam;
            this.$http.get(rankedUrl)
                .success(function (data, status, headers, config) {
                var players = data.map(function (value) {
                    return new Shared.RankedPlayer(value);
                });
                def.resolve(players);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get ranked players.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.playerNameFormat = function (rawPlayersList) {
            var playersList = rawPlayersList.map(function (value) {
                return new Shared.Player(value);
            });
            return playersList;
        };
        // --------------------------------------------------------------
        // Dork of the Month
        ApiService.prototype.getDotm = function (month, year) {
            var def = this.$q.defer();
            var query = '?month=' + month + '&year=' + year;
            this.$http.get("/Players/dotm" + query)
                .success(function (data, status, headers, config) {
                def.resolve(data);
            }).
                error(function (data, status, headers, config) {
                console.error('Cannot get dorks of the month.');
                def.reject(data);
            });
            return def.promise;
        };
        // --------------------------------------------------------------
        // Games
        ApiService.prototype.getLastPlayedGame = function () {
            var def = this.$q.defer();
            this.$http.get("/Games/LastPlayed")
                .success(function (data, status, headers, config) {
                def.resolve(data);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get last game played.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.finalizeGame = function (game) {
            var def = this.$q.defer();
            this.$http.post('/games', game).success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot finalize game. Status code: " + status + ".");
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.deleteGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.delete("/games" + gameIdPath)
                .success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot delete game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.$inject = ['$http', '$q'];
        return ApiService;
    })();
    Shared.ApiService = ApiService;
})(Shared || (Shared = {}));
//# sourceMappingURL=ApiService.js.map