var Shared;
(function (Shared) {
    var ApiService = (function () {
        function ApiService($http, $q, playerNameService) {
            this.$http = $http;
            this.$q = $q;
            this.playerNameService = playerNameService;
        }
        // --------------------------------------------------------------
        // Active Games
        ApiService.prototype.GetActiveGamePath = function (gameIdPath) {
            return '/ActiveGames/json' + gameIdPath;
        };
        ;
        ApiService.prototype.GetActiveGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.get(this.GetActiveGamePath(gameIdPath))
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
        ;
        ApiService.prototype.CreateActiveGame = function (game) {
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
        ApiService.prototype.SaveActiveGame = function (gameIdPath, game) {
            var def = this.$q.defer();
            this.$http.put(this.GetActiveGamePath(gameIdPath), game)
                .success(function (data, status, headers, config) {
                def.resolve();
            }).
                error(function (data, status, headers, config) {
                console.error("Cannot save active game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ;
        ApiService.prototype.DeleteActiveGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.delete(this.GetActiveGamePath(gameIdPath))
                .success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot delete active game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ;
        // --------------------------------------------------------------
        // Get Players
        ApiService.prototype.GetAllPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.$http.get('/players?sort=true')
                .success(function (data, status, headers, config) {
                var allPlayers = data;
                allPlayers = _this.PlayerNameFormat(allPlayers);
                def.resolve(data);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get all players.');
                def.reject(data);
            });
            return def.promise;
        };
        ;
        ApiService.prototype.PlayerNameFormat = function (rawPlayersList) {
            var _this = this;
            rawPlayersList.forEach(function (value) {
                value = _this.playerNameService.PlayerNameFormat(value);
            });
            return rawPlayersList;
        };
        ;
        // --------------------------------------------------------------
        // Games 
        ApiService.prototype.FinalizeGame = function (game) {
            var def = this.$q.defer();
            this.$http.post('/games', game).success(function (data, status, headers, config) {
                def.resolve();
            }).
                error(function (data, status, headers, config) {
                console.error("Cannot finalize game. Status code: " + status + ".");
                def.reject(data);
            });
            return def.promise;
        };
        ;
        ApiService.prototype.DeleteGame = function (gameIdPath) {
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
        ;
        ApiService.$inject = ['$http', '$q', 'playerNameService'];
        return ApiService;
    })();
    Shared.ApiService = ApiService;
})(Shared || (Shared = {}));
//# sourceMappingURL=ApiService.js.map