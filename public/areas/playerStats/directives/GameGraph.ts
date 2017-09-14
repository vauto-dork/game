module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;

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
        gamesPlayed: number;
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

    interface ID3Selection extends d3.Selection<SVGElement, {}, HTMLElement, any> {}

    export class GameGraphController {
        public static $inject: string[] = ["$element", "playerStatsService"];

        private gameDayData: IGameDayData[] = [];

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        constructor(private $element: ng.IAugmentedJQuery, private playerStatsService: IPlayerStatsService) {
            this.playerStatsService.ready().then(() => {
                this.updateData();

                this.playerStatsService.subscribeDataRefresh(() => {
                    this.updateData();
                });
            });
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
                this.gameDayData.push({ date: i + 1, gamesPlayed: 0, rating: 0 });
            }

            var prevDay = 0;
            this.playerStats.games.filter((game) => { return game.played; }).forEach((game) => {
                var day = new Date(game.gameDate).getDate();
                var index = day - 1;
                this.gameDayData[index].gamesPlayed++;

                if(prevDay !== day){
                    this.gameDayData[index].rating = game.rating;
                    prevDay = day;
                }
            });

            this.createRatingGraph();
            this.createGamesPlayedGraph();
        }

        private initGraph(svgClass: string, yMin: number, yMax: number): IGraphConfig {
            var svg = d3.select("svg." + svgClass);
            
            var margin = { top: 20, right: 20, bottom: 30, left: 40 };
            var width = +svg.attr("width") - margin.left - margin.right;
            var height = +svg.attr("height") - margin.top - margin.bottom;

            var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
            var yScale = d3.scaleLinear().rangeRound([height, 0]);

            xScale.domain(this.gameDayData.map((d) => { return d.date.toString(); }));
            yScale.domain([yMin, yMax]);

            svg.selectAll("g").remove();
            svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            return <IGraphConfig>{
                group: d3.select("svg." + svgClass).select("g"),
                margin: margin,
                width: width,
                height: height,
                xScale: xScale,
                yScale: yScale
            };
        }

        private drawAxes(config: IGraphConfig, xAxis: d3.Axis<{}>, yAxis: d3.Axis<{}>): void {
            xAxis.tickSizeOuter(0).tickPadding(10);
            yAxis.tickSizeOuter(0).tickPadding(10);

            config.group.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(0," + config.height + ")")
                .call(xAxis);

            config.group.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
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

            var xAxis = d3.axisBottom(config.xScale).tickSizeInner(-config.height);
            
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(8)
                .tickSizeInner(-config.width);

            this.drawAxes(config, xAxis, yAxis);


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

            
            var lineData = this.gameDayData.filter((game) => { return game.gamesPlayed > 0; })
                .map((d) => {
                    return [d.date, d.rating];
                });

            var lastDay = this.gameDayData[this.gameDayData.length - 1].date;
            var lastRanking = lineData[lineData.length - 1][1];

            lineData.unshift([1,0]);
            lineData.push([lastDay, lastRanking]);
            lineData.push([lastDay, 0]);

            config.group.append("path")
                .data([lineData])
                .attr("class", "line data")
                .attr("transform", "translate(18,0)")
                .attr("d", valueline);


            // Draw the outside graph border

            var outsideBorder = d3.line()
                .x((d) => { return d[0]; })
                .y((d) => { return d[1]; });

            var outsideBorderPoints = [ 
                [0,0],
                [config.width, 0],
                [config.width, config.height]
            ];

            config.group.append("path")
                .data([outsideBorderPoints])
                .attr("class", "rating-outside-border")
                .attr("d", outsideBorder);
        }

        private createGamesPlayedGraph(): void {
            var svgClass = "games-played-svg";

            var yMax = d3.max(this.gameDayData, (d) => { return d.gamesPlayed; });
            yMax = yMax > 5 ? yMax : 5;

            var config = this.initGraph(svgClass, 0, yMax);
            
            config.group.selectAll(".bar")
                .data(this.gameDayData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", (d) => { return config.xScale(d.date.toString()); })
                .attr("y", (d) => { return config.yScale(d.gamesPlayed); })
                .attr("width", config.xScale.bandwidth())
                .attr("height", (d) => { return config.height - config.yScale(d.gamesPlayed); });     
                   

            var xAxis = d3.axisBottom(config.xScale).tickSizeInner(0);
            
            var yAxis = d3.axisLeft(config.yScale)
                .ticks(yMax)
                .tickFormat(d3.format("d"))
                .tickSizeInner(-config.width);

            this.drawAxes(config, xAxis, yAxis);
        }
    }
}