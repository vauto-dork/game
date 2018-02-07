module Components {
    export function UberdorkTable(): ng.IComponentOptions {
        return {
			templateUrl: '/components/doty/directives/UberdorkTableTemplate.html',
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

        constructor(private dateTimeService: Shared.IDateTimeService, private dotyService: IDotyService) {
        }

        private monthName(value: number, abbreviate: boolean): string {
            return this.dateTimeService.monthName(value, abbreviate);
        }

        // private playerStatsUrl(month: number, player: Shared.IRankedPlayerViewModel): string {
        //     var abbrMonth = this.dateTimeService.monthName(month, true);
        //     var playerUrl = player.player.urlId;
        //     var year = !this.dotyService.data ? new Date().getFullYear() : this.dotyService.data.year;

        //     return `playerStats/${playerUrl}#?month=${abbrMonth}&year=${year}`;
        // }
    }
}

