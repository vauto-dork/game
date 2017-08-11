module Shared {
	export interface IMonthYearQueryService {
		getMonthQueryParam(month: number): number;
		getYearQueryParam(year: number): number;

		getQueryParams(): IMonthYearParams;
		saveQueryParams(month: number, year: number): void;

		subscribeDateChange(callback: Function);
	}

	export class MonthYearQueryService extends PubSubServiceBase implements IMonthYearQueryService {
		public static $inject: string[] = ['$timeout', '$location'];

		private minimumYear: number = 2015;

		private events = {
			dateChange: "dateChange"
        };

		constructor($timeout: ng.ITimeoutService, private $location: ng.ILocationService) {
			super($timeout);
		}
		
		private sanitizeParam(value: string): number {
			if (value === undefined) {
				return undefined;
			}

			var parsedValue = parseInt(value, 10);
			return isNaN(parsedValue) ? undefined : parsedValue;
		};
		
		public getMonthQueryParam(month: number): number {
			var queryMonth = this.$location.search().month;

			if (queryMonth !== undefined) {
				month = Months.ShortNames.indexOf(queryMonth);
			}

			return month;
		}
		
		public getYearQueryParam(year: number): number {
			var queryYear = this.sanitizeParam(this.$location.search().year);

			if (queryYear !== undefined) {
				year = queryYear < this.minimumYear ? this.minimumYear : queryYear;
			}

			return year;
		}

		public getQueryParams(): IMonthYearParams {
			var queryMonth = this.$location.search().month;
			var queryYear = this.sanitizeParam(this.$location.search().year);

			var params = new MonthYearParams();

			if(!queryMonth && !queryYear)
				return null;

			if (queryMonth !== undefined) {
				params.month = Months.ShortNames.indexOf(queryMonth);
			}

			if (queryYear !== undefined) {
				params.year = queryYear < this.minimumYear ? this.minimumYear : queryYear;
			}

			return params;
		}

		public saveQueryParams(month: number, year: number): void {
			this.$location.search('month', Months.ShortNames[month]);
			this.$location.search('year', year);
			this.$location.replace();

			var date = new MonthYearParams(month, year);
			this.publish(this.events.dateChange, date);
		}

		public subscribeDateChange(callback: Function): void {
            this.subscribe(this.events.dateChange, callback);
		}
	}
}
