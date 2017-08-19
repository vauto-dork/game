module Leaderboard {
    export function Leaderboard(): ng.IComponentOptions {
        return {
			templateUrl: '/areas/leaderboard/directives/LeaderboardTemplate.html',
			controller: LeaderboardController
		};
    }

    export class LeaderboardController {
        public static $inject: string[] = ['dateTimeService', 'dotmService', 'apiService'];

		private lastDatePlayed: string;
		private currentMonth: number;
		private currentYear: number;
		private lastMonth: number;
		private lastMonthYear: number;
		private noGamesThisMonth: boolean = false;

		constructor(private dateTimeService: Shared.IDateTimeService,
			private dotmService: Components.DotmService,
			private apiService: Shared.IApiService) {
			this.currentMonth = dateTimeService.currentMonthValue();
			this.currentYear = dateTimeService.currentYear();
			this.lastMonth = dateTimeService.lastMonthValue();
			this.lastMonthYear = dateTimeService.lastMonthYear();

			this.dotmService.changeDate(this.lastMonth, this.lastMonthYear);
			this.getLastPlayedGame();
        }

		private getLastPlayedGame() {
			this.apiService.getLastPlayedGame().then(game => {
				this.lastDatePlayed = game.datePlayed;
				
				var lastGame = new Date(this.lastDatePlayed);
				var lastGameMonth = lastGame.getMonth();
				var lastGameYear = lastGame.getFullYear();
				
				// If the last played game is in the current month and year, then there is at least one game this month.
				this.noGamesThisMonth = !(this.currentMonth === lastGameMonth && this.currentYear === lastGameYear);
			}, ()=>{
				console.error("Cannot get last game played.");
			});
		}
    }
}
