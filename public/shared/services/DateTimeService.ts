module Shared {
	export interface IDateTimeService {
		minimumYear: number;
		currentYear(): number;
		currentMonthValue(): number;
		currentMonthName(): string;
		lastMonthYear(): number;
		lastMonthValue(): number;
		lastMonthName(): string;
		monthName(monthValue: number, abbreviateMonth?: boolean): string;
	}
	
	export class DateTimeService implements IDateTimeService {
		
		private get monthNames(): string[] {
			return Months.Names;
		}

		private get abbrMonthNames(): string[] {
			return Months.ShortNames;
		}

		public get minimumYear(): number {
			return 2015;
		}
		
		constructor() {
		}

		public currentYear() {
			return new Date().getFullYear();
		}
		
		public currentMonthValue() {
			return new Date().getMonth();
		}
		
		public currentMonthName() {
			return this.monthNames[this.currentMonthValue()];
		}
		
		public lastMonthYear() {
			return (this.currentMonthValue() - 1 < 0) ? this.currentYear() - 1 : this.currentYear();
		}
		
		public lastMonthValue() {
			return (this.currentMonthValue() - 1 < 0) ? 11 : this.currentMonthValue() - 1;
		}
		
		public lastMonthName() {
			return this.monthNames[this.lastMonthValue()];
		}
		
		public monthName(monthValue: number, abbreviateMonth?: boolean) {
			var monthNames = abbreviateMonth ? this.abbrMonthNames : this.monthNames;

			if (monthValue >= 0 && monthValue <= 11) {
				return monthNames[monthValue];
			}

			return '';
		}
	}
}
