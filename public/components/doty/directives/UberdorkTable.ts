module Components {
    export function UberdorkTable(): ng.IComponentOptions {
        return {
			templateUrl: '/components/doty/directives/UberdorkTableTemplate.html',
			controller: DotyController
		};
    }

    export class UberdorkTableController {
		public static $inject: string[] = ['dateTimeService', 'dotyService'];
                
		private get monthlyRankings(): Shared.IDotyMonthModel[] {
			return this.dotyService.data.monthlyRankings;
        }

        constructor(private dateTimeService: Shared.IDateTimeService, private dotyService: IDotyService) {
        }

        private monthName(value: number): string {
            return this.dateTimeService.monthName(value);
        }
    }
}

