module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;

    export function PlayerStatsDirective(): ng.IDirective {
        return {
			scope: {
			},
			templateUrl: "/areas/playerStats/directives/PlayerStatsTemplate.html",
			controller: "PlayerStatsController",
			controllerAs: "ctrl",
			bindToController: true
        };
    }

    export class PlayerStatsController {
        public static $inject: string[] = ["playerStatsService"];

        private showLoading: boolean = false;

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        private get rating(): number {
            if(!this.playerStatsService.latestGame) {
                return 0;
            }

            return this.playerStatsService.latestGame.rating;
        }

        private get rank(): number {
            if(!this.playerStatsService.latestGame) {
                return 0;
            }

            return this.playerStatsService.latestGame.rank;
        }

        constructor(private playerStatsService: IPlayerStatsService) {
            this.showLoading = true;
            playerStatsService.getPlayerStats().then(()=>{
                this.showLoading = false;
            });
        }

        private rankValue(value: number): number {
            return value === 0 ? null : value;
        }
    }
}