module DorkOfTheYear {
    export function DorkOfTheYear(): ng.IComponentOptions {
        return {
			templateUrl: '/areas/dorkOfTheYear/directives/DorkOfTheYearTemplate.html',
			controller: DorkOfTheYearController
		};
    }

    enum State {
		Init,
		Ready,
		Change
	};

    export class DorkOfTheYearController {
        public static $inject: string[] = ['$timeout', 'monthYearQueryService', 'dateTimeService', 'dotyService'];
        
        private year: number;

        constructor(private $timeout: ng.ITimeoutService,
            private monthYearQueryService: Shared.IMonthYearQueryService,
            private dateTimeService: Shared.IDateTimeService,
            private dotyService: IDotyService) {

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
							this.year = date.year;
						} else {
							this.year = this.dateTimeService.currentYear();
						}
						this.changeState(State.Change);
					}, 0);
					break;
				case State.Change:
					this.$timeout(() => {
						this.monthYearQueryService.saveQueryParams(null, this.year);
						this.dotyService.changeDate(this.year);
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

