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
        public static $inject: string[] = ['$scope', '$timeout', 'monthYearQueryService', 'dateTimeService'];

		private month: number;
		private year: number;

        constructor(private $scope: ng.IScope,
			private $timeout: ng.ITimeoutService,
			private monthYearQueryService: Shared.IMonthYearQueryService,
			private dateTimeService: Shared.IDateTimeService) {

			this.month = dateTimeService.LastMonthValue();
			this.year = dateTimeService.LastMonthYear();

			this.changeState(State.Init);
        }

		private changeState(newState: State) {
			// Timeouts are required to force a digest cycle so the query
			// param factory will update in the correct scope.
			switch (newState) {
				case State.Init:
					this.$timeout(() => {
						this.month = this.monthYearQueryService.GetMonthQueryParam(this.month);
						this.year = this.monthYearQueryService.GetYearQueryParam(this.year);
					}, 0);
					this.changeState(State.Ready);
					break;
				case State.Change:
					this.$timeout(() => {
						this.monthYearQueryService.SaveQueryParams(this.month, this.year);
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
