var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PlayerStats;
(function (PlayerStats) {
    var PlayerStatsService = (function (_super) {
        __extends(PlayerStatsService, _super);
        function PlayerStatsService($timeout, $q, playerId, apiService) {
            var _this = _super.call(this, $timeout) || this;
            _this.$q = $q;
            _this.playerId = playerId;
            _this.apiService = apiService;
            _this.events = {
                dataRefresh: "dataRefresh"
            };
            return _this;
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
                _this.publish(_this.events.dataRefresh, null);
                def.resolve();
            }, function () {
                def.reject();
            });
            return def.promise;
        };
        PlayerStatsService.prototype.subscribeDataRefresh = function (callback) {
            this.subscribe(this.events.dataRefresh, callback);
        };
        PlayerStatsService.$inject = ["$timeout", "$q", "playerId", "apiService"];
        return PlayerStatsService;
    }(Shared.PubSubServiceBase));
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
                _this.updateData();
                _this.playerStatsService.subscribeDataRefresh(function () {
                    _this.updateData();
                });
            });
        }
        Object.defineProperty(GameGraphController.prototype, "playerStats", {
            get: function () {
                return this.playerStatsService.playerStats;
            },
            enumerable: true,
            configurable: true
        });
        GameGraphController.prototype.updateData = function () {
            var _this = this;
            if (!this.playerStats.gamesPlayed) {
                return;
            }
            var gameMonth = new Date(this.playerStats.dateRange[0]).getMonth();
            var gameYear = new Date(this.playerStats.dateRange[0]).getFullYear();
            var numDaysInMonth = new Date(gameYear, gameMonth + 1, 0).getDate();
            this.gameDayData = [];
            for (var i = 0; i < numDaysInMonth; i++) {
                this.gameDayData.push({ date: i + 1, gamesPlayed: 0, rating: 0 });
            }
            var prevDay = 0;
            this.playerStats.games.filter(function (game) { return game.played; }).forEach(function (game) {
                var day = new Date(game.gameDate).getDate();
                var index = day - 1;
                _this.gameDayData[index].gamesPlayed++;
                if (prevDay !== day) {
                    _this.gameDayData[index].rating = game.rating;
                    prevDay = day;
                }
            });
            this.createRatingGraph();
            this.createGamesPlayedGraph();
        };
        GameGraphController.prototype.initGraph = function (svgClass, yMin, yMax) {
            var svg = d3.select("svg." + svgClass);
            var margin = { top: 20, right: 20, bottom: 30, left: 40 };
            var width = +svg.attr("width") - margin.left - margin.right;
            var height = +svg.attr("height") - margin.top - margin.bottom;
            var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
            var yScale = d3.scaleLinear().rangeRound([height, 0]);
            xScale.domain(this.gameDayData.map(function (d) { return d.date.toString(); }));
            yScale.domain([yMin, yMax]);
            svg.selectAll("g").remove();
            svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            return {
                group: d3.select("svg." + svgClass).select("g"),
                margin: margin,
                width: width,
                height: height,
                xScale: xScale,
                yScale: yScale
            };
        };
        GameGraphController.prototype.drawAxes = function (config, xAxis, yAxis) {
            xAxis.tickSizeOuter(0).tickPadding(10);
            yAxis.tickSizeOuter(0).tickPadding(10);
            config.group.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(0," + config.height + ")")
                .call(xAxis);
            config.group.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
        };
        GameGraphController.prototype.createRatingGraph = function () {
            var svgClass = "rating-svg";
            var yMin = d3.min(this.gameDayData, function (d) { return d.rating; });
            var yMax = d3.max(this.gameDayData, function (d) { return d.rating; });
            yMin = !yMin ? 0 : Math.floor(yMin - 0.5);
            yMax = Math.ceil(yMax + 0.5);
            if (yMin === yMax) {
                yMin = yMin - 1;
                yMax = yMax + 1;
            }
            var config = this.initGraph(svgClass, yMin, yMax);
            var xAxis = d3.axisBottom(config.xScale).tickSizeInner(-config.height);
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(8)
                .tickSizeInner(-config.width);
            this.drawAxes(config, xAxis, yAxis);
            config.group.append("linearGradient")
                .attr("id", "rating-gradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 0).attr("y1", config.yScale(0.1))
                .attr("x2", 0).attr("y2", config.yScale(-0.1))
                .selectAll("stop")
                .data([
                { offset: "0%", class: "positive-stop-color" },
                { offset: "45%", class: "positive-stop-color" },
                { offset: "45%", class: "neutral-stop-color" },
                { offset: "55%", class: "neutral-stop-color" },
                { offset: "55%", class: "negative-stop-color" },
                { offset: "100%", class: "negative-stop-color" }
            ])
                .enter().append("stop")
                .attr("offset", function (d) { return d.offset; })
                .attr("class", function (d) { return d.class; });
            var valueline = d3.line()
                .x(function (d) { return config.xScale(d[0].toString()); })
                .y(function (d) { return config.yScale(d[1]); });
            var originalLineData = this.gameDayData.filter(function (game) { return game.gamesPlayed > 0; })
                .map(function (d) {
                return [d.date, d.rating];
            });
            var lastDay = this.gameDayData[this.gameDayData.length - 1].date;
            var lastRanking = originalLineData[originalLineData.length - 1][1];
            var lineData = angular.copy(originalLineData);
            lineData.unshift([1, 0]);
            lineData.push([lastDay, lastRanking]);
            lineData.push([lastDay, 0]);
            config.group.append("path")
                .data([lineData])
                .attr("class", "line data")
                .attr("transform", "translate(18,0)")
                .attr("d", valueline);
            var div = d3.select(".rating-tooltip");
            var hoverArea = config.group.append("g");
            var marker = config.group.append("circle");
            marker.attr("class", "hover-marker")
                .attr("r", 4)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("opacity", 0);
            hoverArea.selectAll(".hover-bar")
                .data(originalLineData)
                .enter().append("rect")
                .attr("class", "hover-bar")
                .attr("x", function (d) { return config.xScale(d[0].toString()); })
                .attr("y", 0)
                .attr("width", config.xScale.bandwidth())
                .attr("height", function (d) { return config.height; })
                .on("mouseover", function (d) {
                var xPx = config.xScale(d[0].toString());
                var yPx = config.yScale(d[1]);
                marker.transition()
                    .duration(200)
                    .style("opacity", 0.75);
                marker.attr("transform", "translate(" + (xPx + 17) + "," + yPx + ")");
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div.html("EOD Rating: " + d[1])
                    .style("left", xPx + 35 + "px")
                    .style("top", yPx + 25 + "px");
            })
                .on("mouseout", function (d) {
                marker.transition()
                    .duration(500)
                    .style("opacity", 0);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
            var outsideBorder = d3.line()
                .x(function (d) { return d[0]; })
                .y(function (d) { return d[1]; });
            var outsideBorderPoints = [
                [0, 0],
                [config.width, 0],
                [config.width, config.height]
            ];
            config.group.append("path")
                .data([outsideBorderPoints])
                .attr("class", "rating-outside-border")
                .attr("d", outsideBorder);
        };
        GameGraphController.prototype.createGamesPlayedGraph = function () {
            var svgClass = "games-played-svg";
            var yMax = d3.max(this.gameDayData, function (d) { return d.gamesPlayed; });
            yMax = yMax > 5 ? yMax : 5;
            var config = this.initGraph(svgClass, 0, yMax);
            config.group.selectAll(".bar")
                .data(this.gameDayData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return config.xScale(d.date.toString()); })
                .attr("y", function (d) { return config.yScale(d.gamesPlayed); })
                .attr("width", config.xScale.bandwidth())
                .attr("height", function (d) { return config.height - config.yScale(d.gamesPlayed); });
            var xAxis = d3.axisBottom(config.xScale).tickSizeInner(0);
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(yMax)
                .tickFormat(d3.format("d"))
                .tickSizeInner(-config.width);
            this.drawAxes(config, xAxis, yAxis);
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