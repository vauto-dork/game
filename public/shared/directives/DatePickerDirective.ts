module Shared {
    export function DatePickerDirective(): ng.IDirective {
        return {
			scope: {
				date: "=",
				showNowButton: "=",
				disabled: "="
			},
			templateUrl: '/shared/directives/DatePickerTemplate.html',
			controller: 'DatePickerController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class DatePickerController {
        public static $inject: string[] = ['dateTimeService'];
		
		private date: Date;
		private showNowButton: boolean;
		private disabled: boolean;
		
		private format: string = 'MMMM dd, yyyy';
		private hstep: number = 1;
		private mstep: number = 1;
		private datePickerOpened: boolean = false;
		private timePickerOpened: boolean = false;
		
        private dateOptions = {
            minDate: new Date(2015, 4, 1),
			maxDate: new Date(),
            showWeeks: false,
            startingDay: 0
		};

		private get prettyDate(): IPrettyDate {
			return this.dateTimeService.beautifyDate(this.date, true);
		}
		
        constructor(private dateTimeService: IDateTimeService) {
        }
	
		private openDatePicker(): void {
			this.datePickerOpened = !this.datePickerOpened;
		}

		private openTimePicker(): void {
			this.timePickerOpened = !this.timePickerOpened;
		}

		private withLeadingZero(value: number): string {
			return value < 10 ? "0" + value : "" + value;
		}

		private useCurrentTime(): void {
			this.date = new Date();
		}
    }
}
