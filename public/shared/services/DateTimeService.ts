module Shared {
	export interface IDateTimeService {
		CurrentYear(): number;
		CurrentMonthValue(): number;
		CurrentMonthName(): string;
		LastMonthYear(): number;
		LastMonthValue(): number;
		LastMonthName(): string;
		MonthName(monthValue: number): string;
	}
	
	export class DateTimeService implements IDateTimeService {
		
		private monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		
		constructor() {
		}

		public CurrentYear() {
			return new Date().getFullYear();
		}
		
		public CurrentMonthValue() {
			return new Date().getMonth();
		}
		
		public CurrentMonthName() {
			return this.monthNames[this.CurrentMonthValue()];
		}
		
		public LastMonthYear() {
			return (this.CurrentMonthValue() - 1 < 0) ? this.CurrentYear() - 1 : this.CurrentYear();
		}
		
		public LastMonthValue() {
			return (this.CurrentMonthValue() - 1 < 0) ? 11 : this.CurrentMonthValue() - 1;
		}
		
		public LastMonthName() {
			return this.monthNames[this.LastMonthValue()];
		}
		
		public MonthName(monthValue: number) {
			if (monthValue >= 0 && monthValue <= 11) {
				return this.monthNames[monthValue];
			}

			return '';
		}
	}
}
