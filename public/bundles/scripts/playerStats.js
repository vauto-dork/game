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
                diff: "=",
                isPercent: "="
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
        Object.defineProperty(DeltaBoxController.prototype, "decimalPlaces", {
            get: function () {
                return (this.isPercent && (this.diff >= 100 || this.diff <= -100)) ? 0 : this.decimal;
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
        function GameGraphController($element, $window, dateTimeService, playerStatsService) {
            var _this = this;
            this.$element = $element;
            this.$window = $window;
            this.dateTimeService = dateTimeService;
            this.playerStatsService = playerStatsService;
            this.gameDayData = [];
            this.isCurrentMonth = false;
            this.duration = 200;
            this.graphMinPx = 700;
            this.resizeWindow();
            this.playerStatsService.ready().then(function () {
                _this.updateData();
                _this.resizeWindow();
                _this.playerStatsService.subscribeDataRefresh(function () {
                    _this.updateData();
                });
            });
            angular.element($window).resize(function () {
                _this.resizeWindow();
                _this.redraw();
            });
            var ratingGraphContainer = this.$element.find(".rating-graph-container");
            var gamesPlayedGraphContainer = this.$element.find(".games-played-graph-container");
            ratingGraphContainer.scroll(function () {
                gamesPlayedGraphContainer.scrollLeft(ratingGraphContainer.scrollLeft());
            });
            gamesPlayedGraphContainer.scroll(function () {
                ratingGraphContainer.scrollLeft(gamesPlayedGraphContainer.scrollLeft());
            });
        }
        Object.defineProperty(GameGraphController.prototype, "playerStats", {
            get: function () {
                return this.playerStatsService.playerStats;
            },
            enumerable: true,
            configurable: true
        });
        GameGraphController.prototype.resizeWindow = function () {
            this.graphWidthPx = Math.min(this.$window.innerWidth - 30, 1200);
            this.graphWidthPx = Math.max(this.graphWidthPx, this.graphMinPx);
            if (this.graphWidthPx === this.graphMinPx) {
                this.$element.find(".graph-container").addClass("overflowed");
            }
            else {
                this.$element.find(".graph-container").removeClass("overflowed");
            }
            this.$element.find(".rating-container").width(this.graphWidthPx);
            this.$element.find(".rating-svg").attr("width", this.graphWidthPx);
            this.$element.find(".games-played-container").width(this.graphWidthPx);
            this.$element.find(".games-played-svg").attr("width", this.graphWidthPx);
        };
        GameGraphController.prototype.translate = function (x, y) {
            return "translate(" + x + "," + y + ")";
        };
        GameGraphController.prototype.updateData = function () {
            var _this = this;
            if (!this.playerStats.gamesPlayed) {
                return;
            }
            var gameMonth = new Date(this.playerStats.dateRange[0]).getUTCMonth();
            var gameYear = new Date(this.playerStats.dateRange[0]).getUTCFullYear();
            var numDaysInMonth = new Date(gameYear, gameMonth + 1, 0).getUTCDate();
            this.isCurrentMonth =
                gameMonth === this.dateTimeService.currentMonthValue()
                    && gameYear === this.dateTimeService.currentYear();
            this.gameDayData = [];
            for (var i = 0; i < numDaysInMonth; i++) {
                this.gameDayData.push({
                    date: i + 1,
                    gamesPlayed: 0,
                    rank: 0,
                    rating: 0,
                    games: []
                });
            }
            var prevDay = 0;
            this.playerStats.games.filter(function (game) { return game.played; }).forEach(function (game) {
                var day = new Date(game.gameDate).getDate();
                var index = day - 1;
                _this.gameDayData[index].gamesPlayed++;
                _this.gameDayData[index].games.unshift(game);
                if (prevDay !== day) {
                    _this.gameDayData[index].rating = game.rating;
                    prevDay = day;
                }
            });
            prevDay = 0;
            this.playerStats.games.forEach(function (game) {
                var day = new Date(game.gameDate).getDate();
                var index = day - 1;
                if (prevDay !== day) {
                    _this.gameDayData[index].rank = game.rank;
                    prevDay = day;
                }
            });
            var gamesPlayed = this.gameDayData.map(function (game) { return game.gamesPlayed; });
            if (Math.max.apply(Math, gamesPlayed) > 6) {
                this.$element.find(".games-played-svg").attr("height", 300);
            }
            else {
                this.$element.find(".games-played-svg").attr("height", 200);
                this.$element.find(".games-played-tooltip").html(" ").css("opacity", 0);
            }
            this.redraw();
        };
        GameGraphController.prototype.redraw = function () {
            this.createRatingGraph();
            this.createGamesPlayedGraph();
        };
        GameGraphController.prototype.initGraph = function (svgClass, yMin, yMax) {
            var svg = d3.select("svg." + svgClass);
            var margin = { top: 20, right: 20, bottom: 20, left: 40 };
            var width = +svg.attr("width") - margin.left - margin.right;
            var height = +svg.attr("height") - margin.top - margin.bottom;
            var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
            var yScale = d3.scaleLinear().rangeRound([height, 0]);
            xScale.domain(this.gameDayData.map(function (d) { return d.date.toString(); }));
            yScale.domain([yMin, yMax]);
            svg.selectAll("g").remove();
            svg.append("g")
                .attr("class", "main-graph-group")
                .attr("transform", this.translate(margin.left, margin.top));
            return {
                group: d3.select("svg." + svgClass).select("g"),
                margin: margin,
                width: width,
                height: height,
                xScale: xScale,
                yScale: yScale
            };
        };
        GameGraphController.prototype.configHoverMarker = function (config, svgClass) {
            var hoverMakerClass = svgClass + "-hover-marker";
            config.group.append("circle")
                .attr("class", hoverMakerClass)
                .attr("r", 4)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("opacity", 0);
            return hoverMakerClass;
        };
        GameGraphController.prototype.configurePopover = function (xPx, yPx, config) {
            var bandwidth = config.xScale.bandwidth();
            var markerLeft = xPx + Math.floor(bandwidth / 2) + 1;
            var divLeft = config.margin.left + markerLeft;
            var divTop = config.margin.top + yPx;
            return {
                marker: {
                    left: markerLeft
                },
                div: {
                    left: divLeft,
                    top: divTop
                }
            };
        };
        GameGraphController.prototype.hoverBarMouseOver = function (hoverMarkerClass, tooltipDivClass) {
            var marker = d3.select("." + hoverMarkerClass);
            var div = d3.select("." + tooltipDivClass);
            marker.transition()
                .duration(this.duration)
                .style("opacity", 0.75);
            div.transition()
                .duration(this.duration)
                .style("opacity", 1);
        };
        GameGraphController.prototype.hoverBarMouseOut = function (hoverMarkerClass, tooltipDivClass) {
            var marker = d3.select("." + hoverMarkerClass);
            var div = d3.select("." + tooltipDivClass);
            marker.transition()
                .duration(this.duration)
                .style("opacity", 0);
            div.transition()
                .duration(this.duration)
                .style("opacity", 0);
        };
        GameGraphController.prototype.drawAxes = function (config, xAxis, yAxis) {
            xAxis.tickSizeOuter(0).tickPadding(10);
            yAxis.tickSizeOuter(0).tickPadding(10);
            var xAxisGroup = config.group.append("g")
                .attr("class", "axis axis-x")
                .call(xAxis);
            config.group.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
            config.group.select(".axis-x").attr("transform", this.translate(0, config.height));
        };
        GameGraphController.prototype.drawOutsideBorder = function (config) {
            var outsideBorder = d3.line()
                .x(function (d) { return d[0]; })
                .y(function (d) { return d[1]; });
            var outsideBorderPoints = [
                [0, 0],
                [config.width, 0],
                [config.width, config.height],
                [0, config.height],
                [0, 0]
            ];
            config.group.append("path")
                .data([outsideBorderPoints])
                .attr("class", "outside-border")
                .attr("d", outsideBorder);
        };
        GameGraphController.prototype.drawHoverMarker = function (markerClass, left, top) {
            d3.select("." + markerClass)
                .attr("transform", this.translate(left, top));
        };
        GameGraphController.prototype.drawPopover = function (div, left, top) {
            div.css("left", left + "px")
                .css("top", top + "px");
        };
        GameGraphController.prototype.createRatingGraph = function () {
            var _this = this;
            var svgClass = "rating-svg";
            var yData = this.gameDayData.filter(function (game) { return game.gamesPlayed > 0; })
                .map(function (game) { return game.rating; });
            var yMin = Math.min.apply(Math, yData);
            var yMax = d3.max(this.gameDayData, function (d) { return d.rating; });
            yMin = !yMin ? 0 : Math.floor(yMin - 0.5);
            yMax = Math.ceil(yMax + 0.5);
            if (yMin === yMax) {
                yMin = yMin - 1;
                yMax = yMax + 1;
            }
            var config = this.initGraph(svgClass, yMin, yMax);
            var xAxis = d3.axisBottom(config.xScale)
                .tickSizeInner(0);
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(10)
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
            var lastDataPoint = originalLineData[originalLineData.length - 1];
            var lastDay = lastDataPoint[0];
            var lastRanking = lastDataPoint[1];
            var lineData = angular.copy(originalLineData);
            var zeroLine = Math.max(yMin, 0);
            lineData.unshift([lineData[0][0], zeroLine]);
            lineData.push([lastDay, lastRanking]);
            lineData.push([lastDay, zeroLine]);
            var lineLeftOffset = Math.floor(config.xScale.bandwidth() / 2) + 1;
            config.group.append("path")
                .data([lineData])
                .attr("class", "line data")
                .attr("transform", this.translate(lineLeftOffset, 0))
                .attr("d", valueline);
            var tooltipDivClass = "rating-tooltip";
            var hoverArea = config.group.append("g").attr("class", svgClass + "-hover-bars");
            var hoverMarkerClass = this.configHoverMarker(config, svgClass);
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
                _this.hoverBarMouseOver(hoverMarkerClass, tooltipDivClass);
                var div = _this.$element.find("." + tooltipDivClass);
                div.html(_this.generateRatingTooltipHtml(d[0]));
                var divWidth = div.outerWidth(true);
                var divHeight = div.outerHeight(true);
                var popoverConfig = _this.configurePopover(xPx, yPx, config);
                var markerLeft = popoverConfig.marker.left;
                _this.drawHoverMarker(hoverMarkerClass, markerLeft, yPx);
                var divLeft = popoverConfig.div.left;
                divLeft = (markerLeft + (divWidth / 2) > config.width)
                    ? config.width - divWidth + config.margin.left
                    : divLeft - (divWidth / 2);
                var divTop = popoverConfig.div.top;
                divTop += (divTop - divHeight - 10 < 0)
                    ? 10
                    : -(divHeight + 10);
                _this.drawPopover(div, divLeft, divTop);
            })
                .on("mouseout", function (d) {
                _this.hoverBarMouseOut(hoverMarkerClass, tooltipDivClass);
            });
            this.drawOutsideBorder(config);
        };
        GameGraphController.prototype.generateRatingTooltipHtml = function (day) {
            var sb = [];
            var ratingStr = d3.format(".2f")(this.gameDayData[day - 1].rating);
            sb.push("<table>");
            sb.push("<tr><td class=\"eod-label\">EOD Rating</td><td class=\"eod-value\">" + ratingStr + "</td></tr>");
            sb.push("<tr><td class=\"eod-label\">EOD Rank</td><td class=\"eod-value\">" + this.gameDayData[day - 1].rank + "</td></tr>");
            sb.push("</table>");
            return sb.join('');
        };
        GameGraphController.prototype.createGamesPlayedGraph = function () {
            var _this = this;
            var svgClass = "games-played-svg";
            var yMax = d3.max(this.gameDayData, function (d) { return d.gamesPlayed; });
            yMax = yMax > 4 ? yMax + 1 : 5;
            var config = this.initGraph(svgClass, 0, yMax);
            var xAxis = d3.axisBottom(config.xScale).tickSizeInner(0);
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(yMax)
                .tickFormat(d3.format("d"))
                .tickSizeInner(-config.width);
            this.drawAxes(config, xAxis, yAxis);
            var filteredGames = this.gameDayData.filter(function (game) { return game.gamesPlayed > 0; });
            config.group.selectAll(".bar")
                .data(filteredGames)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return config.xScale(d.date.toString()); })
                .attr("y", function (d) { return config.yScale(d.gamesPlayed); })
                .attr("width", config.xScale.bandwidth())
                .attr("height", function (d) { return config.height - config.yScale(d.gamesPlayed); });
            var tooltipDivClass = "games-played-tooltip";
            var hoverArea = config.group.append("g").attr("class", svgClass + "-hover-bars");
            var hoverMarkerClass = this.configHoverMarker(config, svgClass);
            var marker = d3.select("." + hoverMarkerClass);
            hoverArea.selectAll(".hover-bar")
                .data(filteredGames)
                .enter().append("rect")
                .attr("class", "hover-bar")
                .attr("x", function (d) { return config.xScale(d.date.toString()); })
                .attr("y", 0)
                .attr("width", config.xScale.bandwidth())
                .attr("height", function (d) { return config.height; })
                .on("mouseover", function (d) {
                var xPx = config.xScale(d.date.toString());
                var yPx = config.yScale(d.gamesPlayed);
                _this.hoverBarMouseOver(hoverMarkerClass, tooltipDivClass);
                var div = _this.$element.find("." + tooltipDivClass);
                div.html(_this.generateGamesPlayedTooltipHtml(d.games));
                var divWidth = div.outerWidth(true);
                var divHeight = div.outerHeight(true);
                var popoverConfig = _this.configurePopover(xPx, yPx, config);
                var markerLeft = popoverConfig.marker.left;
                _this.drawHoverMarker(hoverMarkerClass, markerLeft, yPx);
                var bandwidth = config.xScale.bandwidth();
                var offset = Math.floor(bandwidth / 4);
                var divLeft = popoverConfig.div.left;
                divLeft += (markerLeft + divWidth + offset > config.width)
                    ? -(offset + divWidth)
                    : offset;
                var desiredTop = yPx - (divHeight / 2) + config.margin.top;
                var divTop = (desiredTop < 0)
                    ? 5
                    : desiredTop;
                _this.drawPopover(div, divLeft, divTop);
            })
                .on("mouseout", function (d) {
                _this.hoverBarMouseOut(hoverMarkerClass, tooltipDivClass);
            });
            this.drawOutsideBorder(config);
        };
        GameGraphController.prototype.generateGamesPlayedTooltipHtml = function (games) {
            var sb = [];
            sb.push("<table>");
            games.forEach(function (game, index) {
                var gameDate = new Date(game.gameDate);
                var hour = gameDate.getHours() > 12 ? gameDate.getHours() - 12 : gameDate.getHours();
                var minStr = gameDate.getMinutes() < 10 ? "0" + gameDate.getMinutes() : gameDate.getMinutes().toString();
                var timeStr = (hour || 12) + ":" + minStr + (gameDate.getHours() >= 12 ? 'p' : 'a');
                sb.push("<tr>");
                sb.push("<td class=\"game-num\">" + timeStr + "</td>");
                sb.push("<td class=\"game-rating\">" + d3.format(".2f")(game.rating) + "</td>");
                sb.push("</tr>");
            });
            sb.push("</table>");
            return sb.join('');
        };
        GameGraphController.$inject = ["$element", "$window", "dateTimeService", "playerStatsService"];
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
    var LocalStorageKeys = Shared.LocalStorageKeys;
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
        function PlayerStatsPageController($timeout, localStorageService, monthYearQueryService, playerStatsService) {
            var _this = this;
            this.$timeout = $timeout;
            this.localStorageService = localStorageService;
            this.monthYearQueryService = monthYearQueryService;
            this.playerStatsService = playerStatsService;
            this.showLoading = false;
            this.showErrorMessage = false;
            this.showContent = false;
            this.showAsPercent = false;
            this.changeState(State.Loading);
            this.showAsPercent = this.localStorageService.getStoredBoolean(LocalStorageKeys.PlayerStatsRatingView);
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
        PlayerStatsPageController.prototype.diffValue = function (game) {
            return this.showAsPercent ? game.ratingPctDiff : game.ratingDiff;
        };
        PlayerStatsPageController.prototype.valuePercentClick = function () {
            this.localStorageService.setStoredValue(LocalStorageKeys.PlayerStatsRatingView, this.showAsPercent);
        };
        PlayerStatsPageController.$inject = ["$timeout", "localStorageService", "monthYearQueryService", "playerStatsService"];
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