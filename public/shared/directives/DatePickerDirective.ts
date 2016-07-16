module Shared {
    export function DatePickerDirective(): ng.IDirective {
        return {
			scope: {
				date: "=",
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
		
		private format: string = 'MMMM dd, yyyy';
		private hstep: number = 1;
		private mstep: number = 1;
		private opened: boolean = false;
		
        private dateOptions = {
            minDate: new Date(2015, 4, 1),
            showWeeks: false,
            startingDay: 0
		};

		private get prettyDate(): IPrettyDate {
			return this.dateTimeService.beautifyDate(this.date);
		}
		
        constructor(private dateTimeService: IDateTimeService) {
        }
	
		private open() {
			this.opened = true;
		}

		private withLeadingZero(value: number): string {
			return value < 10 ? "0" + value : "" + value;
		}
    }
}
