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
        public static $inject: string[] = ['$element', '$window', '$timeout', 'dateTimeService'];
		
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

		private emptyDate = new Date(1970, 1, 1);

		private get displayDate(): Date {
			return this.date || this.emptyDate;
		}

        constructor(private $element: ng.IAugmentedJQuery,
			private $window: ng.IWindowService,
			private $timeout: ng.ITimeoutService,
			private dateTimeService: IDateTimeService) {
			$timeout(() => {
				this.resizeTimePickerDropdown();
				this.markInputSelectOnClick(".hours");
				this.markInputSelectOnClick(".minutes");
			}, 0);
        }

		private markInputSelectOnClick(className: string): void {
			var element = this.$element.find(".uib-time" + className).find("input"); 
			element.on('click', () => {
				if (!this.$window.getSelection().toString()) {
					// Works in all browsers except mobile Safari. SetSelectionRange() is
					// too much of a bear to get working properly with Angular and Typescript.
					element.select();
				}
			});
		}
	
		private openDatePicker(): void {
			this.datePickerOpened = !this.datePickerOpened;
		}

		private openTimePicker(): void {
			this.timePickerOpened = !this.timePickerOpened;

			if(this.timePickerOpened) {
				this.resizeTimePickerDropdown();
			}
		}

		private resizeTimePickerDropdown(): void {
			var buttonWidth = this.$element.find("#time-picker-toggle").outerWidth();
			var dropdownMinWidth = parseInt(this.$element.find("#time-picker-dropdown").css("min-width"), 10);
			var dropdownWidth = this.$element.find("#time-picker-dropdown").width();

			if (dropdownWidth !== buttonWidth) {
				var newWidth = buttonWidth > dropdownMinWidth ? buttonWidth : dropdownMinWidth;
				this.$element.find("#time-picker-dropdown").width(newWidth);
			}
		}

		private useCurrentTime(): void {
			this.date = new Date();
		}
    }
}
