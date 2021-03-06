module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;
    import IPlayerStatsGame = Shared.IPlayerStatsGame;
    import IMonthYearParams = Shared.IMonthYearParams;
    import MonthYearParams = Shared.MonthYearParams;
    import LocalStorageKeys = Shared.LocalStorageKeys;

    export function PlayerStatsPage(): ng.IComponentOptions {
        return {
			templateUrl: "/areas/playerStats/directives/PlayerStatsPageTemplate.html",
			controller: PlayerStatsPageController
        };
    }

    enum State {
        Loading,
        Ready,
        Change,
        Error
    }

    export class PlayerStatsPageController {
        public static $inject: string[] = ["$timeout", "localStorageService", "monthYearQueryService", "playerStatsService"];

        private showLoading: boolean = false;
        private showErrorMessage: boolean = false;
        private showContent: boolean = false;
        private showAsPercent: boolean = false;

        private date: IMonthYearParams;

        private get playerStats(): IPlayerStats {
            return this.playerStatsService.playerStats;
        }

        private get hasPlayedGames(): boolean {
            return this.playerStatsService.hasPlayedGames;
        }

        constructor(
            private $timeout: ng.ITimeoutService,
            private localStorageService: Shared.ILocalStorageService,
            private monthYearQueryService: Shared.IMonthYearQueryService,
            private playerStatsService: IPlayerStatsService)
        {
            this.changeState(State.Loading);

            this.showAsPercent = this.localStorageService.getStoredBoolean(LocalStorageKeys.PlayerStatsRatingView);

            monthYearQueryService.subscribeDateChange((event, date: IMonthYearParams) => {
                this.getPlayerStats(date);
            });

            this.date = monthYearQueryService.getQueryParams() || new MonthYearParams();
            this.getPlayerStats(this.date);
        }

        private getPlayerStats(date: Shared.IMonthYearParams): void {
            this.playerStatsService.getPlayerStats(date).then(()=>{
                this.changeState(State.Ready);
            }, () => {
                this.changeState(State.Error);
            });
        }

        private changeState(newState: State): void {
            this.showLoading = newState === State.Loading || newState === State.Change;
            this.showContent = newState === State.Ready;
            this.showErrorMessage = newState === State.Error;
        }

        private rankValue(value: number): number {
            return value === 0 ? null : value;
        }

        private updateQueryParams() {
            this.changeState(State.Change);
            this.$timeout(()=>{
                this.monthYearQueryService.saveQueryParams(this.date.month, this.date.year);
            });
        }
        
        private diffValue(game: IPlayerStatsGame): number {
            return this.showAsPercent ? game.ratingPctDiff : game.ratingDiff;
        }

        private valuePercentClick(): void {
            this.localStorageService.setStoredValue(LocalStorageKeys.PlayerStatsRatingView, this.showAsPercent);
        }
    }
}