module Shared {
    export function MonthYearPickerDirective(): ng.IDirective {
        return {
			scope: {
				month: "=",
				year: "=",
				disabled: "=?",
				change: "&"
			},
			templateUrl: '/shared/directives/MonthYearPickerTemplate.html',
			controller: 'MonthYearPickerController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

	interface INameValuePair {
		name: string;
		value: number;
	}

    export class MonthYearPickerController {
		public static $inject: string[] = ['dateTimeService'];
		
		private localMonth: number;
		private localYear: number;

		public get month(): number {
			return this.localMonth;
		}

		public set month(value: number) {
			this.localMonth = value;
			this.selectedMonth = (value === null || value === undefined || !this.months)
				? this.selectedMonth
				: this.months[value];
		}
		public get year(): number {
			return this.localYear;
		}

		public set year(value: number) {
			this.localYear = value;
			this.selectedYear = (value === null || value === undefined) ? this.selectedYear : value;
		}

		public disabled: boolean;
		public change: Function;

		private disableYear: boolean = false;

		private selectedMonth: string;
		private selectedYear: number;

		private years: number[] = [];
		private months: string[] = Shared.Months.Names;

		private get minimumYear(): number {
			return this.dateTimeService.minimumYear;
		}

		private get disablePrev(): boolean {
			return this.month <= 4 && this.year === this.minimumYear;
		}

		private get disableNext(): boolean {
			return this.month >= this.dateTimeService.currentMonthValue() && this.year >= this.dateTimeService.currentYear();
		}

        constructor(private dateTimeService: IDateTimeService) {
			this.init();
        }

		private init(): void {
			this.selectedMonth = this.months[this.month];

			for (var i = this.minimumYear; i <= this.dateTimeService.currentYear(); i++) {
				this.years.push(i);

				if (i === this.year) {
					this.selectedYear = i;
				}
			}

			this.disableYear = this.disableYear || this.years.length <= 1;
		}

		private updateParams(): void {
			this.month = this.months.indexOf(this.selectedMonth);
			this.year = this.selectedYear;

			if (this.change !== undefined) {
				this.change();
			}
		}

		private prev(): void {
			var monthIndex = (this.month === 0) ? 11 : this.month - 1;
			
			if(monthIndex === 11) {
				this.selectedYear--;
			}

			this.selectedMonth = this.months[monthIndex];
			this.updateParams();
		}

		private next(): void {
			var monthIndex = (this.month + 1) % 12;

			if(monthIndex === 0) {
				this.selectedYear++;	
			}

			this.selectedMonth = this.months[monthIndex];
			this.updateParams();
		}
    }
}
