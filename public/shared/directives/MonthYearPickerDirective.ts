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
		name: string,
		value: number
	}

    export class MonthYearPickerController {
        public static $inject: string[] = ['$scope', 'dateTimeService'];

		private change: Function;
		private isDisabled: boolean = false;

		private minimumYear: number = 2015;
		private disableYear: boolean = false;

		private selectedMonth: INameValuePair;
		private selectedYear: INameValuePair;

		private currentMonth: number;
		private currentYear: number;

		private years: INameValuePair[] = [];
		private months: INameValuePair[] = [
			{ name: 'January', value: 0 },
			{ name: 'February', value: 1 },
			{ name: 'March', value: 2 },
			{ name: 'April', value: 3 },
			{ name: 'May', value: 4 },
			{ name: 'June', value: 5 },
			{ name: 'July', value: 6 },
			{ name: 'August', value: 7 },
			{ name: 'September', value: 8 },
			{ name: 'October', value: 9 },
			{ name: 'November', value: 10 },
			{ name: 'December', value: 11 }
		];

		public get disabled(): boolean {
			return this.isDisabled;
		}

		public set disabled(value: boolean) {
			this.isDisabled = value;
		}

		public get month(): number {
			return this.currentMonth === undefined || this.currentMonth === null
                ? this.dateTimeService.currentMonthValue()
                : this.currentMonth;
		}

		public set month(value: number) {
			this.currentMonth = value;
		}

		public get year(): number {
			return this.currentYear === undefined || this.currentYear === null
                ? this.dateTimeService.currentYear()
                : this.currentYear;
		}

		public set year(value: number) {
			this.currentYear = value;
		}

        constructor(private $scope: ng.IScope, private dateTimeService: Shared.IDateTimeService) {
			this.init();
        }

		private init(): void {
			this.selectedMonth = this.months[this.currentMonth];

			for (var i = this.minimumYear; i <= this.currentYear; i++) {
				var tempYear: INameValuePair = { name: i.toString(), value: i };
				this.years.push(tempYear);

				if (i === this.currentYear) {
					this.selectedYear = tempYear;
				}
			}

			this.disableYear = this.disableYear || this.years.length <= 1;
		};

		private updateParams(): void {
			this.month = this.selectedMonth.value;
			this.year = this.selectedYear.value;

			if (this.change !== undefined) {
				this.change();
			}
		};
    }
}
