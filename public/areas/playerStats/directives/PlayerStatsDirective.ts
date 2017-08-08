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

        private ready: boolean = false;

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        constructor(private playerStatsService: IPlayerStatsService) {
            playerStatsService.getPlayerStats().then(()=>{
                this.ready = true;
            });
        }
    }
}