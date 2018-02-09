module Components {
    export function YearPicker(): ng.IComponentOptions {
        return {
			bindings: {
				year: "=",
				disabled: "=?",
				change: "&"
			},
			templateUrl: '/components/doty/directives/YearPickerTemplate.html',
			controller: YearPickerController
		};
    }

    export class YearPickerController {
		public static $inject: string[] = ['dateTimeService'];
		
		private localYear: number;

		public get year(): number {
			return this.localYear;
		}

		public set year(value: number) {
			this.localYear = value;
			this.selectedYear = (value === null || value === undefined) ? this.selectedYear : value;
		}

		public disabled: boolean;
		public change: Function;

		private selectedYear: number;

		private years: number[] = [];
		private months: string[] = Shared.Months.Names;

		private get minimumYear(): number {
			return this.dateTimeService.minimumYear;
		}

		private get disablePrev(): boolean {
			return this.year === this.minimumYear;
		}

		private get disableNext(): boolean {
			return this.year >= this.dateTimeService.currentYear();
		}

        constructor(private dateTimeService: Shared.IDateTimeService) {
			this.init();
        }

		private init(): void {
			for (var i = this.minimumYear; i <= this.dateTimeService.currentYear(); i++) {
				this.years.push(i);

				if (i === this.year) {
					this.selectedYear = i;
				}
			}
		}

		private updateParams(): void {
			this.year = this.selectedYear;

			if (this.change !== undefined) {
				this.change();
			}
		}

		private prev(): void {
			this.selectedYear--;
			this.updateParams();
		}

		private next(): void {
			this.selectedYear++;
			this.updateParams();
		}
    }
}
