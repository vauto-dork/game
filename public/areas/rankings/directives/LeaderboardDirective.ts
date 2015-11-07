module Rankings {
    export function LeaderboardDirective(): ng.IDirective {
        return {
			scope: {

			},
			templateUrl: '/areas/rankings/directives/LeaderboardTemplate.html',
			controller: 'LeaderboardController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class LeaderboardController {
        public static $inject: string[] = ['$scope', 'dateTimeService', 'apiService'];

		private lastDatePlayed: string;
		private currentMonth: number;
		private currentYear: number;
		private lastMonth: number;
		private lastMonthYear: number;
		private noGamesThisMonth: boolean = false;

        constructor(private $scope: ng.IScope, private dateTimeService: Shared.IDateTimeService, private apiService: Shared.IApiService) {
			this.currentMonth = dateTimeService.currentMonthValue();
			this.currentYear = dateTimeService.currentYear();
			this.lastMonth = dateTimeService.lastMonthValue();
			this.lastMonthYear = dateTimeService.lastMonthYear();

			this.getLastPlayedGame();
        }

		private getLastPlayedGame() {
			this.apiService.getLastPlayedGame().then((data: Shared.IGameViewModel)=>{
				this.lastDatePlayed = data.datePlayed;
				this.noGamesThisMonth = this.hasGames();
			}, ()=>{
				debugger;
			});
		}

		private hasGames() {
			var lastGame = new Date(this.lastDatePlayed);
			var lastGameMonth = lastGame.getMonth();
			var lastGameYear = lastGame.getFullYear();

			return !(this.currentMonth === lastGameMonth && this.currentYear === lastGameYear);
		}
    }
}
