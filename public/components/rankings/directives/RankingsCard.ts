module Rankings {
    export function RankingsCard(): ng.IComponentOptions {
        return {
            bindings: {
                player: "="
            },
            templateUrl: '/components/rankings/directives/RankingsCardTemplate.html',
            controller: RankingsCardController
        };
    }

    export class RankingsCardController {
        public static $inject: string[] = ["monthYearQueryService"];
        
        private player: Shared.IRankedPlayer;
        private playerStatsUrl: string = "";

        private get playerStatsBaseUrl(): string {
            return `/playerStats/${this.player.player.urlId}`;
        }

        private get hasPlayedGames(): boolean {
            return this.player.gamesPlayed > 0;
        }

        constructor(private monthYearQueryService: Shared.IMonthYearQueryService) {
            monthYearQueryService.subscribeDateChange((event, date: Shared.IMonthYearParams) => {
                this.appendQueryParams(`${date.getVisibleQueryString()}`);
            });

            var date = monthYearQueryService.getQueryParams();
            this.appendQueryParams(!date ? "" : `${date.getVisibleQueryString()}`);
        }

        private appendQueryParams(value: string): void {
            this.playerStatsUrl = `${this.playerStatsBaseUrl}${value}`;
        }
    }
}
