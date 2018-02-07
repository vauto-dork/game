module Rankings {
    export function RankingsCard(): ng.IComponentOptions {
        return {
            bindings: {
                player: "=",
                month: "=?",
                year: "=?"
            },
            templateUrl: '/components/rankings/directives/RankingsCardTemplate.html',
            controller: RankingsCardController
        };
    }

    export class RankingsCardController {
        public static $inject: string[] = ["monthYearQueryService"];
        
        private player: Shared.IRankedPlayer;
        private playerStatsUrl: string = "";

        private month: string;
        private year: number;

        private get playerStatsBaseUrl(): string {
            return `/playerStats/${this.player.player.urlId}`;
        }

        private get hasPlayedGames(): boolean {
            return this.player.gamesPlayed > 0;
        }

        constructor(private monthYearQueryService: Shared.IMonthYearQueryService) {
            monthYearQueryService.subscribeDateChange((event, date: Shared.IMonthYearParams) => {
                if(this.useQueryParams()){
                    this.appendQueryParams(`${date.getVisibleQueryString()}`);
                }
            });

            var date = monthYearQueryService.getQueryParams();

            if(this.useQueryParams()){
                this.appendQueryParams(!date ? "" : `${date.getVisibleQueryString()}`);
            }
        }

        private useQueryParams(): boolean {
            var monthNull = this.month === null || this.month === undefined;
            var yearNull = this.year === null || this.year === undefined;

            var useMonthAndYearParams = !monthNull && !yearNull;

            if(useMonthAndYearParams) {
                this.playerStatsUrl = `${this.playerStatsBaseUrl}#?month=${this.month}&year=${this.year}`;
                return false;
            }

            return true;
        }

        private appendQueryParams(value: string): void {
            this.playerStatsUrl = `${this.playerStatsBaseUrl}${value}`;
        }
    }
}
