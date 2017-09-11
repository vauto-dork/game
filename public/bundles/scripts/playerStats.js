var PlayerStats;
(function (PlayerStats) {
    var PlayerStatsService = (function () {
        function PlayerStatsService($q, playerId, apiService) {
            this.$q = $q;
            this.playerId = playerId;
            this.apiService = apiService;
        }
        Object.defineProperty(PlayerStatsService.prototype, "playerStats", {
            get: function () {
                return this.localPlayerStats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsService.prototype, "latestGame", {
            get: function () {
                if (this.localPlayerStats && this.localPlayerStats.games) {
                    return this.localPlayerStats.games[0];
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsService.prototype, "hasPlayedGames", {
            get: function () {
                return !this.playerStats ? false : this.playerStats.gamesPlayed > 0;
            },
            enumerable: true,
            configurable: true
        });
        PlayerStatsService.prototype.ready = function () {
            return this.readyPromise;
        };
        PlayerStatsService.prototype.getPlayerStats = function (date) {
            var _this = this;
            var def = this.$q.defer();
            this.readyPromise = def.promise;
            this.apiService.getPlayerStats(this.playerId, date).then(function (playerStats) {
                _this.localPlayerStats = playerStats;
                def.resolve();
            }, function () {
                def.reject();
            });
            return def.promise;
        };
        PlayerStatsService.$inject = ["$q", "playerId", "apiService"];
        return PlayerStatsService;
    }());
    PlayerStats.PlayerStatsService = PlayerStatsService;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    function DeltaBox() {
        return {
            bindings: {
                value: "=",
                decimal: "@",
                diff: "="
            },
            templateUrl: "/areas/playerStats/directives/DeltaBoxTemplate.html",
            controller: DeltaBoxController
        };
    }
    PlayerStats.DeltaBox = DeltaBox;
    var DeltaBoxController = (function () {
        function DeltaBoxController() {
        }
        Object.defineProperty(DeltaBoxController.prototype, "hasNoValue", {
            get: function () {
                return this.value === null || this.value === undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "hasValue", {
            get: function () {
                return (this.value === 0) || !!this.value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "isDiffPositive", {
            get: function () {
                return this.diff > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "isDiffNegative", {
            get: function () {
                return this.diff < 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "absDiff", {
            get: function () {
                return Math.abs(this.diff);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "absValue", {
            get: function () {
                return Math.abs(this.value);
            },
            enumerable: true,
            configurable: true
        });
        return DeltaBoxController;
    }());
    PlayerStats.DeltaBoxController = DeltaBoxController;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    function GameGraph() {
        return {
            bindings: {},
            templateUrl: "/areas/playerStats/directives/GameGraphTemplate.html",
            controller: GameGraphController
        };
    }
    PlayerStats.GameGraph = GameGraph;
    var GameGraphController = (function () {
        function GameGraphController($element, playerStatsService) {
            var _this = this;
            this.$element = $element;
            this.playerStatsService = playerStatsService;
            this.gameDayData = [];
            this.playerStatsService.ready().then(function () {
                var gameMonth = new Date(_this.playerStats.dateRange[0]).getMonth();
                var gameYear = new Date(_this.playerStats.dateRange[0]).getFullYear();
                var numDaysInMonth = new Date(gameYear, gameMonth + 1, 0).getDate();
                _this.gameDayData = [];
                for (var i = 0; i < numDaysInMonth; i++) {
                    _this.gameDayData.push({ date: i + 1, gamesPlayed: 0 });
                }
                _this.playerStats.games.forEach(function (game) {
                    var day = new Date(game.gameDate).getDate();
                    _this.gameDayData[day - 1].gamesPlayed++;
                });
                _this.createGraph();
            });
        }
        Object.defineProperty(GameGraphController.prototype, "playerStats", {
            get: function () {
                return this.playerStatsService.playerStats;
            },
            enumerable: true,
            configurable: true
        });
        GameGraphController.prototype.createGraph = function () {
            var svg = d3.select("svg"), margin = { top: 20, right: 20, bottom: 30, left: 40 }, width = +svg.attr("width") - margin.left - margin.right, height = +svg.attr("height") - margin.top - margin.bottom;
            var x = d3.scaleBand().rangeRound([0, width]).padding(0.1), y = d3.scaleLinear().rangeRound([height, 0]);
            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var yMax = d3.max(this.gameDayData, function (d) { return +d.gamesPlayed; });
            x.domain(this.gameDayData.map(function (d) { return d.date.toString(); }));
            y.domain([0, yMax]);
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(yMax).tickFormat(d3.format("d")))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");
            g.selectAll(".bar")
                .data(this.gameDayData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.date.toString()); })
                .attr("y", function (d) { return y(d.gamesPlayed); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.gamesPlayed); });
        };
        GameGraphController.$inject = ["$element", "playerStatsService"];
        return GameGraphController;
    }());
    PlayerStats.GameGraphController = GameGraphController;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    function PlayerStatsCard() {
        return {
            templateUrl: "/areas/playerStats/directives/PlayerStatsCardTemplate.html",
            controller: PlayerStatsCardController
        };
    }
    PlayerStats.PlayerStatsCard = PlayerStatsCard;
    var PlayerStatsCardController = (function () {
        function PlayerStatsCardController(playerStatsService) {
            this.playerStatsService = playerStatsService;
        }
        Object.defineProperty(PlayerStatsCardController.prototype, "playerStats", {
            get: function () {
                return this.playerStatsService.playerStats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsCardController.prototype, "rating", {
            get: function () {
                if (!this.playerStatsService.latestGame) {
                    return 0;
                }
                return this.playerStatsService.latestGame.rating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsCardController.prototype, "rank", {
            get: function () {
                if (!this.playerStatsService.latestGame) {
                    return 0;
                }
                return this.playerStatsService.latestGame.rank;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsCardController.prototype, "hasPlayedGames", {
            get: function () {
                return this.playerStatsService.hasPlayedGames;
            },
            enumerable: true,
            configurable: true
        });
        PlayerStatsCardController.$inject = ["playerStatsService"];
        return PlayerStatsCardController;
    }());
    PlayerStats.PlayerStatsCardController = PlayerStatsCardController;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    var MonthYearParams = Shared.MonthYearParams;
    function PlayerStatsPage() {
        return {
            templateUrl: "/areas/playerStats/directives/PlayerStatsPageTemplate.html",
            controller: PlayerStatsPageController
        };
    }
    PlayerStats.PlayerStatsPage = PlayerStatsPage;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["Ready"] = 1] = "Ready";
        State[State["Change"] = 2] = "Change";
        State[State["Error"] = 3] = "Error";
    })(State || (State = {}));
    var PlayerStatsPageController = (function () {
        function PlayerStatsPageController($timeout, monthYearQueryService, playerStatsService) {
            var _this = this;
            this.$timeout = $timeout;
            this.monthYearQueryService = monthYearQueryService;
            this.playerStatsService = playerStatsService;
            this.showLoading = false;
            this.showErrorMessage = false;
            this.showContent = false;
            this.changeState(State.Loading);
            monthYearQueryService.subscribeDateChange(function (event, date) {
                _this.getPlayerStats(date);
            });
            this.date = monthYearQueryService.getQueryParams() || new MonthYearParams();
            this.getPlayerStats(this.date);
        }
        Object.defineProperty(PlayerStatsPageController.prototype, "playerStats", {
            get: function () {
                return this.playerStatsService.playerStats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsPageController.prototype, "hasPlayedGames", {
            get: function () {
                return this.playerStatsService.hasPlayedGames;
            },
            enumerable: true,
            configurable: true
        });
        PlayerStatsPageController.prototype.getPlayerStats = function (date) {
            var _this = this;
            this.playerStatsService.getPlayerStats(date).then(function () {
                _this.changeState(State.Ready);
            }, function () {
                _this.changeState(State.Error);
            });
        };
        PlayerStatsPageController.prototype.changeState = function (newState) {
            this.showLoading = newState === State.Loading || newState === State.Change;
            this.showContent = newState === State.Ready;
            this.showErrorMessage = newState === State.Error;
        };
        PlayerStatsPageController.prototype.rankValue = function (value) {
            return value === 0 ? null : value;
        };
        PlayerStatsPageController.prototype.updateQueryParams = function () {
            var _this = this;
            this.changeState(State.Change);
            this.$timeout(function () {
                _this.monthYearQueryService.saveQueryParams(_this.date.month, _this.date.year);
            });
        };
        PlayerStatsPageController.$inject = ["$timeout", "monthYearQueryService", "playerStatsService"];
        return PlayerStatsPageController;
    }());
    PlayerStats.PlayerStatsPageController = PlayerStatsPageController;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    var PlayerStatsModule = angular.module('PlayerStatsModule', ['UxControlsModule']);
    PlayerStatsModule.service('playerStatsService', PlayerStats.PlayerStatsService);
    PlayerStatsModule.component('gameGraph', PlayerStats.GameGraph());
    PlayerStatsModule.component('deltaBox', PlayerStats.DeltaBox());
    PlayerStatsModule.component('playerStatsCard', PlayerStats.PlayerStatsCard());
    PlayerStatsModule.component('playerStatsPage', PlayerStats.PlayerStatsPage());
})(PlayerStats || (PlayerStats = {}));

//# sourceMappingURL=maps/playerStats.js.map