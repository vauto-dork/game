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

    export class GameGraphController {
        public static $inject: string[] = ["$element", "playerStatsService"];

        private gameDayData: IGameDayData[] = [];

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        constructor(private $element: ng.IAugmentedJQuery, private playerStatsService: IPlayerStatsService) {
            this.playerStatsService.ready().then(() => {
                this.updateData();
                this.createGraph();

                this.playerStatsService.subscribeDataRefresh(() => {
                    this.updateData();
                    this.createGraph();
                });
            });
        }

        private updateData(): void {
            var gameMonth = new Date(this.playerStats.dateRange[0]).getMonth();
            var gameYear = new Date(this.playerStats.dateRange[0]).getFullYear();
            var numDaysInMonth = new Date(gameYear, gameMonth + 1, 0).getDate();

            this.gameDayData = [];

            for (var i = 0; i < numDaysInMonth; i++) {
                this.gameDayData.push({ date: i + 1, gamesPlayed: 0, rating: 0 });
            }

            this.playerStats.games.forEach((game) => {
                if(game.played) {
                    var day = new Date(game.gameDate).getDate();
                    var index = day - 1;
                    this.gameDayData[index].gamesPlayed++;
                    this.gameDayData[index].rating += game.rating;
                }
            });
        }

        private createGraph(): void {
            var svg = d3.select("svg");

            svg.selectAll("g").remove();

            var margin = { top: 20, right: 20, bottom: 30, left: 40 };
            var width = +svg.attr("width") - margin.left - margin.right;
            var height = +svg.attr("height") - margin.top - margin.bottom;

            var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
            var y = d3.scaleLinear().rangeRound([height, 0]);

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var yMax = d3.max(this.gameDayData, (d) => { return +d.gamesPlayed; });

            x.domain(this.gameDayData.map((d) => { return d.date.toString(); }));
            y.domain([0, yMax]);

            var xAxis = d3.axisBottom(x)
                .tickSizeInner(0)
                .tickSizeOuter(0)
                .tickPadding(10);

            var yAxis = d3.axisLeft(y)
                .ticks(yMax)
                .tickFormat(d3.format("d"))
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickPadding(10);

            g.selectAll(".bar")
                .data(this.gameDayData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.date.toString()); })
                .attr("y", function (d) { return y(d.gamesPlayed); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.gamesPlayed); });

            g.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            g.append("g")
                .attr("class", "axis axis-y")
                .call(yAxis);
        }
    }
}