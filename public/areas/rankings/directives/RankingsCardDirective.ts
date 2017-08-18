module Rankings {
    export function RankingsCardDirective(): ng.IDirective {
        return {
            scope: {
                player: "="
            },
            templateUrl: '/areas/rankings/directives/RankingsCardTemplate.html',
            controller: 'RankingsCardController',
            controllerAs: 'ctrl',
            bindToController: true
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
