module Shared {
	export interface IDateTimeService {
		currentYear(): number;
		currentMonthValue(): number;
		currentMonthName(): string;
		lastMonthYear(): number;
		lastMonthValue(): number;
		lastMonthName(): string;
		monthName(monthValue: number): string;
	}
	
	export class DateTimeService implements IDateTimeService {
		
		private monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		
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
		
		public monthName(monthValue: number) {
			if (monthValue >= 0 && monthValue <= 11) {
				return this.monthNames[monthValue];
			}

			return '';
		}
	}
}
