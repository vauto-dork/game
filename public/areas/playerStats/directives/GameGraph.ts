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
                var gameMonth = new Date(this.playerStats.dateRange[0]).getMonth();
                var gameYear = new Date(this.playerStats.dateRange[0]).getFullYear();
                var numDaysInMonth = new Date(gameYear, gameMonth + 1, 0).getDate();

                this.gameDayData = [];

                for (var i = 0; i < numDaysInMonth; i++) {
                    this.gameDayData.push({ date: i + 1, gamesPlayed: 0 });
                }

                this.playerStats.games.forEach((game) => {
                    var day = new Date(game.gameDate).getDate();
                    this.gameDayData[day - 1].gamesPlayed++;
                });

                this.createGraph();
            });
        }

        private createGraph(): void {
            var svg = d3.select("svg"),
                margin = { top: 20, right: 20, bottom: 30, left: 40 },
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom;

            var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
                y = d3.scaleLinear().rangeRound([height, 0]);

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var yMax = d3.max(this.gameDayData, (d) => { return +d.gamesPlayed; });

            x.domain(this.gameDayData.map((d) => { return d.date.toString(); }));
            y.domain([0, yMax]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(yMax).tickFormat(d3.format("d")));

            g.selectAll(".bar")
                .data(this.gameDayData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.date.toString()); })
                .attr("y", function (d) { return y(d.gamesPlayed); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.gamesPlayed); });
        }
    }
}