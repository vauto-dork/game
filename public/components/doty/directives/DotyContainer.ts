module Components {
    export function DotyContainer(): ng.IComponentOptions {
        return {
			templateUrl: '/components/doty/directives/DotyContainerTemplate.html',
			controller: DotyContainerController
		};
    }

    export class DotyContainerController {
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

