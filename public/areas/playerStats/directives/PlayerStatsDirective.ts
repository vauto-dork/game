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

    enum State {
        Loading,
        Ready,
        Error
    }

    export class PlayerStatsController {
        public static $inject: string[] = ["playerStatsService"];

        private showLoading: boolean = false;
        private showErrorMessage: boolean = false;
        private showContent: boolean = false;

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        private get hasPlayedGames(): boolean {
            return this.playerStatsService.hasPlayedGames;
        }

        constructor(private playerStatsService: IPlayerStatsService) {
            this.changeState(State.Loading);

            playerStatsService.getPlayerStats().then(()=>{
                this.changeState(State.Ready);
            }, () => {
                this.changeState(State.Error);
            });
        }

        private changeState(newState: State): void {
            this.showLoading = newState === State.Loading;
            this.showContent = newState === State.Ready;
            this.showErrorMessage = newState === State.Error;
        }

        private rankValue(value: number): number {
            return value === 0 ? null : value;
        }
    }
}