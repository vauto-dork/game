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
        public static $inject: string[] = ['$scope', '$http', 'dateTimeService'];

		private lastDatePlayed: string;
		private currentMonth: number;
		private currentYear: number;
		private lastMonth: number;
		private lastMonthYear: number;
		private noGamesThisMonth: boolean = false;

        constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private dateTimeService: Shared.IDateTimeService) {
			this.currentMonth = dateTimeService.CurrentMonthValue();
			this.currentYear = dateTimeService.CurrentYear();
			this.lastMonth = dateTimeService.LastMonthValue();
			this.lastMonthYear = dateTimeService.LastMonthYear();

			this.getLastPlayedGame();
        }

		private getLastPlayedGame() {
			this.$http.get("/Games/LastPlayed")
			.success((data: Shared.IGameViewModel, status, headers, config) => {
				this.lastDatePlayed = data.datePlayed;
				this.noGamesThisMonth = this.hasGames();
			})
			.error((data, status, headers, config) => {
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
