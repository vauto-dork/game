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

        private tempJsonData: IPlayerStats;

        constructor(private playerStatsService: IPlayerStatsService) {
            playerStatsService.getPlayerStats().then(()=>{
                this.tempJsonData = playerStatsService.playerStats;
            });
        }
    }
}