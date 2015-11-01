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
	
	enum State {
		Ready,
		Disabled,
		Editing
	};

    export class DatePickerController {
        public static $inject: string[] = ['$scope'];
		
		private date: Date;
		private isDisabled: boolean = false;
		
		private showStatic: boolean = false;
		private showEditor: boolean = false;
		
		private format: string = 'MMMM dd, yyyy';
		private hstep: number = 1;
		private mstep: number = 1;
		private opened: boolean = false;
		
		private dateOptions = {
			showWeeks: false
		};
		
		public get disabled(): boolean{
			return this.isDisabled;
		};
		
		public set disabled(value: boolean) {
			this.isDisabled = value;
			this.changeState(value ? State.Disabled : State.Ready);
		}

        constructor(private $scope: ng.IScope) {
			this.changeState(State.Ready);
        }
		
		private changeState(newState: State): void {
			this.showStatic = newState === State.Ready || newState === State.Disabled;
			this.showEditor = newState === State.Editing;
		}
		
		private today(): void {
			this.date = new Date();
		}
		
		private clear(): void {
			this.date = null;
		}
	
		private open($event: Event) {
			$event.preventDefault();
			$event.stopPropagation();
			
			this.opened = true;
		}
		
		private edit(): void {
			this.changeState(State.Editing);
		}
		
    }
}
