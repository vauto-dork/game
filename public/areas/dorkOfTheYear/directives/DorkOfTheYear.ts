module DorkOfTheYear {
    export function DorkOfTheYear(): ng.IComponentOptions {
        return {
			templateUrl: '/areas/dorkOfTheYear/directives/DorkOfTheYearTemplate.html',
			controller: DorkOfTheYearController
		};
    }

    export class DorkOfTheYearController {
        public static $inject: string[] = ['$timeout', 'dateTimeService', 'dotyService'];
        
        private year: number;

        constructor(private $timeout: ng.ITimeoutService, private dateTimeService: Shared.IDateTimeService, private dotyService: IDotyService) {
            this.year = this.dateTimeService.currentYear();
            this.dotyService.changeDate(this.year);
        }

        private updateQueryParams() {
            // Timeouts are required to force a digest cycle so the query
			// param factory will update in the correct scope.
            this.$timeout(()=>{
                this.dotyService.changeDate(this.year);
            }, 0);
		}
    }
}

