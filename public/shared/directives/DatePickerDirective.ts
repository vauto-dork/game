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
        public static $inject: string[] = ['$scope'];
		
		private date: Date;
		
		private format: string = 'MMMM dd, yyyy';
		private hstep: number = 1;
		private mstep: number = 1;
		private opened: boolean = false;
		
		private dateOptions = {
            showWeeks: false,
            startingDay: 0
		};
		
        constructor(private $scope: ng.IScope) {
        }
	
		private open() {
			this.opened = true;
		}
    }
}
