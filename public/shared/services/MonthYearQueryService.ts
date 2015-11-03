module Shared {
	export interface IMonthYearQueryService {
		GetMonthQueryParam(month: number): number;
		GetYearQueryParam(year: number): number;
		SaveQueryParams(month: number, year: number): void;
	}

	export class MonthYearQueryService implements IMonthYearQueryService {
		public static $inject: string[] = ['$location'];

		private minimumYear: number = 2015;

		constructor(private $location: ng.ILocationService) {
			
		}
		
		private SanitizeParam(value: string): number {
			if (value === undefined) {
				return undefined;
			}

			var parsedValue = parseInt(value, 10);
			return isNaN(parsedValue) ? undefined : parsedValue;
		};
		
		public GetMonthQueryParam(month: number): number {
			var queryMonth = this.SanitizeParam(this.$location.search().month);

			if (queryMonth !== undefined) {
				queryMonth--;
				month = queryMonth > 11
					? 0
					: queryMonth < 0 ? 11 : queryMonth;
			}

			return month;
		}
		
		public GetYearQueryParam(year: number): number {
			var queryYear = this.SanitizeParam(this.$location.search().year);

			if (queryYear !== undefined) {
				year = queryYear < this.minimumYear ? this.minimumYear : queryYear;
			}

			return year;
		}
		
		public SaveQueryParams(month: number, year: number): void {
			this.$location.search('month', month + 1);
			this.$location.search('year', year);
			this.$location.replace();
		}
	}
}
