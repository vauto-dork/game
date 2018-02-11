module DorkOfTheYear {
    export function UberdorkTable(): ng.IComponentOptions {
        return {
			templateUrl: '/areas/dorkOfTheYear/directives/UberdorkTableTemplate.html',
			controller: UberdorkTableController
		};
    }

    export class UberdorkTableController {
		public static $inject: string[] = ['dateTimeService', 'dotyService'];
                
		private get monthlyRankings(): Shared.IDotyMonthModel[] {
			return !this.dotyService.data ? [] : this.dotyService.data.monthlyRankings;
        }

        private get year(): number {
            return !this.dotyService.data ? new Date().getFullYear() : this.dotyService.data.year;
        }

        private get currentYear(): number {
            return this.dateTimeService.currentYear();
        }

        constructor(private dateTimeService: Shared.IDateTimeService, private dotyService: IDotyService) {
        }

        private monthName(value: number, abbreviate: boolean): string {
            return this.dateTimeService.monthName(value, abbreviate);
        }
    }
}

