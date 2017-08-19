module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;

    export function PlayerStatsCard(): ng.IComponentOptions {
        return {
			templateUrl: "/areas/playerStats/directives/PlayerStatsCardTemplate.html",
			controller: PlayerStatsCardController
        };
    }

    export class PlayerStatsCardController {
        public static $inject: string[] = ["playerStatsService"];

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

        private get hasPlayedGames(): boolean {
            return this.playerStatsService.hasPlayedGames;
        }

        constructor(private playerStatsService: IPlayerStatsService) {
            
        }
    }
}