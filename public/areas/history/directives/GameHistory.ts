module DorkHistory {
	import EditGameType = Shared.EditGameType;

    export function GameHistory(): ng.IComponentOptions {
        return {
			bindings: {
				isFinalizedGame: '='
			},
			templateUrl: '/areas/history/directives/GameHistoryTemplate.html',
			controller: GameHistoryController
		};
    }

	enum State {
		Init,
		Loading,
		NoGames,
		Ready,
		Error,
		Change
	};

    export class GameHistoryController {
        public static $inject: string[] = ['$timeout', 'dateTimeService', 'monthYearQueryService', 'apiService', 'gameCardService'];

		public isFinalizedGame: boolean;

		private month: number;
		private year: number;
		private games: Shared.IGame[];

		private loading: boolean = true;
		private errorMessage: string = '';
		private showErrorMessage: boolean = false;
		private showNoGamesWarning: boolean = false;

		constructor(
			private $timeout: ng.ITimeoutService,
			private dateTimeService: Shared.IDateTimeService,
			private monthYearQueryService: Shared.IMonthYearQueryService,
			private apiService: Shared.IApiService,
			private gameCardService: Components.IGameCardService) {

			this.gameCardService.gameType = this.isFinalizedGame
				? EditGameType.FinalizedGame
				: EditGameType.ActiveGame;
			
			this.changeState(State.Init);
		}

		private changeState(newState: State): void {
			this.loading = newState === State.Init
						|| newState === State.Change
						|| newState === State.Loading;
			this.showErrorMessage = newState === State.Error;
			this.showNoGamesWarning = newState === State.NoGames;

			switch (newState) {
				case State.Init:
					this.$timeout(() => {
						var date = this.monthYearQueryService.getQueryParams();
						if(date) {
							this.month = date.month;
							this.year = date.year;
						} else {
							this.month = this.dateTimeService.currentMonthValue();
							this.year = this.dateTimeService.currentYear();
							this.monthYearQueryService.saveQueryParams(this.month, this.year);
						}

						this.changeState(State.Loading);
					}, 0);
					break;
				case State.Change:
					this.$timeout(() => {
						this.monthYearQueryService.saveQueryParams(this.month, this.year);
						this.changeState(State.Loading);
					}, 0);
					break;
				case State.Loading:
					this.getGames();
					break;
				case State.NoGames:
					break;
				case State.Ready:
					break;
			}
		}


		private errorHandler(data: string, errorMessage: string): void {
			this.errorMessage = errorMessage;
			console.error(data);
			this.changeState(State.Error);
		}
		
		// Dont call directly. Change state to "Loading" instead.
		private getGames(): void {
			this.apiService.getGames(this.month, this.year).then((data: Shared.IGame[]) => {
				this.games = data;

				if (!data || data.length === 0) {
					this.changeState(State.NoGames);
				}
				else {
					this.changeState(State.Ready);
				}
			}, (data: string) => {
				this.errorHandler(data, 'Error loading games!');
			});
		}

		private updateQueryParams(): void {
			this.changeState(State.Change);
		}

		private reload(): void {
			this.changeState(State.Loading);
		}
	}
}
