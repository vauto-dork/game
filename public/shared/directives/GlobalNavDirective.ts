module Shared {
    export function GlobalNavDirective(): ng.IDirective {
        return {
			scope: {
	
			},
			templateUrl: '/shared/directives/GlobalNavTemplate.html',
			controller: 'GlobalNavController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class GlobalNavController {
        public static $inject: string[] = ['$scope'];
		
		private sidebarOpen: boolean = false;

        constructor(private $scope: ng.IScope) {
        }
		
		private closeSidebar(): void {
			if(this.sidebarOpen === true){
				this.sidebarOpen = false;
			}
		}
    }
}
