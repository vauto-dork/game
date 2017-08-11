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
        public static $inject: string[] = [];
        private player: Shared.IRankedPlayer;

        private get playerStatUrlId(): string {
            return this.player.player.urlId;
        }

        private get hasPlayedGames(): boolean {
            return this.player.gamesPlayed > 0;
        }

        constructor() {
        }
    }
}
