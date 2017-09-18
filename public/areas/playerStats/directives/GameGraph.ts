module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;
    import IPlayerStatsGame = Shared.IPlayerStatsGame;

    export function GameGraph(): ng.IComponentOptions {
        return {
            bindings: {
            },
            templateUrl: "/areas/playerStats/directives/GameGraphTemplate.html",
            controller: GameGraphController
        };
    }

    interface IGameDayData {
        date: number;
        rating: number;
        rank: number;
        gamesPlayed: number;
        games: IPlayerStatsGame[];
    }

    interface IMargin {
        top: number;
        right: number;
        bottom: number;
        left: number
    }

    interface IGraphConfig {
        group?: ID3Selection;
        margin?: IMargin;
        width?: number;
        height?: number;
        xScale?: d3.ScaleBand<string>;
        yScale?: d3.ScaleLinear<number, number>;
    }

    interface IPopoverConfig {
        marker?: {
            left?: number;
        },
        div?: {
            left?: number;
            top?: number;
        }
    }

    interface ID3Selection extends d3.Selection<SVGElement, {}, HTMLElement, any> {}

    export class GameGraphController {
        public static $inject: string[] = ["$element", "$window", "playerStatsService"];

        private gameDayData: IGameDayData[] = [];
        private duration = 250;
        private graphWidthPx: number;
        private graphMinPx = 700;

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        constructor(private $element: ng.IAugmentedJQuery,
            private $window: ng.IWindowService,
            private playerStatsService: IPlayerStatsService) {
            this.playerStatsService.ready().then(() => {
                this.resizeWindow();
                this.updateData();

                this.playerStatsService.subscribeDataRefresh(() => {
                    this.updateData();
                });
            });

            angular.element($window).bind("resize", () => {
                this.resizeWindow();
                this.redraw();
            });
        }

        private resizeWindow(): void {
            this.graphWidthPx = Math.min(this.$window.innerWidth - 30, 1200);
            this.graphWidthPx = Math.max(this.graphWidthPx, this.graphMinPx);

            if(this.graphWidthPx === this.graphMinPx) {
                this.$element.find(".graph-container").addClass("overflowed");
            } else {
                this.$element.find(".graph-container").removeClass("overflowed");
            }

            this.$element.find(".rating-container").width(this.graphWidthPx);
            this.$element.find(".rating-svg").attr("width", this.graphWidthPx);

            this.$element.find(".games-played-container").width(this.graphWidthPx);
            this.$element.find(".games-played-svg").attr("width", this.graphWidthPx);
        }

        private translate(x, y): string {
            return `translate(${x},${y})`;
        }

        private updateData(): void {
            if(!this.playerStats.gamesPlayed) {
                return;
            }

            var gameMonth = new Date(this.playerStats.dateRange[0]).getMonth();
            var gameYear = new Date(this.playerStats.dateRange[0]).getFullYear();
            var numDaysInMonth = new Date(gameYear, gameMonth + 1, 0).getDate();

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
            this.playerStats.games.filter((game) => { return game.played; }).forEach((game) => {
                var day = new Date(game.gameDate).getDate();
                var index = day - 1;
                this.gameDayData[index].gamesPlayed++;
                this.gameDayData[index].games.unshift(game);

                if(prevDay !== day){
                    this.gameDayData[index].rating = game.rating;
                    prevDay = day;
                }
            });

            // Calculate EOD rank for every game since it could change
            // on a game that wasn't played.
            prevDay = 0;
            this.playerStats.games.forEach((game) => {
                var day = new Date(game.gameDate).getDate();
                var index = day - 1;

                if(prevDay !== day){
                    this.gameDayData[index].rank = game.rank;
                    prevDay = day;
                }
            });

            this.redraw();
        }

        private redraw(): void {
            this.createRatingGraph();
            this.createGamesPlayedGraph();
        }

        private initGraph(svgClass: string, yMin: number, yMax: number): IGraphConfig {
            var svg = d3.select("svg." + svgClass);
            
            var margin = { top: 20, right: 20, bottom: 20, left: 40 };
            var width = +svg.attr("width") - margin.left - margin.right;
            var height = +svg.attr("height") - margin.top - margin.bottom;

            var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
            var yScale = d3.scaleLinear().rangeRound([height, 0]);

            xScale.domain(this.gameDayData.map((d) => { return d.date.toString(); }));
            yScale.domain([yMin, yMax]);

            svg.selectAll("g").remove();
            svg.append("g")
                .attr("class", "main-graph-group")
                .attr("transform", this.translate(margin.left, margin.top));

            return <IGraphConfig>{
                group: d3.select("svg." + svgClass).select("g"),
                margin: margin,
                width: width,
                height: height,
                xScale: xScale,
                yScale: yScale
            };
        }

        private configHoverMarker(config: IGraphConfig, svgClass: string): string {
            var hoverMakerClass = svgClass + "-hover-marker";
            config.group.append("circle")
                .attr("class", hoverMakerClass)
                .attr("r", 4)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("opacity", 0);

            return hoverMakerClass;
        }

        private configurePopover(xPx: number, yPx: number, config: IGraphConfig): IPopoverConfig {
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
        }

        private hoverBarMouseOver(hoverMarkerClass: string, tooltipDivClass: string): void {
            var marker = d3.select(`.${hoverMarkerClass}`);
            var div = d3.select(`.${tooltipDivClass}`);
            
            marker.transition()
                .duration(this.duration)
                .style("opacity", 0.75);

            div.transition()
                .duration(this.duration)
                .style("opacity", 1);
        }

        private hoverBarMouseOut(hoverMarkerClass: string, tooltipDivClass: string): void {
            var marker = d3.select(`.${hoverMarkerClass}`);
            var div = d3.select(`.${tooltipDivClass}`);

            marker.transition()
                .duration(this.duration)
                .style("opacity", 0);

            div.transition()
                .duration(this.duration)
                .style("opacity", 0);
        }

        private drawAxes(config: IGraphConfig, xAxis: d3.Axis<{}>, yAxis: d3.Axis<{}>): void {
            xAxis.tickSizeOuter(0).tickPadding(10);
            yAxis.tickSizeOuter(0).tickPadding(10);

            var xAxisGroup = config.group.append("g")
                .attr("class", "axis axis-x")
                .call(xAxis);
            
            config.group.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
        }

        private drawOutsideBorder(config: IGraphConfig): void {
            var outsideBorder = d3.line()
                .x((d) => { return d[0]; })
                .y((d) => { return d[1]; });

            var outsideBorderPoints = [ 
                [0,0],
                [config.width, 0],
                [config.width, config.height],
                [0, config.height],
                [0,0]
            ];

            config.group.append("path")
                .data([outsideBorderPoints])
                .attr("class", "outside-border")
                .attr("d", outsideBorder);
        }

        private drawHoverMarker(markerClass: string, left: number, top: number): void {
            d3.select(`.${markerClass}`)
                .attr("transform", this.translate(left, top));
        }

        private drawPopover(div: ng.IAugmentedJQuery, left: number, top: number) {
            div.css("left", left + "px")
                .css("top", top + "px");
        }

        private createRatingGraph(): void {
            var svgClass = "rating-svg";

            var yMin = d3.min(this.gameDayData, (d) => { return d.rating; });            
            var yMax = d3.max(this.gameDayData, (d) => { return d.rating; });
            
            yMin = !yMin ? 0 : Math.floor(yMin - 0.5);
            yMax = Math.ceil(yMax + 0.5);
            
            if(yMin === yMax) {
                yMin = yMin - 1;
                yMax = yMax + 1;
            }

            var config = this.initGraph(svgClass, yMin, yMax);

            var xAxis = d3.axisBottom(config.xScale)
                .tickSizeInner(-config.height);

            var yAxis = d3.axisLeft(config.yScale)
                .ticks(8)
                .tickSizeInner(-config.width);

            this.drawAxes(config, xAxis, yAxis);

            d3.select(".axis-x").attr("transform", this.translate(0, config.height));

            // Color the lines to show positive and negative values

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
                .attr("offset", (d) => { return d.offset; })
                .attr("class", (d) => { return d.class; });


            // Generate the data line

            var valueline = d3.line()
                .x((d) => { return config.xScale(d[0].toString()); })
                .y((d) => { return config.yScale(d[1]); });
            
            var originalLineData = this.gameDayData.filter((game) => { return game.gamesPlayed > 0; })
                .map((d) => {
                    return [d.date, d.rating];
                });

            var lastDay = this.gameDayData[this.gameDayData.length - 1].date;
            var lastRanking = originalLineData[originalLineData.length - 1][1];

            var lineData = angular.copy(originalLineData);
            lineData.unshift([1,0]);
            lineData.push([lastDay, lastRanking]);
            lineData.push([lastDay, 0]);

            var lineLeftOffset = Math.floor(config.xScale.bandwidth() / 2) + 1;
            config.group.append("path")
                .data([lineData])
                .attr("class", "line data")
                .attr("transform", this.translate(lineLeftOffset, 0))
                .attr("d", valueline);

            // add the dot and tooltip
            var tooltipDivClass = "rating-tooltip";
            var hoverArea = config.group.append("g").attr("class", `${svgClass}-hover-bars`);

            var hoverMarkerClass = this.configHoverMarker(config, svgClass);

            hoverArea.selectAll(".hover-bar")
                .data(originalLineData)
                .enter().append("rect")
                .attr("class", "hover-bar")
                .attr("x", (d) => { return config.xScale(d[0].toString()); })
                .attr("y", 0)
                .attr("width", config.xScale.bandwidth())
                .attr("height", (d) => { return config.height; })
                .on("mouseover", (d) => {
                    var xPx = config.xScale(d[0].toString());
                    var yPx = config.yScale(d[1]);

                    this.hoverBarMouseOver(hoverMarkerClass, tooltipDivClass);

                    var div = this.$element.find(`.${tooltipDivClass}`);
                    div.html(this.generateRatingTooltipHtml(d[0]));

                    var divWidth = div.outerWidth(true);
                    var divHeight = div.outerHeight(true);

                    var popoverConfig = this.configurePopover(xPx, yPx, config);
                    var markerLeft = popoverConfig.marker.left;
                    this.drawHoverMarker(hoverMarkerClass, markerLeft, yPx);

                    var divLeft = popoverConfig.div.left;
                    divLeft = (markerLeft + (divWidth / 2) > config.width)
                        ? config.width - divWidth + config.margin.left
                        : divLeft - (divWidth / 2);

                    // Determine if popover is outside bounds and shift to other side if outside bounds
                    var divTop = popoverConfig.div.top;
                    divTop += (divTop - divHeight - 10 < 0)
                        ? 10
                        : -(divHeight + 10);

                    this.drawPopover(div, divLeft, divTop);
                })
                .on("mouseout", (d) => {
                    this.hoverBarMouseOut(hoverMarkerClass, tooltipDivClass);
                });

            // Draw the outside graph border (has to be last)
            this.drawOutsideBorder(config);
        }

        private generateRatingTooltipHtml(day: number): string {
            var sb: string[] = [];

            var ratingStr = d3.format(".2f")(this.gameDayData[day - 1].rating);

            sb.push("<table>");
            sb.push(`<tr><td class="eod-label">EOD Rating</td><td class="eod-value">${ratingStr}</td></tr>`)
            sb.push(`<tr><td class="eod-label">EOD Rank</td><td class="eod-value">${this.gameDayData[day - 1].rank}</td></tr>`)
            sb.push("</table>");

            return sb.join('');
        }

        private createGamesPlayedGraph(): void {
            var svgClass = "games-played-svg";

            var yMax = d3.max(this.gameDayData, (d) => { return d.gamesPlayed; });
            yMax = yMax > 4 ? yMax + 1 : 5;

            var config = this.initGraph(svgClass, 0, yMax);

            // Shift the graph up to give even spacing on common X-axis
            config.group.attr("transform", this.translate(config.margin.left, 5));

            // Redo the yScale to reverse order
            config.yScale.domain([yMax, 0]);

            var xAxis = d3.axisTop(config.xScale).tickSizeInner(0);
            
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(yMax)
                .tickFormat(d3.format("d"))
                .tickSizeInner(-config.width);

            this.drawAxes(config, xAxis, yAxis);

            var filteredGames = this.gameDayData.filter((game) => { return game.gamesPlayed > 0; });
            
            // Remember that bars are drawn upside-down from upper axis
            config.group.selectAll(".bar")
                .data(filteredGames)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", (d) => { return config.xScale(d.date.toString()); })
                .attr("y", (d) => { return 0 })
                .attr("width", config.xScale.bandwidth())
                .attr("height", (d) => { return config.yScale(d.gamesPlayed); });

            // Draw the shaded hover area
            var tooltipDivClass = "games-played-tooltip";
            var hoverArea = config.group.append("g").attr("class", `${svgClass}-hover-bars`);

            var hoverMarkerClass = this.configHoverMarker(config, svgClass);
            var marker = d3.select(`.${hoverMarkerClass}`);

            hoverArea.selectAll(".hover-bar")
                .data(filteredGames)
                .enter().append("rect")
                .attr("class", "hover-bar")
                .attr("x", (d) => { return config.xScale(d.date.toString()); })
                .attr("y", 0)
                .attr("width", config.xScale.bandwidth())
                .attr("height", (d) => { return config.height; })
                .on("mouseover", (d) => {
                    var xPx = config.xScale(d.date.toString());
                    var yPx = config.yScale(d.gamesPlayed);
                    
                    this.hoverBarMouseOver(hoverMarkerClass, tooltipDivClass);

                    var div = this.$element.find(`.${tooltipDivClass}`);
                    div.html(this.generateGamesPlayedTooltipHtml(d.games));

                    var divWidth = div.outerWidth(true);
                    var divHeight = div.outerHeight(true);

                    var popoverConfig = this.configurePopover(xPx, yPx, config);
                    
                    var markerLeft = popoverConfig.marker.left;
                    this.drawHoverMarker(hoverMarkerClass, markerLeft, yPx);

                    // Determine if popover is outside bounds and shift to other side if outside bounds
                    var bandwidth = config.xScale.bandwidth();
                    var offset = Math.floor(bandwidth / 4);
                    var divLeft = popoverConfig.div.left;
                    divLeft += (markerLeft + divWidth + offset > config.width)
                        ? -(offset + divWidth)
                        : offset

                    var divTop = (yPx + divHeight > config.height)
                        ? -divHeight + config.height
                        : yPx - (divHeight / 2) + 4;

                    this.drawPopover(div, divLeft, divTop);
                })
                .on("mouseout", (d) => {
                    this.hoverBarMouseOut(hoverMarkerClass, tooltipDivClass);
                });

            // Draw the outside graph border (has to be last)
            this.drawOutsideBorder(config);
        }

        private generateGamesPlayedTooltipHtml(games: IPlayerStatsGame[]): string {
            var sb: string[] = [];

            sb.push("<table>");

            games.forEach((game, index) => {
                var gameDate = new Date(game.gameDate);
                var hour = gameDate.getHours() > 12 ? gameDate.getHours() - 12: gameDate.getHours();
                var minStr = gameDate.getMinutes() < 10 ? "0" + gameDate.getMinutes() : gameDate.getMinutes().toString();
                var timeStr = `${hour || 12}:${minStr}${gameDate.getHours() >= 12 ? 'p' : 'a'}`;
                sb.push("<tr>");
                sb.push(`<td class="game-num">${timeStr}</td>`);
                sb.push(`<td class="game-rating">${d3.format(".2f")(game.rating)}</td>`);
                sb.push("</tr>");
            });

            sb.push("</table>");

            return sb.join('');
        }
    }
}