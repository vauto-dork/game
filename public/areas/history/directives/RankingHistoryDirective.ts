module DorkHistory {
    export function RankingHistoryDirective(): ng.IDirective {
        return {
			scope: {
			},
			templateUrl: '/areas/history/directives/RankingHistoryTemplate.html',
			controller: 'RankingHistoryController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

	enum State {
		Init,
		Ready,
		Change
	};

    export class RankingHistoryController {
        public static $inject: string[] = ['$timeout', 'monthYearQueryService', 'dateTimeService', 'dotmService'];

		private month: number;
		private year: number;

		private get isCurrentMonth(): boolean {
			return this.month === this.dateTimeService.currentMonthValue() && this.year === this.dateTimeService.currentYear();
		}

        constructor(
			private $timeout: ng.ITimeoutService,
			private monthYearQueryService: Shared.IMonthYearQueryService,
			private dateTimeService: Shared.IDateTimeService,
			private dotmService: Components.DotmService) {

			this.dotmService.changeDate(this.dateTimeService.currentMonthValue(), this.dateTimeService.currentYear());
			this.changeState(State.Init);
        }

		private changeState(newState: State) {
			// Timeouts are required to force a digest cycle so the query
			// param factory will update in the correct scope.
			switch (newState) {
				case State.Init:
					this.$timeout(() => {
						var date = this.monthYearQueryService.getQueryParams();
						if(date) {
							this.month = date.month;
							this.year = date.year;
							this.changeState(State.Ready);
						} else {
							this.month = this.dateTimeService.lastMonthValue();
							this.year = this.dateTimeService.lastMonthYear();
							this.changeState(State.Change);
						}
					}, 0);
					break;
				case State.Change:
					this.$timeout(() => {
						this.monthYearQueryService.saveQueryParams(this.month, this.year);
						this.dotmService.changeDate(this.month, this.year);
					}, 0);
					this.changeState(State.Ready);
					break;
			}
		}

		private updateQueryParams() {
			this.changeState(State.Change);
		}
    }
}
